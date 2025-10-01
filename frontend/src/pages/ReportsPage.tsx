import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  FileText,
  TrendingUp,
  Filter,
  Eye,
  User,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface StudentResult {
  id: string;
  name: string;
  email: string;
  score: number;
  totalMarks: number;
  grade: string;
  timeSpent: number; // in minutes
  submissionTime: string;
  status: 'completed' | 'in_progress' | 'not_started';
  answers: {
    questionId: string;
    answer: any;
    isCorrect: boolean;
    marksObtained: number;
  }[];
}

interface ExamReport {
  id: string;
  title: string;
  subject: string;
  totalStudents: number;
  completedStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  passRate: number;
  createdAt: string;
  results: StudentResult[];
}

export const ReportsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState('last-30');
  const [reportType, setReportType] = useState('all');
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Mock data
  const examReports: ExamReport[] = [
    {
      id: '1',
      title: 'Mathematics Midterm',
      subject: 'Mathematics',
      totalStudents: 45,
      completedStudents: 42,
      averageScore: 78.5,
      highestScore: 95,
      lowestScore: 45,
      passRate: 87.5,
      createdAt: '2024-01-20',
      results: [
        {
          id: 'r1',
          name: 'Alice Johnson',
          email: 'alice@student.edu',
          score: 95,
          totalMarks: 100,
          grade: 'A+',
          timeSpent: 85,
          submissionTime: '2024-01-20T14:30:00Z',
          status: 'completed',
          answers: [
            { questionId: 'q1', answer: 'B', isCorrect: true, marksObtained: 5 },
            { questionId: 'q2', answer: 'Integration by parts', isCorrect: true, marksObtained: 10 },
          ]
        },
        {
          id: 'r2',
          name: 'Bob Smith',
          email: 'bob@student.edu',
          score: 72,
          totalMarks: 100,
          grade: 'B',
          timeSpent: 95,
          submissionTime: '2024-01-20T14:25:00Z',
          status: 'completed',
          answers: [
            { questionId: 'q1', answer: 'A', isCorrect: false, marksObtained: 0 },
            { questionId: 'q2', answer: 'Integration by substitution', isCorrect: false, marksObtained: 6 },
          ]
        },
        {
          id: 'r3',
          name: 'Carol Davis',
          email: 'carol@student.edu',
          score: 88,
          totalMarks: 100,
          grade: 'A-',
          timeSpent: 78,
          submissionTime: '2024-01-20T14:20:00Z',
          status: 'completed',
          answers: [
            { questionId: 'q1', answer: 'B', isCorrect: true, marksObtained: 5 },
            { questionId: 'q2', answer: 'Integration by parts', isCorrect: true, marksObtained: 10 },
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Computer Science Quiz 3',
      subject: 'Computer Science',
      totalStudents: 38,
      completedStudents: 35,
      averageScore: 82.1,
      highestScore: 98,
      lowestScore: 62,
      passRate: 91.2,
      createdAt: '2024-01-18',
      results: []
    }
  ];

  const stats = [
    {
      title: 'Total Exams',
      value: examReports.length.toString(),
      change: '+12%',
      trend: 'up',
      color: 'blue'
    },
    {
      title: 'Total Students',
      value: examReports.reduce((sum, exam) => sum + exam.totalStudents, 0).toString(),
      change: '+5%',
      trend: 'up',
      color: 'green'
    },
    {
      title: 'Average Score',
      value: `${(examReports.reduce((sum, exam) => sum + exam.averageScore, 0) / examReports.length).toFixed(1)}%`,
      change: '-2%',
      trend: 'down',
      color: 'yellow'
    },
    {
      title: 'Pass Rate',
      value: `${(examReports.reduce((sum, exam) => sum + exam.passRate, 0) / examReports.length).toFixed(1)}%`,
      change: '+8%',
      trend: 'up',
      color: 'purple'
    }
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    if (grade.startsWith('D')) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'not_started':
        return <XCircle className="h-4 w-4 text-gray-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const handleViewExam = (examId: string) => {
    setSelectedExam(examId);
    setSelectedStudent(null);
  };

  const handleViewStudent = (studentId: string) => {
    setSelectedStudent(studentId);
  };

  const selectedExamData = examReports.find(exam => exam.id === selectedExam);
  const selectedStudentData = selectedExamData?.results.find(result => result.id === selectedStudent);

  if (selectedStudent && selectedStudentData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedStudent(null)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Exam Results
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
              <p className="text-gray-600">{selectedStudentData.name} - {selectedExamData?.title}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {selectedStudentData.score}/{selectedStudentData.totalMarks}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Grade</p>
                <p className="text-2xl font-bold text-gray-900">{selectedStudentData.grade}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Time Spent</p>
                <p className="text-2xl font-bold text-gray-900">{selectedStudentData.timeSpent}m</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Percentage</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((selectedStudentData.score / selectedStudentData.totalMarks) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Answer Details</h3>
          <div className="space-y-4">
            {selectedStudentData.answers.map((answer, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                  <div className="flex items-center space-x-2">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm font-medium">
                      {answer.marksObtained} marks
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 mb-2">
                  <strong>Student Answer:</strong> {answer.answer}
                </p>
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  answer.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {answer.isCorrect ? 'Correct' : 'Incorrect'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedExam && selectedExamData) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedExam(null)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Reports
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedExamData.title}</h1>
              <p className="text-gray-600">Detailed exam results and analytics</p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Results</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{selectedExamData.completedStudents}</div>
              <div className="text-sm text-gray-600">Completed</div>
              <div className="text-xs text-gray-500">of {selectedExamData.totalStudents} students</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{selectedExamData.averageScore.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{selectedExamData.passRate.toFixed(1)}%</div>
              <div className="text-sm text-gray-600">Pass Rate</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{selectedExamData.highestScore}</div>
              <div className="text-sm text-gray-600">Highest Score</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Student Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedExamData.results.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{result.name}</div>
                          <div className="text-sm text-gray-500">{result.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.score}/{result.totalMarks}</div>
                      <div className="text-sm text-gray-500">
                        {Math.round((result.score / result.totalMarks) * 100)}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.timeSpent} minutes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(result.status)}
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {result.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewStudent(result.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Track exam performance and student progress</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="last-7">Last 7 days</option>
              <option value="last-30">Last 30 days</option>
              <option value="last-90">Last 3 months</option>
              <option value="last-365">Last year</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Reports</option>
              <option value="performance">Performance</option>
              <option value="participation">Participation</option>
              <option value="department">Department</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${getStatColor(stat.color)}`}>
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className={`text-sm font-medium ${getTrendColor(stat.trend)}`}>
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Exam Reports List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Exam Reports</h3>
        </div>

        <div className="divide-y divide-gray-200">
          {examReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{report.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{report.subject}</p>
                      
                      <div className="flex items-center space-x-6 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{report.completedStudents}/{report.totalStudents} completed</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>Avg: {report.averageScore.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Pass: {report.passRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewExam(report.id)}
                    className="flex items-center space-x-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Details</span>
                  </button>
                  <button className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
