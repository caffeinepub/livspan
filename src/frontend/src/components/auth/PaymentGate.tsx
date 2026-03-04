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
          <Card className="border-helix-accent/50 bg-card/95 backdrop-blur-md shadow-xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-helix-accent" />
                  <CardTitle className="text-sm font-medium text-helix-accent">
                    Admin: Zahlungsadresse konfigurieren
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
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
                <CardDescription className="text-xs text-muted-foreground mt-1">
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
                    className="text-sm text-foreground"
                  >
                    ICP-Zahlungsadresse
                  </Label>
                  <Input
                    id="icp-address-input"
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    placeholder="ICP Account-Adresse eingeben…"
                    className="font-mono text-xs bg-muted/50 border-border focus:border-helix-accent"
                    disabled={setIcpAddressMutation.isPending}
                  />
                  <p className="text-xs text-muted-foreground">
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
                    className="border-border hover:border-helix-strand/60"
                  >
                    Abbrechen
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Payment card */}
        <Card className="border-helix-strand/40 bg-card/95 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-4">
            {/* Logo */}
            <div className="mx-auto mb-4">
              <img
                src="/assets/IMG_8398-1.png"
                alt="LivSpan Token"
                className="w-24 h-24 mx-auto"
              />
            </div>

            <CardTitle className="text-2xl font-light tracking-wide bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">
              {t.paymentGate.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              {t.paymentGate.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Fee info */}
            <div className="flex items-center gap-3 p-4 rounded-lg bg-helix-accent/10 border border-helix-accent/30">
              <Coins className="w-6 h-6 text-helix-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-helix-accent">
                  {t.paymentGate.feeLabel}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {t.paymentGate.feeDescription}
                </p>
              </div>
            </div>

            {/* ICP Address — user's personal subaccount address */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-helix-accent">
                {t.paymentGate.addressLabel}
              </p>

              {userAddressLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
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
                      <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-muted/50 border border-border font-mono text-xs text-foreground break-all leading-relaxed">
                        {userPaymentAddress}
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopy}
                        data-ocid="payment.secondary_button"
                        className="shrink-0 border-helix-strand/40 hover:border-helix-accent hover:bg-helix-accent/10 transition-colors"
                        title={t.paymentGate.copyButton}
                      >
                        {copied ? (
                          <CheckCircle2 className="w-4 h-4 text-helix-accent" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground/70 italic">
                      Diese Adresse ist einzigartig für deinen Account / This
                      address is unique to your account
                    </p>
                  </>
                )}

              {!userAddressLoading &&
                !userAddressError &&
                !userPaymentAddress && (
                  <p className="text-sm text-muted-foreground italic">
                    {t.paymentGate.addressNotSet}
                  </p>
                )}

              {copied && (
                <p className="text-xs text-helix-accent">
                  {t.paymentGate.copySuccess}
                </p>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
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
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-helix-strand/20 border border-helix-strand/40 flex items-center justify-center text-xs text-helix-accent font-medium mt-0.5">
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
                <Alert className="border-helix-accent/50 bg-helix-accent/10">
                  <CheckCircle2 className="w-4 h-4 text-helix-accent" />
                  <AlertDescription className="text-helix-accent font-medium">
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
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
              {pollFetching ? (
                <RefreshCw className="w-4 h-4 text-helix-accent shrink-0 animate-spin" />
              ) : (
                <Clock className="w-4 h-4 text-muted-foreground shrink-0 animate-pulse" />
              )}
              <p className="text-xs text-muted-foreground">
                {pollFetching
                  ? t.paymentGate.pollingChecking
                  : t.paymentGate.pollingMessage}
              </p>
            </div>

            {/* Auto-verification note */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
              <ShieldCheck className="w-4 h-4 text-helix-glow shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
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
