// components/QuestionCard.tsx

import { PencilIcon, TrashIcon } from "lucide-react";
import Button from "@/components/buttons/Button";
import Text from "@/components/text/Text";
import { Question } from "@/types/questions";
import logger from "@/lib/logger";

interface QuestionCardProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (id: number) => void;
  onTranslate: (questionId: number, lang: string) => void;
}

export default function QuestionCard({
  question,
  onEdit,
  onDelete,
  onTranslate,
}: QuestionCardProps) {
  const enTranslation = question.question_texts.find(
    (t) => t.language === "en"
  );

  return (
    <div className='mb-6 p-4 bg-white rounded-lg shadow-sm'>
      <div className='flex justify-between items-start'>
        <Text variant='main' size='lg' weight='bold' tagName='h3'>
          {enTranslation?.question_text}
        </Text>
        <div className='flex gap-2'>
          <Button
            variant='light'
            onClick={() => question.id && onTranslate(question.id, "AR")}
            className='rounded-full'>
            🇸🇦
          </Button>
          <Button
            variant='light'
            onClick={() => question.id && onTranslate(question.id, "RU")}
            className='rounded-full'>
            🇷🇺
          </Button>
          <Button
            variant='light'
            sizeOfButton='base'
            className='p-2 border-none'
            onClick={() => onEdit(question)}>
            <PencilIcon className='w-5 h-5' />
          </Button>
          <Button
            variant='light'
            sizeOfButton='base'
            className='p-2 border-none'
            onClick={() => question.id && onDelete(question.id)}>
            <TrashIcon className='w-5 h-5' />
          </Button>
        </div>
      </div>

      {enTranslation?.options.map((opt, idx) => (
        <div
          key={idx + opt.option_text}
          className='mt-2 flex flex-row gap-5 w-full'>
          <span className='font-medium'>
            {idx + 1}.{opt.option_text}
          </span>
          <div className='flex flex-wrap gap-2'>
            {opt?.tags?.map((tag, idx) => (
              <span
                key={tag + idx}
                className='px-2 py-1 bg-text-3 text-white text-sm rounded-full'>
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
