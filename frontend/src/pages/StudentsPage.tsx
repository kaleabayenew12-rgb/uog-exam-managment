import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Plus, Download } from 'lucide-react';
import { apiService } from '../services/apiService.ts';

interface Student {
  id: number;
  student_id: string;
  name: string;
  email: string;
  department: string;
  total_exams_taken: number;
  average_score: number;
  total_marks_obtained: number;
  total_possible_marks: number;
}

interface ExamResult {
  id: number;
  exam_id: number;
  exam_title: string;
  subject: string;
  score: number;
  total_marks: number;
  grade: string;
  time_spent: number;
  submitted_at: string;
  answers: any[];
}

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showStudentDetails, setShowStudentDetails] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [departmentFilter, searchTerm]);

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (departmentFilter !== 'all') params.append('department', departmentFilter);
      if (searchTerm) params.append('search', searchTerm);

      const data = await apiService.getStudents(Object.fromEntries(params));
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId: string) => {
    try {
      const data = await apiService.getStudent(studentId);
      if (data.success) {
        setSelectedStudent(data.data);
        setShowStudentDetails(true);
      }
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const updateGrade = async (resultId: number, grade: string, score?: number) => {
    try {
      const data = await apiService.updateStudentGrade(
        selectedStudent.student.student_id,
        resultId.toString(),
        { grade, score }
      );
      if (data.success) {
        // Refresh student details
        fetchStudentDetails(selectedStudent.student.student_id);
        alert('Grade updated successfully!');
      }
    } catch (error) {
      console.error('Error updating grade:', error);
      alert('Error updating grade');
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C+':
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'D':
        return 'bg-orange-100 text-orange-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showStudentDetails && selectedStudent) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowStudentDetails(false)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Back to Students
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{selectedStudent.student.name}</h1>
              <p className="text-gray-600">{selectedStudent.student.student_id} - {selectedStudent.student.department}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{selectedStudent.examResults.length}</div>
              <div className="text-sm text-gray-600">Exams Taken</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {selectedStudent.examResults.length > 0 
                  ? Math.round(selectedStudent.examResults.reduce((sum: number, result: ExamResult) => sum + result.score, 0) / selectedStudent.examResults.length)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Average Score</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {selectedStudent.examResults.reduce((sum: number, result: ExamResult) => sum + result.score, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Marks</div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {selectedStudent.examResults.filter((result: ExamResult) => ['A+', 'A', 'B+', 'B'].includes(result.grade)).length}
              </div>
              <div className="text-sm text-gray-600">Good Grades</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Exam Results</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedStudent.examResults.map((result: ExamResult) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{result.exam_title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.subject}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{result.score}/{result.total_marks}</div>
                      <div className="text-sm text-gray-500">{Math.round((result.score / result.total_marks) * 100)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeColor(result.grade)}`}>
                        {result.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.time_spent} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(result.submitted_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          const newGrade = prompt('Enter new grade (A+, A, B+, B, C+, C, D, F):', result.grade);
                          if (newGrade) {
                            const newScore = prompt('Enter new score (optional):', result.score.toString());
                            updateGrade(result.id, newGrade, newScore ? parseInt(newScore) : undefined);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Edit Grade
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
          <h1 className="text-2xl font-bold text-gray-900">Students Management</h1>
          <p className="text-gray-600 mt-1">View and manage student records and exam results</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Student</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or student ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Students ({students.length})</h3>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading students...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exams Taken</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.student_id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{student.total_exams_taken || 0}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.average_score ? Math.round(student.average_score) : 0}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {student.total_marks_obtained || 0}/{student.total_possible_marks || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => fetchStudentDetails(student.student_id)}
                        className="text-blue-600 hover:text-blue-700 mr-4"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {students.length === 0 && !isLoading && (
              <div className="p-8 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No students found</h3>
                <p className="mt-2 text-gray-500">No students match your current filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
