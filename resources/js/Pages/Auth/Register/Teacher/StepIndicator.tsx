import { Check, Footprints } from 'lucide-react'

export function ProgressSteps({ currentStep }: { currentStep: number }) {
  // Define steps configuration
  const steps = [
    {
      label: "Step 1",
      description: "Personal Details"
    },
    {
      label: "Step 2",
      description: "School Details"
    },
  ]

  // Calculate progress percentage
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="w-full max-w-3xl mx-auto pb-8">
      <div className="relative flex justify-between">
        {/* Progress Line */}
        <div className="absolute top-5 left-[2.5rem] right-[2rem] h-1 bg-gray-200 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          let status: 'finished' | 'in-progress' | 'waiting'
          const stepNumber = index + 1

          if (stepNumber < currentStep) status = 'finished'
          else if (stepNumber === currentStep) status = 'in-progress'
          else status = 'waiting'

          return (
            <Step
              key={stepNumber}
              status={status}
              icon={
                status === 'finished' ? <Check className="w-5 h-5" /> : status === 'in-progress' ? <Footprints className="w-5 h-5" /> : <span className="font-medium">{stepNumber}</span>
              }
              description={step.description}
              label={step.label}
            />
          )
        })}
      </div>
    </div>
  )
}

interface StepProps {
  status: 'finished' | 'in-progress' | 'waiting'
  icon: React.ReactNode
  description: string
  label: string
}

function Step({ status, icon, description, label }: StepProps) {
  const bgColor = status === 'finished' ? 'bg-green-500'
                : status === 'in-progress' ? 'bg-blue-500'
                : 'bg-gray-200'

  const textColor = status === 'waiting' ? 'text-gray-500' : 'text-white'

  return (
    <div className="relative flex flex-col items-center z-10">
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${bgColor} ${textColor} shadow-md transition-all duration-300 ease-in-out`}>
        {icon}
      </div>
      <span className="font-medium text-gray-800 pt-2">{description}</span>
    </div>
  )
}

// Add default export with the same name
export default ProgressSteps
