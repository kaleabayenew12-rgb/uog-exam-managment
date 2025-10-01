import React, { useState } from 'react';
import { Upload, Image, Eye } from 'lucide-react';
import { Question } from '../../types';

interface DiagramEditorProps {
  question: Partial<Question>;
  onChange: (question: Partial<Question>) => void;
}

export const DiagramEditor: React.FC<DiagramEditorProps> = ({ question, onChange }) => {
  const [diagramUrl, setDiagramUrl] = useState(question.metadata?.imageUrl || '');
  const [responseType, setResponseType] = useState<'upload' | 'text' | 'annotation'>('text');

  const handleQuestionChange = (text: string) => {
    onChange({ ...question, text });
  };

  const handleDiagramUpload = (url: string) => {
    setDiagramUrl(url);
    onChange({
      ...question,
      metadata: {
        ...question.metadata,
        imageUrl: url
      }
    });
  };

  const handleMarksChange = (marks: number) => {
    onChange({ ...question, marks });
  };

  const sampleDiagrams = [
    'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/590016/pexels-photo-590016.jpg?auto=compress&cs=tinysrgb&w=400',
    'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400'
  ];

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
          rows={3}
          placeholder="Provide instructions for the diagram-based question (e.g., 'Label the parts of the diagram', 'Identify the process shown')..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Marks *
        </label>
        <input
          type="number"
          min="1"
          value={question.marks || 5}
          onChange={(e) => handleMarksChange(parseInt(e.target.value))}
          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Diagram/Image *
        </label>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          {diagramUrl ? (
            <div className="text-center">
              <img
                src={diagramUrl}
                alt="Diagram"
                className="max-w-full h-64 object-contain mx-auto mb-4 rounded-lg border"
              />
              <div className="flex justify-center space-x-2">
                <button
                  onClick={() => setDiagramUrl('')}
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
                  Upload Diagram
                </button>
                <p className="mt-2 text-sm text-gray-500">
                  Or drag and drop your image here
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Sample diagrams:</p>
          <div className="flex space-x-2">
            {sampleDiagrams.map((url, index) => (
              <button
                key={index}
                onClick={() => handleDiagramUpload(url)}
                className="relative group"
              >
                <img
                  src={url}
                  alt={`Sample ${index + 1}`}
                  className="w-20 h-20 object-cover rounded border-2 border-transparent group-hover:border-blue-500 transition-all"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded flex items-center justify-center transition-all">
                  <Eye className="h-4 w-4 text-white opacity-0 group-hover:opacity-100" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Expected Response Type
        </label>
        
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="responseType"
              value="text"
              checked={responseType === 'text'}
              onChange={(e) => setResponseType(e.target.value as any)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            />
            <span className="ml-3">
              <span className="font-medium text-gray-900">Text Response</span>
              <span className="block text-sm text-gray-500">Students type their answers</span>
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="responseType"
              value="upload"
              checked={responseType === 'upload'}
              onChange={(e) => setResponseType(e.target.value as any)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            />
            <span className="ml-3">
              <span className="font-medium text-gray-900">File Upload</span>
              <span className="block text-sm text-gray-500">Students upload their annotated diagram</span>
            </span>
          </label>

          <label className="flex items-center">
            <input
              type="radio"
              name="responseType"
              value="annotation"
              checked={responseType === 'annotation'}
              onChange={(e) => setResponseType(e.target.value as any)}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
            />
            <span className="ml-3">
              <span className="font-medium text-gray-900">Interactive Annotation</span>
              <span className="block text-sm text-gray-500">Students click/mark areas on the diagram</span>
            </span>
          </label>
        </div>
      </div>

      {responseType === 'text' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sample Answer (for grading reference)
          </label>
          <textarea
            placeholder="Provide the expected answer or key points students should identify..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            rows={4}
          />
        </div>
      )}

      <div className="bg-teal-50 p-4 rounded-lg">
        <h4 className="font-medium text-teal-900 mb-2 flex items-center">
          <Image className="h-4 w-4 mr-2" />
          Diagram Questions
        </h4>
        <p className="text-sm text-teal-800">
          These questions are ideal for subjects like biology, chemistry, physics, geography, and engineering. 
          Students can analyze visual information and provide responses based on the diagram.
        </p>
      </div>
    </div>
  );
};
