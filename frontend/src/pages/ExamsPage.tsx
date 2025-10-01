import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { Exam } from '../types';
import { ExamList } from '../components/Exams/ExamList';

interface ExamsPageProps {
  onNavigate: (route: string) => void;
}

export const ExamsPage: React.FC<ExamsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock data - in a real app, this would come from an API
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      title: 'Advanced Data Structures Midterm',
      subject: 'Computer Science',
      description: 'Comprehensive midterm covering trees, graphs, and advanced algorithms',
      duration: 120,
      totalMarks: 100,
      passMark: 60,
      status: 'published',
      departmentIds: ['cs-dept'],
      questions: [
        {
          id: 'q1',
          type: 'mcq',
          text: 'What is the time complexity of binary search?',
          marks: 5,
          options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
          correct: [1]
        },
        {
          id: 'q2',
          type: 'code',
          text: 'Implement a binary search tree insertion function',
          marks: 15,
          metadata: {
            language: 'javascript'
          }
        }
      ],
      createdBy: 'user1',
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-01-20T10:30:00Z',
      version: 2,
      settings: {
        randomizeQuestions: true,
        allowMultipleAttempts: false,
        shuffleOptions: true,
        negativeMark: false
      }
    },
    {
      id: '2',
      title: 'Database Systems Quiz 3',
      subject: 'Computer Science',
      description: 'Quick quiz on normalization and SQL optimization',
      duration: 45,
      totalMarks: 30,
      passMark: 18,
      status: 'approved',
      departmentIds: ['cs-dept'],
      questions: [
        {
          id: 'q3',
          type: 'short',
          text: 'Explain the concept of database normalization',
          marks: 10,
          metadata: {
            keywords: ['normalization', 'normal forms', 'redundancy']
          }
        }
      ],
      createdBy: 'user1',
      createdAt: '2024-01-18T14:00:00Z',
      updatedAt: '2024-01-18T16:45:00Z',
      version: 1,
      settings: {
        randomizeQuestions: false,
        allowMultipleAttempts: true,
        shuffleOptions: true,
        negativeMark: false
      }
    },
    {
      id: '3',
      title: 'Machine Learning Final',
      subject: 'Computer Science',
      description: 'Comprehensive final exam covering all ML concepts',
      duration: 180,
      totalMarks: 150,
      passMark: 90,
      status: 'sent',
      departmentIds: ['cs-dept'],
      questions: [
        {
          id: 'q4',
          type: 'essay',
          text: 'Compare and contrast supervised and unsupervised learning',
          marks: 25
        }
      ],
      createdBy: 'user1',
      createdAt: '2024-01-20T09:00:00Z',
      updatedAt: '2024-01-22T11:00:00Z',
      version: 3,
      settings: {
        randomizeQuestions: true,
        allowMultipleAttempts: false,
        shuffleOptions: true,
        negativeMark: true
      }
    },
    {
      id: '4',
      title: 'Programming Fundamentals Test',
      subject: 'Computer Science',
      description: 'Basic programming concepts and syntax',
      duration: 90,
      totalMarks: 75,
      passMark: 45,
      status: 'draft',
      departmentIds: ['cs-dept'],
      questions: [
        {
          id: 'q5',
          type: 'tf',
          text: 'Python is a statically typed language',
          marks: 2,
          correct: false
        }
      ],
      createdBy: 'user1',
      createdAt: '2024-01-21T10:00:00Z',
      updatedAt: '2024-01-21T10:00:00Z',
      version: 1,
      settings: {
        randomizeQuestions: false,
        allowMultipleAttempts: true,
        shuffleOptions: false,
        negativeMark: false
      }
    }
  ]);

  const handleEdit = (exam: Exam) => {
    console.log('Edit exam:', exam.id);
    // Navigate to edit page
    onNavigate(`exams/${exam.id}/edit`);
  };

  const handleView = (exam: Exam) => {
    console.log('View exam:', exam.id);
    // Navigate to view page
    onNavigate(`exams/${exam.id}/preview`);
  };

  const handleDelete = (examId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this exam? This action cannot be undone.');
    if (confirmDelete) {
      setExams(prevExams => prevExams.filter(exam => exam.id !== examId));
      alert('Exam deleted successfully!');
    }
  };

  const handleSendToDepartment = (examId: string) => {
    const confirmSend = window.confirm('Are you sure you want to send this exam to the department for approval?');
    if (confirmSend) {
      setExams(prevExams => 
        prevExams.map(exam => 
          exam.id === examId 
            ? { ...exam, status: 'sent', updatedAt: new Date().toISOString() }
            : exam
        )
      );
      alert('Exam sent to department for approval!');
    }
  };

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Exams</h1>
          <p className="text-gray-600 mt-1">Manage and organize your examinations</p>
        </div>

        <button 
          onClick={() => onNavigate('exams/new')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="h-4 w-4" />
          <span>Create Exam</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent for Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Showing {filteredExams.length} of {exams.length} exams
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Draft</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Sent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-100 rounded-full"></div>
              <span className="text-sm text-gray-600">Published</span>
            </div>
          </div>
        </div>
      </div>

      {/* Exams List */}
      <ExamList 
        exams={filteredExams}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        onSendToDepartment={handleSendToDepartment}
      />
    </div>
  );
};
