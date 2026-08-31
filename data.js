let feedbackData = [
    {
        id: "FB-8K42Q",
        category: "Library",
        area: "Study Spaces",
        preview: "More quiet study spaces are needed during evening hours.",
        status: "In Progress",
        severity: "Concern",
        rating: 3,
        createdAt: "2026-08-28T10:00:00Z",
        timeline: [
            { date: "2026-08-28T10:00:00Z", desc: "Feedback Submitted Anonymously" },
            { date: "2026-08-29T09:15:00Z", desc: "Assigned to Library Administration" },
            { date: "2026-08-30T14:30:00Z", desc: "Status changed to In Progress" }
        ]
    },
    {
        id: "FB-9L21P",
        category: "Hostel",
        area: "Wi-Fi",
        preview: "Internet connectivity is inconsistent in the hostel.",
        status: "Under Review",
        severity: "Serious",
        rating: 2,
        createdAt: "2026-08-29T11:00:00Z",
        timeline: [
            { date: "2026-08-29T11:00:00Z", desc: "Feedback Submitted Anonymously" },
            { date: "2026-08-31T08:00:00Z", desc: "Status changed to Under Review" }
        ]
    },
    {
        id: "FB-4A17C",
        category: "Faculty",
        area: "Teaching",
        preview: "More practice problems would be helpful before examinations.",
        status: "Resolved",
        severity: "General",
        rating: 4,
        createdAt: "2026-08-27T15:20:00Z",
        timeline: [
            { date: "2026-08-27T15:20:00Z", desc: "Feedback Submitted Anonymously" },
            { date: "2026-08-28T10:00:00Z", desc: "Acknowledged by Department Head" },
            { date: "2026-08-30T16:00:00Z", desc: "Status changed to Resolved. Practice sheets added." }
        ]
    },
    {
        id: "FB-7C62M",
        category: "Canteen",
        area: "Food Quality",
        preview: "The hygiene standard has improved recently, thank you.",
        status: "Resolved",
        severity: "Concern",
        rating: 4,
        createdAt: "2026-08-30T09:10:00Z",
        timeline: [
            { date: "2026-08-30T09:10:00Z", desc: "Feedback Submitted Anonymously" },
            { date: "2026-08-30T10:00:00Z", desc: "Status changed to Resolved." }
        ]
    }
];

let notificationData = [
    {
        id: "notif-1",
        title: "Feedback Update",
        message: "Your feedback FB-8K42Q is now In Progress.",
        time: "2 hours ago",
        link: "#feedback/FB-8K42Q"
    },
    {
        id: "notif-2",
        title: "Feedback Resolved",
        message: "Your feedback FB-4A17C has been marked as resolved.",
        time: "Yesterday",
        link: "#feedback/FB-4A17C"
    },
    {
        id: "notif-3",
        title: "Feedback Update",
        message: "Your feedback FB-9L21P is currently Under Review.",
        time: "2 days ago",
        link: "#feedback/FB-9L21P"
    }
];

let updatesData = [
    {
        status: "Resolved",
        message: "FB-4A17C was marked Resolved",
        time: "2 hours ago",
        dotClass: "dot-resolved",
        link: "#feedback/FB-4A17C"
    },
    {
        status: "In Progress",
        message: "FB-8K42Q moved to In Progress",
        time: "Yesterday",
        dotClass: "dot-progress",
        link: "#feedback/FB-8K42Q"
    },
    {
        status: "Under Review",
        message: "FB-9L21P is now Under Review",
        time: "2 days ago",
        dotClass: "dot-review",
        link: "#feedback/FB-9L21P"
    }
];
