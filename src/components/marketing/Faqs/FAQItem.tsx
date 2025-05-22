// src/components/marketing/FAQItem.tsx
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: React.ReactNode;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(open => !open)}
        className="flex justify-between items-center w-full text-left focus:outline-none hover:text-blue-500 transition-colors"
      >
        <span className="text-lg font-medium text-indigo-600">{question}</span>
        <span className="text-2xl">{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-700 prose max-w-none">
          {answer}
        </div>
      )}
    </div>
  );
};

export default FAQItem;
