// src/types/userTypes.ts
export enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER"
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED"
}

export interface UserProfile {
    userId: number;
    bio: string | null;
    location: string | null;
    websiteLink: string | null;
    birthdate: string | null;
    joinedAt: string;
}

export interface ProfileData {
    id: number;
    fullName: string;
    email: string;
    status: UserStatus;
    role: UserRole;
    profile: UserProfile;
}

export interface UserStats {
    questions: number;
    answers: number;
    reached: string;
    badges: {
        gold: number;
        silver: number;
        bronze: number;
    }
}