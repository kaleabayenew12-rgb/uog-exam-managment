import React, { useState } from 'react';
import { Plus, Trash2, Image } from 'lucide-react';
import { Question } from '../../types';

interface MCQEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const MCQEditor: React.FC<MCQEditorProps> = ({ question, onChange }) => {
  const [options, setOptions] = useState<string[]>(question.options || ['', '']);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(question.correct as number[] || []);
  const [isMultiple, setIsMultiple] = useState(correctAnswers.length > 1);

  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange({ ...question, options: newOptions });
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    let newCorrect: number[];
    
    if (isMultiple) {
      if (isCorrect) {
        newCorrect = [...correctAnswers, index];
      } else {
        newCorrect = correctAnswers.filter(i => i !== index);
      }
    } else {
      newCorrect = isCorrect ? [index] : [];
    }
    
    setCorrectAnswers(newCorrect);
    onChange({ ...question, correct: newCorrect });
  };

  const addOption = () => {
    const newOptions = [...options, ''];
    setOptions(newOptions);
    onChange({ ...question, options: newOptions });
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    
    const newOptions = options.filter((_, i) => i !== index);
    const newCorrect = correctAnswers.filter(i => i !== index).map(i => i > index ? i - 1 : i);
    
    setOptions(newOptions);
    setCorrectAnswers(newCorrect);
    onChange({ ...question, options: newOptions, correct: newCorrect });
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <textarea
          value={question.text || ''}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
          placeholder="Enter your multiple choice question..."
        />
      </div>

      <div className="flex items-center space-x-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marks *
          </label>
          <input
            type="number"
            min="1"
            value={question.marks || 1}
            onChange={(e) => handleMarksChange(parseInt(e.target.value))}
            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="multiple"
            checked={isMultiple}
            onChange={(e) => setIsMultiple(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="multiple" className="ml-2 text-sm text-gray-700">
            Allow multiple correct answers
          </label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Answer Options *
          </label>
          <button
            onClick={addOption}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Option</span>
          </button>
        </div>

        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name="correct"
                checked={correctAnswers.includes(index)}
                onChange={(e) => handleCorrectChange(index, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              
              <div className="flex-1 flex items-center space-x-2">
                <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  {String.fromCharCode(65 + index)}
                </span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                <Image className="h-4 w-4" />
              </button>

              {options.length > 2 && (
                <button
                  onClick={() => removeOption(index)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Mark the correct answer(s) by selecting the radio button or checkbox next to each option. 
          {isMultiple ? ' Multiple answers can be selected.' : ' Only one answer can be selected.'}
        </p>
      </div>
    </div>
  );
};
