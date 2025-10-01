import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Question, BlankAnswer } from '../../types';

interface FillBlankEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const FillBlankEditor: React.FC<FillBlankEditorProps> = ({ question, onChange }) => {
  const [questionText, setQuestionText] = useState(question.text || '');
  const [blanks, setBlanks] = useState<BlankAnswer[]>(question.metadata?.blanks || []);

  useEffect(() => {
    // Find all blanks in the question text
    const blankMatches = questionText.match(/\[\[blank\d+\]\]/g) || [];
    const blankNumbers = blankMatches.map(match => parseInt(match.match(/\d+/)?.[0] || '0'));
    
    // Create blank answers for each found blank
    const newBlanks: BlankAnswer[] = blankNumbers.map(num => {
      const existing = blanks.find(b => b.position === num);
      return existing || {
        id: `blank-${num}`,
        position: num,
        acceptedAnswers: [''],
        marks: 1
      };
    });

    setBlanks(newBlanks);
    onChange({
      ...question,
      text: questionText,
      metadata: {
        ...question.metadata,
        blanks: newBlanks
      }
    });
  }, [questionText]);

  const handleQuestionChange = (text: string) => {
    setQuestionText(text);
  };

  const insertBlank = () => {
    const nextBlankNumber = Math.max(0, ...blanks.map(b => b.position)) + 1;
    const newText = questionText + ` [[blank${nextBlankNumber}]] `;
    setQuestionText(newText);
  };

  const handleBlankAnswerChange = (blankId: string, answerIndex: number, value: string) => {
    const newBlanks = blanks.map(blank => {
      if (blank.id === blankId) {
        const newAnswers = [...blank.acceptedAnswers];
        newAnswers[answerIndex] = value;
        return { ...blank, acceptedAnswers: newAnswers };
      }
      return blank;
    });
    setBlanks(newBlanks);
  };

  const addAnswerToBlank = (blankId: string) => {
    const newBlanks = blanks.map(blank => {
      if (blank.id === blankId) {
        return { ...blank, acceptedAnswers: [...blank.acceptedAnswers, ''] };
      }
      return blank;
    });
    setBlanks(newBlanks);
  };

  const removeAnswerFromBlank = (blankId: string, answerIndex: number) => {
    const newBlanks = blanks.map(blank => {
      if (blank.id === blankId && blank.acceptedAnswers.length > 1) {
        const newAnswers = blank.acceptedAnswers.filter((_, i) => i !== answerIndex);
        return { ...blank, acceptedAnswers: newAnswers };
      }
      return blank;
    });
    setBlanks(newBlanks);
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  const handleBlankMarksChange = (blankId: string, marks: number) => {
    const newBlanks = blanks.map(blank => {
      if (blank.id === blankId) {
        return { ...blank, marks };
      }
      return blank;
    });
    setBlanks(newBlanks);
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Question Text with Blanks *
          </label>
          <button
            onClick={insertBlank}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Insert Blank</span>
          </button>
        </div>
        <textarea
          value={questionText}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
          placeholder="Type your question and use [[blank1]], [[blank2]], etc. to insert blanks..."
        />
        <p className="text-xs text-gray-500 mt-1">
          Use [[blank1]], [[blank2]], etc. to mark where students should fill in answers
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Marks *
        </label>
        <input
          type="number"
          min="1"
          value={question.marks || blanks.reduce((sum, blank) => sum + blank.marks, 0)}
          onChange={(e) => handleMarksChange(parseInt(e.target.value))}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {blanks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Configure Blank Answers
          </label>
          
          <div className="space-y-4">
            {blanks.map((blank) => (
              <div key={blank.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Blank {blank.position}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Marks:</span>
                    <input
                      type="number"
                      min="1"
                      value={blank.marks}
                      onChange={(e) => handleBlankMarksChange(blank.id, parseInt(e.target.value))}
                      className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  {blank.acceptedAnswers.map((answer, answerIndex) => (
                    <div key={answerIndex} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={answer}
                        onChange={(e) => handleBlankAnswerChange(blank.id, answerIndex, e.target.value)}
                        placeholder={`Acceptable answer ${answerIndex + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      
                      {blank.acceptedAnswers.length > 1 && (
                        <button
                          onClick={() => removeAnswerFromBlank(blank.id, answerIndex)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={() => addAnswerToBlank(blank.id)}
                    className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    + Add alternative answer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-orange-50 p-4 rounded-lg">
        <p className="text-sm text-orange-800">
          <strong>Instructions:</strong> Use the "Insert Blank" button or manually type [[blank1]], [[blank2]], etc. 
          in your question text. Each blank will be automatically detected and you can configure acceptable answers below.
        </p>
      </div>
    </div>
  );
};
