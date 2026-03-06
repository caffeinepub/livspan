import { Gender } from "@/backend";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useSaveCallerUserProfile,
} from "@/hooks/useUserProfileQueries";
import { useI18n } from "@/i18n/useI18n";
import { Loader2, User } from "lucide-react";
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
import type React from "react";
import { useEffect, useState } from "react";

interface ProfileOnboardingGateProps {
  children: React.ReactNode;
}

export default function ProfileOnboardingGate({
  children,
}: ProfileOnboardingGateProps) {
  const { t } = useI18n();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();
  const saveMutation = useSaveCallerUserProfile();

  const [name, setName] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [heightCm, setHeightCm] = useState("");
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

    const year = Number.parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    if (!birthYear || Number.isNaN(year) || year < 1900 || year > currentYear) {
      newErrors.birthYear = t.profile.validation.birthYearInvalid;
    }

    const height = Number.parseInt(heightCm);
    if (!heightCm || Number.isNaN(height) || height < 50 || height > 300) {
      newErrors.heightCm = t.profile.validation.heightInvalid;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const profile = {
      name: name.trim(),
      birthYear: BigInt(Number.parseInt(birthYear)),
      heightCm: BigInt(Number.parseInt(heightCm)),
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
            backgroundImage:
              "url(/assets/generated/dna-helix-bg.dim_1440x2560.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 z-0 bg-black/60 backdrop-blur-[2px]" />

        {/* Login card with glassmorphism */}
        <Card
          className="relative z-10 max-w-md w-full border-0 shadow-2xl"
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
          <CardHeader className="text-center">
            {/* Logo */}
            <div className="mx-auto mb-6">
              <img
                src="/assets/IMG_8398-1.png"
                alt="LivSpan Token"
                className="w-32 h-32 mx-auto"
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
              {t.profile.loginRequired.title}
            </CardTitle>
            <CardDescription style={{ color: "rgba(100, 220, 160, 0.6)" }}>
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
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <Dialog open={true}>
        <DialogContent
          className="sm:max-w-md border-0"
          style={{
            background: "rgba(0, 20, 10, 0.85)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(0, 255, 120, 0.2)",
            borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(0, 255, 100, 0.12)",
          }}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle
              className="text-xl font-light tracking-wide"
              style={{
                background: "linear-gradient(135deg, #a8ffce, #4fffb0)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t.profile.setup.title}
            </DialogTitle>
            <DialogDescription style={{ color: "rgba(100, 220, 160, 0.6)" }}>
              {t.profile.setup.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" style={{ color: "#00e87a" }}>
                {t.profile.fields.name}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.profile.placeholders.name}
                disabled={saveMutation.isPending}
                style={{
                  background: "rgba(0, 30, 15, 0.5)",
                  borderColor: "rgba(0, 255, 120, 0.25)",
                  color: "#a8ffce",
                }}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Birth Year */}
            <div className="space-y-2">
              <Label htmlFor="birthYear" style={{ color: "#00e87a" }}>
                {t.profile.fields.birthYear}
              </Label>
              <Input
                id="birthYear"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder={t.profile.placeholders.birthYear}
                disabled={saveMutation.isPending}
                style={{
                  background: "rgba(0, 30, 15, 0.5)",
                  borderColor: "rgba(0, 255, 120, 0.25)",
                  color: "#a8ffce",
                }}
              />
              {errors.birthYear && (
                <p className="text-xs text-destructive">{errors.birthYear}</p>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="heightCm" style={{ color: "#00e87a" }}>
                {t.profile.fields.heightCm}
              </Label>
              <Input
                id="heightCm"
                type="number"
                min="50"
                max="300"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder={t.profile.placeholders.heightCm}
                disabled={saveMutation.isPending}
                style={{
                  background: "rgba(0, 30, 15, 0.5)",
                  borderColor: "rgba(0, 255, 120, 0.25)",
                  color: "#a8ffce",
                }}
              />
              {errors.heightCm && (
                <p className="text-xs text-destructive">{errors.heightCm}</p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label style={{ color: "#00e87a" }}>
                {t.profile.fields.gender}
              </Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as Gender)}
                disabled={saveMutation.isPending}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Gender.male} id="male" />
                  <Label
                    htmlFor="male"
                    className="font-normal cursor-pointer"
                    style={{ color: "#7effc0" }}
                  >
                    {t.profile.genderOptions.male}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Gender.female} id="female" />
                  <Label
                    htmlFor="female"
                    className="font-normal cursor-pointer"
                    style={{ color: "#7effc0" }}
                  >
                    {t.profile.genderOptions.female}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={Gender.diverse} id="diverse" />
                  <Label
                    htmlFor="diverse"
                    className="font-normal cursor-pointer"
                    style={{ color: "#7effc0" }}
                  >
                    {t.profile.genderOptions.diverse}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Error message */}
            {saveMutation.isError && (
              <Alert
                variant="destructive"
                style={{
                  background: "rgba(30, 0, 0, 0.5)",
                  borderColor: "rgba(255, 80, 80, 0.35)",
                }}
              >
                <AlertDescription style={{ color: "#ff8080" }}>
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
