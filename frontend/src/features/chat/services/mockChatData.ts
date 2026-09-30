import type { Conversation } from "../types/conversation.types"
import type { Message } from "../types/message.types"

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "BCA Semester 5 Syllabus & Exam Pattern",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    lastMessagePreview: "Here is the breakdown for Java & Python course modules...",
    isShared: true,
    shareToken: "share-bca-s5",
  },
  {
    id: "conv-2",
    title: "Hostel Gate Timings and Weekend Passes",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    lastMessagePreview: "Hostel gates close strictly at 9:30 PM on weekdays.",
  },
  {
    id: "conv-3",
    title: "Campus Placement Drive Eligibility Criteria",
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    lastMessagePreview: "Students with a minimum 6.5 CGPA and no active backlogs are eligible.",
  },
  {
    id: "conv-4",
    title: "Central Library Overdue Books & Renewal",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastMessagePreview: "Standard issue duration is 14 days with 1 online renewal.",
  },
]

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-101",
      conversationId: "conv-1",
      sender: "user",
      content: "Can you provide the syllabus summary for BCA Semester 5, specifically for Python and Web Development?",
      timestamp: "09:15 AM",
      status: "sent",
    },
    {
      id: "msg-102",
      conversationId: "conv-1",
      sender: "assistant",
      content: `### BCA Semester 5 — Core Course Outline

Here is the approved university syllabus overview for **Python & Web Technologies**:

#### 1. Python Programming
* **Unit 1:** Advanced Data Structures, Comprehensions, and Generators
* **Unit 2:** Object-Oriented Design, Inheritance, and Custom Exceptions
* **Unit 3:** File I/O, Serialization (JSON, Pickle), and SQLite3
* **Unit 4:** Web Frameworks introduction (FastAPI / Flask)

#### 2. Web Development Lab
* Responsive UI with modern CSS and Flexbox/Grid
* RESTful API integration and Async fetch operations
* State management and component lifecycles

\`\`\`python
# Example: Fast-check database session
from sqlalchemy import create_engine
engine = create_engine("sqlite:///bca_lab.db")
print("Database connected successfully")
\`\`\`

*Internal tests are scheduled for the 3rd week of next month.* Let me know if you would like previous year question papers or reference textbook recommendations.`,
      timestamp: "09:16 AM",
      status: "sent",
    },
  ],
  "conv-2": [
    {
      id: "msg-201",
      conversationId: "conv-2",
      sender: "user",
      content: "What are the hostel closing hours and how do I apply for an outstation weekend pass?",
      timestamp: "03:40 PM",
      status: "sent",
    },
    {
      id: "msg-202",
      conversationId: "conv-2",
      sender: "assistant",
      content: `**Hostel Gate Timings & Leave Regulations:**

1. **Daily Curfew:**
   - **Weekdays (Mon–Fri):** 09:30 PM
   - **Weekends (Sat–Sun):** 10:00 PM

2. **Weekend Leave Pass Process:**
   - Submit your request on the **Student ERP Portal** under *Hostel Services → Outstation Pass* at least **24 hours prior** to departure.
   - Guardian SMS/Email verification is mandatory for approval.
   - Physical sign-out at the main security desk before 08:00 PM on Friday.`,
      timestamp: "03:41 PM",
      status: "sent",
    },
  ],
}
