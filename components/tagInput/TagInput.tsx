import { useState, useEffect, useRef } from "react";
import { useGetStringTagsQuery } from "@/redux/api/tags-api";
import Input from "../input/Input";

type TagInputProps = {
  tags: string[];
  onTagsChange: (newTags: string[]) => void;
};

export default function TagInput({ tags, onTagsChange }: TagInputProps) {
  const [tagInput, setTagInput] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data } = useGetStringTagsQuery(tagInput, {
    skip: tagInput.length < 2, // Avoid unnecessary API calls
  });

  // Filter & limit results when data loads
  useEffect(() => {
    if (data?.success) {
      const filtered = data.result
        .filter((tag) => tag.toLowerCase().includes(tagInput.toLowerCase()))
        .slice(0, 6); // Show only 6 matches
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [data, tagInput]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      onTagsChange([...tags, tag]);
    }
    setTagInput("");
    setIsDropdownOpen(false);
  };

  const removeTag = (index: number) => {
    onTagsChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className='relative w-full max-w-md' ref={dropdownRef}>
      {/* Selected Tags */}
      <div className='flex gap-2 items-center flex-wrap p-2 pl-0 '>
        {tags.map((tag, index) => (
          <span
            key={index}
            className='px-2 py-1 bg-gray-200 rounded flex items-center'>
            {tag}
            <button
              onClick={() => removeTag(index)}
              className='ml-1 text-red-500'>
              ×
            </button>
          </span>
        ))}

        {/* Tag Input */}
        <Input
          placeholder='Add tag'
          value={tagInput}
          onChange={(e) => {
            setTagInput(e.target.value);
            setIsDropdownOpen(e.target.value.length >= 3); // Open dropdown on valid input
          }}
          onKeyDown={handleTagInput}
          onFocus={() => setIsDropdownOpen(tagInput.length >= 3)}
          className='w-32'
        />
      </div>

      {/* Filtered Suggestions Dropdown */}
      {isDropdownOpen && filteredSuggestions.length > 0 && (
        <ul className='absolute bg-white border border-gray-300 rounded-md w-full mt-1 shadow-lg z-10 transition-opacity duration-200 opacity-100'>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className='px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200'
              onClick={() => addTag(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
