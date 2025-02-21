import { useEffect, useState } from "react";
import { ImSpinner2 } from "react-icons/im";
import { toast } from "react-toastify";

import logger from "@/lib/logger";

import Button from "@/components/buttons/Button";
import Modal from "@/components/Modal/Modal";
import Text from "@/components/text/Text";

import { QuestionText } from "@/types/questions";

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  translation: {
    question: QuestionText;
    baseOtionsLength: number | undefined;
  } | null;
  isLoading: boolean;
  questionId: number | null;
  onSave: (updatedTranslation: QuestionText) => Promise<void>;
}

export default function TranslationModal({
  isOpen,
  onClose,
  translation,
  isLoading,
  onSave,
}: TranslationModalProps) {
  const [editedTranslation, setEditedTranslation] =
    useState<QuestionText | null>(null);

  useEffect(() => {
    if (translation) {
      setEditedTranslation((prev) => {
        const existingOptions = translation.question.options || [];
        const requiredLength =
          translation.baseOtionsLength || existingOptions.length;

        // Ensure the options array matches the required length
        const updatedOptions = Array.from(
          { length: requiredLength },
          (_, index) => ({
            id: existingOptions[index]?.id || index,
            option_text: existingOptions[index]?.option_text || "",
          })
        );

        return { ...translation.question, options: updatedOptions };
      });
    } else {
      setEditedTranslation(null);
    }
  }, [translation]);

  if (!translation) return null;

  const handleChange = (field: string, value: string, index?: number) => {
    setEditedTranslation((prev) => {
      if (!prev) return null;

      if (index !== undefined) {
        const updatedOptions = prev.options.map((opt, i) =>
          i === index ? { ...opt, option_text: value } : opt
        );

        return { ...prev, options: updatedOptions };
      }

      return { ...prev, [field]: value };
    });
  };

  const handleSave = async () => {
    if (!editedTranslation) return;

    try {
      await onSave(editedTranslation);
      toast.success("Translation saved successfully!");
      onClose();
    } catch (error) {
      logger(error, "Save Translation Error");
      toast.error("Failed to save translation.");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${translation.question.language} Translation`}>
      <div className='p-4'>
        {isLoading ? (
          <div className='flex justify-center items-center py-6'>
            <ImSpinner2 className='animate-spin ' />
          </div>
        ) : (
          <>
            <input
              type='text'
              className='w-full p-2 mt-2 border rounded'
              value={editedTranslation?.question_text || ""}
              onChange={(e) => handleChange("question_text", e.target.value)}
            />

            <div className='mt-4'>
              <Text variant='main' size='lg'>
                Options:
              </Text>
              {editedTranslation?.options.map((opt, idx) => (
                <input
                  key={idx}
                  type='text'
                  className='w-full p-2 mt-2 border rounded'
                  value={opt.option_text}
                  onChange={(e) =>
                    handleChange("option_text", e.target.value, idx)
                  }
                />
              ))}
            </div>

            <div className='mt-6 flex justify-end gap-4'>
              <Button variant='brown' onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button variant='brown' onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"} {/* ✅ Show loading text */}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
