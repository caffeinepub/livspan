import React from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { t } = useI18n();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      variant={isAuthenticated ? 'outline' : 'default'}
      size="sm"
      className="gap-2 bg-gradient-to-r from-helix-accent to-helix-glow hover:from-helix-glow hover:to-helix-accent border-helix-strand/40"
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {t.auth.loggingIn}
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4" />
          {t.auth.logout}
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4" />
          {t.auth.login}
        </>
      )}
    </Button>
  );
}
