import React, { useState, useEffect } from 'react';
import {
  Copy,
  CheckCircle2,
  Loader2,
  Coins,
  Clock,
  ShieldCheck,
  Settings,
  Save,
  X,
  Zap,
  AlertCircle,
} from 'lucide-react';
import {
  useGetIcpAddress,
  useIsCallerAdmin,
  useSetIcpAddress,
  useVerifyAndActivateMutation,
} from '@/hooks/useActivationQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/useI18n';
import LoginButton from '@/components/auth/LoginButton';
import { toast } from 'sonner';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function PaymentGate() {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: icpAddress, isLoading: addressLoading, isError: addressError } = useGetIcpAddress();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const setIcpAddressMutation = useSetIcpAddress();
  const verifyAndActivateMutation = useVerifyAndActivateMutation();

  const [copied, setCopied] = useState(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);

  // Pre-fill input when address loads or admin panel opens
  useEffect(() => {
    if (adminPanelOpen && icpAddress !== undefined) {
      setAddressInput(icpAddress);
    }
  }, [adminPanelOpen, icpAddress]);

  const handleCopy = async () => {
    if (!icpAddress) return;
    try {
      await navigator.clipboard.writeText(icpAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const el = document.createElement('textarea');
      el.value = icpAddress;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSaveAddress = async () => {
    const trimmed = addressInput.trim();
    if (!trimmed) {
      toast.error('Bitte eine gültige ICP-Adresse eingeben.');
      return;
    }
    try {
      await setIcpAddressMutation.mutateAsync(trimmed);
      toast.success('Zahlungsadresse erfolgreich gespeichert.');
      setAdminPanelOpen(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unbekannter Fehler';
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
        toast.success(t.paymentGate.checkPaymentSuccess);
      } else {
        setVerifyError(t.paymentGate.checkPaymentError);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
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
          backgroundImage: 'url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
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
                  title={adminPanelOpen ? 'Schließen' : 'Öffnen'}
                >
                  {adminPanelOpen ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                </Button>
              </div>
              {!adminPanelOpen && (
                <CardDescription className="text-xs text-muted-foreground mt-1">
                  Klicke auf das Symbol, um die ICP-Zahlungsadresse zu bearbeiten.
                </CardDescription>
              )}
            </CardHeader>

            {adminPanelOpen && (
              <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                  <Label htmlFor="icp-address-input" className="text-sm text-foreground">
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
                    Diese Adresse wird Nutzern auf der Anmeldeseite angezeigt, damit sie 1 ICP senden können.
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleSaveAddress}
                    disabled={setIcpAddressMutation.isPending || !addressInput.trim()}
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
                      setAddressInput(icpAddress ?? '');
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
                <p className="text-sm font-medium text-helix-accent">{t.paymentGate.feeLabel}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.paymentGate.feeDescription}</p>
              </div>
            </div>

            {/* ICP Address */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-helix-accent">{t.paymentGate.addressLabel}</p>

              {addressLoading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t.paymentGate.loadingAddress}</span>
                </div>
              )}

              {addressError && (
                <Alert variant="destructive">
                  <AlertDescription>{t.paymentGate.addressError}</AlertDescription>
                </Alert>
              )}

              {!addressLoading && !addressError && icpAddress && (
                <div className="flex items-stretch gap-2">
                  <div className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-muted/50 border border-border font-mono text-xs text-foreground break-all leading-relaxed">
                    {icpAddress}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
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
              )}

              {!addressLoading && !addressError && !icpAddress && (
                <p className="text-sm text-muted-foreground italic">{t.paymentGate.addressNotSet}</p>
              )}

              {copied && (
                <p className="text-xs text-helix-accent">{t.paymentGate.copySuccess}</p>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">{t.paymentGate.instructionsTitle}</p>
              <ol className="space-y-2">
                {[
                  t.paymentGate.step1,
                  t.paymentGate.step2,
                  t.paymentGate.step3,
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-helix-strand/20 border border-helix-strand/40 flex items-center justify-center text-xs text-helix-accent font-medium mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
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

              {/* Check Payment button */}
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

            {/* Polling status */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0 animate-pulse" />
              <p className="text-xs text-muted-foreground">{t.paymentGate.pollingMessage}</p>
            </div>

            {/* Auto-verification note */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
              <ShieldCheck className="w-4 h-4 text-helix-glow shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">{t.paymentGate.autoVerifyNote}</p>
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
