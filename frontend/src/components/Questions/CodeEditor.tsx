import React, { useState } from 'react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { Question, TestCase } from '../../types';

interface CodeEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ question, onChange }) => {
  const [language, setLanguage] = useState(question.metadata?.language || 'javascript');
  const [testCases, setTestCases] = useState<TestCase[]>(
    question.metadata?.testCases || [
      { input: '', expectedOutput: '', isHidden: false }
    ]
  );
  const [codeTemplate, setCodeTemplate] = useState('');

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'c', label: 'C' }
  ];

  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        language: lang
      }
    });
  };

  const handleTestCaseChange = (index: number, field: keyof TestCase, value: string | boolean) => {
    const newTestCases = testCases.map((testCase, i) => 
      i === index ? { ...testCase, [field]: value } : testCase
    );
    setTestCases(newTestCases);
    
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        testCases: newTestCases
      }
    });
  };

  const addTestCase = () => {
    const newTestCase: TestCase = {
      input: '',
      expectedOutput: '',
      isHidden: false
    };
    setTestCases([...testCases, newTestCase]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length <= 1) return;
    
    const newTestCases = testCases.filter((_, i) => i !== index);
    setTestCases(newTestCases);
    
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        testCases: newTestCases
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
          Problem Description *
        </label>
        <textarea
          value={question.text || ''}
          onChange={(e) => handleQuestionChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          rows={4}
          placeholder="Describe the coding problem, including input/output format and constraints..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Programming Language *
          </label>
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {languages.map(lang => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marks *
          </label>
          <input
            type="number"
            min="1"
            value={question.marks || 10}
            onChange={(e) => handleMarksChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Code Template (Optional)
        </label>
        <div className="relative">
          <textarea
            value={codeTemplate}
            onChange={(e) => setCodeTemplate(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
            rows={8}
            placeholder={`// Starter code for students\nfunction solution() {\n    // Your code here\n}`}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Test Cases *
          </label>
          <button
            onClick={addTestCase}
            className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Test Case</span>
          </button>
        </div>

        <div className="space-y-4">
          {testCases.map((testCase, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Test Case {index + 1}</h4>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={testCase.isHidden}
                      onChange={(e) => handleTestCaseChange(index, 'isHidden', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Hidden from students</span>
                  </label>
                  
                  {testCases.length > 1 && (
                    <button
                      onClick={() => removeTestCase(index)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Input
                  </label>
                  <textarea
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                    rows={3}
                    placeholder="Input for this test case..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Output
                  </label>
                  <textarea
                    value={testCase.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm"
                    rows={3}
                    placeholder="Expected output for this test case..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center">
          <Play className="h-4 w-4 mr-2" />
          Auto-grading System
        </h4>
        <p className="text-sm text-gray-700">
          Student submissions will be automatically tested against your test cases. 
          Hidden test cases are used for final grading while visible ones help students debug their code.
        </p>
      </div>
    </div>
  );
};
