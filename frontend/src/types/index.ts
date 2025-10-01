export interface User {
  id: string;
  email: string;
  name: string;
  role: 'teacher' | 'department_head' | 'admin' | 'student';
  department?: string;
  avatar?: string;
}

export interface Question {
  id: string;
  type: 'mcq' | 'tf' | 'short' | 'fill' | 'matching' | 'essay' | 'code' | 'diagram' | 'diagram-mcq' | 'diagram-tf' | 'diagram-matching' | 'paragraph-mcq' | 'paragraph-tf' | 'paragraph-matching';
  text: string;
  marks: number;
  options?: string[];
  correct?: number[] | string[] | boolean;
  metadata?: {
    shuffle?: boolean;
    imageUrl?: string;
    caseSensitive?: boolean;
    keywords?: string[];
    language?: string;
    testCases?: TestCase[];
    pairs?: MatchingPair[];
    blanks?: BlankAnswer[];
    wordLimit?: number;
    baseText?: string; // For paragraph-based questions
  };
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

export interface MatchingPair {
  id: string;
  prompt: string;
  response: string;
}

export interface BlankAnswer {
  id: string;
  position: number;
  acceptedAnswers: string[];
  marks: number;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration: number; // minutes
  totalMarks: number;
  passMark: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected' | 'published';
  departmentIds: string[];
  questions: Question[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  settings: {
    randomizeQuestions: boolean;
    allowMultipleAttempts: boolean;
    shuffleOptions: boolean;
    negativeMark: boolean;
    startDate?: string;
    endDate?: string;
  };
  approvals?: Approval[];
}

export interface Approval {
  id: string;
  examId: string;
  approverId: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
}
