import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { Question, MatchingPair } from '../../types';

interface MatchingEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const MatchingEditor: React.FC<MatchingEditorProps> = ({ question, onChange }) => {
  const [pairs, setPairs] = useState<MatchingPair[]>(
    question.metadata?.pairs || [
      { id: '1', prompt: '', response: '' },
      { id: '2', prompt: '', response: '' }
    ]
  );

  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handlePairChange = (id: string, field: 'prompt' | 'response', value: string) => {
    const newPairs = pairs.map(pair => 
      pair.id === id ? { ...pair, [field]: value } : pair
    );
    setPairs(newPairs);
    
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        pairs: newPairs
      }
    });
  };

  const addPair = () => {
    const newPair: MatchingPair = {
      id: Date.now().toString(),
      prompt: '',
      response: ''
    };
    const newPairs = [...pairs, newPair];
    setPairs(newPairs);
    
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        pairs: newPairs
      }
    });
  };

  const removePair = (id: string) => {
    if (pairs.length <= 2) return;
    
    const newPairs = pairs.filter(pair => pair.id !== id);
    setPairs(newPairs);
    
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        pairs: newPairs
      }
    });
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Instructions *
        </label>
        <textarea
          value={question.text || ''}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={2}
          placeholder="e.g., Match each term with its definition..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marks *
        </label>
        <input
          type="number"
          min="1"
          value={question.marks || pairs.length}
          onChange={(e) => handleMarksChange(parseInt(e.target.value))}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Matching Pairs *
          </label>
          <button
            onClick={addPair}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Pair</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="text-sm font-medium text-gray-600">Prompts (Left Side)</div>
            <div className="text-sm font-medium text-gray-600">Responses (Right Side)</div>
          </div>

          {pairs.map((pair, index) => (
            <div key={pair.id} className="grid grid-cols-2 gap-4 items-start">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <input
                    type="text"
                    value={pair.prompt}
                    onChange={(e) => handlePairChange(pair.id, 'prompt', e.target.value)}
                    placeholder={`Prompt ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={pair.response}
                    onChange={(e) => handlePairChange(pair.id, 'response', e.target.value)}
                    placeholder={`Response ${index + 1}`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {pairs.length > 2 && (
                  <button
                    onClick={() => removePair(pair.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-pink-50 p-4 rounded-lg">
        <p className="text-sm text-pink-800">
          <strong>Student View:</strong> Students will see the prompts on the left and responses on the right. 
          The responses will be shuffled randomly for each student to prevent copying.
        </p>
      </div>
    </div>
  );
};
