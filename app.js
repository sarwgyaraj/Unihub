document.addEventListener("DOMContentLoaded", () => {
    
    // Status mapping utility using Lucide icons
    const statusMap = {
        "Resolved": { class: "status-resolved", icon: "check-circle-2", dot: "dot-resolved" },
        "In Progress": { class: "status-progress", icon: "loader-2", dot: "dot-progress" },
        "Under Review": { class: "status-review", icon: "eye", dot: "dot-review" },
        "New": { class: "status-review", icon: "sparkles", dot: "dot-review" },
    };

    // Helper to safely render icons after DOM updates
    function updateIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // --- ROUTER LOGIC ---
    function handleRoute() {
        const hash = window.location.hash || '#dashboard';
        
        // Hide all views
        document.querySelectorAll('.app-view').forEach(view => {
            view.classList.remove('active');
        });

        // Parse hash for dynamic routes (e.g. #feedback/FB-123)
        let route = hash;
        let param = null;
        if (hash.startsWith('#feedback/')) {
            route = '#feedback';
            param = hash.split('/')[1];
        }

        // Sidebar active state update
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        let activeNav = document.querySelector(`.nav-item[href="${route}"]`) || document.querySelector(`.nav-item[href="${hash}"]`);
        if (activeNav) activeNav.classList.add('active');
        
        // Close sidebar on mobile after nav
        const sidebar = document.getElementById("sidebar");
        if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        }

        // Render specific view
        switch (route) {
            case '#dashboard':
                document.getElementById('view-dashboard').classList.add('active');
                renderDashboard();
                break;
            case '#submit':
                document.getElementById('view-submit').classList.add('active');
                break;
            case '#history':
                document.getElementById('view-history').classList.add('active');
                renderHistory();
                break;
            case '#track':
                document.getElementById('view-track').classList.add('active');
                document.getElementById('track-result-container').style.display = 'none';
                document.getElementById('track-id-input').value = '';
                break;
            case '#notifications':
                document.getElementById('view-notifications').classList.add('active');
                renderNotificationsPage();
                break;
            case '#feedback':
                document.getElementById('view-details').classList.add('active');
                renderFeedbackDetails(param);
                break;
            default:
                document.getElementById('view-dashboard').classList.add('active');
                renderDashboard();
        }

        document.getElementById('main-scroll-area').scrollTop = 0;
        updateIcons();
    }

    window.addEventListener('hashchange', handleRoute);


    // --- VIEW RENDERING FUNCTIONS ---

    function renderDashboard() {
        if (!feedbackData || feedbackData.length === 0) {
            document.getElementById("statistics-grid").innerHTML = '';
            document.getElementById("recent-feedback-list").innerHTML = `
                <div class="empty-state">
                    <h3>No feedback submitted yet</h3>
                    <p>Your feedback can help improve campus life.</p>
                    <a href="#submit" class="primary-cta no-underline"><i data-lucide="plus" class="cta-icon"></i> Submit Feedback</a>
                </div>
            `;
            document.getElementById("overview-card").innerHTML = '<p style="color:var(--text-muted)">No data to display.</p>';
            document.getElementById("recent-updates-list").innerHTML = '<div class="update-item"><p class="update-text">No recent updates.</p></div>';
            return;
        }

        // Stats
        const total = feedbackData.length;
        const resolved = feedbackData.filter(f => f.status === "Resolved").length;
        const inProgress = feedbackData.filter(f => f.status === "In Progress").length;
        const underReview = feedbackData.filter(f => f.status === "Under Review").length;

        document.getElementById("statistics-grid").innerHTML = `
            <div class="stat-card">
                <div class="stat-header"><span class="stat-title">Total Feedback</span><i data-lucide="message-square" class="stat-icon"></i></div>
                <div class="stat-value">${total}</div>
                <div class="stat-desc">All submissions</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span class="stat-title">Under Review</span><i data-lucide="clock" class="stat-icon"></i></div>
                <div class="stat-value">${underReview}</div>
                <div class="stat-desc">Awaiting action</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span class="stat-title">In Progress</span><i data-lucide="settings-2" class="stat-icon"></i></div>
                <div class="stat-value">${inProgress}</div>
                <div class="stat-desc">Currently being addressed</div>
            </div>
            <div class="stat-card">
                <div class="stat-header"><span class="stat-title">Resolved</span><i data-lucide="check-circle-2" class="stat-icon"></i></div>
                <div class="stat-value">${resolved}</div>
                <div class="stat-desc">Successfully addressed</div>
            </div>
        `;

        // Overview
        const resolvedPct = (resolved / total) * 100 || 0;
        const inProgressPct = (inProgress / total) * 100 || 0;
        const underReviewPct = (underReview / total) * 100 || 0;

        document.getElementById("overview-card").innerHTML = `
            <div class="overview-total">Total: ${total}</div>
            <div class="overview-list">
                <div class="overview-item">
                    <div class="overview-label"><span class="overview-dot dot-resolved"></span>Resolved</div><span>${resolved}</span>
                </div>
                <div class="overview-item">
                    <div class="overview-label"><span class="overview-dot dot-progress"></span>In Progress</div><span>${inProgress}</span>
                </div>
                <div class="overview-item">
                    <div class="overview-label"><span class="overview-dot dot-review"></span>Under Review</div><span>${underReview}</span>
                </div>
            </div>
            <div class="overview-bar-container">
                <div class="overview-bar-segment" style="width: ${resolvedPct}%; background-color: var(--status-resolved-text);"></div>
                <div class="overview-bar-segment" style="width: ${inProgressPct}%; background-color: var(--status-progress-text);"></div>
                <div class="overview-bar-segment" style="width: ${underReviewPct}%; background-color: var(--status-review-text);"></div>
            </div>
        `;

        // Recent Feedback
        const recent = [...feedbackData].reverse().slice(0, 3);
        let fbHtml = '';
        recent.forEach(fb => {
            fbHtml += createFeedbackCardHTML(fb);
        });
        document.getElementById("recent-feedback-list").innerHTML = fbHtml;

        // Recent Updates
        let upHtml = '';
        updatesData.forEach(update => {
            const iconName = statusMap[update.status] ? statusMap[update.status].icon : "circle";
            const colorClass = statusMap[update.status] ? statusMap[update.status].dot : "";
            upHtml += `
            <a href="${update.link}" class="update-item">
                <p class="update-text"><i data-lucide="${iconName}" class="inline-icon" style="color:var(--status-${update.status.split(' ')[0].toLowerCase()}-text, currentColor)"></i> ${update.message}</p>
                <span class="update-time">${update.time}</span>
            </a>
            `;
        });
        document.getElementById("recent-updates-list").innerHTML = upHtml;
    }

    // Submit View Form Handler
    const submitForm = document.getElementById("submit-feedback-form");
    submitForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const randomId = "FB-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        
        const newFeedback = {
            id: randomId,
            category: document.getElementById("submit-category").value,
            area: document.getElementById("submit-area").value,
            preview: document.getElementById("submit-preview").value,
            status: "New",
            severity: document.getElementById("submit-severity").value,
            rating: parseInt(document.getElementById("submit-rating").value),
            createdAt: new Date().toISOString(),
            timeline: [
                { date: new Date().toISOString(), desc: "Feedback Submitted Anonymously" }
            ]
        };

        feedbackData.push(newFeedback);
        
        notificationData.unshift({
            id: `notif-${Date.now()}`,
            title: "Feedback Submitted",
            message: `Your new feedback ${randomId} has been successfully submitted.`,
            time: "Just now",
            link: `#feedback/${randomId}`
        });

        submitForm.reset();
        window.location.hash = "#dashboard";
    });

    // History View
    function renderHistory() {
        const container = document.getElementById("history-list-container");
        if (feedbackData.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No feedback history</h3><p>You haven't submitted any feedback yet.</p></div>`;
            return;
        }

        let html = '';
        [...feedbackData].reverse().forEach(fb => {
            html += createFeedbackCardHTML(fb);
        });
        container.innerHTML = html;
    }

    // Track View
    const trackForm = document.getElementById("track-form");
    trackForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputId = document.getElementById("track-id-input").value.trim().toUpperCase();
        
        const fb = feedbackData.find(f => f.id === inputId);
        const container = document.getElementById("track-result-container");
        
        if (fb) {
            container.innerHTML = createFeedbackCardHTML(fb) + `
                <a href="#feedback/${fb.id}" class="primary-cta no-underline" style="margin-top:24px; width:100%; text-align:center;">View Full Details</a>
            `;
            container.style.display = "block";
            updateIcons();
        } else {
            container.innerHTML = `<div class="empty-state"><h3 style="color:#ef4444;"><i data-lucide="alert-circle"></i> ID Not Found</h3><p>We couldn't find any feedback matching "${inputId}".</p></div>`;
            container.style.display = "block";
            updateIcons();
        }
    });

    // Notifications View
    function renderNotificationsPage() {
        const container = document.getElementById("notifications-page-list");
        let html = '';
        notificationData.forEach(notif => {
            html += `
            <div class="notif-page-item">
                <div class="notif-page-content">
                    <h4><a href="${notif.link}" style="text-decoration:none; color:var(--text-main);">${notif.title}</a></h4>
                    <p>${notif.message}</p>
                </div>
                <div class="notif-page-time">${notif.time}</div>
            </div>
            `;
        });
        container.innerHTML = html;
    }

    function renderHeaderNotifications() {
        const list = document.getElementById("dropdown-notifications");
        document.getElementById("notification-badge").innerText = notificationData.length;
        
        let html = '';
        notificationData.slice(0, 4).forEach(notif => {
            html += `
            <a href="${notif.link}" class="notification-item">
                <strong>${notif.title}</strong><br>
                ${notif.message}
                <span class="notification-time">${notif.time}</span>
            </a>
            `;
        });
        list.innerHTML = html;
    }

    // Feedback Details View
    function renderFeedbackDetails(id) {
        const fb = feedbackData.find(f => f.id === id);
        const container = document.getElementById("details-container");
        
        if (!fb) {
            container.innerHTML = `<div class="empty-state"><h3>Not Found</h3><p>Feedback item ${id} could not be found.</p></div>`;
            return;
        }

        const dateStr = new Date(fb.createdAt).toLocaleString();
        const statusStyle = statusMap[fb.status] || statusMap["New"];

        let timelineHtml = '';
        if (fb.timeline) {
            fb.timeline.forEach(event => {
                timelineHtml += `
                <div class="timeline-event">
                    <div class="timeline-desc">${event.desc}</div>
                    <div class="timeline-date">${new Date(event.date).toLocaleString()}</div>
                </div>`;
            });
        }

        container.innerHTML = `
            <div class="feedback-card" style="margin-bottom: 32px;">
                <div class="fb-header">
                    <span class="fb-id">${fb.id}</span>
                    <span class="status-badge ${statusStyle.class}"><i data-lucide="${statusStyle.icon}"></i> ${fb.status}</span>
                </div>
                <div class="fb-meta">
                    <span class="meta-item">Category: <strong>${fb.category}</strong></span>
                    <span class="meta-item">Area: <strong>${fb.area}</strong></span>
                    <span class="meta-item">Severity: <strong>${fb.severity}</strong></span>
                    <span class="meta-item">Submitted: <strong>${dateStr}</strong></span>
                </div>
                <div class="fb-preview" style="font-style:normal; font-size:1rem; padding: 16px;">
                    ${fb.preview}
                </div>
            </div>
            
            <h3 class="section-title">Activity Timeline</h3>
            <div class="details-timeline">
                ${timelineHtml}
            </div>
        `;
    }

    // Helper: Create HTML for a standard Feedback Card
    function createFeedbackCardHTML(fb) {
        const statusStyle = statusMap[fb.status] || statusMap["New"];
        const dateStr = new Date(fb.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
        
        return `
        <div class="feedback-card">
            <div class="fb-header">
                <span class="fb-id">${fb.id}</span>
                <span class="fb-date">${dateStr}</span>
            </div>
            <div class="fb-meta">
                <span class="meta-item">Category: <strong>${fb.category}</strong></span>
                <span class="meta-item">Area: <strong>${fb.area}</strong></span>
            </div>
            <div class="fb-preview">"${fb.preview}"</div>
            <div class="fb-footer">
                <span class="status-badge ${statusStyle.class}"><i data-lucide="${statusStyle.icon}"></i> ${fb.status}</span>
                <a href="#feedback/${fb.id}" class="btn-view-details">View Details <i data-lucide="chevron-right" class="inline-icon"></i></a>
            </div>
        </div>`;
    }


    // --- UI INTERACTIONS ---

    const anonymityModal = document.getElementById("anonymity-modal");
    const btnHowAnonymityWorks = document.getElementById("btn-how-anonymity-works");
    const modalClose = document.getElementById("modal-close");

    btnHowAnonymityWorks.addEventListener("click", () => anonymityModal.classList.add("show"));
    modalClose.addEventListener("click", () => anonymityModal.classList.remove("show"));
    anonymityModal.addEventListener("click", (e) => { if (e.target === anonymityModal) anonymityModal.classList.remove("show"); });

    // Sidebar Toggle (Mobile)
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.getElementById("sidebar");

    hamburgerBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    document.addEventListener("click", (e) => {
        if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !hamburgerBtn.contains(e.target) && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        }
    });

    // Dropdowns
    const notificationBtn = document.getElementById("notification-btn");
    const notificationDropdown = document.getElementById("notification-dropdown");
    const profileBtn = document.getElementById("profile-btn");
    const profileDropdown = document.getElementById("profile-dropdown");
    const viewAllNotifBtn = document.getElementById("view-all-notif-btn");

    notificationBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notificationDropdown.classList.toggle("show");
        profileDropdown.classList.remove("show");
    });
    profileBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileDropdown.classList.toggle("show");
        notificationDropdown.classList.remove("show");
    });
    
    viewAllNotifBtn.addEventListener("click", () => notificationDropdown.classList.remove("show"));
    
    document.addEventListener("click", (e) => {
        if (!notificationDropdown.contains(e.target) || e.target.tagName === 'A') {
            notificationDropdown.classList.remove("show");
        }
        if (!profileDropdown.contains(e.target) || e.target.tagName === 'A') {
            profileDropdown.classList.remove("show");
        }
    });


    // --- INITIALIZATION ---
    renderHeaderNotifications();
    handleRoute(); 
    updateIcons();
});
