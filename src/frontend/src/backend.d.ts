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
    vegetableGrams?: bigint;
    caloriesBurned: bigint;
    proteinGrams?: bigint;
    protein: number;
}
export interface FastingSchedule {
    endHour: number;
    startHour: number;
}
export type Time = bigint;
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
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearNutritionDay(dayTimestamp: Time): Promise<void>;
    getCallerFastingSchedule(): Promise<FastingSchedule | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNutritionEntry(user: Principal, dayTimestamp: Time): Promise<NutritionDay | null>;
    getTodayNutritionEntry(): Promise<NutritionDay | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerFastingSchedule(fastingSchedule: FastingSchedule): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveNutritionDayEntry(dayTimestamp: Time, entry: NutritionDay): Promise<void>;
}
