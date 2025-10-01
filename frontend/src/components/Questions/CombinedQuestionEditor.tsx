import React, { useState } from 'react';
import { Upload, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { Question, MatchingPair } from '../../types';

interface CombinedQuestionEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const CombinedQuestionEditor: React.FC<CombinedQuestionEditorProps> = ({ question, onChange }) => {
  const [baseContent, setBaseContent] = useState(question.metadata?.baseText || question.metadata?.imageUrl || '');
  const [options, setOptions] = useState<string[]>(question.options || ['', '']);
  const [correctAnswers, setCorrectAnswers] = useState<number[]>(question.correct as number[] || []);
  const [pairs, setPairs] = useState<MatchingPair[]>(
    question.metadata?.pairs || [
      { id: '1', prompt: '', response: '' },
      { id: '2', prompt: '', response: '' }
    ]
  );

  const isDiagramBased = question.type?.startsWith('diagram-');
  const isMCQ = question.type?.endsWith('-mcq');
  const isTF = question.type?.endsWith('-tf');
  const isMatching = question.type?.endsWith('-matching');

  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleBaseContentChange = (content: string) => {
    setBaseContent(content);
    const metadata = isDiagramBased 
      ? { ...question.metadata, imageUrl: content }
      : { ...question.metadata, baseText: content };
    onChange({ ...question, metadata });
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    onChange({ ...question, options: newOptions });
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    let newCorrect: number[];
    
    if (isTF) {
      // For True/False, only one answer
      newCorrect = isCorrect ? [index] : [];
      onChange({ ...question, correct: index === 0 ? true : false });
      return;
    }
    
    if (isCorrect) {
      newCorrect = [...correctAnswers, index];
    } else {
      newCorrect = correctAnswers.filter(i => i !== index);
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

  const getQuestionTitle = () => {
    if (question.type === 'diagram-mcq') return 'Diagram + Multiple Choice Question';
    if (question.type === 'diagram-tf') return 'Diagram + True/False Question';
    if (question.type === 'diagram-matching') return 'Diagram + Matching Question';
    if (question.type === 'paragraph-mcq') return 'Paragraph + Multiple Choice Question';
    if (question.type === 'paragraph-tf') return 'Paragraph + True/False Question';
    if (question.type === 'paragraph-matching') return 'Paragraph + Matching Question';
    return 'Combined Question';
  };

  const sampleImages = [
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">{getQuestionTitle()}</h3>
        <p className="text-sm text-blue-800">
          This question type combines {isDiagramBased ? 'an image/diagram' : 'a text passage'} with {isMCQ ? 'multiple choice options' : isTF ? 'true/false answers' : 'matching pairs'}.
        </p>
      </div>

      {/* Base Content (Image or Paragraph) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {isDiagramBased ? 'Diagram/Image *' : 'Text Passage *'}
        </label>
        
        {isDiagramBased ? (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {baseContent ? (
              <div className="text-center">
                <img
                  src={baseContent}
                  alt="Question diagram"
                  className="max-w-full h-64 object-contain mx-auto mb-4 rounded-lg border"
                />
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setBaseContent('')}
                    className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Remove
                  </button>
                  <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Replace Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Image
                  </button>
                  <p className="mt-2 text-sm text-gray-500">
                    Or select from samples below
                  </p>
                </div>
              </div>
            )}
            
            {!baseContent && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Sample images:</p>
                <div className="flex space-x-2">
                  {sampleImages.map((url, index) => (
                    <button
                      key={index}
                      onClick={() => handleBaseContentChange(url)}
                      className="relative group"
                    >
                      <img
                        src={url}
                        alt={`Sample ${index + 1}`}
                        className="w-20 h-20 object-cover rounded border-2 border-transparent group-hover:border-blue-500 transition-all"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <textarea
            value={baseContent}
            onChange={(e) => handleBaseContentChange(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={6}
            placeholder="Enter the text passage that students will read before answering the question..."
          />
        )}
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Question Text *
        </label>
        <textarea
          value={question.text || ''}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={3}
          placeholder={`Enter your question based on the ${isDiagramBased ? 'diagram' : 'passage'} above...`}
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

      {/* Answer Options based on type */}
      {isMCQ && (
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
                  type="checkbox"
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
      )}

      {isTF && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Correct Answer *
          </label>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="answer"
                checked={question.correct === true}
                onChange={() => onChange({ ...question, correct: true })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <CheckCircle className="h-5 w-5 text-green-600 ml-3 mr-2" />
              <span className="text-sm font-medium text-gray-700">True</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="answer"
                checked={question.correct === false}
                onChange={() => onChange({ ...question, correct: false })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <Circle className="h-5 w-5 text-red-600 ml-3 mr-2" />
              <span className="text-sm font-medium text-gray-700">False</span>
            </label>
          </div>
        </div>
      )}

      {isMatching && (
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
              <div className="text-sm font-medium text-gray-600">Items to Match</div>
              <div className="text-sm font-medium text-gray-600">Correct Matches</div>
            </div>

            {pairs.map((pair, index) => (
              <div key={pair.id} className="grid grid-cols-2 gap-4 items-start">
                <input
                  type="text"
                  value={pair.prompt}
                  onChange={(e) => handlePairChange(pair.id, 'prompt', e.target.value)}
                  placeholder={`Item ${index + 1}`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pair.response}
                    onChange={(e) => handlePairChange(pair.id, 'response', e.target.value)}
                    placeholder={`Match ${index + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  
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
      )}
    </div>
  );
};
