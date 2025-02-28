"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import logger from "@/lib/logger";

import Text from "@/components/text/Text";

import {
  useDeleteQuestionMutation,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
} from "@/redux/api/questionnaire-api";

import AddQuestion from "./components/add-edit-question";
import QuestionCard from "./components/questionCard";
import TranslationModal from "./components/TranslationModal";

import { Question, QuestionText } from "@/types/questions";

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const { data: questionsList, isLoading, refetch } = useGetQuestionsQuery();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  const [selectedTranslation, setSelectedTranslation] = useState<{
    question: QuestionText;
    baseOtionsLength: number | undefined;
  } | null>(null);

  const [deleteQuestion, { isLoading: isDeleteLoading }] =
    useDeleteQuestionMutation();
  const [questionId, setQuestionId] = useState<number | null>(null);
  const [updateQuestion, { isLoading: isUpdateLoading }] =
    useUpdateQuestionMutation();

  useEffect(() => {
    if (!isLoading && questionsList) {
      setQuestions(questionsList.result);
    }
  }, [questionsList, isLoading]);

  const handleDeleteQuestion = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    toast.info("Deleting question...");

    const res = await deleteQuestion(id);
    if ("data" in res && res.data?.success) {
      toast.success("Question deleted!");
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      refetch();
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleOpenTranslation = (questionId: number, lang: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    const translation = question.question_texts.find(
      (t) => t.language === lang
    );

    const baseTranslationOptions = question.question_texts.find(
      (t) => t.language === "en"
    )?.options.length;

    if (baseTranslationOptions) {
      setSelectedTranslation({
        question: translation || {
          id: questionId,
          language: lang,
          question_text: "",
          options: [],
        },
        baseOtionsLength: baseTranslationOptions,
      });
      setQuestionId(questionId);
      setIsModalOpen(true);
    }
  };

  const onTranslate = (questionId: number, lang: string) => {
    handleOpenTranslation(questionId, lang);
  };

  const handleSaveTranslation = async (updatedTranslation: QuestionText) => {
    if (!questionId) return;

    // Find the question to update
    const questionToUpdate = questions.find((q) => q.id === questionId);
    if (!questionToUpdate) return;

    // Check if the language exists in question_texts
    const existingIndex = questionToUpdate.question_texts.findIndex(
      (t) => t.language === updatedTranslation.language
    );

    let updatedQuestionTexts;
    if (existingIndex !== -1) {
      // Replace existing translation
      updatedQuestionTexts = questionToUpdate.question_texts.map((t, index) =>
        index === existingIndex ? updatedTranslation : t
      );
    } else {
      // Add new translation
      updatedQuestionTexts = [
        ...questionToUpdate.question_texts,
        updatedTranslation,
      ];
    }

    // Prepare updated question data
    const updatedQuestion = {
      ...questionToUpdate,
      question_texts: updatedQuestionTexts,
    };

    try {
      // Call API to update the question
      await updateQuestion({ id: questionId, data: updatedQuestion }).unwrap();

      // Update local state only after successful API call
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === questionId ? updatedQuestion : q))
      );

      setIsModalOpen(false);
    } catch (error) {
      logger(error, "Error updating question");
      toast.error("Error updating question");
    }
  };

  return (
    <div className='w-full bg-secondary-100 rounded-2xl py-5 px-5 mx-auto'>
      <AddQuestion editingQuestion={editingQuestion} />

      <Text variant='main' size='2xl' weight='bold' classNames='mb-6'>
        Questions List
      </Text>
      <div className='bg-secondary-100 rounded-2xl p-6'>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onTranslate={onTranslate}
              onEdit={() => {
                setEditingQuestion(q);
                setTimeout(() => {
                  const container = document.querySelector(
                    "main.flex-1.overflow-y-auto.p-4"
                  );
                  if (container) {
                    container.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }, 100);
              }}
              onDelete={handleDeleteQuestion}
            />
          ))
        )}

        {selectedTranslation?.baseOtionsLength && (
          <TranslationModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedTranslation(null);
              setQuestionId(null);
            }}
            isLoading={isUpdateLoading}
            questionId={questionId}
            translation={selectedTranslation}
            onSave={handleSaveTranslation}
          />
        )}
      </div>
    </div>
  );
}
