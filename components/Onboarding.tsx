
import React, { useState } from 'react';

interface Step {
  title: string;
  description: string;
  icon: string;
}

const steps: Step[] = [
  {
    title: "Welcome to AI Utility Hub",
    description: "The all-in-one workspace for modern creators. We've gathered the world's most powerful AI tools in one dashboard.",
    icon: "🚀"
  },
  {
    title: "Credits Power Your Hub",
    description: "Every action uses 'Credits'. You start with 10 free credits. Pro tools like Logo Animation cost more, while simple ones like Comments cost less.",
    icon: "⚡"
  },
  {
    title: "Endless Possibilities",
    description: "From SEO audits to Hindi tutoring and background removal—everything you need to scale your business is right here.",
    icon: "🛠️"
  }
];

const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-10 text-center space-y-6">
          <div className="text-6xl animate-bounce">{steps[currentStep].icon}</div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black">{steps[currentStep].title}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
              {steps[currentStep].description}
            </p>
          </div>
          
          <div className="flex items-center justify-center space-x-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep ? 'w-8 bg-indigo-600' : 'w-2 bg-gray-200 dark:bg-gray-700'}`}></div>
            ))}
          </div>

          <button 
            onClick={next}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-500/30 transition-all"
          >
            {currentStep === steps.length - 1 ? "Let's Get Started!" : "Next Step"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
