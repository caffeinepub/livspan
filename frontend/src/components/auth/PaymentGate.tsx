import React, { useState } from 'react';
import { Copy, CheckCircle2, Loader2, Coins, Clock, ShieldCheck } from 'lucide-react';
import { useGetIcpAddress } from '@/hooks/useActivationQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useI18n } from '@/i18n/useI18n';
import LoginButton from '@/components/auth/LoginButton';

export default function PaymentGate() {
  const { t } = useI18n();
  const { data: icpAddress, isLoading: addressLoading, isError: addressError } = useGetIcpAddress();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!icpAddress) return;
    try {
      await navigator.clipboard.writeText(icpAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
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

      {/* Payment card */}
      <Card className="relative z-10 max-w-lg w-full border-helix-strand/40 bg-card/95 backdrop-blur-md shadow-2xl">
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

          {/* Polling status */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
            <Clock className="w-4 h-4 text-muted-foreground shrink-0 animate-pulse" />
            <p className="text-xs text-muted-foreground">{t.paymentGate.pollingMessage}</p>
          </div>

          {/* Manual confirmation note */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border/30">
            <ShieldCheck className="w-4 h-4 text-helix-glow shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">{t.paymentGate.manualConfirmNote}</p>
          </div>

          {/* Logout option */}
          <div className="pt-2 flex justify-center">
            <LoginButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
