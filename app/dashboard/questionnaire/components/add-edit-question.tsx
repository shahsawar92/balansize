"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import Input from "@/components/input/Input";
import { Switch } from "@/components/switch/switch";
import TagInput from "@/components/tagInput/TagInput";
import Text from "@/components/text/Text";

import CategorySelect from "@/app/_app-components/getCategories";
import { useGetCategoriesQuery } from "@/redux/api/categories-api";
import {
  useAddQuestionMutation,
  useGetQuestionsQuery,
  useUpdateQuestionMutation,
} from "@/redux/api/questionnaire-api";

import { Category } from "@/types/categories-types";
import { Question } from "@/types/questions";

export default function AddQuestion({
  editingQuestion,
}: {
  editingQuestion: Question | null;
}) {
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState<
    Array<{ name: string; tags: string[]; tagInput?: string }>
  >([{ name: "", tags: [], tagInput: "" }]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [allowMultipleSelection, setAllowMultipleSelection] = useState(false);
  const [isQuestioner, setIsQuestioner] = useState(true);
  const [isForExpert, setIsForExpert] = useState(false);

  const [categories, setCategories] = useState<Category>();

  const { data: categoriesData } = useGetCategoriesQuery();
  const [addQuestion, { isLoading }] = useAddQuestionMutation();
  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateQuestionMutation();
  const { refetch } = useGetQuestionsQuery();

  useEffect(() => {
    if (editingQuestion) {
      setIsEditing(true);
      setEditId(editingQuestion.id);
      setNewQuestion(editingQuestion.question_texts[0].question_text ?? "");
      setAllowMultipleSelection(editingQuestion.is_multiple);
      setIsQuestioner(editingQuestion.is_questioner);
      setIsForExpert(editingQuestion.is_for_expert ?? false);
      setCategories({
        id: editingQuestion.category_id,
        name:
          categoriesData?.result?.find(
            (t) => t.id === editingQuestion.category_id
          )?.name ?? "",
        icon: "",
        translations: [],
      });

      // Ensure options are mapped correctly
      setOptions(
        editingQuestion.question_texts.flatMap((qText) =>
          qText.options.map((opt) => ({
            name: opt.option_text,
            tags: [...(opt.tags ?? [])],
            tagInput: "",
          }))
        )
      );
    }
  }, [editingQuestion, categoriesData]);
  const handleOptionChange = (
    index: number,
    value: string,
    field: "name" | "tagInput"
  ) => {
    setOptions((prev) => {
      return prev.map((opt, i) =>
        i === index ? { ...opt, [field]: value } : opt
      );
    });
  };

  const addOption = () => {
    setOptions((prev) => [...prev, { name: "", tags: [] }]);
  };

  const removeOption = (index: number) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  logger(
    "optionsState",
    JSON.stringify(
      options.map(({ name, tags }) => ({
        option_text: name,
        tags,
      }))
    )
  );

  const handleAddQuestion = async () => {
    if (!newQuestion.trim()) return toast.error("Please enter a question.");
    if (options.some((opt) => !opt.name.trim()))
      return toast.error("Please fill all options.");
    if (!categories) return toast.error("Please select a category.");

    const formattedOptions = options.map(({ name, tags }, index) => ({
      id: editingQuestion?.question_texts[0]?.options[index]?.id ?? 0,
      option_text: name,
      tags: [...tags],
    }));

    const questionData = {
      id: isEditing && editId !== null ? editId : null,
      is_questioner: isQuestioner,
      is_multiple: allowMultipleSelection,
      is_for_expert: isForExpert,
      category_id: categories?.id ?? 0,
      question_texts: [
        {
          id: editingQuestion?.question_texts[0]?.id ?? 0,
          language: "en",
          question_text: newQuestion,
          options: formattedOptions,
        },
      ],
    };

    try {
      let response;
      if (isEditing && editId) {
        response = await updateQuestion({
          id: editId,
          data: questionData,
        }).unwrap();
      } else {
        response = await addQuestion(questionData).unwrap();
      }

      if (response.success === false) {
        toast.error(response.message);
      } else {
        toast.success(isEditing ? "Question updated!" : "Question added!");
        resetForm();
        refetch();
      }
    } catch (error) {
      toast.error("Failed to process the request.");
    }
  };

  const resetForm = () => {
    setNewQuestion("");
    setOptions([{ name: "", tags: [], tagInput: "" }]);
    setCategories(undefined); // Reset category selection
    setAllowMultipleSelection(false); // Reset switch to default
    setIsQuestioner(true); // Reset switch to default
    setIsForExpert(false); // Reset switch to default
    setIsEditing(false);
    setEditId(null);
  };

  return (
    <div className='bg-secondary-100 rounded-2xl p-6 mb-8'>
      <div className='flex justify-between items-center gap-6'>
        <Text variant='main' size='2xl' weight='bold' classNames='mb-6'>
          {isEditing ? "Edit Question" : "Add Question"}
        </Text>
        <CategorySelect
          selectedCategory={categories}
          onChange={setCategories}
        />
      </div>

      <div className='flex flex-col gap-4 w-full'>
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder='Enter your question here...'
          className='w-full p-2 border rounded-lg focus:ring-main-brown focus:border-main-brown'
          rows={3}
        />
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

            <TagInput
              tags={option.tags}
              onTagsChange={(newTags) => {
                setOptions((prev) => {
                  return prev.map((opt, i) =>
                    i === index
                      ? {
                          ...opt,
                          tags: newTags,
                        }
                      : opt
                  );
                });
              }}
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
        <Button
          variant='light'
          sizeOfButton='large'
          onClick={addOption}
          className='w-fit rounded-full'>
          Add Option
        </Button>
        <Button
          variant='brown'
          sizeOfButton='large'
          className='w-fit rounded-full'
          onClick={handleAddQuestion}
          disabled={isLoading || isUpdating}>
          {isLoading || isUpdating
            ? "Processing..."
            : isEditing
              ? "Update"
              : "Save"}
        </Button>

        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-4 bg-secondary-300 p-2 rounded shadow bg-opacity-50'>
            <Switch
              checked={allowMultipleSelection}
              onCheckedChange={setAllowMultipleSelection}
            />
            <Text variant='secondary' size='sm'>
              Allow Multiple Selection
            </Text>
          </div>
          <div className='flex items-center gap-4 bg-secondary-300 p-2 rounded shadow bg-opacity-50'>
            <Switch checked={isQuestioner} onCheckedChange={setIsQuestioner} />
            <Text variant='secondary' size='sm'>
              Is Questioner
            </Text>
          </div>
          <div className='flex items-center gap-4 bg-secondary-300 p-2 rounded shadow bg-opacity-50'>
            <Switch checked={isForExpert} onCheckedChange={setIsForExpert} />

            <Text variant='secondary' size='sm'>
              Is For Expert
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
