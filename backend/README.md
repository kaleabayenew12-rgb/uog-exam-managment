Front-end specification — Exam Builder portal (detailed breakdown + full system flow)

Nice — below is a complete, developer-ready front-end spec for your Exam Builder portal. It describes pages, UI components, state/data flows, interactions (including Send to Department → approval), question-type editors, security & deployment notes, plus a recommended folder structure and example API contract. Use this as a blueprint to implement in React (recommended), Vue, or Angular.

1 — High-level user flows (what users do)

User visits Login → authenticates.

User lands on Dashboard (role-aware).

Teacher/Examiner: Create exam (build questions, save draft) → Send to Department.

Department Head: Receive notification → review exam → Approve or Reject (with comments).

Once approved: exam can be Published to students or scheduled.

Students take exam; results are auto-graded (where possible) or queued for manual grading.

Reports and exports are available.

2 — Pages / Routes (front-end)

/login — Login / forgot password

/dashboard — Role-aware home

/exams — Manage Exams (list, filter, search)

/exams/new — Create exam

/exams/:id/edit — Edit exam

/exams/:id/preview — Preview exam (take as student)

/exams/:id/send — Send to Department modal/flow (can be modal on edit)

/departments/approvals — Department approval queue

/reports — Reports & results

/profile — User settings

/admin — Admin controls (roles, departments, config)

3 — Main UI components

Topbar / Sidebar (navigation, role-specific)

ExamList (table/cards with filters: status, department, date)

ExamCard (summary + quick-actions)

ExamForm (meta: title, category, duration, marks, pass mark, target departments, schedule)

QuestionList inside ExamForm (sortable list)

QuestionEditor (editor wrapper that switches by type)

QuestionTypePicker (dropdown/grid for TF, MCQ, Short Answer, Fill-Blank, Matching, Essay, Coding, Diagram, etc.)

CodeEditor (Monaco / Ace wrapper) for coding questions

DiagramUploader / CanvasAnnotator (upload image / annotate)

MatchingEditor (drag & drop pair editor)

FillBlankEditor (inline inputs/placeholder markers)

PreviewPlayer (simulate student view)

Modal (confirmations: send to department, delete)

Notification system (toasts, in-app)

AuditLog viewer (who changed what)

4 — Question types & UX details (how to create each)
True / False

UI: statement textarea + radio for True/False + marks

Validation: must select correct answer

Multiple Choice (Single / Multi-select)

UI: question text, repeatable option rows (option text, optional image/media), checkboxes to mark correct option(s), set points per option (optional)

Features: add image for each option, reorder options, toggle “shuffle options”

Validation: at least 2 options; mark ≥1 correct (single vs multi)

Short Answer

UI: question text + short text answer sample / keywords for auto-grading

Features: case-insensitive matching, regex or keyword lists for auto-mark

Fill in the Blank (Blankspace)

UI: author writes question with placeholders like [[blank1]] or uses inline editor to insert blanks. For each blank, supply acceptable answers and marks.

Preview shows blanks appearing as input fields.

Matching

UI: left column (prompts) and right column (responses). Add pairs; responses can be randomized for student view.

Student UI: drag-and-drop or dropdown linking.

Paragraph / Essay

UI: long text editor (rich text optional), rubric fields for manual grading (criteria, marks).

No auto-grading unless using NLP (out-of-scope).

Coding (programming)

UI: code editor (Monaco), language selector, sample input/output, test cases (hidden & visible), time/memory limits, automatic judge settings.

Backend requirement: run/test code in sandbox (Docker/runner).

Frontend features: code template insertion, run tests, show test case results.

Diagram / Upload-based

UI: allow upload of diagram image or embed a simple drawing canvas (SVG/HTML5 canvas) where students annotate or mark areas.

Marking: teacher defines interactive hotspots or accept file upload as answer.

Others (e.g., Audio/Video)

UI: upload media, playback controls, and student upload/record answer options.

5 — Exam settings & meta options

Title, Subject, Tags, Instructions (global & per question)

Duration (minutes), schedule (start/end datetime)

Total marks, pass mark, negative marking toggles

Randomize questions on each attempt

Shuffle options per question

Attempt limits (1 or multiple)

Access constraints (by department, group, IP range)

Security options: disable copy/paste, allow webcam capture, require proctoring token

6 — Send to Department workflow (front-end interactions)

In ExamForm, user clicks Send to Department button.

Open modal: multi-select departments (dropdown with search), add message/notes, choose urgency, attach supporting files.

On submit:

Frontend POST /api/exams/:id/send with payload { departments: [...], note: '', senderId }

Show optimistic UI: status changes to Sent (Pending Approval); show toast.

Department queue:

Department Head sees exam in /departments/approvals.

Actions: View → Approve (POST /api/exams/:id/approve) or Reject (POST /api/exams/:id/reject with comments).

After approval:

System changes status to Approved → optionally auto-publish or notify creator to publish.

UX tips:

Show audit trail on exam page (who sent, when, approvals/rejections and comments).

Allow resending after edits, with version note.

7 — State management & data flow

Use centralized state solution: Redux Toolkit or Context + useReducer for React.

Local state for form inputs with autosave to server (debounced).

Typical data flows:

On page load: GET /api/user and /api/permissions then fetch role-specific data.

Save exam draft: POST /api/exams (create) or PUT /api/exams/:id (update).

Add question: POST /api/exams/:id/questions or send full exam body in PUT.

Send to department: POST /api/exams/:id/send.

Use optimistic updates for quick UX with rollback on failure.

8 — Data models (frontend view models)

Example exam shape (JSON):

{
  "id": "string",
  "title": "Midterm 2025",
  "subject": "Math",
  "description": "Instructions...",
  "duration": 90,
  "totalMarks": 100,
  "passMark": 50,
  "status": "draft|sent|approved|published",
  "departmentIds": ["dept1","dept2"],
  "questions": [
    {
      "id": "q1",
      "type": "mcq|tf|short|fill|matching|essay|code|diagram",
      "text": "Question text",
      "options": [ "A", "B" ],
      "correct": [0],
      "marks": 5,
      "metadata": { "shuffle": true, "imageUrl": null }
    }
  ],
  "createdBy": "userId",
  "createdAt": "ISODate",
  "updatedAt": "ISODate",
  "version": 3
}

9 — API contract (examples)

POST /api/login → { email, password }

GET /api/exams?status=&department=&createdBy= → list

POST /api/exams → create draft

PUT /api/exams/:id → update

POST /api/exams/:id/send → { departments: [], message: '' }

GET /api/departments/:id/approvals → pending exams

POST /api/exams/:id/approve → { approverId }

POST /api/exams/:id/reject → { reason }

POST /api/exams/:id/publish → publish to students

GET /api/exams/:id/preview → for previewing

POST /api/exams/:id/questions → add question (or include in PUT)

Make endpoints idempotent where possible and return clear status codes + helpful error JSON.

10 — Autosave, versioning & conflict handling

Autosave exam draft every N seconds or on change (debounced).

Attach version in exam updates to detect edit conflicts (optimistic locking). Server returns 409 with latest document and change diff.

Provide "Restore previous version" UI (history).

11 — Notifications & real-time

Use WebSocket / Server-Sent Events (SSE) for:

Approval notifications

Exam publishing events

Student submissions (for instructors)

Fallback to polling if realtime not available.

12 — Security & permissions (frontend concerns)

Store token securely (HttpOnly cookie preferred; otherwise in-memory or secure storage).

Frontend checks to hide/show UI elements based on permissions, but always re-validated on server.

CSRF protection, rate limits, validation on all inputs.

Input sanitization, file-type validation (for uploads).

Use TLS (https) always.

13 — Accessibility & UX

Keyboard navigable components.

Proper ARIA labels for custom controls (matching, drag/drop).

Contrast & font size accessible.

Screen reader announcements on major actions (exam sent, approved).

Error messages inline and accessible.

14 — Testing strategy

Unit tests: component logic, QuestionEditor variants.

Integration tests: flows — create exam, add questions, send to department.

E2E: Cypress or Playwright for real flows (login → create → send → approve).

Accessibility tests: axe-core integrations.

15 — Performance & optimization

Lazy-load heavy components (Monaco editor only when needed).

Server-side pagination for exam lists.

Use virtualization for long question lists.

Compress images on upload; limit file sizes.

16 — Suggested front-end tech stack

React + TypeScript

Redux Toolkit (or Zustand) for state

React Router v6

TailwindCSS for styling (or Material UI)

Monaco Editor for coding questions

react-beautiful-dnd for drag/drop (matching, reorder)

Axios / fetch with centralized API layer

WebSocket or Socket.io for real-time

Jest + React Testing Library + Cypress

17 — Example folder structure (React + TS)
src/
├─ api/
│   └─ exams.ts
├─ components/
│   ├─ common/
│   ├─ Exam/
│   │  ├─ ExamForm.tsx
│   │  ├─ QuestionList.tsx
│   │  ├─ QuestionEditors/
│   │  │  ├─ MCQEditor.tsx
│   │  │  ├─ TFEditor.tsx
│   │  │  ├─ CodeEditorWrapper.tsx
│   │  │  └─ DiagramEditor.tsx
├─ features/
│   ├─ auth/
│   ├─ exams/
├─ pages/
│   ├─ Login.tsx
│   ├─ Dashboard.tsx
│   ├─ ExamsPage.tsx
│   ├─ CreateExamPage.tsx
├─ routes/
├─ store/
├─ utils/
└─ styles/

18 — Example UI behavior snippets (pseudocode)

Send to Department (frontend):

Validate exam (minimum number of questions, total marks matches).

Open department selector modal.

POST /api/exams/:id/send.

Update status to sent and show toast: “Sent to X department(s).”

Track in exam history.

Approve (department head):

Click exam → review questions and settings.

Click Approve → POST /api/exams/:id/approve.

Notif to creator: “Your exam has been approved on 2025-09-29.”

19 — Deployment & CI

Build process: CI pipeline installs, runs tests, builds static site.

Host frontend on Netlify/Vercel or serve behind CDN (if monolith).

Use environment variables for API endpoints, auth settings.

Use Sentry or similar for frontend error tracking.

20 — Extras & polish ideas

Question templates — save frequently used question formats.

Bulk import — CSV/Excel import for question bank.

Rubrics & graders — structured manual grading with rubrics.

Preview student experience — toggles to see how questions render.

Audit / change diff — show exact edits when exam is re-sent after changes.

Mobile friendly — students may take short quizzes on mobile.

21 — Deliverables I can produce next (pick any)

a) Full React + TypeScript starter repo scaffold (pages + skeleton components).

b) A single-file CreateExam React component with multiple question editors implemented (MCQ, TF, Short Answer, Code with Monaco).

c) A visual wireframe / UI mockup (described or simple HTML/CSS).

d) Detailed backend API spec (OpenAPI/Swagger) matching the frontend.

Tell me which of (a/b/c/d) you want and I’ll generate it right away — I can also start with a minimal working CreateExam page (React + Tailwind + question editors) if you want code.

Is this conversation helpful so far?

ChatGPT can make mistakes. Check important info.
