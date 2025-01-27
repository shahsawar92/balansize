"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

import dummyQuestions from "@/data/mock-questions";

import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";
import Modal from "@/components/Modal/Modal";
import { Switch } from "@/components/switch/switch";
import Label from "@/components/text/Label";
import Text from "@/components/text/Text";

interface Translation {
  question?: string;
  options?: string[];
}

interface Question {
  id: number;
  question: string;
  options: string[];
  translations: {
    ar?: Translation;
    ru?: Translation;
  };
  isMultipleAllowed?: boolean;
  tags: string[];
}

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>(dummyQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([""]); // Start with one empty option
  const [tags, setTags] = useState<string[]>([]); // Store tags as an array
  const [tagInput, setTagInput] = useState(""); // Input for tags
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [translationModal, setTranslationModal] = useState({
    show: false,
    lang: "",
    questionId: null as number | null,
    tempTranslation: { question: "", options: [""] },
  });
  const [allowMultipleSelection, setAllowMultipleSelection] = useState(false); // Toggle for multiple selection

  // Add a new option
  const addOption = () => {
    setOptions([...options, ""]);
  };

  // Remove an option by index
  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  // Handle tag input
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Remove a tag
  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  // Save or update a question
  const handleAddQuestion = () => {
    if (newQuestion.trim() === "") return;

    const newQuestionObj: Question = {
      id: isEditing && editId !== null ? editId : Date.now(),
      question: newQuestion,
      options: options.filter((opt) => opt.trim() !== ""),
      translations: {},
      tags: tags,
      isMultipleAllowed: allowMultipleSelection,
    };

    if (isEditing) {
      setQuestions(
        questions.map((q) => (q.id === editId ? newQuestionObj : q))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      setQuestions([...questions, newQuestionObj]);
    }

    resetForm();
  };

  const handleTranslation = (questionId: number, lang: "ar" | "ru") => {
    const question = questions.find((q) => q.id === questionId);
    setTranslationModal({
      show: true,
      lang,
      questionId,

      tempTranslation: {
        question: question?.translations[lang]?.question || "",
        options: question?.translations[lang]?.options || question?.options || [],
      },
    });
  };
  const saveTranslation = () => {
    setQuestions(
      questions.map((q) => {
        if (q.id === translationModal.questionId) {
          return {
            ...q,
            translations: {
              ...q.translations,
              [translationModal.lang]: translationModal.tempTranslation,
            },
          };
        }
        return q;
      })
    );
    setTranslationModal({ ...translationModal, show: false });
  };
  // Reset form fields
  const resetForm = () => {
    setNewQuestion("");
    setOptions([""]);
    setTags([]);
    setTagInput("");
  };

  // Edit a question
  const handleEditQuestion = (question: Question) => {
    setNewQuestion(question.question);
    setOptions(question.options);
    setTags(question.tags);
    setIsEditing(true);
    setEditId(question.id);
  };

  // Delete a question
  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Handle option change
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className='w-full bg-secondary-100 rounded-2xl py-5 px-5 mx-auto'>
      {/* Add/Edit Question Form */}
      <div className='bg-secondary-100 rounded-2xl p-6 mb-8'>
        <Text variant='main' size='2xl' weight='bold' classNames='mb-6'>
          {isEditing ? "Edit Question" : "Add Question"}
        </Text>
        <div className='flex flex-col gap-4 w-full'>
          <div className='flex flex-col md:flex-row gap-4 items-start justify-between'>
            <div className='w-full '>
              <textarea
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder='Enter your question here...'
                className='w-full p-2 border rounded-lg focus:ring-main-brown focus:border-main-brown'
                rows={3}
              />
            </div>
          </div>
          <div className='w-full  flex flex-row flex-wrap gap-2'>
            {options.map((option, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <Input
                  placeholder={`Option ${index + 1}`}
                  type='text'
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  variant='light'
                  sizeOfInput='large'
                />
                {options.length > 1 && (
                  <button
                    onClick={() => removeOption(index)}
                    className='text-red-500 hover:text-red-700'>
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <Button
            variant='light'
            sizeOfButton='large'
            onClick={addOption}
            className='w-fit rounded-full '>
            Add Option
          </Button>
          <div className='mt-4'>
            <Label className='block text-sm font-semibold text-gray-700'>
              Tags
            </Label>
            <div className='flex flex-wrap gap-2 '>
              {tags.map((tag, index) => (
                <span key={index} className=' flex items-center gap-1'>
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className='text-red-500 hover:text-red-700'>
                    ×
                  </button>
                </span>
              ))}
              <Input
                type='text'
                value={tagInput}
                sizeOfInput='large'
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInput}
                placeholder='Type and press Enter...'
                className='flex-1 outline-none'
              />
            </div>
          </div>
          <div className='flex justify-between items-center'>
            <Button
              variant='brown'
              sizeOfButton='large'
              className='w-fit rounded-full'
              onClick={handleAddQuestion}>
              {isEditing ? "Update" : "Save"}
            </Button>
            <div className='flex items-center gap-2'>
              <Text variant='secondary' size='sm'>
                Allow Multiple Selection
              </Text>
              <Switch
                checked={
                  questions.find((q) => q.id === editId)?.isMultipleAllowed ||
                  allowMultipleSelection
                }
                onCheckedChange={setAllowMultipleSelection}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className='bg-secondary-100 rounded-2xl p-6'>
        {questions.map((q, index) => (
          <div key={q.id} className='mb-6 p-4 bg-white rounded-lg shadow-sm'>
            <div className='flex justify-between items-start'>
              <Text variant='main' size='lg' weight='bold' tagName='h3'>
                {index + 1}. {q.question}
              </Text>
              <div className='flex gap-2'>
                <Button
                  variant='light'
                  onClick={() => handleTranslation(q.id, "ar")}
                  className={cn(
                    " hover:bg-gray-100 rounded-full",
                    q.translations.ar &&
                      Object.keys(q.translations?.ar).length &&
                      "bg-main-brown text-white"
                  )}>
                  🇸🇦
                </Button>
                <Button
                  variant='light'
                  onClick={() => handleTranslation(q.id, "ru")}
                  className={cn(
                    " hover:bg-gray-100 rounded-full",
                    q.translations.ru &&
                      Object.keys(q.translations?.ru).length &&
                      "bg-main-brown text-white"
                  )}>
                  {" "}
                  🇷🇺
                </Button>

                {/* multiple allowed or not */}
                <Button
                  variant='light'
                  title={
                    q?.isMultipleAllowed
                      ? "Multiple Selection"
                      : "Single Selection"
                  }
                  sizeOfButton='base'
                  className='p-2 border-none'>
                  {q?.isMultipleAllowed ? (
                    <div className='w-5 h-5 bg-main-brown  border border-main-brown  rounded-full'></div>
                  ) : (
                    <div className='w-5 h-5 bg-transparent border border-main-brown rounded-full'></div>
                  )}
                </Button>
                <Button
                  variant='light'
                  sizeOfButton='base'
                  className='p-2 border-none'
                  onClick={() => handleEditQuestion(q)}>
                  <PencilIcon className='w-5 h-5' />
                </Button>
                <Button
                  variant='light'
                  sizeOfButton='base'
                  className='p-2 border-none'
                  onClick={() => handleDeleteQuestion(q.id)}>
                  <TrashIcon className='w-5 h-5' />
                </Button>
              </div>
            </div>

            {/* Tags Display */}
            {q.options.length > 0 && (
              <div className='mt-2 flex flex-wrap gap-2'>
                {q.options.map((tag, i) => (
                  <span
                    key={i}
                    className='px-2 py-1 bg-main-brown/10 text-main-brown text-sm rounded-full'>
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className='p-2  rounded-lg mt-2'>
              {q.tags.length > 0 && (
                <div className='mt-2 flex flex-wrap gap-2'>
                  {q.tags.map((tag, i) => (
                    <span
                      key={i}
                      className='px-2 py-1 bg-main-light text-main-brown text-sm rounded-full'>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Translation Modal */}
      <Modal
        isOpen={translationModal.show}
        onClose={() =>
          setTranslationModal({ ...translationModal, show: false })
        }
        title={`Translate to ${translationModal.lang.toUpperCase()}`}>
        <div className='space-y-4'>
          <label className='block text-sm font-semibold text-gray-700'>
            Translated Question
          </label>
          <Input
            value={translationModal.tempTranslation.question}
            onChange={(e) =>
              setTranslationModal({
                ...translationModal,
                tempTranslation: {
                  ...translationModal.tempTranslation,
                  question: e.target.value,
                },
              })
            }
          />

          {translationModal.tempTranslation.options.map((option, i) => (
            <>
              <label
                key={i}
                className='block text-sm font-semibold text-gray-700'>
                Option {i + 1}
              </label>
              <Input
                key={i}
                value={option}
                onChange={(e) => {
                  const newOptions = [
                    ...translationModal.tempTranslation.options,
                  ];
                  newOptions[i] = e.target.value;
                  setTranslationModal({
                    ...translationModal,
                    tempTranslation: {
                      ...translationModal.tempTranslation,
                      options: newOptions,
                    },
                  });
                }}
              />
            </>
          ))}

          <Button variant='brown' onClick={saveTranslation}>
            Save Translation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
