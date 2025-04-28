"use client";
import React, { useState } from "react";
import { toast } from "react-toastify";

import Input from "@/components/input/Input";
import Text from "@/components/text/Text";

import CategorySelect from "@/app/_app-components/getCategories";
import { useAddQuizQuestionMutation, useUpdateQuizQuestionMutation } from "@/redux/api/quiz-questions";

import { Category } from "@/types/categories-types";
import logger from "@/lib/logger";

function Page() {
  const [newQuestion, setNewQuestion] = useState("");
  const [options, setOptions] = useState<Array<{ name: string }>>([
    { name: "" },
    { name: "" },
    { name: "" },
    { name: "" },
  ]);
  const [correctOption, setCorrectOption] = useState("");

  const [categories, setCategories] = useState<Category | undefined>();

  const [addQuestion, { isLoading, error }] = useAddQuizQuestionMutation();
  // update api useUpdateQuizQuestionMutation



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
    toast.info("Adding question...");

    try {
      const res = await addQuestion(payload).unwrap();
      toast.success("Question added successfully!");
      setNewQuestion("");
      setOptions([{ name: "" }, { name: "" }, { name: "" }, { name: "" }]);
      setCorrectOption("");
      setCategories(undefined);
    } catch (error) {
      toast.error("Failed to add question. Please try again.");
    }
    logger(error, "Error adding question");
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
          Add Question
        </Text>
        <CategorySelect
          selectedCategory={categories}
          onChange={setCategories}
        />
      </div>

      <div className='flex flex-col gap-4 w-full'>
        {/* Question */}
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder='Enter your question here...'
          className='w-full p-2 border rounded-lg focus:ring-main-brown focus:border-main-brown'
          rows={3}
        />

        {/* Options */}
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

        {/* Correct Option Select */}
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className='mt-6 bg-main-brown text-white py-2 px-4 rounded hover:bg-opacity-90'>
          Submit Question
        </button>
      </div>
    </div>
  );
}

export default Page;
