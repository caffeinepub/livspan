/**
 * ProfileOnboardingGate
 *
 * Handles two concerns:
 * 1. Shows a login prompt when the user is not authenticated.
 * 2. Shows a profile-setup modal when the user is authenticated but has no profile yet.
 *
 * NOTE: Activation (1 ICP payment gate) is verified upstream in App.tsx.
 * By the time this component renders, the user is guaranteed to be both
 * authenticated AND activated.
 */
import React, { useState, useEffect } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '@/hooks/useUserProfileQueries';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User } from 'lucide-react';
import { useI18n } from '@/i18n/useI18n';
import { Gender } from '@/backend';
import LoginButton from '@/components/auth/LoginButton';

interface ProfileOnboardingGateProps {
  children: React.ReactNode;
}

export default function ProfileOnboardingGate({ children }: ProfileOnboardingGateProps) {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const [name, setName] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [gender, setGender] = useState<Gender>(Gender.diverse);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when profile loads
  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setBirthYear(userProfile.birthYear.toString());
      setHeightCm(userProfile.heightCm.toString());
      setGender(userProfile.gender);
    }
  }, [userProfile]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t.profile.validation.nameRequired;
    }

    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    if (!birthYear || isNaN(year) || year < 1900 || year > currentYear) {
      newErrors.birthYear = t.profile.validation.birthYearInvalid;
    }

    const height = parseInt(heightCm);
    if (!heightCm || isNaN(height) || height < 50 || height > 300) {
      newErrors.heightCm = t.profile.validation.heightInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const profile = {
      name: name.trim(),
      birthYear: BigInt(parseInt(birthYear)),
      heightCm: BigInt(parseInt(heightCm)),
      gender,
    };

    saveMutation.mutate(profile);
  };

  // Show login prompt when not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* DNA helix background image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        
        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" />

        {/* Login card with enhanced backdrop */}
        <Card className="relative z-10 max-w-md w-full border-helix-strand/40 bg-card/95 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="mx-auto mb-6">
              <img 
                src="/assets/IMG_8398-1.png" 
                alt="LivSpan Token" 
                className="w-32 h-32 mx-auto"
              />
            </div>
            <CardTitle className="text-2xl font-light tracking-wide bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">
              {t.profile.loginRequired.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {t.profile.loginRequired.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <LoginButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show profile setup when authenticated but profile is missing
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <Dialog open={true}>
        <DialogContent className="sm:max-w-md" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="text-xl font-light tracking-wide bg-gradient-to-r from-helix-accent to-helix-glow bg-clip-text text-transparent">
              {t.profile.setup.title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t.profile.setup.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-helix-accent">{t.profile.fields.name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.profile.placeholders.name}
                disabled={saveMutation.isPending}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Birth Year */}
            <div className="space-y-2">
              <Label htmlFor="birthYear" className="text-helix-accent">{t.profile.fields.birthYear}</Label>
              <Input
                id="birthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder={t.profile.placeholders.birthYear}
                disabled={saveMutation.isPending}
              />
              {errors.birthYear && (
                <p className="text-xs text-destructive">{errors.birthYear}</p>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="heightCm" className="text-helix-accent">{t.profile.fields.heightCm}</Label>
              <Input
                id="heightCm"
                type="number"
                min="50"
                max="300"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder={t.profile.placeholders.heightCm}
                disabled={saveMutation.isPending}
              />
              {errors.heightCm && (
                <p className="text-xs text-destructive">{errors.heightCm}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label className="text-helix-accent">{t.profile.fields.gender}</Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as Gender)}
                disabled={saveMutation.isPending}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Gender.male} id="male" />
                  <Label htmlFor="male" className="font-normal cursor-pointer">
                    {t.profile.genderOptions.male}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Gender.female} id="female" />
                  <Label htmlFor="female" className="font-normal cursor-pointer">
                    {t.profile.genderOptions.female}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Gender.diverse} id="diverse" />
                  <Label htmlFor="diverse" className="font-normal cursor-pointer">
                    {t.profile.genderOptions.diverse}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Error message */}
            {saveMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to save profile. Please try again.
                </AlertDescription>
              </Alert>
            )}

            {/* Save button */}
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="w-full bg-gradient-to-r from-helix-accent to-helix-glow hover:from-helix-glow hover:to-helix-accent"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t.profile.actions.saving}
                </>
              ) : (
                <>
                  <User className="w-4 h-4 mr-2" />
                  {t.profile.actions.save}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show children when profile exists
  return <>{children}</>;
}
