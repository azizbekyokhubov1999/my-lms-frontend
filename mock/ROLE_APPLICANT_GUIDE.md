# ROLE: APPLICANT (Абитуриент) - Frontend Development Guide

**Last Updated:** March 6, 2026**Version:** 1.0**Status:** Ready for Implementation

---

## 1. Role Overview

### Purpose

The Applicant role represents a prospective student who is applying for admission to the university. This role is critical for the entire admission pipeline and serves as the entry point to the LMS platform.

### Key Objectives

- Submit application with personal information

- Upload required documents for verification

- Schedule and take entrance exam with proctoring

- Track admission status in real-time

- Receive notifications about admission decisions

- Transition to Student role upon successful enrollment

### Business Value

- Automates 70%+ of manual admission operations

- Provides transparent, traceable admission process

- Reduces admission cycle time from weeks to days

- Enables global scalability for international students

---

## 2. User Journey & Workflows

### 2.1 Complete Admission Pipeline (End-to-End)

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICANT ADMISSION FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. REGISTRATION                                                 │
│     ├─ Create account (email/phone verification)                │
│     ├─ Fill personal information                                │
│     └─ Status: Applied                                          │
│                                                                   │
│  2. DOCUMENT UPLOAD                                              │
│     ├─ Upload required documents (passport, diploma, etc.)      │
│     ├─ System validates format/size/readability                │
│     ├─ Anti-fraud checks (duplicates, re-submissions)          │
│     └─ Status: DocsPending → DocsInReview                      │
│                                                                   │
│  3. DOCUMENT VERIFICATION                                        │
│     ├─ Academic Department reviews documents                    │
│     ├─ Verification decision: Verified or RejectedDocs         │
│     └─ Status: Verified or RejectedDocs                        │
│                                                                   │
│  4. EXAM SCHEDULING                                              │
│     ├─ System offers available exam slots                       │
│     ├─ Applicant selects preferred slot                        │
│     └─ Status: ExamScheduled                                   │
│                                                                   │
│  5. EXAM TAKING                                                  │
│     ├─ Pre-check (camera, microphone, identity verification)   │
│     ├─ Proctored exam via Classmate                            │
│     ├─ Video recording + telemetry collection                  │
│     └─ Status: ExamInProgress → ExamCompleted                 │
│                                                                   │
│  6. RESULT & DECISION                                            │
│     ├─ Automatic scoring                                        │
│     ├─ Fraud detection analysis                                │
│     ├─ Decision: Passed or Failed                              │
│     └─ Status: Enrolled or RejectedExam                        │
│                                                                   │
│  7. ENROLLMENT (if Passed)                                       │
│     ├─ Student account created                                 │
│     ├─ Assigned to program/group                               │
│     ├─ Access to courses granted                               │
│     └─ Transition to STUDENT role                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Detailed Status Lifecycle

| Status | Description | Applicant Can Do | System Actions |
| --- | --- | --- | --- |
| **Applied** | Application submitted | View status, upload docs | Send confirmation email |
| **DocsPending** | Awaiting document upload | Upload docs, view requirements | Set deadline reminder |
| **DocsInReview** | Documents under review | Wait, view upload history | Academic Dept reviews |
| **Verified** | Documents accepted | Schedule exam, view decision | Offer exam slots |
| **ExamScheduled** | Exam slot confirmed | View exam details, prepare | Send pre-exam reminder |
| **ExamInProgress** | Exam is being taken | Take exam | Record session, collect telemetry |
| **ExamCompleted** | Exam finished | Wait for results | Score exam, analyze for fraud |
| **Passed** | Exam passed, ready to enroll | Access student portal | Create student account, grant access |
| **Failed** | Exam failed | View score, appeal, reschedule | Offer retake options |
| **UnderReview** | Suspicious activity detected | Wait for investigation | AQAD/Academic Dept investigates |
| **RejectedDocs** | Documents rejected | Resubmit corrected docs | Send rejection reason + checklist |
| **RejectedExam** | Exam rejected (fraud/violation) | Appeal or reapply | Notify of violation |
| **Enrolled** | Successfully enrolled | Access student features | Transition to STUDENT role |

---

## 3. Frontend Components & Pages

### 3.1 Page Structure

```
/admission/
├── /admission/register/
│   └── RegisterPage.tsx
├── /admission/documents/
│   └── DocumentUploadPage.tsx
├── /admission/exam-schedule/
│   └── ExamSchedulePage.tsx
├── /admission/exam-take/
│   └── ExamTakingPage.tsx
├── /admission/status/
│   └── AdmissionStatusPage.tsx
└── /admission/dashboard/
    └── ApplicantDashboard.tsx
```

### 3.2 Key Components

#### 1. **Registration Page** (`RegisterPage.tsx`)

**Purpose:** First entry point for new applicants

**Key Fields:**

```typescript
interface RegistrationForm {
  email: string;              // Unique, verified
  phone: string;              // Unique, verified
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  nationality: string;
  passportNumber: string;     // Unique
  appliedProgram: string;     // Select from dropdown
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}
```

**Features:**

- Email/phone uniqueness validation

- Password strength indicator

- Terms & conditions acceptance

- Multi-language support

- Responsive design for mobile

**Validation Rules:**

```
- Email: valid format + unique
- Phone: valid format + unique
- Password: min 8 chars, uppercase, lowercase, number, special char
- Date of Birth: age ≥ 18 years
- All fields required
```

**Success Flow:**

1. Account created

1. Verification email sent

1. Redirect to email verification page

1. After verification → Document upload page

**Error Handling:**

```
- Email already registered → Suggest login or account recovery
- Phone already registered → Suggest alternative
- Weak password → Show requirements
- Invalid input → Show field-specific errors
```

---

#### 2. **Document Upload Page** (`DocumentUploadPage.tsx`)

**Purpose:** Collect required documents for verification

**Required Documents:**

```typescript
interface DocumentUpload {
  documentType: 'passport' | 'diploma' | 'transcript' | 'certificate' | 'other';
  fileName: string;
  fileSize: number;           // Max 10MB
  uploadedAt: Date;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  rejectionReason?: string;
}
```

**Features:**

- Drag-and-drop file upload

- File type validation (PDF, JPG, PNG)

- File size validation (max 10MB per file)

- Progress bar during upload

- Uploaded files list with status

- Retry failed uploads

- Download uploaded files

**Validation Rules:**

```
- File types: PDF, JPG, PNG only
- Max file size: 10MB
- Min resolution for images: 300x300px
- Document must be readable (OCR check)
- Anti-fraud: check for duplicates
```

**UI Elements:**

```tsx
// Drag-and-drop zone
<DragDropZone
  onDrop={handleFileDrop}
  acceptedFormats={['pdf', 'jpg', 'png']}
  maxSize={10 * 1024 * 1024}
/>

// Uploaded files list
<DocumentList
  documents={uploadedDocuments}
  onRetry={retryUpload}
  onDelete={deleteDocument}
/>

// Status indicator
<StatusBadge
  status={verificationStatus}
  message={rejectionReason}
/>
```

**Status Transitions:**

- Upload → Pending → Verified/Rejected

- If Rejected → Show reason + correction checklist

- If Verified → Enable exam scheduling

---

#### 3. **Exam Schedule Page** (`ExamSchedulePage.tsx`)

**Purpose:** Allow applicant to select preferred exam slot

**Data Structure:**

```typescript
interface ExamSlot {
  slotId: string;
  examDate: Date;
  examTime: string;           // HH:MM format
  durationMinutes: number;    // e.g., 120
  availableSeats: number;
  proctorName?: string;
  location: string;           // Online/Room
}

interface ExamSession {
  sessionId: string;
  applicantId: string;
  slotId: string;
  status: 'scheduled' | 'in_progress' | 'completed';
  scheduledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  passingScore: number;
}
```

**Features:**

- Display available exam slots in calendar view

- Filter by date/time preference

- Show slot details (date, time, duration, proctor)

- Confirm slot selection

- Send confirmation email

- Allow rescheduling (if allowed by policy)

**UI Elements:**

```tsx
// Calendar view
<CalendarView
  slots={availableSlots}
  onSelectSlot={handleSlotSelection}
/>

// Slot details
<SlotDetails
  slot={selectedSlot}
  onConfirm={confirmSlot}
  onCancel={cancelSelection}
/>

// Confirmation
<ConfirmationDialog
  message="Confirm exam slot?"
  onConfirm={submitConfirmation}
/>
```

**Business Rules:**

- Minimum 24 hours before exam to schedule

- Maximum 7 days advance booking

- Can reschedule up to 24 hours before exam

- Cancellation refund policy applies

---

#### 4. **Exam Taking Page** (`ExamTakingPage.tsx`)

**Purpose:** Conduct proctored exam within LMS

**Key Features:**

- Pre-exam checklist (camera, microphone, lighting)

- Identity verification (photo ID + face recognition)

- Exam timer

- Question navigation

- Submit answers

- Proctor monitoring integration

**Pre-Exam Checklist:**

```typescript
interface PreExamCheck {
  cameraWorking: boolean;
  microphoneWorking: boolean;
  internetStable: boolean;
  identityVerified: boolean;
  environmentClear: boolean;
  allChecksPassed: boolean;
}
```

**Exam Interface:**

```tsx
// Pre-exam screen
<PreExamChecklist
  onCheckComplete={handleCheckComplete}
  onFailure={handleCheckFailure}
/>

// Exam screen
<ExamInterface
  questions={examQuestions}
  timeRemaining={timeRemaining}
  currentQuestion={currentQuestion}
  onAnswerChange={handleAnswerChange}
  onSubmit={submitExam}
/>

// Proctor monitoring
<ProctorMonitoring
  cameraFeed={cameraStream}
  screenShare={screenShare}
  telemetry={telemetryData}
/>
```

**Proctoring Integration (Classmate):**

- Video recording of exam session

- Screen recording

- Webcam monitoring

- Microphone monitoring

- Keyboard/mouse activity tracking

- Anomaly detection (suspicious behavior)

**Edge Cases Handling:**

```
- Internet disconnection: Auto-pause, allow reconnect within 5 min
- Camera/mic failure: Prevent exam start
- Suspicious activity detected: Flag for review, continue exam
- Exam timeout: Auto-submit current answers
- Browser tab switch: Warning, then block if repeated
```

---

#### 5. **Admission Status Page** (`AdmissionStatusPage.tsx`)

**Purpose:** Track admission progress and view decisions

**Features:**

- Timeline view of admission stages

- Current status display with progress

- Document verification status

- Exam schedule and results

- Final decision display

- Download decision letter

- Appeal option (if applicable)

**Status Timeline:**

```tsx
<StatusTimeline
  stages={[
    { stage: 'Application', status: 'completed', date: '2026-03-01' },
    { stage: 'Documents', status: 'in_progress', date: '2026-03-05' },
    { stage: 'Exam', status: 'pending', date: null },
    { stage: 'Decision', status: 'pending', date: null },
  ]}
/>
```

**Display Elements:**

- Current status badge

- Next action required (if any)

- Deadline for next step

- Document verification details

- Exam results (if completed)

- Decision letter (if available)

---

#### 6. **Applicant Dashboard** (`ApplicantDashboard.tsx`)

**Purpose:** Central hub for applicant activities

**Key Sections:**

```typescript
interface ApplicantDashboard {
  admissionStatus: AdmissionStatus;
  nextAction: NextAction;
  timeline: Timeline;
  notifications: Notification[];
  documents: Document[];
  examDetails?: ExamSession;
  faq: FAQ[];
}
```

**Dashboard Layout:**

```
┌─────────────────────────────────────────────┐
│ Welcome, [Name]!                            │
│ Your admission status: [Status Badge]       │
├─────────────────────────────────────────────┤
│ NEXT ACTION                                 │
│ ├─ Action: [Upload Documents/Schedule Exam]│
│ └─ Deadline: [Date]                        │
├─────────────────────────────────────────────┤
│ TIMELINE                                    │
│ ├─ ✓ Application Submitted                 │
│ ├─ ⏳ Documents Under Review                │
│ ├─ ○ Exam Scheduled                        │
│ └─ ○ Decision Pending                      │
├─────────────────────────────────────────────┤
│ RECENT NOTIFICATIONS                        │
│ ├─ "Documents received"                    │
│ ├─ "Exam slot available"                   │
│ └─ "New message from admissions"           │
├─────────────────────────────────────────────┤
│ QUICK ACTIONS                               │
│ ├─ [Upload Documents]                      │
│ ├─ [Schedule Exam]                         │
│ ├─ [View Status]                           │
│ └─ [Contact Support]                       │
└─────────────────────────────────────────────┘
```

---

## 4. API Integration Points

### 4.1 Backend API Endpoints (tRPC Procedures)

```typescript
// Registration
POST /api/trpc/applicant.register
Body: {
  email, phone, firstName, lastName, dateOfBirth,
  nationality, passportNumber, appliedProgram, password
}

// Document Upload
POST /api/trpc/applicant.uploadDocument
Body: FormData with file + documentType

// Get Documents
GET /api/trpc/applicant.getDocuments
Response: Document[]

// Get Available Exam Slots
GET /api/trpc/applicant.getExamSlots
Query: { programId, dateFrom, dateTo }

// Schedule Exam
POST /api/trpc/applicant.scheduleExam
Body: { slotId }

// Get Exam Session
GET /api/trpc/applicant.getExamSession
Response: ExamSession

// Get Admission Status
GET /api/trpc/applicant.getAdmissionStatus
Response: AdmissionStatus

// Submit Appeal
POST /api/trpc/applicant.submitAppeal
Body: { reason, description }
```

### 4.2 Real-Time Events (WebSocket)

```typescript
// Subscribe to status changes
applicant:status_changed
- Triggered when: Documents verified, exam scheduled, decision made

// Subscribe to notifications
applicant:notification_received
- Triggered when: New message, deadline approaching, status update
```

---

## 5. Notifications & Communications

### 5.1 Email Notifications

| Event | Template | Recipient | Timing |
| --- | --- | --- | --- |
| Registration Successful | Welcome email + verification link | Applicant | Immediate |
| Email Verified | Account activated | Applicant | Immediate |
| Documents Received | Confirmation of upload | Applicant | Immediate |
| Documents Verified | Ready for exam scheduling | Applicant | Immediate |
| Documents Rejected | Rejection reason + checklist | Applicant | Immediate |
| Exam Scheduled | Exam details + preparation tips | Applicant | Immediate |
| Exam Reminder | 24 hours before exam | Applicant | 24h before |
| Exam Completed | Results pending | Applicant | Immediate |
| Decision Made | Passed/Failed + next steps | Applicant | Immediate |
| Enrolled | Welcome to student portal | Applicant | Immediate |

### 5.2 In-App Notifications

- Real-time status updates

- Deadline reminders

- Document rejection alerts

- Exam scheduling confirmations

- Decision announcements

---

## 6. Frontend Implementation Checklist

### Phase 1: Registration & Authentication

- [ ] Registration form with validation

- [ ] Email verification flow

- [ ] Password reset functionality

- [ ] Login/logout

- [ ] Session management

- [ ] Remember me option

### Phase 2: Document Management

- [ ] File upload component

- [ ] Drag-and-drop functionality

- [ ] File validation (type, size, format)

- [ ] Upload progress tracking

- [ ] Document list display

- [ ] Document deletion

- [ ] Retry failed uploads

### Phase 3: Exam Scheduling

- [ ] Calendar/slot selection UI

- [ ] Slot details display

- [ ] Booking confirmation

- [ ] Reschedule functionality

- [ ] Exam preparation checklist

### Phase 4: Exam Taking

- [ ] Pre-exam checks (camera, mic, internet)

- [ ] Identity verification UI

- [ ] Exam interface (questions, timer, navigation)

- [ ] Proctoring integration

- [ ] Anomaly detection alerts

- [ ] Submit exam functionality

### Phase 5: Status Tracking

- [ ] Status timeline display

- [ ] Real-time status updates

- [ ] Notification center

- [ ] Document status tracking

- [ ] Exam results display

- [ ] Decision letter download

### Phase 6: User Experience

- [ ] Responsive design (mobile, tablet, desktop)

- [ ] Accessibility (WCAG 2.1 AA)

- [ ] Multi-language support

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

### Typography

```
Headings: Bold sans-serif (Montserrat, Poppins)
Body: Regular sans-serif (Inter, Roboto)
Subtitles: Thin sans-serif
```

### Components

- Status badges (Applied, Verified, Scheduled, etc.)

- Progress indicators

- Timeline visualization

- File upload zones

- Modal dialogs

- Toast notifications

- Loading skeletons

---

## 8. Security & Compliance

### Data Protection

- GDPR compliance for personal data

- Encryption for sensitive fields (passport, phone)

- Secure file storage

- Access logs and audit trails

### Anti-Fraud Measures

- Duplicate document detection

- IP address tracking

- Device fingerprinting

- Behavioral analysis

- Unusual activity alerts

### Authentication & Authorization

- JWT token-based auth

- 2FA for sensitive operations

- Session timeout (30 min inactivity)

- RBAC (Role-Based Access Control)

---

## 9. Performance Considerations

### Optimization

- Lazy load document list

- Compress uploaded images

- Cache exam slot data

- Optimize form validation

- Minimize re-renders

### Metrics to Track

- Page load time

- Form submission time

- File upload speed

- API response time

- User session duration

---

## 10. Testing Strategy

### Unit Tests

- Form validation logic

- Date/time calculations

- File type validation

- Status transitions

### Integration Tests

- Registration flow

- Document upload

- Exam scheduling

- Status tracking

### E2E Tests

- Complete admission pipeline

- Error scenarios

- Edge cases (network failures, etc.)

### User Acceptance Testing

- Real applicants test the flow

- Feedback collection

- Usability improvements

---

## 11. Common Prompts for AI Tools (Cursor, Copilot)

### For Component Generation:

```
"Create a React component for applicant registration form with 
email, phone, password validation, and error handling. Use 
Tailwind CSS for styling and React Hook Form for state management."
```

### For API Integration:

```
"Write a tRPC hook to handle applicant registration with error 
handling, loading states, and success notifications."
```

### For Document Upload:

```
"Implement a drag-and-drop file upload component that validates 
file type (PDF, JPG, PNG) and size (max 10MB), shows progress bar, 
and displays uploaded files list."
```

### For Exam Scheduling:

```
"Create a calendar component showing available exam slots with 
filtering by date/time, slot details display, and booking confirmation."
```

---

## 12. Troubleshooting Guide

### Common Issues

| Issue | Cause | Solution |
| --- | --- | --- |
| File upload fails | File too large or wrong format | Validate before upload, show error message |
| Exam pre-check fails | Camera/mic not working | Guide user through troubleshooting steps |
| Status not updating | WebSocket connection lost | Implement reconnection logic with exponential backoff |
| Exam timeout | Network latency | Auto-save answers periodically |
| Document rejected | Quality issues | Show specific rejection reason with correction checklist |

---

## 13. Future Enhancements

- AI-powered document verification

- Automated essay scoring

- Interview scheduling integration

- Video submission for motivation letter

- Social login (Google, Microsoft)

- Mobile app version

- Blockchain diploma verification

---

**End of Applicant Role Guide**

---

*For questions or clarifications, contact the Product Owner or AQAD team.*

