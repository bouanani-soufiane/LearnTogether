export type UserRequestDTO = {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
};

export enum UserRole {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
}