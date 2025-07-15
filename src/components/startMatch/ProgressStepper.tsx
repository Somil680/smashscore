import React from 'react'

interface ProgressStepperProps {
  step: number
  total: number
  labels: string[]
}

export default function ProgressStepper({
  step,
  total,
  labels,
}: ProgressStepperProps) {
    return (
      <div className="w-full flex items-center justify-between gap-0 mb-6 border-b border-gray-800 bg-transparent">
        {labels.map((label, idx) => (
          <div key={label} className="flex-1 flex flex-col items-center">
            <span
              className={`text-sm font-medium pb-2 transition-colors duration-300 ${
                idx === step ? 'text-lime-400' : 'text-gray-500'
              }`}
            >
              {label}
            </span>
            <div
              className={`h-1 w-2/3 rounded-full transition-all duration-300 ${
                idx === step
                  ? 'bg-gradient-to-r from-lime-400 via-blue-500 to-purple-500'
                  : 'bg-transparent'
              }`}
            ></div>
          </div>
        ))}
      </div>
    )
}
