import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import * as React from "react";

import { cn } from "@/lib/utils";

import Button from "@/components/buttons/Button";
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
        "w-full max-w-sm mx-auto bg-white rounded-2xl shadow-sm p-6",
        className
      )}
      {...rest}>
      <CardHeader className='p-0 mb-0 space-y-0 border-none'>
        <div className='flex justify-between items-start'>
          <CardTitle>
            <Text tagName='span' variant='main' size='xs' weight='bold'>
              {title}
            </Text>
          </CardTitle>
          <div className='inline-flex items-center px-3 py-1 rounded-full bg-secondary-100 max-w-fit text-nowrap'>
            <Text size='xs' classNames='text-dark'>
              {trail}
            </Text>
          </div>
        </div>
      </CardHeader>

      <CardContent className='p-0'>
        <div className='mb-2'>
          <Text tagName='h4' size='2xl' weight='normal' variant='main'>
            ${price}
            <Text tagName='span' size='xs' weight='normal' variant='thirtery'>
              / month
            </Text>
          </Text>
        </div>

        <div className='mb-3'>
          <Text tagName='p' size='xs' weight='normal' variant='secondary'>
            {description}
          </Text>
        </div>

        <ul className='space-y-2 mb-8'>
          {features.map((feature, index) => (
            <li key={index} className='flex items-center gap-2'>
              <CheckIcon className='w-5 h-5 text-main-brown flex-shrink-0' />
              <Text tagName='span' size='xs' weight='normal' variant='main'>
                {feature?.text}
              </Text>
            </li>
          ))}
        </ul>

        <div className='flex items-center gap-4'>
          <Button variant='light' className='border-none' onClick={onEdit}>
            <PencilIcon className='w-5 h-5' />
            <span>Edit</span>
          </Button>
          <Button variant='light' className='border-none' onClick={onDelete}>
            <TrashIcon className='w-5 h-5' />
            <span>Delete</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

PlanCard.displayName = "PlanCard";

export default PlanCard;
