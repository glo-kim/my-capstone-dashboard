# BRIEF.md

## Project Title
Healthcare Case Management Dashboard – Care Coordinator View

---

## Overview
This dashboard is designed to help healthcare care coordinators manage patient cases more effectively by providing real-time visibility into case load, patient risk, and required follow-up actions.

The solution is **desktop-first**, supporting high-information-density workflows such as reviewing caseloads and identifying trends. A complementary **mobile experience** allows care coordinators to access essential information and manage cases while on patient visits.

Instead of navigating multiple systems or spreadsheets, the dashboard surfaces the most critical information in one place—helping case managers prioritize their work, identify high-risk patients, and intervene early to prevent negative outcomes such as hospital readmissions.

---

## Target User
**Primary User:** Care Coordinator / Case Manager  
**Environment:** Hospital or healthcare system (care management or discharge team)

---

## User Goals
- Prioritize patients who need immediate follow-up
- Identify high-risk patients (e.g., risk of readmission)
- Track progress of active cases
- Ensure timely communication and care coordination
- Balance workload effectively across cases

---

## Key Questions the Dashboard Answers
- Which patients need attention right now?
- Which cases are at risk (missed follow-up, high-risk conditions)?
- What is my current caseload and status breakdown?
- Are there overdue actions I need to complete today?
- Are patients progressing toward their care goals?

---

## Device Strategy

### Desktop (Primary Experience)
- Used for full workflow visibility and planning
- Displays complete caseload, trends, and risk signals
- Multi-panel layout for scanning and prioritization

### Mobile (Supporting Experience)
- Used during patient visits or on-the-go
- Focuses on:
  - Viewing assigned patients
  - Updating case status
  - Logging notes and actions

👉 **Desktop = Awareness + Planning**  
👉 **Mobile = Action + Execution**

---

## Core Features

### Case Visibility
- Active case overview
- Case status breakdown (open, in progress, closed)
- Patient assignment visibility

### Risk Identification
- High-risk patient detection
- Missed follow-ups and overdue actions
- Time-based risk signals (e.g., no contact in X days)

### Activity Tracking
- Calls, visits, and follow-ups
- Patient engagement indicators
- Service utilization tracking

### Outcomes Monitoring
- Goals achieved
- Barriers resolved
- Readmission indicators

### Alerts & Action Feed
- Real-time alerts for critical issues
- Prioritized task list
- Escalation indicators

---

## Layout

### Desktop Layout (Multi-Panel)
- **Top:** KPI summary (high-level overview)
- **Left column:** Caseload breakdown and activity metrics
- **Center:** Risk & priority panel (primary focus)
- **Right column:** Alerts and filters

👉 Designed for scanning and prioritization across many patients

### Mobile Layout (Single-Column)
- Priority case surfaced at top
- Scrollable list of assigned cases
- Action buttons (log visit, update status)
- Lightweight alerts

👉 Designed for quick actions, not deep analysis

---

## Interaction

### Desktop Interactions
- Filtering by case status and risk level
- Hover states for contextual details
- Drill-down into patient or case details

### Mobile Interactions
- Tap to expand case details
- Quick actions (update, log, complete)
- Minimal navigation depth

### System Feedback
- Visual alerts (color-coded risk)
- Status changes reflected immediately
- Empty states when no action is needed

---

## Styling

### Visual Principles
- Clean, structured, grid-based layout
- High contrast for readability in healthcare settings
- Minimal clutter to reduce cognitive load

### Color Usage
- Red = high risk / urgent
- Yellow = warning / needs attention
- Green = stable / completed
- Neutral tones for baseline UI

### Components
- KPI cards for quick scanning
- Data tables for case details
- Alert banners for urgent issues
- Chips/tags for status and risk labeling

---

## Technical Approach

### Frontend
- Component-based architecture (cards, panels, tables)
- Responsive layout (desktop-first with mobile adaptation)

### Data
- Mock JSON dataset simulating:
  - Cases
  - Patients
  - Activities
  - Outcomes

### Key Components
- KPI summary cards
- Risk list (table or list view)
- Alerts panel
- Filters and search

### Deployment
- Hosted on Vercel
- Optimized for quick load and responsiveness

---

## Core Value Proposition
This dashboard transforms fragmented case management data into a clear, actionable view—helping care coordinators act faster, reduce risk, and improve patient outcomes.

---

## Design Principles

- **Action over information:** Highlight what needs attention now
- **Clear hierarchy:** Guide attention using layout and color
- **Real-time awareness:** Surface time-sensitive issues
- **Low cognitive load:** Simplify complex workflows
- **Context-aware design:** Adapt to desktop vs mobile usage

---

## Success Criteria

- Users can immediately identify high-priority patients
- Risk signals are clearly surfaced without searching
- Core workflows (review → prioritize → act) are supported
- Mobile enables efficient updates during patient visits
- The dashboard feels realistic to healthcare operations

---

## Future Considerations

- Integration with EHR systems
- Predictive risk scoring (AI-driven)
- Team-level dashboards for supervisors
- Offline mobile support for field use