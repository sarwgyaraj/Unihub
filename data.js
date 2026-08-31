// Existing Feedback Data
let feedbackData = [
    { id: "FB-8K42Q", category: "Library", area: "Study Spaces", preview: "More quiet study spaces are needed during evening hours.", status: "In Progress", severity: "Concern", rating: 3, createdAt: "2026-08-28T10:00:00Z", timeline: [{ date: "2026-08-28T10:00:00Z", desc: "Feedback Submitted Anonymously" }, { date: "2026-08-30T14:30:00Z", desc: "Status changed to In Progress" }] },
    { id: "FB-9L21P", category: "Hostel", area: "Wi-Fi", preview: "Internet connectivity is inconsistent in the hostel.", status: "Under Review", severity: "Serious", rating: 2, createdAt: "2026-08-29T11:00:00Z", timeline: [{ date: "2026-08-29T11:00:00Z", desc: "Feedback Submitted Anonymously" }] },
    { id: "FB-4A17C", category: "Faculty", area: "Teaching", preview: "More practice problems would be helpful before examinations.", status: "Resolved", severity: "General", rating: 4, createdAt: "2026-08-27T15:20:00Z", timeline: [{ date: "2026-08-27T15:20:00Z", desc: "Feedback Submitted Anonymously" }, { date: "2026-08-30T16:00:00Z", desc: "Status changed to Resolved. Practice sheets added." }] },
    { id: "FB-7C62M", category: "Canteen", area: "Food Quality", preview: "The hygiene standard has improved recently, thank you.", status: "Resolved", severity: "Concern", rating: 4, createdAt: "2026-08-30T09:10:00Z", timeline: [{ date: "2026-08-30T09:10:00Z", desc: "Feedback Submitted Anonymously" }, { date: "2026-08-30T10:00:00Z", desc: "Status changed to Resolved." }] }
];

let notificationData = [
    { id: "notif-1", title: "Feedback Update", message: "Your feedback FB-8K42Q is now In Progress.", time: "2 hours ago", link: "#feedback/FB-8K42Q" },
    { id: "notif-2", title: "Feedback Resolved", message: "Your feedback FB-4A17C has been marked as resolved.", time: "Yesterday", link: "#feedback/FB-4A17C" }
];

let updatesData = [
    { status: "Resolved", message: "FB-4A17C was marked Resolved", time: "2 hours ago", link: "#feedback/FB-4A17C" },
    { status: "In Progress", message: "FB-8K42Q moved to In Progress", time: "Yesterday", link: "#feedback/FB-8K42Q" }
];


// --- NEW: NOTES EXCHANGE DATA ---

const defaultNotesData = [
    { id: "NOTE-001", title: "Trees & Graphs — Unit 3", description: "Complete notes covering binary trees, BST, AVL trees and graph traversal.", subject: "Data Structures", branch: "CSE", semester: 2, type: "Lecture Notes", fileType: "PDF", pages: 18, rating: 4.7, downloads: 128, saves: 42, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-28T10:00:00Z", uploader: "system" },
    { id: "NOTE-002", title: "Process Management", description: "Detailed notes on processes, threads, CPU scheduling, and deadlocks.", subject: "Operating Systems", branch: "CSE", semester: 4, type: "Revision Notes", fileType: "PDF", pages: 22, rating: 4.8, downloads: 94, saves: 31, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-25T14:20:00Z", uploader: "system" },
    { id: "NOTE-003", title: "SQL & Normalization", description: "Quick revision sheet for SQL commands and Database Normalization (1NF to BCNF).", subject: "Database Management", branch: "CSE", semester: 3, type: "Cheat Sheet", fileType: "PDF", pages: 16, rating: 4.6, downloads: 87, saves: 28, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-27T09:15:00Z", uploader: "system" },
    { id: "NOTE-004", title: "Integration & Differential Equations", description: "Engineering Mathematics II solved examples and formulas.", subject: "Engineering Mathematics", branch: "Mechanical", semester: 2, type: "Handwritten Notes", fileType: "PDF", pages: 25, rating: 4.5, downloads: 76, saves: 19, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-20T11:45:00Z", uploader: "system" },
    { id: "NOTE-005", title: "OSI & TCP/IP", description: "Comprehensive comparison and breakdown of network layers.", subject: "Computer Networks", branch: "ECE", semester: 5, type: "Lecture Notes", fileType: "DOCX", pages: 20, rating: 4.8, downloads: 112, saves: 55, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-29T16:30:00Z", uploader: "system" },
    { id: "NOTE-006", title: "Logic Gates & Boolean Algebra", description: "Digital Electronics Unit 1 basics with truth tables.", subject: "Digital Electronics", branch: "ECE", semester: 3, type: "Lecture Notes", fileType: "PDF", pages: 14, rating: 4.4, downloads: 61, saves: 12, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-22T08:00:00Z", uploader: "system" },
    { id: "NOTE-007", title: "Dynamic Programming Guide", description: "Step-by-step solutions to classical DP problems (Knapsack, LCS, Matrix Chain).", subject: "Algorithms", branch: "CSE", semester: 4, type: "Study Material", fileType: "PDF", pages: 30, rating: 4.9, downloads: 210, saves: 89, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-15T10:00:00Z", uploader: "system" },
    { id: "NOTE-008", title: "Quantum Mechanics Basics", description: "First year engineering physics notes on Schrödinger equations.", subject: "Physics", branch: "Civil", semester: 1, type: "Lecture Notes", fileType: "PDF", pages: 12, rating: 4.2, downloads: 45, saves: 8, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-18T13:20:00Z", uploader: "system" },
    { id: "NOTE-009", title: "8085 Architecture", description: "Pin diagrams and instruction sets for 8085 Microprocessor.", subject: "Microprocessors", branch: "ECE", semester: 5, type: "Handwritten Notes", fileType: "Image", pages: 8, rating: 4.3, downloads: 58, saves: 15, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-26T09:00:00Z", uploader: "system" },
    { id: "NOTE-010", title: "React & Node.js Crash Course", description: "MERN stack basics, components, hooks, and express routing.", subject: "Web Technologies", branch: "CSE", semester: 6, type: "Study Material", fileType: "PDF", pages: 40, rating: 4.8, downloads: 185, saves: 72, contributor: "Anonymous Student", status: "Published", createdAt: "2026-08-30T17:15:00Z", uploader: "system" }
];

// Persistence Logic using LocalStorage
function getStoredItem(key, defaultValue) {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
}

function setStoredItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Load data
let userNotes = getStoredItem('userNotes', []);
let savedNoteIds = getStoredItem('savedNoteIds', []);

// Merge default notes and user uploaded notes
let allNotesData = [...defaultNotesData, ...userNotes];

// Helper functions to interact with Notes Data
const NotesManager = {
    getAllNotes: () => allNotesData,
    
    getPublishedNotes: () => allNotesData.filter(n => n.status === "Published"),
    
    getNoteById: (id) => allNotesData.find(n => n.id === id),
    
    getSavedNotes: () => allNotesData.filter(n => savedNoteIds.includes(n.id)),
    
    getUserUploads: () => userNotes,
    
    isSaved: (id) => savedNoteIds.includes(id),
    
    toggleSaveNote: (id) => {
        if (savedNoteIds.includes(id)) {
            savedNoteIds = savedNoteIds.filter(savedId => savedId !== id);
        } else {
            savedNoteIds.push(id);
        }
        setStoredItem('savedNoteIds', savedNoteIds);
        return savedNoteIds.includes(id);
    },
    
    uploadNote: (noteData) => {
        const newNote = {
            id: "NOTE-USR-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
            ...noteData,
            rating: 0,
            downloads: 0,
            saves: 0,
            contributor: "Anonymous Student",
            status: "Pending Review",
            createdAt: new Date().toISOString(),
            uploader: "user"
        };
        
        userNotes.unshift(newNote);
        allNotesData = [...defaultNotesData, ...userNotes];
        setStoredItem('userNotes', userNotes);
        
        return newNote;
    },
    
    recordDownload: (id) => {
        const note = allNotesData.find(n => n.id === id);
        if (note) {
            note.downloads += 1;
            // In a real app we'd persist this, but for the mock it's fine to just increment memory
            // unless it's a user note
            if (note.uploader === "user") {
                setStoredItem('userNotes', userNotes);
            }
        }
    }
};


// ==========================================
// ASSIGNMENT DEADLINES DATA
// ==========================================

// Calculate dynamic dates based on today for realistic mock data
const today = new Date();
const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(23, 59, 0, 0);
const in3Days = new Date(today); in3Days.setDate(in3Days.getDate() + 3); in3Days.setHours(23, 59, 0, 0);
const in5Days = new Date(today); in5Days.setDate(in5Days.getDate() + 5); in5Days.setHours(23, 59, 0, 0);
const in7Days = new Date(today); in7Days.setDate(in7Days.getDate() + 7); in7Days.setHours(23, 59, 0, 0);
const past2Days = new Date(today); past2Days.setDate(past2Days.getDate() - 2); past2Days.setHours(23, 59, 0, 0);

const defaultAssignmentsData = [
    {
        id: "ASN-001",
        title: "Assignment 03 — Binary Trees",
        subject: "Data Structures",
        description: "Implement binary tree traversal algorithms and analyze their time complexity.",
        dueDate: tomorrow.toISOString(),
        priority: "High",
        progress: 80,
        status: "Due Tomorrow",
        completed: false,
        instructor: "Dr. Ananya Sharma",
        assignedDate: new Date(today.getTime() - 7*24*60*60*1000).toISOString()
    },
    {
        id: "ASN-002",
        title: "Lab Report — Optics",
        subject: "Physics",
        description: "Submit the final optics laboratory report.",
        dueDate: in3Days.toISOString(),
        priority: "Medium",
        progress: 60,
        status: "Upcoming",
        completed: false,
        instructor: "Dr. Priya Mehta",
        assignedDate: new Date(today.getTime() - 5*24*60*60*1000).toISOString()
    },
    {
        id: "ASN-003",
        title: "SQL Assignment — Queries",
        subject: "Database Management",
        description: "Complete the assigned SQL query exercises.",
        dueDate: in5Days.toISOString(),
        priority: "Medium",
        progress: 30,
        status: "Upcoming",
        completed: false,
        instructor: "Prof. R. Menon",
        assignedDate: new Date(today.getTime() - 2*24*60*60*1000).toISOString()
    },
    {
        id: "ASN-004",
        title: "Calculus Problem Set",
        subject: "Mathematics",
        description: "Unit 2 problem set covering limits and continuity.",
        dueDate: past2Days.toISOString(),
        priority: "High",
        progress: 100,
        status: "Completed",
        completed: true,
        instructor: "Dr. Rajesh Kumar",
        assignedDate: new Date(today.getTime() - 14*24*60*60*1000).toISOString()
    },
    {
        id: "ASN-005",
        title: "Responsive Portfolio",
        subject: "Web Development",
        description: "Build a responsive personal portfolio using HTML and CSS.",
        dueDate: in7Days.toISOString(),
        priority: "Low",
        progress: 45,
        status: "Upcoming",
        completed: false,
        instructor: "Ms. Kavita Singh",
        assignedDate: new Date(today.getTime() - 3*24*60*60*1000).toISOString()
    }
];

let userAssignments = getStoredItem('userAssignments', defaultAssignmentsData);

const AssignmentManager = {
    getAll: () => userAssignments,
    
    getById: (id) => userAssignments.find(a => a.id === id),
    
    add: (assignment) => {
        const newAssignment = {
            id: "ASN-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
            ...assignment,
            completed: false,
            assignedDate: new Date().toISOString()
        };
        userAssignments.push(newAssignment);
        setStoredItem('userAssignments', userAssignments);
        return newAssignment;
    },
    
    update: (id, updates) => {
        const index = userAssignments.findIndex(a => a.id === id);
        if (index !== -1) {
            userAssignments[index] = { ...userAssignments[index], ...updates };
            setStoredItem('userAssignments', userAssignments);
            return userAssignments[index];
        }
        return null;
    },
    
    delete: (id) => {
        userAssignments = userAssignments.filter(a => a.id !== id);
        setStoredItem('userAssignments', userAssignments);
    },
    
    toggleComplete: (id) => {
        const assignment = AssignmentManager.getById(id);
        if (assignment) {
            assignment.completed = !assignment.completed;
            if (assignment.completed) {
                assignment.progress = 100;
            }
            setStoredItem('userAssignments', userAssignments);
            return assignment;
        }
        return null;
    },
    
    updateProgress: (id, progress) => {
        const assignment = AssignmentManager.getById(id);
        if (assignment) {
            assignment.progress = Math.min(100, Math.max(0, parseInt(progress)));
            if (assignment.progress === 100) assignment.completed = true;
            else assignment.completed = false;
            
            setStoredItem('userAssignments', userAssignments);
            return assignment;
        }
        return null;
    }
};
