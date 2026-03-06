import LoginButton from "@/components/auth/LoginButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useActivationPolling,
  useGetIcpAddress,
  useGetUserPaymentAddress,
  useIsCallerAdmin,
  useSetIcpAddress,
  useVerifyAndActivateMutation,
} from "@/hooks/useActivationQueries";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useI18n } from "@/i18n/useI18n";
import type { Principal } from "@dfinity/principal";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Coins,
  Copy,
  Loader2,
  RefreshCw,
  Save,
  Settings,
  ShieldCheck,
  X,
  Zap,
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function PaymentGate() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const principal: Principal | null = identity ? identity.getPrincipal() : null;

  // User's personal subaccount address (unique per user, for payment destination)
  const {
    data: userPaymentAddress,
    isLoading: userAddressLoading,
    isError: userAddressError,
  } = useGetUserPaymentAddress();
  // Admin-only: owner collection address (used in admin panel configuration)
  const { data: icpAddress } = useGetIcpAddress();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setIcpAddressMutation = useSetIcpAddress();
  const verifyAndActivateMutation = useVerifyAndActivateMutation();

  const [copied, setCopied] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [addressInput, setAddressInput] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);
  // Track whether we've already shown the auto-activation toast to avoid duplicates
  const autoActivatedRef = useRef(false);

  // ── Automatic polling every 12 seconds ──────────────────────────────────
  // Stop polling once we've detected activation (either via polling or manual check)
  const pollingEnabled = isAuthenticated && !verifySuccess;
  const { data: polledActivation, isFetching: pollFetching } =
    useActivationPolling(principal, pollingEnabled);

  // When polling detects activation, show success and let App.tsx re-render
  useEffect(() => {
    if (polledActivation === true && !autoActivatedRef.current) {
      autoActivatedRef.current = true;
      setVerifySuccess(true);
      toast.success(t.paymentGate.checkPaymentSuccess);
    }
  }, [polledActivation, t.paymentGate.checkPaymentSuccess]);

  // Pre-fill input when address loads or admin panel opens
  useEffect(() => {
    if (adminPanelOpen && icpAddress !== undefined) {
      setAddressInput(icpAddress);
    }
  }, [adminPanelOpen, icpAddress]);

  const handleCopy = async () => {
    if (!userPaymentAddress) return;
    try {
      await navigator.clipboard.writeText(userPaymentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement("textarea");
      el.value = userPaymentAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveAddress = async () => {
    const trimmed = addressInput.trim();
    if (!trimmed) {
      toast.error("Bitte eine gültige ICP-Adresse eingeben.");
      return;
    }
    try {
      await setIcpAddressMutation.mutateAsync(trimmed);
      toast.success("Zahlungsadresse erfolgreich gespeichert.");
      setAdminPanelOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unbekannter Fehler";
      toast.error(`Fehler beim Speichern: ${message}`);
    }
  };

  const handleVerifyPayment = async () => {
    setVerifyError(null);
    setVerifySuccess(false);
    try {
      const activated = await verifyAndActivateMutation.mutateAsync();
      if (activated) {
        setVerifySuccess(true);
        autoActivatedRef.current = true;
        toast.success(t.paymentGate.checkPaymentSuccess);
      } else {
        setVerifyError(t.paymentGate.checkPaymentError);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setVerifyError(`${t.paymentGate.checkPaymentError} (${message})`);
    }
  };

  const showAdminPanel = isAuthenticated && !adminLoading && isAdmin === true;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* DNA helix background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage:
            "url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 z-0 bg-black/70 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-lg flex flex-col gap-4">
        {/* Admin Configuration Panel */}
        {showAdminPanel && (
          <Card
            className="border-0 shadow-xl"
            style={{
              background: "rgba(0, 20, 10, 0.55)",
              backdropFilter: "blur(16px) saturate(180%)",
              WebkitBackdropFilter: "blur(16px) saturate(180%)",
              border: "1px solid rgba(0, 255, 120, 0.25)",
              borderRadius: "16px",
            }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" style={{ color: "#00e87a" }} />
                  <CardTitle
                    className="text-sm font-medium"
                    style={{ color: "#00e87a" }}
                  >
                    Admin: Zahlungsadresse konfigurieren
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  style={{ color: "rgba(100, 220, 160, 0.6)" }}
                  onClick={() => setAdminPanelOpen((v) => !v)}
                  title={adminPanelOpen ? "Schließen" : "Öffnen"}
                >
                  {adminPanelOpen ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Settings className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {!adminPanelOpen && (
                <CardDescription
                  className="text-xs mt-1"
                  style={{ color: "rgba(100, 220, 160, 0.6)" }}
                >
                  Klicke auf das Symbol, um die ICP-Zahlungsadresse zu
                  bearbeiten.
                </CardDescription>
              )}
            </CardHeader>

            {adminPanelOpen && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label
                    htmlFor="icp-address-input"
                    className="text-sm"
                    style={{ color: "#a8ffce" }}
                  >
                    ICP-Zahlungsadresse
                  </Label>
                  <Input
                    id="icp-address-input"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="ICP Account-Adresse eingeben…"
                    className="font-mono text-xs"
                    style={{
                      background: "rgba(0, 30, 15, 0.5)",
                      borderColor: "rgba(0, 255, 120, 0.25)",
                      color: "#a8ffce",
                    }}
                    disabled={setIcpAddressMutation.isPending}
                  />
                  <p
                    className="text-xs"
                    style={{ color: "rgba(100, 220, 160, 0.6)" }}
                  >
                    Diese Adresse wird Nutzern auf der Anmeldeseite angezeigt,
                    damit sie 1 ICP senden können.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveAddress}
                    disabled={
                      setIcpAddressMutation.isPending || !addressInput.trim()
                    }
                    className="flex-1 bg-gradient-to-r from-helix-accent to-helix-glow text-white hover:opacity-90"
                    size="sm"
                  >
                    {setIcpAddressMutation.isPending ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Speichern…
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 mr-2" />
                        Adresse speichern
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAdminPanelOpen(false);
                      setAddressInput(icpAddress ?? "");
                    }}
                    disabled={setIcpAddressMutation.isPending}
                    style={{
                      background: "rgba(0, 30, 15, 0.5)",
                      borderColor: "rgba(0, 255, 120, 0.3)",
                      color: "#a8ffce",
                    }}
                  >
                    Abbrechen
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Payment card */}
        <Card
          className="border-0 shadow-2xl"
          style={{
            background: "rgba(0, 20, 10, 0.55)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(0, 255, 120, 0.2)",
            borderRadius: "20px",
            boxShadow:
              "0 8px 40px rgba(0, 255, 100, 0.12), 0 1px 0 rgba(255,255,255,0.04) inset",
          }}
        >
          <CardHeader className="text-center pb-4">
            {/* Logo */}
            <div className="mx-auto mb-4">
              <img
                src="/assets/IMG_8398-1.png"
                alt="LivSpan Token"
                className="w-24 h-24 mx-auto"
              />
            </div>

            <CardTitle
              className="text-2xl font-light tracking-wide"
              style={{
                background: "linear-gradient(135deg, #a8ffce, #4fffb0)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.paymentGate.title}
            </CardTitle>
            <CardDescription
              className="mt-2"
              style={{ color: "rgba(100, 220, 160, 0.6)" }}
            >
              {t.paymentGate.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Fee info */}
            <div
              className="flex items-center gap-3 p-4 rounded-lg"
              style={{
                background: "rgba(0, 232, 122, 0.1)",
                border: "1px solid rgba(0, 232, 122, 0.3)",
              }}
            >
              <Coins
                className="w-6 h-6 shrink-0"
                style={{ color: "#00e87a" }}
              />
              <div>
                <p className="text-sm font-medium" style={{ color: "#00e87a" }}>
                  {t.paymentGate.feeLabel}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(100, 220, 160, 0.6)" }}
                >
                  {t.paymentGate.feeDescription}
                </p>
              </div>
            </div>

            {/* ICP Address — user's personal subaccount address */}
            <div className="space-y-2">
              <p className="text-sm font-medium" style={{ color: "#00e87a" }}>
                {t.paymentGate.addressLabel}
              </p>

              {userAddressLoading && (
                <div
                  className="flex items-center gap-2 text-sm py-3"
                  style={{ color: "rgba(100, 220, 160, 0.6)" }}
                >
                  <Loader2
                    className="w-4 h-4 animate-spin"
                    style={{ color: "#00e87a" }}
                  />
                  <span>{t.paymentGate.loadingAddress}</span>
                </div>
              )}

              {userAddressError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {t.paymentGate.addressError}
                  </AlertDescription>
                </Alert>
              )}

              {!userAddressLoading &&
                !userAddressError &&
                userPaymentAddress && (
                  <>
                    <div className="flex items-stretch gap-2">
                      <div
                        className="flex-1 min-w-0 px-3 py-2 rounded-lg font-mono text-xs break-all leading-relaxed"
                        style={{
                          background: "rgba(0, 30, 15, 0.5)",
                          border: "1px solid rgba(0, 255, 120, 0.2)",
                          color: "#a8ffce",
                        }}
                      >
                        {userPaymentAddress}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                        data-ocid="payment.secondary_button"
                        className="shrink-0 transition-colors"
                        style={{
                          background: "rgba(0, 30, 15, 0.5)",
                          borderColor: "rgba(0, 255, 120, 0.3)",
                          color: "#a8ffce",
                        }}
                        title={t.paymentGate.copyButton}
                      >
                        {copied ? (
                          <CheckCircle2
                            className="w-4 h-4"
                            style={{ color: "#00e87a" }}
                          />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p
                      className="text-xs italic"
                      style={{ color: "rgba(100, 220, 160, 0.5)" }}
                    >
                      Diese Adresse ist einzigartig für deinen Account / This
                      address is unique to your account
                    </p>
                  </>
                )}

              {!userAddressLoading &&
                !userAddressError &&
                !userPaymentAddress && (
                  <p
                    className="text-sm italic"
                    style={{ color: "rgba(100, 220, 160, 0.6)" }}
                  >
                    {t.paymentGate.addressNotSet}
                  </p>
                )}

              {copied && (
                <p className="text-xs" style={{ color: "#00e87a" }}>
                  {t.paymentGate.copySuccess}
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <p className="text-sm font-medium" style={{ color: "#7effc0" }}>
                {t.paymentGate.instructionsTitle}
              </p>
              <ol className="space-y-2">
                {[
                  { label: t.paymentGate.step1, num: 1 },
                  { label: t.paymentGate.step2, num: 2 },
                  { label: t.paymentGate.step3, num: 3 },
                ].map(({ label, num }) => (
                  <li
                    key={`payment-step-${num}`}
                    className="flex items-start gap-3 text-sm"
                    style={{ color: "rgba(100, 220, 160, 0.6)" }}
                  >
                    <span
                      className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mt-0.5"
                      style={{
                        background: "rgba(0, 232, 122, 0.15)",
                        border: "1px solid rgba(0, 232, 122, 0.4)",
                        color: "#00e87a",
                      }}
                    >
                      {num}
                    </span>
                    <span>{label}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* ── Automatic Payment Verification ── */}
            <div className="space-y-3">
              {/* Success state */}
              {verifySuccess && (
                <Alert
                  style={{
                    background: "rgba(0, 232, 122, 0.1)",
                    borderColor: "rgba(0, 232, 122, 0.5)",
                  }}
                >
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: "#00e87a" }}
                  />
                  <AlertDescription
                    className="font-medium"
                    style={{ color: "#00e87a" }}
                  >
                    {t.paymentGate.checkPaymentSuccess}
                  </AlertDescription>
                </Alert>
              )}

              {/* Error state */}
              {verifyError && !verifySuccess && (
                <Alert variant="destructive" className="border-destructive/50">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>{verifyError}</AlertDescription>
                </Alert>
              )}

              {/* Manual "Check Payment" fallback button */}
              <Button
                onClick={handleVerifyPayment}
                disabled={verifyAndActivateMutation.isPending || verifySuccess}
                className="w-full bg-gradient-to-r from-helix-accent via-helix-strand to-helix-glow text-white hover:opacity-90 transition-opacity font-medium"
                size="lg"
              >
                {verifyAndActivateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t.paymentGate.checkPaymentChecking}
                  </>
                ) : verifySuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t.paymentGate.checkPaymentSuccess}
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    {t.paymentGate.checkPaymentButton}
                  </>
                )}
              </Button>
            </div>

            {/* ── Automatic polling status indicator ── */}
            <div
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{
                background: "rgba(0, 30, 15, 0.4)",
                border: "1px solid rgba(0, 255, 120, 0.15)",
              }}
            >
              {pollFetching ? (
                <RefreshCw
                  className="w-4 h-4 shrink-0 animate-spin"
                  style={{ color: "#00e87a" }}
                />
              ) : (
                <Clock
                  className="w-4 h-4 shrink-0 animate-pulse"
                  style={{ color: "rgba(100, 220, 160, 0.6)" }}
                />
              )}
              <p
                className="text-xs"
                style={{ color: "rgba(100, 220, 160, 0.6)" }}
              >
                {pollFetching
                  ? t.paymentGate.pollingChecking
                  : t.paymentGate.pollingMessage}
              </p>
            </div>

            {/* Auto-verification note */}
            <div
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{
                background: "rgba(0, 20, 10, 0.3)",
                border: "1px solid rgba(0, 255, 120, 0.1)",
              }}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-helix-glow" />
              <p
                className="text-xs"
                style={{ color: "rgba(100, 220, 160, 0.6)" }}
              >
                {t.paymentGate.autoVerifyNote}
              </p>
            </div>

            {/* Logout option */}
            <div className="pt-2 flex justify-center">
              <LoginButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
