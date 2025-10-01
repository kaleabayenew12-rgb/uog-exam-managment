import React from 'react';
import { Clock, Users, FileText, CheckCircle, XCircle, AlertCircle, CreditCard as Edit, Eye, Trash2, Send } from 'lucide-react';
import { Exam } from '../../types';

interface ExamListProps {
  exams: Exam[];
  onEdit: (exam: Exam) => void;
  onView: (exam: Exam) => void;
  onDelete?: (examId: string) => void;
  onSendToDepartment?: (examId: string) => void;
}

export const ExamList: React.FC<ExamListProps> = ({ exams, onEdit, onView, onDelete, onSendToDepartment }) => {
  const getStatusIcon = (status: Exam['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="h-4 w-4" />;
      case 'sent':
        return <AlertCircle className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'published':
        return <Users className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Exam['status']) => {
    switch (status) {
      case 'draft':
        return 'text-gray-600 bg-gray-100';
      case 'sent':
        return 'text-yellow-700 bg-yellow-100';
      case 'approved':
        return 'text-green-700 bg-green-100';
      case 'rejected':
        return 'text-red-700 bg-red-100';
      case 'published':
        return 'text-blue-700 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const canDelete = (status: Exam['status']) => {
    return status === 'draft' || status === 'rejected';
  };

  const handleDelete = (exam: Exam) => {
    if (!canDelete(exam.status)) {
      alert('You can only delete draft or rejected exams.');
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${exam.title}"? This action cannot be undone.`);
    if (confirmDelete && onDelete) {
      onDelete(exam.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Exams</h2>
      </div>

      <div className="divide-y divide-gray-200">
        {exams.map((exam) => (
          <div key={exam.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {exam.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{exam.subject}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{exam.duration} mins</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{exam.questions.length} questions</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{exam.totalMarks} marks</span>
                      </div>
                      <div>
                        <span>Updated {formatDate(exam.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(exam.status)}`}>
                      {getStatusIcon(exam.status)}
                      <span className="ml-2 capitalize">{exam.status === 'sent' ? 'Sent for Approval' : exam.status}</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onView(exam)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="View Exam"
                >
                  <Eye className="h-4 w-4" />
                  <span>View</span>
                </button>
                
                <button
                  onClick={() => onEdit(exam)}
                  className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Edit Exam"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>

                {exam.status === 'draft' && onSendToDepartment && (
                  <button
                    onClick={() => onSendToDepartment(exam.id)}
                    className="flex items-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Send to Department"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => handleDelete(exam)}
                    disabled={!canDelete(exam.status)}
                    className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                      canDelete(exam.status)
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    title={canDelete(exam.status) ? 'Delete Exam' : 'Cannot delete approved/published exams'}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>

            {exam.description && (
              <p className="mt-3 text-gray-600 line-clamp-2">
                {exam.description}
              </p>
            )}
          </div>
        ))}

        {exams.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No exams found</h3>
            <p className="mt-2 text-gray-500">Get started by creating your first exam.</p>
          </div>
        )}
      </div>
    </div>
  );
};
