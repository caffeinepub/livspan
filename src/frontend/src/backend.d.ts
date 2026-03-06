import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NutritionDay {
    fat: number;
    caloriesConsumed: bigint;
    waterMl: bigint;
    carbs: number;
    bodyWeightKg?: number;
    waterLiters: number;
    vegetableGrams?: bigint;
    caloriesBurned: bigint;
    proteinGrams?: bigint;
    protein: number;
}
export interface SleepDay {
    durationHours: number;
    qualityScore: bigint;
}
export type Time = bigint;
export interface DiaryEntry {
    id: string;
    title: string;
    content: string;
    timestamp: Time;
}
export interface StressDay {
    date: string;
    systolic: bigint;
    diastolic: bigint;
    pulse: bigint;
}
export interface MovementDay {
    activeMinutes: bigint;
    activityType: Variant_gym_run_bike_walk;
    date: string;
    intensity: Variant_intense_light_medium;
}
export interface FastingSchedule {
    endHour: number;
    startHour: number;
}
export interface UserProfile {
    heightCm: bigint;
    birthYear: bigint;
    name: string;
    gender: Gender;
}
export enum Gender {
    female = "female",
    male = "male",
    diverse = "diverse"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_gym_run_bike_walk {
    gym = "gym",
    run = "run",
    bike = "bike",
    walk = "walk"
}
export enum Variant_intense_light_medium {
    intense = "intense",
    light = "light",
    medium = "medium"
}
export interface backendInterface {
    addDiaryEntry(title: string, content: string): Promise<string>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearNutritionDay(dayTimestamp: Time): Promise<void>;
    clearSleepDay(dayTimestamp: Time): Promise<void>;
    confirmActivation(user: Principal): Promise<void>;
    deleteDiaryEntry(id: string): Promise<boolean>;
    getCallerFastingSchedule(): Promise<FastingSchedule | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDiaryEntries(): Promise<Array<DiaryEntry>>;
    getIcpAddress(): Promise<string>;
    getMovementDay(date: string): Promise<MovementDay | null>;
    getNutritionEntry(user: Principal, dayTimestamp: Time): Promise<NutritionDay | null>;
    getSleepEntry(user: Principal, dayTimestamp: Time): Promise<SleepDay | null>;
    getStressDay(date: string): Promise<StressDay | null>;
    getTodayNutritionEntry(): Promise<NutritionDay | null>;
    getTodaySleepEntry(): Promise<SleepDay | null>;
    getUserPaymentAddress(): Promise<Principal>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isUserActivated(user: Principal): Promise<boolean>;
    saveCallerFastingSchedule(fastingSchedule: FastingSchedule): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMovementDay(movementDay: MovementDay): Promise<void>;
    saveNutritionDayEntry(dayTimestamp: Time, entry: NutritionDay): Promise<void>;
    saveSleepDayEntry(dayTimestamp: Time, entry: SleepDay): Promise<void>;
    saveStressDay(stressDay: StressDay): Promise<void>;
    setIcpAddress(address: string): Promise<void>;
    updateDiaryEntry(id: string, title: string, content: string): Promise<boolean>;
    verifyAndActivate(): Promise<boolean>;
}
