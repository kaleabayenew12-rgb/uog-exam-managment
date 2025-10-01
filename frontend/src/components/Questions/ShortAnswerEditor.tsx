import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Question } from '../../types';

interface ShortAnswerEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const ShortAnswerEditor: React.FC<ShortAnswerEditorProps> = ({ question, onChange }) => {
  const [keywords, setKeywords] = useState<string[]>(question.metadata?.keywords || ['']);
  const [caseSensitive, setCaseSensitive] = useState(question.metadata?.caseSensitive || false);

  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
    
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        keywords: newKeywords
      }
    });
  };

  const addKeyword = () => {
    const newKeywords = [...keywords, ''];
    setKeywords(newKeywords);
  };

  const removeKeyword = (index: number) => {
    if (keywords.length <= 1) return;
    
    const newKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(newKeywords);
    
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        keywords: newKeywords
      }
    });
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  const handleCaseSensitiveChange = (caseSensitive: boolean) => {
    setCaseSensitive(caseSensitive);
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        caseSensitive
      }
    });
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
          placeholder="Enter your short answer question..."
        />
      </div>

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

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Acceptable Keywords/Answers *
          </label>
          <button
            onClick={addKeyword}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Keyword</span>
          </button>
        </div>

        <div className="space-y-3">
          {keywords.map((keyword, index) => (
            <div key={index} className="flex items-center space-x-3">
              <input
                type="text"
                value={keyword}
                onChange={(e) => handleKeywordChange(index, e.target.value)}
                placeholder={`Acceptable answer ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              
              {keywords.length > 1 && (
                <button
                  onClick={() => removeKeyword(index)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="caseSensitive"
          checked={caseSensitive}
          onChange={(e) => handleCaseSensitiveChange(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="caseSensitive" className="ml-2 text-sm text-gray-700">
          Case sensitive matching
        </label>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Auto-grading:</strong> This question will be automatically graded based on the keywords you provide. 
          Add multiple acceptable answers or variations to improve accuracy.
        </p>
      </div>
    </div>
  );
};
