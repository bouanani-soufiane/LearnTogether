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

export interface TagResponseDTO {
    id: number;
    name: string;
}

export interface VoteResponseDTO {
    id: number;
    userId: number;
    value: number;
}

export interface AnswerResponseDTO {
    id: number;
    userId: number;
    content: string;
    valid: boolean;
    votes: VoteResponseDTO[];
}

export interface QuestionResponseDTO {
    id: number;
    userId: number;
    title: string;
    content: string;
    answers: AnswerResponseDTO[];
    votes: VoteResponseDTO[];
    tags: TagResponseDTO[];
    createdAt?: string;
    viewCount?: number;
}

export interface PagedResult<T> {
    data: T[];
    totalElements: number;
    pageNumber: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
}

export type QuestionsResponse = PagedResult<QuestionResponseDTO>;

export interface QuestionCreateDTO {
    title: string;
    content: string;
    tagIds?: number[];
}

export interface AnswerCreateDTO {
    content: string;
}

export interface VoteCreateDTO {
    value: number;
}

export interface Tag {
    id: number;
    name: string;
    description?: string;
    count?: number; // How many questions use this tag
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED"
}