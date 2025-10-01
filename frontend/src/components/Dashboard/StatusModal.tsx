import React from 'react';
import { X, FileText, Clock, Users } from 'lucide-react';
import { Exam } from '../../types';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'draft' | 'sent' | 'published';
  exams: Exam[];
  onNavigateToExam: (examId: string) => void;
}

export const StatusModal: React.FC<StatusModalProps> = ({ 
  isOpen, 
  onClose, 
  status, 
  exams, 
  onNavigateToExam 
}) => {
  if (!isOpen) return null;

  const getStatusInfo = () => {
    switch (status) {
      case 'draft':
        return {
          title: 'Draft Exams',
          icon: <FileText className="h-6 w-6 text-gray-600" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
      case 'sent':
        return {
          title: 'Sent to Department',
          icon: <Clock className="h-6 w-6 text-yellow-600" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        };
      case 'published':
        return {
          title: 'Published Exams',
          icon: <Users className="h-6 w-6 text-blue-600" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const filteredExams = exams.filter(exam => 
    exam.status === status
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${statusInfo.bgColor}`}>
              {statusInfo.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{statusInfo.title}</h3>
              <p className="text-sm text-gray-500">{filteredExams.length} exam(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredExams.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredExams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    onNavigateToExam(exam.id);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{exam.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{exam.subject}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                        <span>{exam.questions.length} questions</span>
                        <span>{exam.totalMarks} marks</span>
                        <span>Updated {formatDate(exam.updatedAt)}</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                        {status === 'sent' ? 'Sent to Department' : status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className={`p-3 rounded-lg ${statusInfo.bgColor} inline-flex mb-4`}>
                {statusInfo.icon}
              </div>
              <p className="text-gray-500">No {status === 'sent' ? 'sent' : status} exams found</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
