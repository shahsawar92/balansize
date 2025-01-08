import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import * as React from "react";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/cards/card";
import Text from "@/components/text/Text";

import { Plan } from "@/types/plans";

interface PlanCardProps extends Plan {
  onEdit?: () => void;
  onDelete?: () => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  description,
  price,
  features,
  trail,
  onEdit,
  onDelete,
  className,
  ...rest
}) => {
  return (
    <Card
      className={cn(
        "w-full max-w-sm mx-auto bg-white rounded-3xl shadow-sm p-6",
        className
      )}
      {...rest}>
      <CardHeader className='p-0 mb-4 space-y-0'>
        <div className='flex justify-between items-start'>
          <CardTitle className='text-2xl font-bold text-dark'>
            {title}
          </CardTitle>
          <div className='inline-flex items-center px-3 py-1 rounded-full bg-secondary-100 max-w-fit text-nowrap'>
            <Text size='xs' classNames='text-dark'>
              {trail}
            </Text>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='mb-4'>
          <Text tagName='p' size='3xl' weight='bold' classNames='text-dark'>
            ${price}
            <span className='text-base font-normal text-gray-500 ml-1'>
              / month
            </span>
          </Text>
        </div>

        <div className='mb-6'>
          <Text tagName='p' size='base' classNames='text-gray-600'>
            {description}
          </Text>
        </div>

        <ul className='space-y-4 mb-8'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center gap-3'>
              <CheckIcon className='w-5 h-5 text-main-brown flex-shrink-0' />
              <Text tagName='span' size='base' classNames='text-dark'>
                {feature?.text}
              </Text>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-4'>
          <button
            onClick={onEdit}
            className='inline-flex items-center gap-2 text-dark hover:text-main-brown transition-colors'>
            <PencilIcon className='w-5 h-5' />
            <span>Edit</span>
          </button>
          <button
            onClick={onDelete}
            className='inline-flex items-center gap-2 text-dark hover:text-red-500 transition-colors'>
            <TrashIcon className='w-5 h-5' />
            <span>Delete</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

PlanCard.displayName = "PlanCard";

export default PlanCard;
