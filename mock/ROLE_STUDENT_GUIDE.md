# ROLE: STUDENT - Frontend Development Guide

**Last Updated:** March 6, 2026  
**Version:** 1.0  
**Status:** Ready for Implementation

---

## 1. Role Overview

### Purpose
The Student role represents an enrolled learner who actively participates in courses, attends lectures, completes assignments, takes exams, and tracks their academic progress. Students are the primary users of the learning delivery system.

### Key Objectives
- Access enrolled courses and lectures
- Participate in online lectures via Teams
- Download and review course materials
- Engage in Q&A, comments, and chat discussions
- Submit assignments and take exams
- Track attendance and grades
- Monitor financial status and payment obligations
- Receive notifications about deadlines and updates

### Business Value
- Enables 24/7 access to learning materials
- Facilitates interactive learning with peer engagement
- Provides real-time progress tracking
- Automates attendance and grading workflows
- Improves student retention through engagement metrics

---

## 2. User Journey & Workflows

### 2.1 Complete Learning Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│              STUDENT LEARNING JOURNEY                     │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  1. ENROLLMENT & ACCESS                                  │
│     ├─ Assigned to program/group                         │
│     ├─ Courses automatically visible                     │
│     ├─ Schedule published                                │
│     └─ Status: Active Student                            │
│                                                            │
│  2. COURSE EXPLORATION                                   │
│     ├─ Browse enrolled courses                           │
│     ├─ View course syllabus & outcomes                   │
│     ├─ Check course schedule                             │
│     └─ Access course materials                           │
│                                                            │
│  3. LECTURE PARTICIPATION                                │
│     ├─ Join live lecture via Teams                       │
│     ├─ Automatic attendance tracking                     │
│     ├─ Participate in Q&A/chat                           │
│     ├─ Complete mini-activities                          │
│     └─ Access lecture recording                          │
│                                                            │
│  4. ASSIGNMENT SUBMISSION                                │
│     ├─ Download assignment details                       │
│     ├─ Submit answers/files                              │
│     ├─ Track submission status                           │
│     └─ Receive feedback from teacher                     │
│                                                            │
│  5. EXAM PREPARATION & TAKING                            │
│     ├─ Check exam eligibility (attendance, assignments)  │
│     ├─ Schedule exam slot                                │
│     ├─ Take proctored exam                               │
│     └─ View results                                      │
│                                                            │
│  6. PROGRESS TRACKING                                    │
│     ├─ View current grades                               │
│     ├─ Check attendance percentage                       │
│     ├─ Monitor financial status                          │
│     ├─ Receive progress notifications                    │
│     └─ Appeal grades (if applicable)                     │
│                                                            │
│  7. FINANCIAL MANAGEMENT                                 │
│     ├─ View payment obligations                          │
│     ├─ Make payments                                     │
│     ├─ Track payment status                              │
│     └─ Handle payment blocks                             │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

### 2.2 Access Control States

| State | Description | Can Access Courses | Can Take Exam |
|-------|-------------|-------------------|---------------|
| **Active** | Good standing, no debt | ✓ Yes | ✓ Yes |
| **BlockedByDebt** | Outstanding payment | ✓ View only | ✗ No |
| **BlockedByFraud** | Suspected violation | ✗ No | ✗ No |
| **SuspendedByAdmin** | Administrative action | ✗ No | ✗ No |
| **TemporaryOverride** | Exception granted | ✓ Yes (limited) | ✓ Yes (limited) |

---

## 3. Frontend Components & Pages

### 3.1 Page Structure

```
/student/
├── /student/dashboard/
│   └── StudentDashboard.tsx
├── /student/courses/
│   ├── CoursesListPage.tsx
│   └── CourseDetailPage.tsx
├── /student/lectures/
│   ├── LectureListPage.tsx
│   └── LecturePage.tsx
├── /student/assignments/
│   ├── AssignmentsPage.tsx
│   └── AssignmentDetailPage.tsx
├── /student/exams/
│   ├── ExamsPage.tsx
│   └── ExamTakingPage.tsx
├── /student/grades/
│   └── GradesPage.tsx
├── /student/attendance/
│   └── AttendancePage.tsx
├── /student/finances/
│   └── FinancesPage.tsx
└── /student/profile/
    └── StudentProfilePage.tsx
```

### 3.2 Key Components

#### 1. **Student Dashboard** (`StudentDashboard.tsx`)

**Purpose:** Central hub showing student's academic status and quick actions

**Key Sections:**

```typescript
interface StudentDashboard {
  welcomeMessage: string;
  accessStatus: 'Active' | 'BlockedByDebt' | 'BlockedByFraud' | 'Suspended';
  upcomingLectures: Lecture[];
  upcomingDeadlines: Deadline[];
  currentGrades: GradeSummary;
  attendanceStatus: AttendanceSummary;
  financialStatus: FinancialSummary;
  notifications: Notification[];
  enrolledCourses: Course[];
}
```

**Dashboard Layout:**

```
┌─────────────────────────────────────────────────────────┐
│ Welcome, [Student Name]! | Your Status: [Active/Blocked]│
├─────────────────────────────────────────────────────────┤
│ QUICK STATS (4 Cards)                                   │
│ ├─ GPA: 3.8/4.0        ├─ Attendance: 95%             │
│ ├─ Courses: 5/5        ├─ Payment Status: Paid         │
├─────────────────────────────────────────────────────────┤
│ UPCOMING LECTURES (Next 7 days)                         │
│ ├─ [Course] - [Date] [Time] - [Join Button]           │
│ ├─ [Course] - [Date] [Time] - [Join Button]           │
│ └─ [View All Lectures]                                 │
├─────────────────────────────────────────────────────────┤
│ UPCOMING DEADLINES                                      │
│ ├─ [Course] Assignment due in 2 days                   │
│ ├─ [Course] Exam registration closes tomorrow          │
│ └─ [View All Deadlines]                                │
├─────────────────────────────────────────────────────────┤
│ RECENT NOTIFICATIONS                                    │
│ ├─ "Grade posted for Assignment 1"                     │
│ ├─ "Lecture recording available"                       │
│ └─ "Payment reminder: Due in 5 days"                   │
├─────────────────────────────────────────────────────────┤
│ MY COURSES (Carousel/Grid)                              │
│ ├─ [Course Card] [Course Card] [Course Card]          │
│ └─ [View All Courses]                                  │
├─────────────────────────────────────────────────────────┤
│ QUICK ACTIONS                                           │
│ ├─ [Join Lecture] [View Grades] [Pay Fees] [Support]  │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Real-time access status display
- Quick links to urgent actions
- Notification center with filtering
- Course progress indicators
- Financial alerts
- Attendance warnings

---

#### 2. **Courses List Page** (`CoursesListPage.tsx`)

**Purpose:** Display all enrolled courses with filtering and search

**Data Structure:**

```typescript
interface StudentCourse {
  courseId: string;
  title: string;
  code: string;
  instructor: string;
  description: string;
  credits: number;
  status: 'active' | 'completed' | 'archived';
  progress: number;              // 0-100%
  currentGrade?: number;
  enrollmentDate: Date;
  startDate: Date;
  endDate: Date;
  lectureCount: number;
  completedLectures: number;
  materials: Material[];
}
```

**Features:**
- Grid/list view toggle
- Filter by status (active, completed, archived)
- Search by course name/code
- Sort by start date, progress, grade
- Course cards showing:
  - Course title and code
  - Instructor name
  - Progress bar
  - Current grade
  - Next lecture date
  - Quick action button (View/Continue)

**UI Elements:**

```tsx
<CoursesContainer>
  <SearchAndFilter
    onSearch={handleSearch}
    onFilter={handleFilter}
    onSort={handleSort}
  />
  
  <CourseGrid>
    {courses.map(course => (
      <CourseCard
        course={course}
        onViewCourse={navigateToCourse}
        onJoinLecture={joinNextLecture}
      />
    ))}
  </CourseGrid>
</CoursesContainer>
```

---

#### 3. **Course Detail Page** (`CourseDetailPage.tsx`)

**Purpose:** View complete course information, syllabus, and materials

**Sections:**

```
┌──────────────────────────────────────────────────┐
│ COURSE HEADER                                    │
│ ├─ Course Title | Code | Credits                │
│ ├─ Instructor: [Name] | [Email]                 │
│ └─ Progress: [Progress Bar] 65%                 │
├──────────────────────────────────────────────────┤
│ TABS: Overview | Lectures | Materials | Grades  │
├──────────────────────────────────────────────────┤
│ OVERVIEW TAB                                     │
│ ├─ Course Description                           │
│ ├─ Learning Outcomes                            │
│ ├─ Prerequisites                                │
│ ├─ Grading Policy                               │
│ ├─ Course Schedule                              │
│ └─ Attendance Requirements                      │
├──────────────────────────────────────────────────┤
│ LECTURES TAB                                     │
│ ├─ [Lecture 1] - [Date] - [Join/View Recording]│
│ ├─ [Lecture 2] - [Date] - [Join/View Recording]│
│ └─ [View All Lectures]                         │
├──────────────────────────────────────────────────┤
│ MATERIALS TAB                                    │
│ ├─ [PDF] Lecture Slides - Week 1                │
│ ├─ [Video] Recording - Week 1                   │
│ ├─ [Link] Additional Resources                  │
│ └─ [Download All]                              │
├──────────────────────────────────────────────────┤
│ GRADES TAB                                       │
│ ├─ Current Grade: 85/100 (B+)                  │
│ ├─ Assignments: 8/10                           │
│ ├─ Midterm Exam: 82/100                        │
│ └─ Final Exam: Not Yet Taken                   │
└──────────────────────────────────────────────────┘
```

**Features:**
- Course overview with learning outcomes
- Complete lecture schedule
- Material library with download
- Grade breakdown
- Attendance tracking
- Instructor contact information
- Course announcements

---

#### 4. **Lecture Page** (`LecturePage.tsx`)

**Purpose:** Main learning interface for individual lectures

**Data Structure:**

```typescript
interface Lecture {
  lectureId: string;
  courseId: string;
  title: string;
  topic: string;
  learningOutcomes: string[];
  scheduledDate: Date;
  scheduledTime: string;
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  materials: Material[];
  recordingUrl?: string;
  teamsLink?: string;
  attendance?: AttendanceRecord;
  qa?: QAThread[];
  comments?: Comment[];
  chat?: ChatMessage[];
}
```

**Lecture Interface:**

```
┌──────────────────────────────────────────────────────────┐
│ LECTURE HEADER                                           │
│ [Course] > [Lecture Title] | [Date] [Time]              │
├──────────────────────────────────────────────────────────┤
│ MAIN CONTENT AREA (Left 70%)                            │
│ ├─ LIVE LECTURE (if scheduled)                          │
│ │  ├─ [Teams Embed / Video Player]                      │
│ │  ├─ Timer: 45 min remaining                           │
│ │  ├─ [Attendance Confirmed] ✓                          │
│ │  └─ [Leave Lecture] [Raise Hand] [Chat]             │
│ │                                                        │
│ ├─ OR RECORDED LECTURE (if completed)                  │
│ │  ├─ [Video Player with Playback Controls]            │
│ │  ├─ [Download Recording]                             │
│ │  └─ [Transcript/Subtitles]                           │
│ │                                                        │
│ └─ MATERIALS SECTION                                    │
│    ├─ [PDF] Lecture Slides                             │
│    ├─ [PDF] Handout                                    │
│    ├─ [Link] Additional Resources                      │
│    └─ [Download All]                                  │
├──────────────────────────────────────────────────────────┤
│ SIDEBAR (Right 30%)                                     │
│ ├─ LEARNING OUTCOMES                                    │
│ │  ├─ □ Outcome 1                                      │
│ │  ├─ □ Outcome 2                                      │
│ │  └─ □ Outcome 3                                      │
│ │                                                        │
│ ├─ TABS: Q&A | Comments | Chat                         │
│ │                                                        │
│ ├─ Q&A SECTION                                          │
│ │  ├─ [Ask Question Button]                            │
│ │  ├─ [Question 1] - [Votes] [Answers]                │
│ │  ├─ [Question 2] - [Votes] [Answers]                │
│ │  └─ [View All Q&A]                                  │
│ │                                                        │
│ ├─ COMMENTS SECTION                                     │
│ │  ├─ [Add Comment]                                    │
│ │  ├─ [Comment 1] - [Replies]                         │
│ │  └─ [Comment 2] - [Replies]                         │
│ │                                                        │
│ └─ CHAT SECTION                                         │
│    ├─ [Chat Messages...]                               │
│    └─ [Message Input]                                  │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- Live lecture join with Teams integration
- Attendance auto-tracking
- Materials download
- Q&A section with voting
- Comments and discussions
- Real-time chat
- Lecture recording access
- Transcript/subtitles

**Interactive Elements:**

```tsx
// Live lecture join
<LiveLectureView
  teamsLink={lecture.teamsLink}
  onJoin={handleJoinLecture}
  onLeave={handleLeaveLecture}
/>

// Q&A section
<QASection
  questions={lecture.qa}
  onAskQuestion={handleAskQuestion}
  onVote={handleVote}
  onAnswer={handleAnswer}
/>

// Materials
<MaterialsList
  materials={lecture.materials}
  onDownload={handleDownload}
/>
```

---

#### 5. **Assignments Page** (`AssignmentsPage.tsx`)

**Purpose:** View and submit assignments

**Data Structure:**

```typescript
interface Assignment {
  assignmentId: string;
  lectureId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: Date;
  maxScore: number;
  rubric: Rubric[];
  submissionType: 'file' | 'text' | 'quiz';
  attachments?: Attachment[];
  submissions: StudentSubmission[];
  status: 'pending' | 'submitted' | 'graded' | 'late';
}

interface StudentSubmission {
  submissionId: string;
  studentId: string;
  content: string;
  files: File[];
  submittedAt: Date;
  isLate: boolean;
  score?: number;
  feedback?: string;
  status: 'submitted' | 'graded' | 'pending_review';
}
```

**Assignment List View:**

```
┌────────────────────────────────────────────────┐
│ ASSIGNMENTS                                    │
│ Filter: [All] [Pending] [Submitted] [Graded]  │
├────────────────────────────────────────────────┤
│ [Assignment 1]                                 │
│ ├─ Course: [Course Name]                      │
│ ├─ Due: [Date] - [Time Remaining]             │
│ ├─ Status: Pending                            │
│ └─ [View & Submit]                            │
│                                                │
│ [Assignment 2]                                 │
│ ├─ Course: [Course Name]                      │
│ ├─ Due: [Date] - OVERDUE                      │
│ ├─ Status: Submitted                          │
│ └─ [View Submission]                          │
│                                                │
│ [Assignment 3]                                 │
│ ├─ Course: [Course Name]                      │
│ ├─ Due: [Date]                                │
│ ├─ Status: Graded (85/100)                    │
│ └─ [View Feedback]                            │
└────────────────────────────────────────────────┘
```

**Assignment Detail View:**

```
┌──────────────────────────────────────────────────┐
│ [Assignment Title]                               │
│ [Course Name] | Due: [Date] [Time]              │
├──────────────────────────────────────────────────┤
│ DESCRIPTION                                      │
│ [Full assignment description and requirements]  │
├──────────────────────────────────────────────────┤
│ RUBRIC                                           │
│ ├─ Criteria 1: 0-25 points                      │
│ ├─ Criteria 2: 0-25 points                      │
│ ├─ Criteria 3: 0-25 points                      │
│ └─ Criteria 4: 0-25 points                      │
├──────────────────────────────────────────────────┤
│ SUBMISSION                                       │
│ ├─ [Drag & Drop File Upload]                    │
│ ├─ OR [Paste Text Answer]                       │
│ ├─ [Attached Files: file1.pdf, file2.docx]     │
│ └─ [Submit] [Save Draft]                       │
├──────────────────────────────────────────────────┤
│ FEEDBACK (if graded)                            │
│ ├─ Score: 85/100 (B+)                          │
│ ├─ Submitted: [Date] [Time]                    │
│ ├─ Graded: [Date] [Time]                       │
│ └─ Feedback: [Teacher Comments]                │
└──────────────────────────────────────────────────┘
```

**Features:**
- Assignment list with filtering
- Detailed assignment description
- Rubric display
- File upload with drag-and-drop
- Text submission
- Submission history
- Grade and feedback display
- Late submission handling

---

#### 6. **Exams Page** (`ExamsPage.tsx`)

**Purpose:** View exams, check eligibility, and schedule exam slots

**Data Structure:**

```typescript
interface StudentExam {
  examId: string;
  courseId: string;
  title: string;
  examDate: Date;
  examTime: string;
  durationMinutes: number;
  maxScore: number;
  passingScore: number;
  eligibility: {
    isEligible: boolean;
    blockers: string[];  // e.g., "Low attendance", "Unpaid fees"
  };
  status: 'scheduled' | 'in_progress' | 'completed' | 'not_scheduled';
  score?: number;
  result?: 'passed' | 'failed';
  attemptNumber?: number;
  maxAttempts: number;
}
```

**Exams List View:**

```
┌──────────────────────────────────────────────────┐
│ EXAMS                                            │
│ Filter: [All] [Scheduled] [Completed] [Failed]  │
├──────────────────────────────────────────────────┤
│ [Exam 1: Midterm - Mathematics]                 │
│ ├─ Course: [Course Name]                        │
│ ├─ Date: [Date] [Time] | Duration: 120 min     │
│ ├─ Status: Scheduled                            │
│ ├─ Eligibility: ✓ Eligible                      │
│ └─ [Join Exam] [View Details]                  │
│                                                 │
│ [Exam 2: Final - Physics]                       │
│ ├─ Course: [Course Name]                        │
│ ├─ Date: [Date] [Time]                          │
│ ├─ Status: Not Scheduled                        │
│ ├─ Eligibility: ✗ Not Eligible                  │
│ │  ├─ Reason: Low attendance (75% < 80%)       │
│ │  └─ Reason: Unpaid fees                       │
│ └─ [Schedule] (Disabled)                       │
│                                                 │
│ [Exam 3: Final - Chemistry]                     │
│ ├─ Course: [Course Name]                        │
│ ├─ Date: [Past Date]                            │
│ ├─ Status: Completed                            │
│ ├─ Score: 92/100 (A)                           │
│ └─ [View Results]                              │
└──────────────────────────────────────────────────┘
```

**Exam Detail View:**

```
┌──────────────────────────────────────────────────┐
│ [Exam Title]                                     │
│ [Course Name] | [Date] [Time] | Duration: 120min│
├──────────────────────────────────────────────────┤
│ EXAM DETAILS                                     │
│ ├─ Total Points: 100                            │
│ ├─ Passing Score: 60                            │
│ ├─ Question Types: Multiple Choice, Essay       │
│ ├─ Proctoring: Yes (Classmate)                 │
│ └─ Retakes Allowed: 2 attempts                  │
├──────────────────────────────────────────────────┤
│ ELIGIBILITY CHECK                                │
│ ├─ ✓ Attendance: 95% (≥ 80%)                   │
│ ├─ ✓ Assignments: 5/5 submitted                │
│ ├─ ✓ Payment: Paid                             │
│ └─ Status: ELIGIBLE                             │
├──────────────────────────────────────────────────┤
│ SCHEDULING                                       │
│ ├─ Current Status: Scheduled                    │
│ ├─ Scheduled Slot: [Date] [Time]               │
│ ├─ [Reschedule] [Cancel]                       │
│ └─ [Join Exam] (if within 15 min of start)    │
├──────────────────────────────────────────────────┤
│ PREVIOUS ATTEMPTS                                │
│ ├─ Attempt 1: [Date] - Score: 78/100 (Failed) │
│ └─ Attempt 2: [Date] - Score: 92/100 (Passed) │
└──────────────────────────────────────────────────┘
```

**Features:**
- Exam list with filtering
- Eligibility check with blockers
- Exam details and requirements
- Scheduling/rescheduling
- Previous attempt history
- Score and results display

---

#### 7. **Grades Page** (`GradesPage.tsx`)

**Purpose:** View grades, GPA, and academic progress

**Data Structure:**

```typescript
interface StudentGrades {
  courseId: string;
  courseName: string;
  courseCode: string;
  credits: number;
  gradeComponents: {
    assignments: { score: number; maxScore: number; weight: number };
    midterm: { score: number; maxScore: number; weight: number };
    final: { score: number; maxScore: number; weight: number };
    participation: { score: number; maxScore: number; weight: number };
  };
  finalGrade: number;
  letterGrade: string;  // A, B+, B, etc.
  gpa: number;
}
```

**Grades View:**

```
┌──────────────────────────────────────────────────┐
│ GRADES & ACADEMIC PROGRESS                       │
├──────────────────────────────────────────────────┤
│ CURRENT GPA: 3.8/4.0                            │
│ Semester GPA: 3.9/4.0                           │
│ Academic Standing: Good                         │
├──────────────────────────────────────────────────┤
│ COURSES GRADES                                   │
│ ┌────────────────────────────────────────────┐  │
│ │ Course | Grade | GPA | Assignments | Exams│  │
│ ├────────────────────────────────────────────┤  │
│ │ Math   │ A (95)│ 4.0 │ 95, 92, 88 │ 98   │  │
│ │ Physics│ B+(87)│ 3.3 │ 85, 88, 90 │ 85   │  │
│ │ Chem   │ A (92)│ 4.0 │ 92, 94, 90 │ 92   │  │
│ │ Eng    │ B (82)│ 3.0 │ 80, 85, 82 │ 80   │  │
│ │ History│ A (93)│ 4.0 │ 95, 92, 91 │ 93   │  │
│ └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│ GRADE BREAKDOWN (Selected Course)                │
│ Course: Mathematics                              │
│ ├─ Assignments (40%): 90/100                    │
│ ├─ Midterm (30%): 95/100                        │
│ ├─ Final (30%): 98/100                          │
│ └─ Final Grade: 95/100 (A)                      │
├──────────────────────────────────────────────────┤
│ PROGRESS TOWARDS GOALS                           │
│ ├─ Current: 3.8/4.0                            │
│ ├─ Target: 3.9/4.0                             │
│ ├─ Needed: +0.1 GPA                            │
│ └─ Courses to Improve: [List]                  │
└──────────────────────────────────────────────────┘
```

**Features:**
- Current GPA display
- Course grades table
- Grade breakdown by component
- Letter grade conversion
- Academic standing indicator
- Progress towards goals

---

#### 8. **Attendance Page** (`AttendancePage.tsx`)

**Purpose:** Track lecture attendance and participation

**Data Structure:**

```typescript
interface AttendanceRecord {
  lectureId: string;
  courseId: string;
  lectureDate: Date;
  lectureName: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  joinTime: Date;
  leaveTime: Date;
  duration: number;  // minutes
  participation: 'high' | 'medium' | 'low' | 'none';
}

interface AttendanceSummary {
  courseId: string;
  courseName: string;
  totalLectures: number;
  attended: number;
  absent: number;
  late: number;
  excused: number;
  attendancePercentage: number;
  minimumRequired: number;
  status: 'good' | 'warning' | 'critical';
}
```

**Attendance View:**

```
┌──────────────────────────────────────────────────┐
│ ATTENDANCE TRACKING                              │
├──────────────────────────────────────────────────┤
│ OVERALL ATTENDANCE: 92%                          │
│ Minimum Required: 80%                            │
│ Status: ✓ Good                                   │
├──────────────────────────────────────────────────┤
│ BY COURSE                                        │
│ ┌────────────────────────────────────────────┐  │
│ │ Course     │ Attended │ Absent │ Percentage │  │
│ ├────────────────────────────────────────────┤  │
│ │ Math       │ 14/15    │ 1      │ 93%       │  │
│ │ Physics    │ 13/15    │ 2      │ 87%       │  │
│ │ Chemistry  │ 15/15    │ 0      │ 100%      │  │
│ │ English    │ 12/14    │ 2      │ 86%       │  │
│ │ History    │ 14/15    │ 1      │ 93%       │  │
│ └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│ DETAILED HISTORY (Mathematics)                   │
│ ┌────────────────────────────────────────────┐  │
│ │ Date     │ Time      │ Status │ Duration   │  │
│ ├────────────────────────────────────────────┤  │
│ │ Mar 1    │ 10:00 AM  │ ✓      │ 60 min    │  │
│ │ Mar 3    │ 10:00 AM  │ ✓      │ 60 min    │  │
│ │ Mar 5    │ 10:00 AM  │ ✗      │ -         │  │
│ │ Mar 8    │ 10:00 AM  │ ✓      │ 60 min    │  │
│ │ Mar 10   │ 10:00 AM  │ ✓      │ 60 min    │  │
│ └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│ WARNINGS                                         │
│ ├─ Physics: 87% (below 90% target)              │
│ └─ English: 86% (approaching minimum 80%)       │
└──────────────────────────────────────────────────┘
```

**Features:**
- Overall attendance percentage
- Attendance by course
- Detailed attendance history
- Status indicators (present, absent, late, excused)
- Warnings for low attendance
- Participation tracking

---

#### 9. **Finances Page** (`FinancesPage.tsx`)

**Purpose:** Manage payments and track financial obligations

**Data Structure:**

```typescript
interface StudentFinances {
  studentId: string;
  totalObligation: number;
  totalPaid: number;
  totalDue: number;
  accessStatus: 'Active' | 'BlockedByDebt' | 'TemporaryOverride';
  contracts: Contract[];
  payments: Payment[];
  paymentSchedule: PaymentSchedule[];
}

interface Contract {
  contractId: string;
  amount: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
}

interface Payment {
  paymentId: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  method: 'bank_transfer' | 'credit_card' | 'cash';
}
```

**Finances View:**

```
┌──────────────────────────────────────────────────┐
│ FINANCIAL STATUS                                 │
├──────────────────────────────────────────────────┤
│ ACCESS STATUS: ✓ ACTIVE                          │
│ No payment blocks                                │
├──────────────────────────────────────────────────┤
│ PAYMENT SUMMARY                                  │
│ ├─ Total Obligation: $5,000                     │
│ ├─ Total Paid: $3,500 (70%)                     │
│ ├─ Total Due: $1,500 (30%)                      │
│ └─ Next Payment: $500 due Mar 15                │
├──────────────────────────────────────────────────┤
│ PAYMENT SCHEDULE                                 │
│ ┌────────────────────────────────────────────┐  │
│ │ Due Date   │ Amount │ Status │ Action     │  │
│ ├────────────────────────────────────────────┤  │
│ │ Mar 15     │ $500   │ Pending│ [Pay Now]  │  │
│ │ Apr 15     │ $500   │ Pending│ [Pay Now]  │  │
│ │ May 15     │ $500   │ Pending│ [Pay Now]  │  │
│ │ Feb 15     │ $500   │ Paid   │ ✓          │  │
│ │ Jan 15     │ $500   │ Paid   │ ✓          │  │
│ └────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────┤
│ PAYMENT METHODS                                  │
│ ├─ [Bank Transfer]                              │
│ ├─ [Credit Card]                                │
│ ├─ [Installment Plan]                           │
│ └─ [Contact Finance Office]                     │
├──────────────────────────────────────────────────┤
│ ALERTS                                           │
│ ├─ Payment due in 5 days                        │
│ └─ Consider setting up automatic payments       │
└──────────────────────────────────────────────────┘
```

**Features:**
- Financial summary and status
- Payment schedule display
- Payment history
- Online payment processing
- Installment plan information
- Payment reminders
- Access status indicator

---

## 4. API Integration Points

### 4.1 Backend API Endpoints (tRPC Procedures)

```typescript
// Get student dashboard
GET /api/trpc/student.getDashboard
Response: StudentDashboard

// Get enrolled courses
GET /api/trpc/student.getCourses
Query: { status?, search?, sort? }
Response: StudentCourse[]

// Get course details
GET /api/trpc/student.getCourseDetail
Query: { courseId }
Response: CourseDetail

// Get lectures
GET /api/trpc/student.getLectures
Query: { courseId }
Response: Lecture[]

// Get lecture details
GET /api/trpc/student.getLectureDetail
Query: { lectureId }
Response: Lecture

// Join lecture
POST /api/trpc/student.joinLecture
Body: { lectureId }
Response: { teamsLink, chatLink }

// Get assignments
GET /api/trpc/student.getAssignments
Query: { courseId?, status? }
Response: Assignment[]

// Submit assignment
POST /api/trpc/student.submitAssignment
Body: { assignmentId, content, files }
Response: { submissionId, status }

// Get exams
GET /api/trpc/student.getExams
Response: StudentExam[]

// Get grades
GET /api/trpc/student.getGrades
Response: StudentGrades[]

// Get attendance
GET /api/trpc/student.getAttendance
Query: { courseId? }
Response: AttendanceSummary[]

// Get finances
GET /api/trpc/student.getFinances
Response: StudentFinances

// Make payment
POST /api/trpc/student.makePayment
Body: { amount, method, dueDate }
Response: { paymentId, status }

// Post Q&A question
POST /api/trpc/student.postQuestion
Body: { lectureId, question }
Response: { questionId }

// Post comment
POST /api/trpc/student.postComment
Body: { lectureId, content }
Response: { commentId }

// Post chat message
POST /api/trpc/student.postChatMessage
Body: { lectureId, message }
Response: { messageId }
```

### 4.2 Real-Time Events (WebSocket)

```typescript
// Subscribe to grade updates
student:grade_posted
- Triggered when: Teacher posts grade for assignment/exam

// Subscribe to lecture notifications
student:lecture_reminder
- Triggered when: Lecture starting in 15 minutes

// Subscribe to payment reminders
student:payment_reminder
- Triggered when: Payment due in 3 days

// Subscribe to attendance updates
student:attendance_recorded
- Triggered when: Attendance recorded for lecture

// Subscribe to Q&A updates
student:qa_answered
- Triggered when: Teacher answers student's question

// Subscribe to access status changes
student:access_status_changed
- Triggered when: Access status changes (blocked/unblocked)
```

---

## 5. Notifications & Communications

### 5.1 Email Notifications

| Event | Template | Timing |
|-------|----------|--------|
| Lecture Scheduled | Lecture details + join link | 24h before |
| Lecture Reminder | Join now link | 15 min before |
| Lecture Recording Available | Recording link + transcript | Immediately |
| Assignment Posted | Assignment details + deadline | Immediately |
| Assignment Deadline | Reminder + submission link | 24h before |
| Assignment Graded | Grade + feedback | Immediately |
| Exam Scheduled | Exam details + preparation tips | Immediately |
| Exam Reminder | Join exam link | 24h before |
| Exam Results | Score + results | Immediately |
| Payment Due | Amount + payment link | 7 days before |
| Payment Overdue | Urgent reminder + access warning | Immediately |
| Access Blocked | Reason + resolution steps | Immediately |
| Grade Posted | Course grade + GPA impact | Immediately |

### 5.2 In-App Notifications

- Real-time lecture reminders
- Grade posting alerts
- Payment reminders
- Assignment deadline warnings
- Q&A answered notifications
- Access status changes
- Course announcements

---

## 6. Frontend Implementation Checklist

### Phase 1: Dashboard & Navigation
- [ ] Student dashboard layout
- [ ] Navigation sidebar
- [ ] Quick stats cards
- [ ] Upcoming lectures widget
- [ ] Notifications center
- [ ] User profile menu

### Phase 2: Courses & Lectures
- [ ] Courses list page
- [ ] Course detail page
- [ ] Lectures list page
- [ ] Lecture detail page
- [ ] Materials download
- [ ] Teams integration

### Phase 3: Learning Interactions
- [ ] Q&A component
- [ ] Comments section
- [ ] Chat interface
- [ ] Attendance tracking display
- [ ] Participation tracking

### Phase 4: Assignments & Exams
- [ ] Assignments list
- [ ] Assignment submission form
- [ ] File upload component
- [ ] Exams list
- [ ] Exam eligibility check
- [ ] Exam scheduling

### Phase 5: Grades & Progress
- [ ] Grades page
- [ ] GPA calculation display
- [ ] Attendance page
- [ ] Progress tracking
- [ ] Academic standing indicator

### Phase 6: Finances
- [ ] Financial status display
- [ ] Payment schedule
- [ ] Payment form
- [ ] Payment history
- [ ] Access status indicator

### Phase 7: User Experience
- [ ] Responsive design
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Dark mode support
- [ ] Loading states
- [ ] Error handling
- [ ] Success messages

---

## 7. Design System & UI Patterns

### Color Scheme (Minimalist Scandinavian)
```
Primary: Cool Gray (#E8EAED)
Secondary: Pastel Blue (#B3D9E8)
Accent: Blush Pink (#E8C4D4)
Text: Dark Gray (#2C3E50)
Success: Green (#27AE60)
Warning: Orange (#F39C12)
Error: Red (#E74C3C)
```

### Components
- Course cards
- Lecture cards
- Grade indicators
- Attendance badges
- Status indicators
- Progress bars
- Timeline components
- Modal dialogs
- Toast notifications

---

## 8. Security & Compliance

### Data Protection
- GDPR compliance
- Encryption for sensitive data
- Secure file storage
- Access logs

### Authentication
- JWT token-based auth
- Session management
- 2FA for sensitive operations

### Authorization
- RBAC (Role-Based Access Control)
- Course-level access control
- Financial data protection

---

## 9. Performance Considerations

### Optimization
- Lazy load course materials
- Paginate lecture lists
- Cache grades and attendance
- Optimize video playback
- Minimize re-renders

### Metrics
- Page load time
- Material download speed
- API response time
- Video streaming quality

---

## 10. Testing Strategy

### Unit Tests
- Grade calculation logic
- Attendance percentage calculation
- Payment schedule generation
- Eligibility checks

### Integration Tests
- Course enrollment flow
- Lecture joining
- Assignment submission
- Grade posting

### E2E Tests
- Complete learning journey
- Payment flow
- Exam taking
- Grade viewing

---

## 11. Common Prompts for AI Tools

### For Dashboard:
```
"Create a student dashboard component showing GPA, upcoming lectures, 
deadlines, and financial status with real-time updates."
```

### For Lecture Interface:
```
"Build a lecture page with embedded Teams video, Q&A section, 
comments, chat, and materials download using React and Tailwind CSS."
```

### For Assignments:
```
"Create an assignment submission component with file upload, 
text input, rubric display, and feedback viewing."
```

### For Grades:
```
"Implement a grades page showing course grades, GPA, grade breakdown, 
and progress towards goals with charts."
```

---

**End of Student Role Guide**

---

*For questions or clarifications, contact the Product Owner or Academic Department.*
