import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Input from "@/components/input/Input";
import Text from "@/components/text/Text";

import CategorySelect from "@/app/_app-components/getCategories";
import { useAddQuizQuestionMutation } from "@/redux/api/quiz-questions";

import { Category } from "@/types/categories-types";
import { QuizQuestion } from "@/types/quiz-questions";
import { useGetCategoriesQuery } from "@/redux/api/categories-api";

interface Props {
  editQuestion?: QuizQuestion | null;
  onCompleted?: () => void;
}

function QuizQuestionComponent({ editQuestion, onCompleted }: Props) {
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState<Array<{ name: string }>>([
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
  ]);
  const [correctOption, setCorrectOption] = useState("");
  const [categories, setCategories] = useState<Category | undefined>();
  const { data: categoriesData } = useGetCategoriesQuery();

  const [addQuestion, { isLoading, error }] = useAddQuizQuestionMutation();

  useEffect(() => {
    if (editQuestion) {
      setNewQuestion(editQuestion.question || "");
      logger(editQuestion, "Edit Question");
      setOptions([
        { name: editQuestion.option1 || "" },
        { name: editQuestion.option2 || "" },
        { name: editQuestion.option3 || "" },
        { name: editQuestion.option4 || "" },
      ]);
      setCorrectOption(editQuestion.correctOption || "");
      setCategories({
        id: editQuestion.category_id,
        name:
          categoriesData?.result?.find((t) => t.id === editQuestion.category_id)
            ?.name ?? "",
        icon: "",
        translations: [],
      });
    }
  }, [editQuestion]);

  const handleSubmit = async () => {
    if (
      !newQuestion ||
      options.some((opt) => opt.name.trim() === "") ||
      !correctOption ||
      !categories
    ) {
      alert("Please fill all fields");
      return;
    }

    const payload = {
      question: newQuestion,
      option1: options[0].name,
      option2: options[1].name,
      option3: options[2].name,
      option4: options[3].name,
      correctOption: correctOption,
      category_id: categories.id,
    };
    toast.info(editQuestion ? "Updating question..." : "Adding question...");

    try {
      const res = await addQuestion(payload).unwrap();
      toast.success(
        editQuestion
          ? "Question updated successfully!"
          : "Question added successfully!"
      );
      setNewQuestion("");
      setOptions([{ name: "" }, { name: "" }, { name: "" }, { name: "" }]);
      setCorrectOption("");
      setCategories(undefined);
      if (onCompleted) onCompleted();
    } catch (error) {
      toast.error("Failed to save question. Please try again.");
    }
    logger(error, "Error saving question");
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index].name = value;
    setOptions(updatedOptions);
  };

  return (
    <div className='bg-secondary-100 rounded-2xl p-6 mb-8'>
      <div className='flex justify-between items-center gap-6'>
        <Text variant='main' size='2xl' weight='bold' classNames='mb-6'>
          {editQuestion ? "Edit Question" : "Add Question"}
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

        <div className='flex gap-2 flex-wrap items-center'>
          {options.map((option, index) => {
            const optionKey = `option${index + 1}`;
            const isSelected = correctOption === optionKey;

            return (
              <Input
                key={index}
                placeholder={`Option ${index + 1}`}
                value={option.name}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className={`flex-1 ${
                  isSelected
                    ? "border border-main-brown ring-2 ring-main-brown"
                    : "border"
                }`}
              />
            );
          })}
        </div>

        <div className='flex flex-col gap-2 mt-4'>
          <Text variant='secondary' size='sm'>
            Select Correct Option
          </Text>
          <select
            value={correctOption}
            onChange={(e) => setCorrectOption(e.target.value)}
            className='p-2 border rounded focus:ring-main-brown focus:border-main-brown'>
            <option value=''>-- Select Correct Option --</option>
            <option value='option1'>{options[0].name || "Option 1"}</option>
            <option value='option2'>{options[1].name || "Option 2"}</option>
            <option value='option3'>{options[2].name || "Option 3"}</option>
            <option value='option4'>{options[3].name || "Option 4"}</option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className='mt-6 bg-main-brown text-white py-2 px-4 rounded hover:bg-opacity-90'>
          {editQuestion ? "Update Question" : "Submit Question"}
        </button>
      </div>
    </div>
  );
}

export default QuizQuestionComponent;
