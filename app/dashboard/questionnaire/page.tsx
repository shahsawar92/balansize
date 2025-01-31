"use client";

import { PencilIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";
import Modal from "@/components/Modal/Modal";
import { Switch } from "@/components/switch/switch";
import Text from "@/components/text/Text";

interface Option {
  name: string;
  tags: (string | number)[];
  tagInput?: string;
}

interface QuestionTranslation {
  language: string;
  question_text: string;
  options: Option[];
}

interface Question {
  id: number;
  category_id: number;
  is_questioner: boolean;
  is_multiple: boolean;
  question_translation: QuestionTranslation[];
}

const dummyQuestions: Question[] = [
  {
    id: 1,
    category_id: 1,
    is_questioner: true,
    is_multiple: false,
    question_translation: [
      {
        language: "EN",
        question_text: "What is the primary source of Vitamin C?",
        options: [
          { name: "Milk", tags: [1, "dairy", "vitamin"] },
          { name: "Oranges", tags: [2, "citrus", "vitaminC"] },
          { name: "Eggs", tags: [3, "protein", "diet"] },
          { name: "Bread", tags: [4, "carbs", "nutrition"] },
        ],
      },
      {
        language: "AR",
        question_text: "ما هو المصدر الرئيسي لفيتامين C؟",
        options: [
          { name: "حليب", tags: [1, "dairy", "vitamin"] },
          { name: "برتقال", tags: [2, "citrus", "vitaminC"] },
          { name: "بيض", tags: [3, "protein", "diet"] },
          { name: "خبز", tags: [4, "carbs", "nutrition"] },
        ],
      },
    ],
  },
  {
    id: 2,
    category_id: 1,
    is_questioner: true,
    is_multiple: false,
    question_translation: [
      {
        language: "EN",
        question_text:
          "Which nutrient is essential for building and repairing tissues?",
        options: [
          { name: "Carbohydrates", tags: [1, "energy", "carbs"] },
          { name: "Fats", tags: [2, "energy", "fats"] },
          { name: "Protein", tags: [3, "protein", "recovery"] },
          { name: "Fiber", tags: [4, "digestion", "fiber"] },
        ],
      },
      {
        language: "AR",
        question_text: "أي عنصر غذائي ضروري لبناء وإصلاح الأنسجة؟",
        options: [
          { name: "الكربوهيدرات", tags: [1, "energy", "carbs"] },
          { name: "الدهون", tags: [2, "energy", "fats"] },
          { name: "البروتين", tags: [3, "protein", "recovery"] },
          { name: "الألياف", tags: [4, "digestion", "fiber"] },
        ],
      },
      {
        language: "RU",
        question_text:
          "Какое питательное вещество необходимо для восстановления и строительства тканей?",
        options: [
          { name: "Углеводы", tags: [1, "energy", "carbs"] },
          { name: "Жиры", tags: [2, "energy", "fats"] },
          { name: "Белки", tags: [3, "protein", "recovery"] },
          { name: "Клетчатка", tags: [4, "digestion", "fiber"] },
        ],
      },
    ],
  },
  {
    id: 6,
    category_id: 2,
    is_questioner: true,
    is_multiple: false,
    question_translation: [
      {
        language: "EN",
        question_text:
          "What activity is recommended to reduce stress and improve mental health?",
        options: [
          { name: "Exercise", tags: [1, "mentalhealth", "fitness"] },
          { name: "Meditation", tags: [2, "mindfulness", "relaxation"] },
          { name: "Reading", tags: [3, "knowledge", "calm"] },
          { name: "Watching TV", tags: [4, "entertainment", "relaxation"] },
        ],
      },
      {
        language: "AR",
        question_text:
          "ما هو النشاط الموصى به لتقليل التوتر وتحسين الصحة العقلية؟",
        options: [
          { name: "التمرين", tags: [1, "mentalhealth", "fitness"] },
          { name: "التأمل", tags: [2, "mindfulness", "relaxation"] },
          { name: "القراءة", tags: [3, "knowledge", "calm"] },
          { name: "مشاهدة التلفاز", tags: [4, "entertainment", "relaxation"] },
        ],
      },
      {
        language: "RU",
        question_text:
          "Какая деятельность рекомендуется для снижения стресса и улучшения психического здоровья?",
        options: [
          { name: "Упражнения", tags: [1, "mentalhealth", "fitness"] },
          { name: "Медитация", tags: [2, "mindfulness", "relaxation"] },
          { name: "Чтение", tags: [3, "knowledge", "calm"] },
          { name: "Просмотр ТВ", tags: [4, "entertainment", "relaxation"] },
        ],
      },
    ],
  },
  {
    id: 7,
    category_id: 2,
    is_questioner: true,
    is_multiple: false,
    question_translation: [
      {
        language: "EN",
        question_text: "Which habit is beneficial for mental well-being?",
        options: [
          { name: "Regular sleep", tags: [1, "sleep", "mentalwellbeing"] },
          {
            name: "Excessive social media",
            tags: [2, "distraction", "stress"],
          },
          { name: "Healthy diet", tags: [3, "nutrition", "mentalhealth"] },
          { name: "Skipping meals", tags: [4, "unhealthy", "mentalhealth"] },
        ],
      },
      {
        language: "AR",
        question_text: "ما هي العادة المفيدة للصحة العقلية؟",
        options: [
          { name: "النوم المنتظم", tags: [1, "sleep", "mentalwellbeing"] },
          {
            name: "وسائل التواصل الاجتماعي المفرطة",
            tags: [2, "distraction", "stress"],
          },
          { name: "نظام غذائي صحي", tags: [3, "nutrition", "mentalhealth"] },
          { name: "تخطي الوجبات", tags: [4, "unhealthy", "mentalhealth"] },
        ],
      },
      {
        language: "RU",
        question_text: "Какая привычка полезна для психического здоровья?",
        options: [
          { name: "Регулярный сон", tags: [1, "sleep", "mentalwellbeing"] },
          {
            name: "Чрезмерное использование соцсетей",
            tags: [2, "distraction", "stress"],
          },
          { name: "Здоровое питание", tags: [3, "nutrition", "mentalhealth"] },
          {
            name: "Пропуск приема пищи",
            tags: [4, "unhealthy", "mentalhealth"],
          },
        ],
      },
    ],
  },
];

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>(dummyQuestions);
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([{ name: "", tags: [] }]);
  const [categoryId] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [translationModal, setTranslationModal] = useState<{
    show: boolean;
    lang: string;
    questionId: number | null;
    tempTranslation: QuestionTranslation;
  }>({
    show: false,
    lang: "",
    questionId: null,
    tempTranslation: { language: "", question_text: "", options: [] },
  });
  const [allowMultipleSelection, setAllowMultipleSelection] = useState(false);
  const [isQuestioner, setIsQuestioner] = useState(true);

  const handleTagInput = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      const newOptions = [...options];
      const currentInput = newOptions[index].tagInput?.trim();
      if (currentInput) {
        // Add tag and clear input
        newOptions[index].tags.push(currentInput);
        newOptions[index].tagInput = "";
        setOptions(newOptions);
      }
    }
  };

  // Update the handleOptionChange function
  const handleOptionChange = (
    index: number,
    value: string,
    field: "name" | "tagInput"
  ) => {
    const newOptions = [...options];
    if (field === "name") {
      newOptions[index].name = value;
    } else {
      // Only update the tagInput field, don't push here
      newOptions[index].tagInput = value;
    }
    setOptions(newOptions);
  };

  const removeTag = (optionIndex: number, tagIndex: number) => {
    const newOptions = [...options];
    newOptions[optionIndex].tags.splice(tagIndex, 1);
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { name: "", tags: [] }]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    if (newQuestion.trim() === "") return;

    const newQuestionObj: Question = {
      id: isEditing && editId !== null ? editId : Date.now(),
      category_id: categoryId,
      is_questioner: isQuestioner,
      is_multiple: allowMultipleSelection,
      question_translation: [
        {
          language: "EN",
          question_text: newQuestion,
          options: options.filter((opt) => opt.name.trim() !== ""),
        },
      ],
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

  const resetForm = () => {
    setNewQuestion("");
    setOptions([{ name: "", tags: [] }]);
  };

  const saveTranslation = () => {
    setQuestions(
      questions.map((q) => {
        if (q.id === translationModal.questionId) {
          const existing = q.question_translation.findIndex(
            (t) => t.language === translationModal.lang
          );
          const newTranslation = {
            language: translationModal.lang,
            question_text: translationModal.tempTranslation.question_text,
            options: translationModal.tempTranslation.options,
          };

          return {
            ...q,
            question_translation:
              existing === -1
                ? [...q.question_translation, newTranslation]
                : q.question_translation.map((t) =>
                    t.language === translationModal.lang ? newTranslation : t
                  ),
          };
        }
        return q;
      })
    );
    setTranslationModal({ ...translationModal, show: false });
  };

  logger(questions);

  const handleTranslation = (questionId: number, lang: string) => {
    const question = questions.find((q) => q.id === questionId);
    const baseTranslation = question?.question_translation.find(
      (t) => t.language === "EN"
    );

    const existingTranslation = question?.question_translation.find(
      (t) => t.language === lang
    );

    setTranslationModal({
      show: true,
      lang,
      questionId,
      tempTranslation: {
        language: lang,
        question_text: existingTranslation?.question_text || "",
        options:
          existingTranslation?.options ||
          baseTranslation?.options.map((opt) => ({
            name: "",
            tags: opt.tags,
          })) ||
          [],
      },
    });
  };
  const handleEditQuestion = (question: Question) => {
    const enTranslation = question.question_translation.find(
      (t) => t.language === "EN"
    );
    if (enTranslation) {
      setNewQuestion(enTranslation.question_text);
      setOptions(enTranslation.options);
      setIsEditing(true);
      setEditId(question.id);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
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
          <div className='w-full flex flex-col gap-2'>
            {options.map((option, index) => (
              <div key={index} className='flex gap-2 items-center'>
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option.name}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value, "name")
                  }
                  className='flex-1'
                />
                <div className='flex gap-2 items-center'>
                  {option.tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className='px-2 py-1 bg-gray-200 rounded'>
                      {tag}
                      <button
                        onClick={() => removeTag(index, tagIdx)}
                        className='ml-1 text-red-500'>
                        ×
                      </button>
                    </span>
                  ))}
                  <Input
                    placeholder='Add tag'
                    value={option.tagInput || ""}
                    onChange={(e) =>
                      handleOptionChange(index, e.target.value, "tagInput")
                    }
                    onKeyDown={(e) => handleTagInput(e, index)}
                    className='w-24'
                  />
                </div>
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
            className='w-fit rounded-full'>
            Add Option
          </Button>
          <div className='flex justify-between items-center'>
            <Button
              variant='brown'
              sizeOfButton='large'
              className='w-fit rounded-full'
              onClick={handleAddQuestion}>
              {isEditing ? "Update" : "Save"}
            </Button>
            <div>
              {" "}
              <div className='flex items-center gap-2'>
                <Text variant='secondary' size='sm'>
                  Allow Multiple Selection
                </Text>
                <Switch
                  checked={allowMultipleSelection}
                  onCheckedChange={setAllowMultipleSelection}
                />
              </div>
              <div className='flex items-center gap-2'>
                <Text variant='secondary' size='sm'>
                  Is Questioner
                </Text>
                <Switch
                  checked={isQuestioner}
                  onCheckedChange={setIsQuestioner}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className='bg-secondary-100 rounded-2xl p-6'>
        {questions.map((q) => {
          const enTranslation = q.question_translation.find(
            (t) => t.language === "EN"
          );
          return (
            <div key={q.id} className='mb-6 p-4 bg-white rounded-lg shadow-sm'>
              <div className='flex justify-between items-start'>
                <Text variant='main' size='lg' weight='bold' tagName='h3'>
                  {enTranslation?.question_text}
                </Text>
                <div className='flex gap-2'>
                  <Button
                    variant='light'
                    onClick={() => handleTranslation(q.id, "AR")}
                    className='rounded-full'>
                    🇸🇦
                  </Button>
                  <Button
                    variant='light'
                    onClick={() => handleTranslation(q.id, "RU")}
                    className='rounded-full'>
                    🇷🇺
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

              {enTranslation?.options.map((opt, idx) => (
                <div key={idx} className='mt-2 flex flex-col w-full'>
                  <span className='font-medium'>
                    {idx + 1}.{opt.name}
                  </span>
                  <div className='flex flex-wrap gap-2'>
                    <span className='px-2 py-1  text-sm rounded-full'>
                      tags:
                    </span>
                    {opt.tags.map((tag) => (
                      <span
                        key={tag}
                        className='px-2 py-1 bg-text-3 text-white text-sm rounded-full'>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
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
            value={translationModal.tempTranslation.question_text}
            onChange={(e) =>
              setTranslationModal({
                ...translationModal,
                tempTranslation: {
                  ...translationModal.tempTranslation,
                  question_text: e.target.value,
                },
              })
            }
          />
          {translationModal.tempTranslation.options.map((option, i) => (
            <div key={i}>
              <label className='block text-sm font-semibold text-gray-700 mt-4'>
                Option {i + 1}
              </label>
              <Input
                value={option.name}
                onChange={(e) => {
                  const newOptions = [
                    ...translationModal.tempTranslation.options,
                  ];
                  newOptions[i].name = e.target.value;
                  setTranslationModal({
                    ...translationModal,
                    tempTranslation: {
                      ...translationModal.tempTranslation,
                      options: newOptions,
                    },
                  });
                }}
              />
            </div>
          ))}
          <Button variant='brown' onClick={saveTranslation} className='mt-4'>
            Save Translation
          </Button>
        </div>
      </Modal>
    </div>
  );
}
