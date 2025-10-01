import React from 'react';
import { CheckCircle, Circle, Type, CreditCard as Edit3, Link, FileText, Code, Image } from 'lucide-react';

interface QuestionTypeSelectorProps {
  onSelect: (type: string) => void;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ onSelect }) => {
  const questionTypes = [
    // Basic Types
    {
      type: 'mcq',
      title: 'Multiple Choice',
      description: 'Single or multiple correct answers',
      icon: CheckCircle,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      type: 'tf',
      title: 'True/False',
      description: 'Simple true or false question',
      icon: Circle,
      color: 'bg-green-50 text-green-600'
    },
    {
      type: 'short',
      title: 'Short Answer',
      description: 'Brief text response',
      icon: Type,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      type: 'fill',
      title: 'Fill in the Blanks',
      description: 'Complete missing parts',
      icon: Edit3,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      type: 'matching',
      title: 'Matching',
      description: 'Match pairs of items',
      icon: Link,
      color: 'bg-pink-50 text-pink-600'
    },
    {
      type: 'essay',
      title: 'Essay',
      description: 'Long form written response',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      type: 'code',
      title: 'Coding',
      description: 'Programming question',
      icon: Code,
      color: 'bg-gray-50 text-gray-600'
    },
    {
      type: 'diagram',
      title: 'Diagram',
      description: 'Image-based question',
      icon: Image,
      color: 'bg-teal-50 text-teal-600'
    },
    
    // Combined Types - Diagram Based
    {
      type: 'diagram-mcq',
      title: 'Diagram + Multiple Choice',
      description: 'Image with multiple choice options',
      icon: Image,
      color: 'bg-cyan-50 text-cyan-600'
    },
    {
      type: 'diagram-tf',
      title: 'Diagram + True/False',
      description: 'Image with true/false question',
      icon: Image,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      type: 'diagram-matching',
      title: 'Diagram + Matching',
      description: 'Image with matching pairs',
      icon: Image,
      color: 'bg-rose-50 text-rose-600'
    },
    
    // Combined Types - Paragraph Based
    {
      type: 'paragraph-mcq',
      title: 'Paragraph + Multiple Choice',
      description: 'Text passage with multiple choice',
      icon: FileText,
      color: 'bg-violet-50 text-violet-600'
    },
    {
      type: 'paragraph-tf',
      title: 'Paragraph + True/False',
      description: 'Text passage with true/false',
      icon: FileText,
      color: 'bg-lime-50 text-lime-600'
    },
    {
      type: 'paragraph-matching',
      title: 'Paragraph + Matching',
      description: 'Text passage with matching pairs',
      icon: FileText,
      color: 'bg-amber-50 text-amber-600'
    }
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Question Type</h3>
      
      {/* Basic Types */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Question Types</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {questionTypes.slice(0, 8).map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.type}
                onClick={() => onSelect(type.type)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 text-left group"
              >
                <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{type.title}</h3>
                <p className="text-xs text-gray-500">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Diagram-Based Combined Types */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Diagram-Based Questions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionTypes.slice(8, 11).map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.type}
                onClick={() => onSelect(type.type)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 text-left group"
              >
                <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{type.title}</h3>
                <p className="text-xs text-gray-500">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Paragraph-Based Combined Types */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Paragraph-Based Questions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {questionTypes.slice(11).map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.type}
                onClick={() => onSelect(type.type)}
                className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:border-blue-300 text-left group"
              >
                <div className={`w-12 h-12 ${type.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{type.title}</h3>
                <p className="text-xs text-gray-500">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
