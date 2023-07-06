'use client';

import { useBoardStore } from '@/store/boardStore';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// --------------------------------------------

interface RadioProps {
  id: string;
  name: string;
  description: string;
  color: string;
}

// --------------------------------------------

const types: RadioProps[] = [
  {
    id: 'todo',
    name: 'Todo',
    description: 'A new task to be completed',
    color: 'bg-red-500',
  },
  {
    id: 'inprogress',
    name: 'In Progress',
    description: 'A task that is currently being working on',
    color: 'bg-yellow-500',
  },
  {
    id: 'done',
    name: 'Done',
    description: 'A task that has been completed',
    color: 'bg-green-500',
  },
];

// --------------------------------------------

export default function TaskTypeRadioGroup() {
  const { newTaskType, setNewTaskType } = useBoardStore((state) => state);

  return (
    <div className='w-full py-5'>
      <div className='mx-auto w-full max-w-md'>
        <RadioGroup value={newTaskType} onChange={(e) => setNewTaskType(e)}>
          <div className='space-y-2'>
            {types.map(({ id, color, name, description }) => (
              <RadioGroup.Option
                value={id}
                key={id}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-10 ring-white ring-opacity-60 ring-offset-sky-300'
                      : ''
                  } 
                  
                  ${checked ? `${color} bg-opacity-75 text-white` : 'bg-white'}
                  relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ checked }) => (
                  <div className='flex w-full items-center justify-between'>
                    <div className='flex items-center'>
                      <div className='text-sm'>
                        <RadioGroup.Label
                          className={`font-medium ${
                            checked ? 'text-white' : 'text-gray-900'
                          }`}
                          as='p'
                        >
                          {name}
                        </RadioGroup.Label>
                        <RadioGroup.Description
                          as='span'
                          className={`inline ${
                            checked ? 'text-white' : 'text-gray-500'
                          }`}
                        >
                          {description}
                        </RadioGroup.Description>
                      </div>
                    </div>
                    {checked && (
                      <div className='shrink-0 text-white'>
                        <CheckCircleIcon className='h-6 w-6' />
                      </div>
                    )}
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
