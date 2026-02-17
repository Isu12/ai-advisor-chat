

# SLIIT AI Academic & Elective Advisor — Implementation Plan

## Overview
A modern, professional chatbot interface for SLIIT university students to get AI-powered academic and elective recommendations based on their profile (GPA, faculty, strengths, career interests, etc.).

---

## 1. Page Layout & Styling
- Full-screen layout with the uploaded SLIIT campus photo as a fixed background image (with a dark overlay for readability)
- Glassmorphism-styled central container (frosted glass effect with backdrop blur, subtle border, rounded corners)
- Professional academic color theme: navy blue, white, soft greys
- Google Font: Inter or Poppins for clean, accessible typography
- Smooth transitions and soft shadows throughout

## 2. Top Navigation Bar
- University logo (uploaded SLIIT shield logo) on the left
- App title: **"SLIIT AI Academic & Elective Advisor"** centered or beside the logo
- Clean, slim navbar with a subtle glass/shadow effect

## 3. Student Profile Form (Input Section)
A structured form displayed above the chat area with the following fields:
- **GPA** — number input (step 0.01, range 0–4)
- **Faculty** — dropdown: Faculty of Computing, Faculty of Engineering, Faculty of Business
- **Strong Subjects** — text input
- **Weak Subjects** — text input
- **Career Interest** — dropdown: AI, Data Science, Cybersecurity, Software Engineering, DevOps, General IT
- **Preferred Difficulty** — dropdown: Low, Moderate, High
- **"Get Recommendation"** button — styled navy blue, rounded, with hover effect
- Form validation to ensure required fields are filled before submission

## 4. Chat Window
- Scrollable message area below the form
- **Student messages** — right-aligned bubbles (blue/navy)
- **AI responses** — left-aligned bubbles (light grey/white) with markdown rendering support
- Timestamps displayed under each message
- Loading indicator while waiting for AI response
- Welcome message on initial load

## 5. API Integration (Ready to Connect)
- On form submit, a JSON payload is constructed with all form fields and sent via `POST /recommend`
- The student's input is shown as a right-aligned chat message summarizing their profile
- The AI response from the API is displayed as a left-aligned chat bubble
- Error handling with user-friendly messages if the API is unreachable
- Currently will use a mock/placeholder response since no backend is connected yet

## 6. Footer
- Small footer at the bottom: **"Powered by Generative AI | SLIIT Academic Prototype"**
- Subtle, non-intrusive styling

## 7. Responsive Design
- Fully responsive — works on desktop, tablet, and mobile
- Form fields stack vertically on smaller screens
- Chat container adapts to available space

