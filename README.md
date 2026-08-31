# Uni Hub

Uni Hub is a comprehensive, modern, dark-themed campus management portal designed to streamline university life for students. It consolidates scattered academic tools into a single, cohesive interface built entirely with Vanilla HTML, CSS, and JavaScript.

## Features & Modules

The platform is divided into several highly functional modules:

### 1. Anonymous Student Feedback
Provides a secure space for students to submit complaints and suggestions regarding campus facilities (Library, Canteen, Hostels, etc.) completely anonymously.
- Status tracking timeline (Pending, In Progress, Resolved)
- Anonymity guarantee logic ensuring student IDs and metadata are detached from reviews

### 2. Notes Exchange
A community-driven repository for study materials.
- Browse and download lecture notes, cheat sheets, and past papers by branch, semester, and subject.
- Save notes for quick access later.
- Upload your own materials to contribute to the community.

### 3. Assignment Deadlines
A robust deadline tracker replacing traditional scattered syllabus schedules.
- Automatic urgency calculation (Due Soon, Overdue, Upcoming)
- Visual progress bars for multi-stage assignments
- Integrated monthly calendar displaying deadline hotspots
- Quick-add modal for spontaneous homework tracking

### 4. Professor Appointments
A polished landing page and scheduling system designed to connect students with faculty effortlessly.

### 5. Profile & Settings
- Manage personal details, notifications, and application preferences.

## Technical Architecture

Uni Hub is engineered as a **Hash-based Single Page Application (SPA)**, meaning it never reloads the page. Instead, it dynamically swaps out modular UI blocks based on the URL hash (e.g., `#notes-overview`, `#assignments-all`).

- **Frontend Core:** Pure HTML5, CSS3, and ES6 JavaScript. No bulky frameworks like React or Angular, ensuring lightning-fast load times.
- **State Management & Persistence:** All data (Notes, Assignments, Feedback) is dynamically managed via a centralized mock backend in `data.js`. State mutations are persisted locally to the browser using `localStorage`.
- **Design System:** Custom CSS utilizing a unified Slate dark theme (`#0f172a`), deep shadows, modern border radii, and flexible CSS Grid/Flexbox responsive layouts.
- **Iconography:** Integrated with [Lucide Icons](https://lucide.dev/) for a crisp, lightweight, and modern aesthetic.

## File Structure

- `index.html`: The monolithic DOM structure containing the sidebar, internal navigation, and all hidden view containers (`.app-view`).
- `styles.css`: The comprehensive design system containing variables, global components (buttons, cards, banners), and module-specific styling.
- `data.js`: The mock database containing default seeded arrays and the manager classes (`AssignmentManager`, `NotesManager`) used for CRUD operations with `localStorage`.
- `app.js`: The application brain handling hashchange routing, DOM manipulation, rendering functions, and form submission logic.

## How to Run

Because the application requires no backend or build step, running it is incredibly simple:

1. Clone or download the repository.
2. Open `index.html` directly in any modern web browser.
3. Everything, including data persistence, will work immediately out of the box via `localStorage`.
