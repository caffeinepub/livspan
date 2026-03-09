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

        {/* Login card — futuristic HUD style */}
        <Card
          className="relative z-10 max-w-md w-full border-0 shadow-2xl futuristic-card"
          style={{
            borderRadius: "16px",
          }}
        >
          <CardHeader className="text-center pt-8">
            {/* Logo with neon ring */}
            <div className="mx-auto mb-6 relative inline-block">
              <img
                src="/assets/uploads/IMG_8864-1.png"
                alt="LivSpan Token"
                className="w-28 h-28 mx-auto"
                style={{
                  filter: "drop-shadow(0 0 16px rgba(0, 255, 180, 0.5))",
                }}
              />
            </div>
            <CardTitle
              className="text-2xl font-semibold tracking-wide neon-text"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {t.profile.loginRequired.title}
            </CardTitle>
            <CardDescription
              className="text-xs tracking-wider uppercase mt-1"
              style={{
                color: "rgba(0, 245, 255, 0.5)",
                fontFamily: "Sora, sans-serif",
              }}
            >
              {t.profile.loginRequired.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center pb-8">
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
          className="sm:max-w-md border-0 futuristic-card"
          style={{
            borderRadius: "16px",
          }}
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle
              className="text-xl font-semibold tracking-wide neon-text"
              style={{ fontFamily: "Sora, sans-serif" }}
            >
              {t.profile.setup.title}
            </DialogTitle>
            <DialogDescription style={{ color: "rgba(0, 245, 255, 0.5)" }}>
              {t.profile.setup.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-xs uppercase tracking-widest"
                style={{
                  color: "rgba(0, 245, 255, 0.7)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {t.profile.fields.name}
              </Label>
              <Input
                id="name"
                data-ocid="profile.input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.profile.placeholders.name}
                disabled={saveMutation.isPending}
                className="hud-input"
              />
              {errors.name && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.name_error"
                >
                  {errors.name}
                </p>
              )}
            </div>

            {/* Birth Year */}
            <div className="space-y-2">
              <Label
                htmlFor="birthYear"
                className="text-xs uppercase tracking-widest"
                style={{
                  color: "rgba(0, 245, 255, 0.7)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {t.profile.fields.birthYear}
              </Label>
              <Input
                id="birthYear"
                data-ocid="profile.input"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                placeholder={t.profile.placeholders.birthYear}
                disabled={saveMutation.isPending}
                className="hud-input"
              />
              {errors.birthYear && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.error_state"
                >
                  {errors.birthYear}
                </p>
              )}
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label
                htmlFor="heightCm"
                className="text-xs uppercase tracking-widest"
                style={{
                  color: "rgba(0, 245, 255, 0.7)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {t.profile.fields.heightCm}
              </Label>
              <Input
                id="heightCm"
                data-ocid="profile.input"
                type="number"
                min="50"
                max="300"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder={t.profile.placeholders.heightCm}
                disabled={saveMutation.isPending}
                className="hud-input"
              />
              {errors.heightCm && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="profile.error_state"
                >
                  {errors.heightCm}
                </p>
              )}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label
                className="text-xs uppercase tracking-widest"
                style={{
                  color: "rgba(0, 245, 255, 0.7)",
                  fontFamily: "Sora, sans-serif",
                }}
              >
                {t.profile.fields.gender}
              </Label>
              <RadioGroup
                value={gender}
                onValueChange={(value) => setGender(value as Gender)}
                disabled={saveMutation.isPending}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={Gender.male}
                    id="male"
                    data-ocid="profile.radio"
                  />
                  <Label
                    htmlFor="male"
                    className="font-normal cursor-pointer"
                    style={{ color: "#00f5ff" }}
                  >
                    {t.profile.genderOptions.male}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={Gender.female}
                    id="female"
                    data-ocid="profile.radio"
                  />
                  <Label
                    htmlFor="female"
                    className="font-normal cursor-pointer"
                    style={{ color: "#00f5ff" }}
                  >
                    {t.profile.genderOptions.female}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={Gender.diverse}
                    id="diverse"
                    data-ocid="profile.radio"
                  />
                  <Label
                    htmlFor="diverse"
                    className="font-normal cursor-pointer"
                    style={{ color: "#00f5ff" }}
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
                data-ocid="profile.error_state"
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
              data-ocid="profile.submit_button"
              className="w-full font-semibold tracking-wider"
              style={{
                background: "rgba(0, 10, 6, 0.5)",
                border: "1px solid rgba(0, 245, 255, 0.4)",
                color: "#00f5ff",
                fontFamily: "Sora, sans-serif",
                transition: "all 0.2s ease",
              }}
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
