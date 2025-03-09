// src/pages/profile/ProfileQuestions.tsx
import React, { useEffect, useState } from "react";
import { useQuestionStore } from "@/store/questionStore";
import QuestionCard from "@/components/QuestionCard";

interface ProfileQuestionsProps {
    userId: number;
}

export function ProfileQuestions({ userId }: ProfileQuestionsProps) {
    const { questions, fetchQuestions } = useQuestionStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch questions for this specific user
        const fetchUserQuestions = async () => {
            setIsLoading(true);
            try {
                // Adjust your store/service to support filtering by userId
                await fetchQuestions(1, 10, `userId=${userId}`);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId) {
            fetchUserQuestions();
        }
    }, [userId, fetchQuestions]);

    if (isLoading) {
        return <div className="text-center py-8">Loading questions...</div>;
    }

    const userQuestions = questions?.data || [];

    if (userQuestions.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                This user hasn't asked any questions yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {userQuestions.map((question) => (
                <QuestionCard key={question.id} question={question} />
            ))}
        </div>
    );
}