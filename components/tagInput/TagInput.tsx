import { useState } from "react";

import Input from "../input/Input";

type TagInputProps = {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
};

export default function TagInput({ tags, onTagsChange }: TagInputProps) {
  const [tagInput, setTagInput] = useState("");

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        onTagsChange([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className='flex gap-2 items-center'>
      {tags.map((tag, index) => (
        <span key={index} className='px-2 py-1 bg-gray-200 rounded'>
          {tag}
          <button
            onClick={() => removeTag(index)}
            className='ml-1 text-red-500'>
            ×
          </button>
        </span>
      ))}
      <Input
        placeholder='Add tag'
        value={tagInput || ""}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleTagInput}
        className='w-24'
      />
    </div>
  );
}
