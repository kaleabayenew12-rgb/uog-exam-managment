import React from 'react';
import { Question } from '../../types';

interface EssayEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const EssayEditor: React.FC<EssayEditorProps> = ({ question, onChange }) => {
  const rubricCriteria = [
    'Content and Understanding',
    'Organization and Structure',
    'Grammar and Language Use'
  ];

  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  const handleWordLimitChange = (wordLimit: number) => {
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        wordLimit
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Essay Question/Prompt *
        </label>
        <textarea
          value={question.text || ''}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
          placeholder="Enter your essay question or writing prompt..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Marks *
          </label>
          <input
            type="number"
            min="1"
            value={question.marks || 10}
            onChange={(e) => handleMarksChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Word Limit (Optional)
          </label>
          <input
            type="number"
            min="50"
            step="50"
            value={question.metadata?.wordLimit || ''}
            onChange={(e) => handleWordLimitChange(parseInt(e.target.value))}
            placeholder="e.g., 500"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Grading Rubric (for manual grading)
        </label>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="space-y-3">
            {rubricCriteria.map((criterion, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700">{criterion}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Weight:</span>
                  <select className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-lg">
        <h4 className="font-medium text-indigo-900 mb-2">Manual Grading Required</h4>
        <p className="text-sm text-indigo-800">
          Essay questions require manual grading by instructors. The rubric above will help ensure consistent 
          and fair evaluation of student responses. Consider providing clear grading criteria to students.
        </p>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Additional Instructions (Optional)</h4>
        <textarea
          placeholder="Provide any additional instructions for students (e.g., citation requirements, specific topics to address, formatting guidelines)..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
        />
      </div>
    </div>
  );
};
