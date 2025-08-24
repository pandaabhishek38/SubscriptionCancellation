export default function ProgressBar({
  currentStep,
  totalSteps,
  complete = false,
}: {
  currentStep: number;
  totalSteps: number;
  complete?: boolean;
}) {
  return (
    <div className="flex items-center space-x-2">
      {/* Bars */}
      <div className="flex space-x-1">
        {Array.from({ length: totalSteps }).map((_, i) => {
          let color = "bg-gray-300"; // default = empty

          if (complete) {
            color = "bg-green-600"; // all green
          } else if (i < currentStep - 1) {
            color = "bg-green-600"; // completed steps
          } else if (i === currentStep - 1) {
            color = "bg-gray-500"; // current step (darker gray)
          }

          return <div key={i} className={`h-1.5 w-6 rounded-full ${color}`} />;
        })}
      </div>

      {/* Text */}
      <span className="text-sm text-gray-600 ml-2">
        {complete ? "Complete" : `Step ${currentStep} of ${totalSteps}`}
      </span>
    </div>
  );
}
