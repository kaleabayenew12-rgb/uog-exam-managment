import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText,
  TrendingUp,
  Plus,
  Users,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Exam } from '../types';
import { StatusModal } from '../components/Dashboard/StatusModal';

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<'draft' | 'published' | 'sent' | null>(null);

  // Mock exam data for dashboard
  const mockExams: Exam[] = [
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
        { id: 'q1', type: 'mcq', text: 'What is the time complexity of binary search?', marks: 5, options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'], correct: [1] }
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
      title: 'Database Systems Quiz',
      subject: 'Computer Science',
      description: 'Quick quiz on normalization',
      duration: 45,
      totalMarks: 30,
      passMark: 18,
      status: 'draft',
      departmentIds: ['cs-dept'],
      questions: [
        { id: 'q2', type: 'short', text: 'Explain database normalization', marks: 10 }
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
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const handleStatusClick = (status: 'draft' | 'sent' | 'published') => {
    setSelectedStatus(status as 'draft' | 'published' | 'sent');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'create':
        onNavigate('exams/new');
        break;
      case 'exams':
        onNavigate('exams');
        break;
      case 'reports':
        onNavigate('reports');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleNavigateToExam = (examId: string) => {
    onNavigate(`exams/${examId}/edit`);
  };

  const getExamCounts = () => {
    const draft = mockExams.filter(exam => exam.status === 'draft').length;
    const published = mockExams.filter(exam => exam.status === 'published').length;
    
    return { draft, published };
  };

  const examCounts = getExamCounts();

  return (
    <>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {getGreeting()}, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome to your exam builder dashboard. Create and manage your exams here.
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              onClick={() => handleStatusClick('draft')}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FileText className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Draft Exams</p>
                  <p className="text-2xl font-bold text-gray-900">{examCounts.draft}</p>
                </div>
              </div>
            </div>

            <div 
              onClick={() => handleStatusClick('published')}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Published Exams</p>
                  <p className="text-2xl font-bold text-gray-900">{examCounts.published}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Questions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockExams.reduce((sum, exam) => sum + exam.questions.length, 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockExams.filter(exam => 
                      new Date(exam.createdAt).getMonth() === new Date().getMonth()
                    ).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { title: 'Advanced Data Structures Midterm', status: 'published', time: '2 hours ago' },
                  { title: 'Database Systems Quiz', status: 'draft', time: '1 day ago' },
                  { title: 'Algorithm Analysis Test', status: 'published', time: '2 days ago' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'published' ? 'bg-blue-500' : 'bg-gray-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{item.status} • {item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => handleQuickAction('create')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Create New Exam</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('exams')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-900">Manage Exams</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('reports')}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-900">View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <StatusModal
        isOpen={!!selectedStatus}
        onClose={() => setSelectedStatus(null)}
        status={selectedStatus!}
        exams={mockExams}
        onNavigateToExam={handleNavigateToExam}
      />
    </>
  );
};
