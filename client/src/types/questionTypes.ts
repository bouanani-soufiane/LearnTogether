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
    createdAt?: string;
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

export const calculateVoteTotal = (votes: VoteResponseDTO[]): number => {
    if (!votes || !Array.isArray(votes)) return 0;
    return votes.reduce((total, vote) => total + vote.value, 0);
};

export const getUserVote = (votes: VoteResponseDTO[], userId?: number): VoteResponseDTO | undefined => {
    if (!userId) return undefined;
    return votes.find(vote => vote.userId === userId);
};