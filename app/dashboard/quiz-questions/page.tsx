"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  useDeleteQuizQuestionMutation,
  useGetQuizQuestionsQuery,
} from "@/redux/api/quiz-questions";

import QuizQuestionComponent from "./_components/add-update-question";

import { QuizQuestion } from "@/types/quiz-questions";

export default function PartnersPage() {
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [editQuestion, setEditQuestion] = useState<QuizQuestion | null>(null);
  const router = useRouter();
  const {
    data: quizzezData,
    error,
    isLoading,
    refetch,
  } = useGetQuizQuestionsQuery();
  const [deleteQuizQuestion] = useDeleteQuizQuestionMutation();

  useEffect(() => {
    if (quizzezData && Array.isArray(quizzezData.result)) {
      setQuizQuestions(quizzezData.result);
    }
  }, [quizzezData]);

  const handleDelete = async (quizQuestion: QuizQuestion) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete this Quiz Question. This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      if (!quizQuestion.id) return;
      toast.info(`Deleting quiz question...`);
      try {
        const res = await deleteQuizQuestion(quizQuestion.id).unwrap();
        if (res.success === true) {
          refetch();
          toast.success(`Quiz Question has been deleted successfully!`);
        }
      } catch (error) {
        toast.error("Failed to delete question. Please try again.");
      }
    }
  };

  const handleEditClick = (question: QuizQuestion) => {
    setTimeout(() => {
      const container = document.querySelector(
        "main.flex-1.overflow-y-auto.p-4"
      );
      if (container) {
        container.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 100);
    setEditQuestion(question);
  };

  if (isLoading) return <p>Loading quiz questions...</p>;
  if (error) return <p>Error loading quiz questions</p>;

  return (
    <div className='bg-secondary-100 rounded-2xl mb-8 max-w-7xl mx-auto p-6'>
      <QuizQuestionComponent
        editQuestion={editQuestion}
        onCompleted={() => {
          setEditQuestion(null);
          refetch();
        }}
      />

      <h1 className='text-2xl font-bold mb-6'>All Quiz Questions</h1>
      <div className='space-y-6'>
        {quizQuestions.map((question) => (
          <div key={question.id} className='p-4 rounded-lg shadow bg-white'>
            <div className='flex justify-between items-start'>
              <div>
                <h2 className='text-lg font-semibold mb-2'>
                  {question.question}
                </h2>
                <ul className='space-y-2'>
                  {["option1", "option2", "option3", "option4"].map(
                    (optKey, index) => (
                      <li
                        key={index}
                        className={`p-2 rounded border ${
                          question.correctOption === optKey
                            ? "border-green-500 bg-green-100 font-semibold"
                            : "border-gray-300"
                        }`}>
                        {question[optKey as keyof QuizQuestion]}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className='flex gap-2'>
                <button
                  onClick={() => handleEditClick(question)}
                  className='text-blue-600 hover:text-blue-800'>
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => handleDelete(question)}
                  className='text-red-600 hover:text-red-800'>
                  <TrashIcon className='w-5 h-5' />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
