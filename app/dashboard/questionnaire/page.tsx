"use client";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

import dummyQuestions from "@/data/mock-questions";

import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";

interface Question {
  id: number;
  question: string;
  options: string[];
}

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>(dummyQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  const handleAddQuestion = () => {
    if (newQuestion.trim() === "") return;

    const newQuestionObj: Question = {
      id: isEditing && editId !== null ? editId : questions.length + 1,
      question: newQuestion,
      options: options.filter((opt) => opt.trim() !== ""),
    };

    if (isEditing) {
      setQuestions(
        questions.map((q) =>
          q.id === editId ? { ...q, ...newQuestionObj } : q
        )
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      setQuestions([...questions, newQuestionObj]);
    }

    setNewQuestion("");
    setOptions(["", "", "", ""]);
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleEditQuestion = (question: Question) => {
    setNewQuestion(question.question);
    setOptions(question.options);
    setIsEditing(true);
    setEditId(question.id);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className='w-full bg-secondary-100 rounded-2xl max-w-7xl py-5 px-5 mx-auto'>
      <div className='bg-secondary-100 rounded-2xl p-6 mb-8'>
        <h2 className='text-xl font-semibold mb-6 text-dark'>
          {isEditing ? "Edit Question" : "Add New Question"}
        </h2>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col md:flex-row gap-4 items-start justify-between'>
            {/* Question Textarea */}
            <div className='w-full md:w-1/2'>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder='Enter your question here...'
                className='w-full p-2 border rounded-lg focus:ring-main-brown focus:border-main-brown'
                rows={options.length}
                style={{
                  height: `calc(${options.length * 40}px + 1rem)`,
                }}
              />
            </div>

            {/* Options Inputs */}
            <div className='w-full md:w-1/2 flex flex-col gap-2'>
              {options.map((option, index) => (
                <Input
                  key={index}
                  placeholder={`Option ${index + 1}`}
                  type='text'
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant='light'
                  sizeOfInput='large'
                  isPassword={false}
                  isInvalid={false}
                  errorMessage=''
                />
              ))}
            </div>
          </div>
          <Button
            variant='brown'
            sizeOfButton='base'
            className='w-fit self-end'
            onClick={handleAddQuestion}>
            {isEditing ? "Update" : "Save"}
          </Button>
        </div>
      </div>

      <div className='bg-secondary-100 rounded-2xl p-6'>
        <h2 className='text-xl font-semibold mb-6 text-dark'>Questions List</h2>

        <div className='space-y-6 bg-main-white rounded-lg p-4 max-h-[500px] overflow-y-auto'>
          {questions.map((q, index) => (
            <div key={q.id}>
              <div className='flex justify-between items-start mb-4'>
                <div className='text-dark'>
                  <span className='font-medium'>{index + 1}. </span>
                  <span>{q.question}</span>
                </div>
                <div className='flex gap-2'>
                  <button
                    className='text-main-brown hover:text-main-brown/80 transition-colors'
                    onClick={() => handleEditQuestion(q)}>
                    <PencilIcon className='w-5 h-5' />
                  </button>
                  <button
                    className='text-red-500 hover:text-red-600 transition-colors'
                    onClick={() => handleDeleteQuestion(q.id)}>
                    <TrashIcon className='w-5 h-5' />
                  </button>
                </div>
              </div>

              <div className='flex gap-4 text-muted ml-5'>
                {q.options.map((option, i) => (
                  <div key={i} className='flex items-center gap-2'>
                    <span className='text-dark'>{option}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
