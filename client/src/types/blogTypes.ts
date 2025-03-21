export enum ReviewStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}

export interface TagDTO {
    id: number;
    name: string;
}

export interface CommentResponseDTO {
    id: number;
    userId: number;
    content: string;
    blogId: number;
}

export interface CreateCommentRequest {
    content: string;
}

export interface BlogResponseDTO {
    id: number;
    userId: number;
    title: string;
    content: string;
    views: number;
    reviewStatus: ReviewStatus;
    reviewedAt: string | null;
    likeCount: number;
    likedByCurrentUser: boolean;
    comments: CommentResponseDTO[];
    tags: TagDTO[];
    commentCount: number;
}

export interface BlogSummaryDTO {
    id: number;
    userId: number;
    title: string;
    views: number;
    reviewStatus: ReviewStatus;
    likeCount: number;
    tags: TagDTO[];
    commentCount: number;
}

export interface CreateBlogRequest {
    title: string;
    content: string;
    tagIds: number[];
}

export interface UpdateBlogRequest {
    title: string;
    content: string;
    tagIds: number[];
}

export interface ReviewBlogRequest {
    status: ReviewStatus;
}
