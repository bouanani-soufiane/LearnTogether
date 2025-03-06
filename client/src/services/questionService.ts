import { apiInstance } from '../api';

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
    // Frontend needs these fields and i will later make them in the response coming from backend
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

export const getQuestions = async (
    page = 1,
    size = 10,
    sort = 'createdAt,desc'
): Promise<QuestionsResponse> => {
    try {
        const response = await apiInstance.get('/api/v1/questions', {
            params: { page, size, sort }
        });

        const enhancedData = response.data.data.map((question: QuestionResponseDTO) => ({
            ...question,
            createdAt: question.createdAt || new Date().toISOString(),
            viewCount: question.viewCount || Math.floor(Math.random() * 100) + 10,
        }));

        return {
            ...response.data,
            data: enhancedData
        };
    } catch (error) {
        console.error('Error fetching questions:', error);
        throw error;
    }
};

export const getQuestionById = async (id: number): Promise<QuestionResponseDTO> => {
    try {
        const response = await apiInstance.get<QuestionResponseDTO>(`/api/v1/questions/${id}`);

        return {
            ...response.data,
            createdAt: response.data.createdAt || new Date().toISOString(),
            viewCount: response.data.viewCount || Math.floor(Math.random() * 100) + 10,
        };
    } catch (error) {
        console.error(`Error fetching question with ID ${id}:`, error);
        throw error;
    }
};

export const createQuestion = async (questionData: QuestionCreateDTO): Promise<QuestionResponseDTO> => {
    try {
        const response = await apiInstance.post<QuestionResponseDTO>('/api/v1/questions', questionData);
        return response.data;
    } catch (error) {
        console.error('Error creating question:', error);
        throw error;
    }
};

export const updateQuestion = async (id: number, questionData: QuestionCreateDTO): Promise<QuestionResponseDTO> => {
    try {
        const response = await apiInstance.put<QuestionResponseDTO>(`/api/v1/questions/${id}`, questionData);
        return response.data;
    } catch (error) {
        console.error(`Error updating question ${id}:`, error);
        throw error;
    }
};

export const deleteQuestion = async (id: number): Promise<void> => {
    try {
        await apiInstance.delete(`/api/v1/questions/${id}`);
    } catch (error) {
        console.error(`Error deleting question ${id}:`, error);
        throw error;
    }
};

export const addAnswer = async (questionId: number, content: string): Promise<AnswerResponseDTO> => {
    try {
        console.log(`Adding answer to question ${questionId}`);

        const response = await apiInstance.post<AnswerResponseDTO>(
            `/api/v1/questions/${questionId}/answers`,
            { content },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("Answer response:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error adding answer to question ${questionId}:`, error);
        throw error;
    }
};


export const addVoteToQuestion = async (questionId: number, value: number): Promise<VoteResponseDTO> => {
    try {
        console.log(`Sending vote to question ${questionId} with value ${value}`);

        const response = await apiInstance.post<VoteResponseDTO>(
            `/api/v1/questions/${questionId}/votes`,
            { value }
        );

        console.log("Vote response:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error voting on question ${questionId}:`, error);
        throw error;
    }
};

export const addVoteToAnswer = async (answerId: number, value: number): Promise<VoteResponseDTO> => {
    try {
        console.log(`Sending vote to answer ${answerId} with value ${value}`);

        const response = await apiInstance.post<VoteResponseDTO>(
            `/api/v1/questions/answers/${answerId}/votes`,
            { value } // This matches your VoteCreateDTO on the backend
        );

        console.log("Vote response:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error voting on answer ${answerId}:`, error);
        throw error;
    }
};

export const markAnswerAsValid = async (answerId: number): Promise<AnswerResponseDTO> => {
    try {
        console.log(`Attempting to mark answer ${answerId} as valid`);

        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
            const parsed = JSON.parse(authStorage);
            console.log("Auth state:", {
                isAuthenticated: parsed.state?.isAuthenticated,
                hasToken: !!parsed.state?.token,
                userId: parsed.state?.user?.id
            });
        } else {
            console.warn("No auth storage found!");
        }

        console.log("Request URL:", `/api/v1/questions/answers/${answerId}/mark-valid`);

        const response = await apiInstance.patch<AnswerResponseDTO>(
            `/api/v1/questions/answers/${answerId}/mark-valid`
        );

        console.log("Mark as valid SUCCESS response:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error marking answer ${answerId} as valid:`, error);

        throw error;
    }
};

export const calculateVoteTotal = (votes: VoteResponseDTO[]): number => {
    if (!votes || !Array.isArray(votes)) return 0;
    return votes.reduce((total, vote) => total + vote.value, 0);
};

export const getUserVote = (votes: VoteResponseDTO[], userId?: number): VoteResponseDTO | undefined => {
    if (!userId) return undefined;
    return votes.find(vote => vote.userId === userId);
};