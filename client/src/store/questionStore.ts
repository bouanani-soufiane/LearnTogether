import {create} from 'zustand';
import {
    addAnswer,
    addVoteToAnswer,
    addVoteToQuestion,
    createQuestion,
    getQuestionById,
    getQuestions,
    markAnswerAsValid
} from '../services/questionService';
import {AnswerResponseDTO, QuestionCreateDTO, QuestionResponseDTO, QuestionsResponse} from "@/types";

interface QuestionState {
    // Home page state
    questions: QuestionsResponse | null;
    isQuestionsLoading: boolean;
    questionsError: string | null;
    currentPage: number;
    sortOption: string;

    // Question detail state
    currentQuestion: QuestionResponseDTO | null;
    isQuestionLoading: boolean;
    questionError: string | null;

    // Ask question state
    isSubmittingQuestion: boolean;
    createQuestionError: string | null;

    // Answer state
    isSubmittingAnswer: boolean;
    submitAnswerError: string | null;

    // Actions
    fetchQuestions: (page?: number, number: number, sort?: string) => Promise<void>;
    fetchQuestionById: (id: number) => Promise<void>;
    submitQuestion: (questionData: QuestionCreateDTO) => Promise<number | null>;
    submitAnswer: (questionId: number, content: string) => Promise<void>;
    voteOnQuestion: (questionId: number, voteType: 'up' | 'down' | 'none') => Promise<void>;
    voteOnAnswer: (answerId: number, voteType: 'up' | 'down' | 'none') => Promise<void>;
    acceptAnswer: (answerId: number) => Promise<void>;
    clearErrors: () => void;
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
    // Home page state
    questions: null,
    isQuestionsLoading: false,
    questionsError: null,
    currentPage: 1,
    sortOption: 'newest',

    // Question detail state
    currentQuestion: null,
    isQuestionLoading: false,
    questionError: null,

    // Ask question state
    isSubmittingQuestion: false,
    createQuestionError: null,

    // Answer state
    isSubmittingAnswer: false,
    submitAnswerError: null,

    // Actions
    fetchQuestions: async (page = 1, sort = 'newest') => {
        set({
            isQuestionsLoading: true,
            questionsError: null,
            currentPage: page,
            sortOption: sort
        });

        try {
            let sortParam = 'createdAt,desc';
            switch (sort) {
                case 'newest':
                    sortParam = 'id,desc';
                    break;
                case 'votes':
                    sortParam = 'id,desc';
                    break;
            }

            const data = await getQuestions(page, 10, sortParam);
            set({ questions: data, isQuestionsLoading: false });
        } catch (err: any) {
            set({
                questionsError: err.message || 'Failed to fetch questions',
                isQuestionsLoading: false
            });
        }
    },

    fetchQuestionById: async (id: number) => {
        set({ isQuestionLoading: true, questionError: null });

        try {
            const question = await getQuestionById(id);
            set({ currentQuestion: question, isQuestionLoading: false });
        } catch (err: any) {
            set({
                questionError: err.message || 'Failed to load question',
                isQuestionLoading: false
            });
        }
    },

    submitQuestion: async (questionData: QuestionCreateDTO) => {
        set({ isSubmittingQuestion: true, createQuestionError: null });

        try {
            const response = await createQuestion(questionData);
            set({ isSubmittingQuestion: false });
            return response.id;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to submit question';
            set({
                createQuestionError: errorMessage,
                isSubmittingQuestion: false
            });
            return null;
        }
    },

    submitAnswer: async (questionId: number, content: string) => {
        set({ isSubmittingAnswer: true, submitAnswerError: null });

        try {
            const answer = await addAnswer(questionId, content);

            const currentQuestion = get().currentQuestion;
            if (currentQuestion && currentQuestion.id === questionId) {
                const updatedAnswers = [...(currentQuestion.answers || []), answer];
                set({
                    currentQuestion: {
                        ...currentQuestion,
                        answers: updatedAnswers
                    },
                    isSubmittingAnswer: false
                });
            } else {
                set({ isSubmittingAnswer: false });
            }
        } catch (err: any) {
            set({
                submitAnswerError: err.response?.data?.message || 'Failed to submit answer',
                isSubmittingAnswer: false
            });
        }
    },

    voteOnQuestion: async (questionId: number, voteType: 'up' | 'down' | 'none') => {
        const currentQuestion = get().currentQuestion;
        if (!currentQuestion) return;

        try {
            // Convert vote type to numeric value
            const voteValue = voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0;

            // Call the API to register the vote
            const response = await addVoteToQuestion(questionId, voteValue);

            // Update the local state
            let updatedVotes = [...currentQuestion.votes];
            const existingVoteIndex = updatedVotes.findIndex(v => v.userId === response.userId);

            if (existingVoteIndex >= 0) {
                if (voteType === 'none') {
                    // Remove the vote
                    updatedVotes = updatedVotes.filter((_, index) => index !== existingVoteIndex);
                } else {
                    // Update existing vote
                    updatedVotes[existingVoteIndex] = {
                        ...updatedVotes[existingVoteIndex],
                        value: voteValue
                    };
                }
            } else if (voteType !== 'none') {
                // Add new vote
                updatedVotes.push(response);
            }

            set({
                currentQuestion: {
                    ...currentQuestion,
                    votes: updatedVotes
                }
            });
        } catch (err: any) {
            console.error('Error voting on question:', err);
        }
    },

    voteOnAnswer: async (answerId: number, voteType: 'up' | 'down' | 'none') => {
        const currentQuestion = get().currentQuestion;
        if (!currentQuestion || !currentQuestion.answers) return;

        try {
            // Convert vote type to numeric value
            const voteValue = voteType === 'up' ? 1 : voteType === 'down' ? -1 : 0;

            // Call the API to register the vote
            const response = await addVoteToAnswer(answerId, voteValue);

            // Update the local state
            const updatedAnswers = currentQuestion.answers.map((answer: AnswerResponseDTO) => {
                if (answer.id !== answerId) return answer;

                let updatedVotes = [...answer.votes];
                const existingVoteIndex = updatedVotes.findIndex(v => v.userId === response.userId);

                if (existingVoteIndex >= 0) {
                    if (voteType === 'none') {
                        // Remove the vote
                        updatedVotes = updatedVotes.filter((_, index) => index !== existingVoteIndex);
                    } else {
                        // Update existing vote
                        updatedVotes[existingVoteIndex] = {
                            ...updatedVotes[existingVoteIndex],
                            value: voteValue
                        };
                    }
                } else if (voteType !== 'none') {
                    // Add new vote
                    updatedVotes.push(response);
                }

                return {
                    ...answer,
                    votes: updatedVotes
                };
            });

            set({
                currentQuestion: {
                    ...currentQuestion,
                    answers: updatedAnswers
                }
            });
        } catch (err: any) {
            console.error('Error voting on answer:', err);
        }
    },

    acceptAnswer: async (answerId: number) => {
        const currentQuestion = get().currentQuestion;
        if (!currentQuestion || !currentQuestion.answers) return;

        try {
            // Call the API to mark the answer as valid
            await markAnswerAsValid(answerId);

            // Update all answers to ensure only one is marked as valid
            const updatedAnswers = currentQuestion.answers.map((answer: AnswerResponseDTO) => ({
                ...answer,
                valid: answer.id === answerId
            }));

            set({
                currentQuestion: {
                    ...currentQuestion,
                    answers: updatedAnswers
                }
            });
        } catch (err: any) {
            console.error('Error accepting answer:', err);
        }
    },

    clearErrors: () => {
        set({
            questionsError: null,
            questionError: null,
            createQuestionError: null,
            submitAnswerError: null
        });
    }
}));