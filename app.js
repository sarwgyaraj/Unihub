document.addEventListener("DOMContentLoaded", () => {
    
    // Status mapping utility using Lucide icons
    const statusMap = {
        "Resolved": { class: "status-resolved", icon: "check-circle-2", dot: "dot-resolved" },
        "In Progress": { class: "status-progress", icon: "loader-2", dot: "dot-progress" },
        "Under Review": { class: "status-review", icon: "eye", dot: "dot-review" },
        "New": { class: "status-review", icon: "sparkles", dot: "dot-review" },
        "Published": { class: "status-published", icon: "check-circle", dot: "dot-resolved" },
        "Pending Review": { class: "status-pending", icon: "clock", dot: "dot-review" }
    };

    function updateIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    // --- APP CONTEXT / GLOBAL STATE ---
    let currentModule = 'feedback'; // 'feedback' or 'notes'

    // --- ROUTER LOGIC ---
    function handleRoute() {
        const hash = window.location.hash || '#dashboard';
        
        document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));

        let route = hash;
        let param = null;
        if (hash.startsWith('#feedback/')) {
            route = '#feedback';
            param = hash.split('/')[1];
        } else if (hash.startsWith('#note/')) {
            route = '#note';
            param = hash.split('/')[1];
        }

        const notesRoutes = ['#notes-overview', '#notes-browse', '#notes-saved', '#notes-upload', '#notes-my-uploads', '#note'];
        const feedbackRoutes = ['#dashboard', '#submit', '#history', '#track', '#feedback'];
        const appointmentsRoutes = ['#appointments-home'];
        const assignmentsRoutes = ['#assignments-dashboard', '#assignments-all'];
        
        if (notesRoutes.includes(route)) currentModule = 'notes';
        else if (appointmentsRoutes.includes(route)) currentModule = 'appointments';
        else if (assignmentsRoutes.includes(route)) currentModule = 'assignments';
        else if (feedbackRoutes.includes(route)) currentModule = 'feedback';

        updateGlobalHeaderAndNav();

        // Specific View Rendering
        switch (route) {
            // Feedback Routes
            case '#dashboard': document.getElementById('view-dashboard').classList.add('active'); renderFeedbackDashboard(); break;
            case '#submit': document.getElementById('view-submit').classList.add('active'); break;
            case '#history': document.getElementById('view-history').classList.add('active'); renderFeedbackHistory(); break;
            case '#track': document.getElementById('view-track').classList.add('active'); break;
            case '#feedback': document.getElementById('view-details').classList.add('active'); renderFeedbackDetails(param); break;
            
            // Shared
            case '#notifications': document.getElementById('view-notifications').classList.add('active'); renderNotificationsPage(); break;
            
            // Notes Routes
            case '#notes-overview': document.getElementById('view-notes-overview').classList.add('active'); renderNotesOverview(); break;
            case '#notes-browse': document.getElementById('view-notes-browse').classList.add('active'); renderNotesBrowse(); break;
            case '#notes-saved': document.getElementById('view-notes-saved').classList.add('active'); renderNotesSaved(); break;
            case '#notes-upload': document.getElementById('view-notes-upload').classList.add('active'); break;
            case '#notes-my-uploads': document.getElementById('view-notes-my-uploads').classList.add('active'); renderNotesMyUploads(); break;
            case '#note': document.getElementById('view-notes-details').classList.add('active'); renderNoteDetails(param); break;
            
            // Appointments Routes
            case '#appointments-home': document.getElementById('view-appointments-home').classList.add('active'); break;
            
            // Assignments Routes
            case '#assignments-dashboard': document.getElementById('view-assignments-dashboard').classList.add('active'); renderAssignmentsDashboard(); break;
            case '#assignments-all': document.getElementById('view-assignments-all').classList.add('active'); renderAssignmentsAll(); break;
            
            default: document.getElementById('view-dashboard').classList.add('active'); renderFeedbackDashboard();
        }

        document.getElementById('main-scroll-area').scrollTop = 0;
        updateIcons();
    }

    function updateGlobalHeaderAndNav() {
        const internalNav = document.getElementById('notes-internal-nav');
        const headerTitles = document.getElementById('dynamic-header-titles');
        
        // Update Sidebar highlighting
        document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
        
        if (currentModule === 'notes') {
            document.getElementById('notes-internal-nav').style.display = 'block';
            document.getElementById('appointments-internal-nav').style.display = 'none';
            headerTitles.innerHTML = `<h1>Notes Exchange</h1><p>Find, share and discover notes from your campus community.</p>`;
            document.querySelector('.sidebar-nav .nav-item[data-view="notes-overview"]').classList.add('active');
            
            // Update internal nav highlighting
            document.querySelectorAll('#notes-internal-nav .internal-nav-link').forEach(el => el.classList.remove('active'));
            let activeInternal = document.querySelector(`#notes-internal-nav .internal-nav-link[href="${window.location.hash}"]`);
            if (activeInternal) activeInternal.classList.add('active');
            
        } else if (currentModule === 'appointments') {
            document.getElementById('notes-internal-nav').style.display = 'none';
            document.getElementById('appointments-internal-nav').style.display = 'block';
            headerTitles.innerHTML = `<h1>Professor Appointments</h1><p>Connect with the right professor. At the right time.</p>`;
            document.querySelector('.sidebar-nav .nav-item[data-view="appointments-home"]').classList.add('active');
        } else if (currentModule === 'assignments') {
            document.getElementById('notes-internal-nav').style.display = 'none';
            document.getElementById('appointments-internal-nav').style.display = 'none';
            document.getElementById('assignments-internal-nav').style.display = 'block';
            headerTitles.innerHTML = `<h1>Assignment Deadlines</h1><p>Stay on top of your coursework and never miss an important deadline.</p>`;
            document.querySelector('.sidebar-nav .nav-item[data-view="assignments-dashboard"]').classList.add('active');
            
            document.querySelectorAll('#assignments-internal-nav .internal-nav-link').forEach(el => el.classList.remove('active'));
            let activeInternal = document.querySelector(`#assignments-internal-nav .internal-nav-link[href="${window.location.hash}"]`);
            if (activeInternal) activeInternal.classList.add('active');

        } else {
            document.getElementById('notes-internal-nav').style.display = 'none';
            document.getElementById('appointments-internal-nav').style.display = 'none';
            document.getElementById('assignments-internal-nav').style.display = 'none';
            headerTitles.innerHTML = `<h1>Anonymous Student Feedback</h1><p>Share your experience and help improve campus.</p>`;
            document.querySelector('.sidebar-nav .nav-item[data-view="dashboard"]').classList.add('active');
        }
        
        // Close sidebar on mobile
        const sidebar = document.getElementById("sidebar");
        if (window.innerWidth <= 768 && sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        }
    }

    window.addEventListener('hashchange', handleRoute);


    // ==========================================
    // FEEDBACK MODULE RENDERING
    // ==========================================
    function renderFeedbackDashboard() {
        // [Existing Feedback Dashboard Logic]
        if (!feedbackData || feedbackData.length === 0) return;
        const total = feedbackData.length;
        const resolved = feedbackData.filter(f => f.status === "Resolved").length;
        const inProgress = feedbackData.filter(f => f.status === "In Progress").length;
        const underReview = feedbackData.filter(f => f.status === "Under Review").length;

        document.getElementById("statistics-grid").innerHTML = `
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Total Feedback</span><i data-lucide="message-square" class="stat-icon"></i></div><div class="stat-value">${total}</div><div class="stat-desc">All submissions</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Under Review</span><i data-lucide="clock" class="stat-icon"></i></div><div class="stat-value">${underReview}</div><div class="stat-desc">Awaiting action</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">In Progress</span><i data-lucide="settings-2" class="stat-icon"></i></div><div class="stat-value">${inProgress}</div><div class="stat-desc">Currently being addressed</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Resolved</span><i data-lucide="check-circle-2" class="stat-icon"></i></div><div class="stat-value">${resolved}</div><div class="stat-desc">Successfully addressed</div></div>
        `;

        document.getElementById("recent-feedback-list").innerHTML = [...feedbackData].reverse().slice(0, 3).map(createFeedbackCardHTML).join('');
        document.getElementById("recent-updates-list").innerHTML = updatesData.map(u => `<a href="${u.link}" class="update-item"><p class="update-text"><i data-lucide="${statusMap[u.status]?.icon || 'circle'}" class="inline-icon" style="color:var(--status-${u.status.split(' ')[0].toLowerCase()}-text, currentColor)"></i> ${u.message}</p><span class="update-time">${u.time}</span></a>`).join('');
    }

    // Submit Feedback Form Handler
    document.getElementById("submit-feedback-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const randomId = "FB-" + Math.random().toString(36).substring(2, 7).toUpperCase();
        feedbackData.push({
            id: randomId, category: document.getElementById("submit-category").value, area: document.getElementById("submit-area").value,
            preview: document.getElementById("submit-preview").value, status: "New", severity: document.getElementById("submit-severity").value,
            rating: parseInt(document.getElementById("submit-rating").value), createdAt: new Date().toISOString(), timeline: [{ date: new Date().toISOString(), desc: "Feedback Submitted Anonymously" }]
        });
        e.target.reset(); window.location.hash = "#dashboard";
    });

    function renderFeedbackHistory() {
        document.getElementById("history-list-container").innerHTML = feedbackData.length === 0 ? `<div class="empty-state"><h3>No feedback history</h3><p>You haven't submitted any feedback yet.</p></div>` : [...feedbackData].reverse().map(createFeedbackCardHTML).join('');
    }

    document.getElementById("track-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const inputId = document.getElementById("track-id-input").value.trim().toUpperCase();
        const fb = feedbackData.find(f => f.id === inputId);
        const container = document.getElementById("track-result-container");
        if (fb) { container.innerHTML = createFeedbackCardHTML(fb) + `<a href="#feedback/${fb.id}" class="primary-cta no-underline" style="margin-top:24px; width:100%; text-align:center;">View Full Details</a>`; container.style.display = "block"; updateIcons(); } 
        else { container.innerHTML = `<div class="empty-state"><h3 style="color:#ef4444;"><i data-lucide="alert-circle"></i> ID Not Found</h3><p>We couldn't find any feedback matching "${inputId}".</p></div>`; container.style.display = "block"; updateIcons(); }
    });

    function renderFeedbackDetails(id) {
        const fb = feedbackData.find(f => f.id === id);
        const container = document.getElementById("details-container");
        if (!fb) { container.innerHTML = `<div class="empty-state"><h3>Not Found</h3><p>Feedback item ${id} could not be found.</p></div>`; return; }
        const statusStyle = statusMap[fb.status] || statusMap["New"];
        container.innerHTML = `
            <div class="feedback-card" style="margin-bottom: 32px;">
                <div class="fb-header"><span class="fb-id">${fb.id}</span><span class="status-badge ${statusStyle.class}"><i data-lucide="${statusStyle.icon}"></i> ${fb.status}</span></div>
                <div class="fb-meta"><span class="meta-item">Category: <strong>${fb.category}</strong></span><span class="meta-item">Area: <strong>${fb.area}</strong></span></div>
                <div class="fb-preview" style="font-style:normal; font-size:1rem; padding: 16px;">${fb.preview}</div>
            </div>
            <h3 class="section-title">Activity Timeline</h3>
            <div class="details-timeline">${(fb.timeline||[]).map(e => `<div class="timeline-event"><div class="timeline-desc">${e.desc}</div><div class="timeline-date">${new Date(e.date).toLocaleString()}</div></div>`).join('')}</div>
        `;
    }

    function createFeedbackCardHTML(fb) {
        const statusStyle = statusMap[fb.status] || statusMap["New"];
        return `<div class="feedback-card"><div class="fb-header"><span class="fb-id">${fb.id}</span><span class="fb-date">${new Date(fb.createdAt).toLocaleDateString()}</span></div><div class="fb-meta"><span class="meta-item">Category: <strong>${fb.category}</strong></span><span class="meta-item">Area: <strong>${fb.area}</strong></span></div><div class="fb-preview">"${fb.preview}"</div><div class="fb-footer"><span class="status-badge ${statusStyle.class}"><i data-lucide="${statusStyle.icon}"></i> ${fb.status}</span><a href="#feedback/${fb.id}" class="btn-view-details">View Details <i data-lucide="chevron-right" class="inline-icon"></i></a></div></div>`;
    }


    // ==========================================
    // NOTES EXCHANGE MODULE RENDERING
    // ==========================================

    function createNoteCardHTML(note) {
        const isSaved = NotesManager.isSaved(note.id);
        const saveIconClass = isSaved ? 'saved' : '';
        const saveIconFill = isSaved ? '#ef4444' : 'none';

        return `
        <div class="note-card">
            <div class="note-card-header">
                <div class="note-icon-type">
                    <i data-lucide="file-text" style="color:var(--primary-color)"></i> ${note.fileType}
                </div>
                <button class="btn-save-note ${saveIconClass}" data-id="${note.id}" aria-label="Save Note">
                    <i data-lucide="heart" style="fill: ${saveIconFill}"></i>
                </button>
            </div>
            <div class="note-subject">${note.subject}</div>
            <h3>${note.title}</h3>
            <div class="note-meta-line">
                <span><i data-lucide="book-open" class="inline-icon"></i> ${note.branch} • Sem ${note.semester}</span>
            </div>
            <div class="note-stats">
                <span class="stat-item rating"><i data-lucide="star" class="inline-icon" style="fill: currentColor"></i> ${note.rating.toFixed(1)}</span>
                <span class="stat-item"><i data-lucide="download" class="inline-icon"></i> ${note.downloads}</span>
                <span class="stat-item"><i data-lucide="file" class="inline-icon"></i> ${note.pages} pages</span>
            </div>
            <div class="note-card-footer">
                <div class="note-card-contributor">
                    <i data-lucide="user" class="inline-icon"></i> ${note.contributor}
                </div>
                <a href="#note/${note.id}" class="btn-view-details">View <i data-lucide="chevron-right" class="inline-icon"></i></a>
            </div>
        </div>`;
    }

    // Bind Save Buttons
    function bindSaveButtons() {
        document.querySelectorAll('.btn-save-note').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = btn.getAttribute('data-id');
                const isNowSaved = NotesManager.toggleSaveNote(id);
                
                const icon = btn.querySelector('i');
                if (isNowSaved) {
                    btn.classList.add('saved');
                    icon.style.fill = '#ef4444';
                } else {
                    btn.classList.remove('saved');
                    icon.style.fill = 'none';
                }
            });
        });
    }

    // Notes Overview
    function renderNotesOverview() {
        const allNotes = NotesManager.getPublishedNotes();
        const subjects = [...new Set(allNotes.map(n => n.subject))].slice(0, 4); // Get top 4 subjects
        
        // Stats
        document.getElementById("notes-stats-grid").innerHTML = `
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Available Notes</span><i data-lucide="files" class="stat-icon"></i></div><div class="stat-value">${allNotes.length}</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Subjects</span><i data-lucide="book" class="stat-icon"></i></div><div class="stat-value">${subjects.length}+</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Contributors</span><i data-lucide="users" class="stat-icon"></i></div><div class="stat-value">82</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">My Uploads</span><i data-lucide="upload-cloud" class="stat-icon"></i></div><div class="stat-value">${NotesManager.getUserUploads().length}</div></div>
        `;

        // Subjects
        let subjHtml = subjects.map(s => {
            const count = allNotes.filter(n => n.subject === s).length;
            return `
            <a href="#notes-browse" class="subject-card no-underline">
                <div class="icon-wrap"><i data-lucide="library"></i></div>
                <h4>${s}</h4>
                <p>${count} notes</p>
            </a>`;
        }).join('');
        document.getElementById("subject-cards-grid").innerHTML = subjHtml;

        // Recent Notes
        const recentNotes = [...allNotes].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
        document.getElementById("recent-notes-list").innerHTML = recentNotes.map(createNoteCardHTML).join('');
        
        updateIcons();
        bindSaveButtons();
    }

    // Notes Browse & Filters
    function renderNotesBrowse() {
        const allNotes = NotesManager.getPublishedNotes();
        const container = document.getElementById("browse-notes-grid");
        
        function applyFilters() {
            let filtered = [...allNotes];
            
            const branch = document.getElementById("filter-branch").value;
            const sem = document.getElementById("filter-semester").value;
            const type = document.getElementById("filter-type").value;
            const search = document.getElementById("browse-search-input").value.toLowerCase();
            const sort = document.getElementById("notes-sort-select").value;

            if (branch) filtered = filtered.filter(n => n.branch === branch);
            if (sem) filtered = filtered.filter(n => n.semester == sem);
            if (type) filtered = filtered.filter(n => n.type === type);
            if (search) {
                filtered = filtered.filter(n => 
                    n.title.toLowerCase().includes(search) || 
                    n.subject.toLowerCase().includes(search)
                );
            }

            if (sort === 'newest') filtered.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
            else if (sort === 'downloads') filtered.sort((a,b) => b.downloads - a.downloads);
            else if (sort === 'rating') filtered.sort((a,b) => b.rating - a.rating);
            else if (sort === 'saves') filtered.sort((a,b) => b.saves - a.saves);

            document.getElementById("browse-results-info").innerText = `Showing ${filtered.length} notes`;
            
            if (filtered.length === 0) {
                container.innerHTML = `<div class="empty-state" style="grid-column: 1/-1;"><h3>No notes found</h3><p>Try adjusting your search or filters.</p><button class="secondary-btn" onclick="document.getElementById('btn-clear-filters').click()">Clear Filters</button></div>`;
            } else {
                container.innerHTML = filtered.map(createNoteCardHTML).join('');
            }
            updateIcons();
            bindSaveButtons();
        }

        // Attach listeners
        ['filter-branch', 'filter-semester', 'filter-type', 'notes-sort-select'].forEach(id => {
            document.getElementById(id).addEventListener('change', applyFilters);
        });
        document.getElementById('browse-search-input').addEventListener('input', applyFilters);
        
        document.getElementById('btn-clear-filters').addEventListener('click', () => {
            document.getElementById('filter-branch').value = "";
            document.getElementById('filter-semester').value = "";
            document.getElementById('filter-type').value = "";
            document.getElementById('browse-search-input').value = "";
            applyFilters();
        });

        // Pass hero search to browse search if exists
        const heroSearchVal = document.getElementById('hero-notes-search').value;
        if(heroSearchVal) {
            document.getElementById('browse-search-input').value = heroSearchVal;
            document.getElementById('hero-notes-search').value = "";
        }

        applyFilters(); // Initial render
    }

    // Saved Notes
    function renderNotesSaved() {
        const savedNotes = NotesManager.getSavedNotes();
        const container = document.getElementById("saved-notes-grid");
        
        if (savedNotes.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1/-1;">
                    <h3>No saved notes yet</h3>
                    <p>Browse the Notes Exchange and save useful study material for later.</p>
                    <a href="#notes-browse" class="primary-cta no-underline">Browse Notes</a>
                </div>`;
        } else {
            container.innerHTML = savedNotes.map(createNoteCardHTML).join('');
            bindSaveButtons();
        }
    }

    // Note Details
    function renderNoteDetails(id) {
        const note = NotesManager.getNoteById(id);
        const container = document.getElementById("note-details-container");
        
        if (!note) {
            container.innerHTML = `<div class="empty-state"><h3>Not Found</h3><p>Note could not be found.</p></div>`;
            return;
        }

        const isSaved = NotesManager.isSaved(note.id);
        const dateStr = new Date(note.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        container.innerHTML = `
            <div class="note-details-layout">
                <!-- Left: Preview & Actions -->
                <div class="note-preview-area">
                    <div class="preview-placeholder">
                        <i data-lucide="file-text" style="width:64px; height:64px; margin-bottom:16px; color:var(--border-color)"></i>
                        <h3>PDF PREVIEW</h3>
                        <p>Document Viewer Placeholder</p>
                    </div>
                    <div class="preview-controls">
                        <button class="secondary-btn"><i data-lucide="chevron-left" class="inline-icon"></i> Prev</button>
                        <span>Page 1 / ${note.pages}</span>
                        <button class="secondary-btn">Next <i data-lucide="chevron-right" class="inline-icon"></i></button>
                    </div>
                    <div style="padding: 24px; display:flex; gap:16px;">
                        <button class="primary-cta" id="btn-actual-download" style="flex-grow:1"><i data-lucide="download" class="cta-icon"></i> Download Note</button>
                        <button class="secondary-btn btn-save-note ${isSaved ? 'saved' : ''}" data-id="${note.id}" style="width:120px; justify-content:center;">
                            <i data-lucide="heart" class="inline-icon" style="fill: ${isSaved ? '#ef4444' : 'none'}; margin-right:8px;"></i> Save
                        </button>
                        <button class="secondary-btn"><i data-lucide="flag" class="inline-icon"></i> Report</button>
                    </div>
                </div>

                <!-- Right: Information -->
                <div class="note-info-sidebar">
                    <div class="info-card">
                        <h3>${note.title}</h3>
                        <p style="color:var(--text-muted); margin-bottom: 24px; line-height: 1.5;">${note.description}</p>
                        
                        <div class="info-row"><span class="info-label">Subject</span><span class="info-value">${note.subject}</span></div>
                        <div class="info-row"><span class="info-label">Branch</span><span class="info-value">${note.branch}</span></div>
                        <div class="info-row"><span class="info-label">Semester</span><span class="info-value">${note.semester}</span></div>
                        <div class="info-row"><span class="info-label">Type</span><span class="info-value">${note.type}</span></div>
                        <div class="info-row"><span class="info-label">Format</span><span class="info-value">${note.fileType}</span></div>
                        <div class="info-row"><span class="info-label">Uploaded</span><span class="info-value">${dateStr}</span></div>
                        <div class="info-row"><span class="info-label">Contributor</span><span class="info-value">${note.contributor}</span></div>
                        
                        <div class="rating-section">
                            <span style="font-weight:600; font-size:1.5rem; color:#facc15;">${note.rating.toFixed(1)}</span>
                            <div class="stars">
                                <i data-lucide="star" class="active"></i><i data-lucide="star" class="active"></i><i data-lucide="star" class="active"></i><i data-lucide="star" class="active"></i><i data-lucide="star-half"></i>
                            </div>
                            <span style="color:var(--text-muted); font-size:0.85rem; margin-left:auto;">(${note.downloads} downloads)</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        updateIcons();
        bindSaveButtons();
        
        document.getElementById('btn-actual-download').addEventListener('click', () => {
            NotesManager.recordDownload(note.id);
            alert("Download started for: " + note.title);
            renderNoteDetails(id); // re-render to update download count
        });
    }

    // Upload Notes Logic
    const uploadForm = document.getElementById("upload-note-form");
    const fileZone = document.getElementById("file-upload-zone");
    const filePreview = document.getElementById("file-upload-preview");
    const fileInput = document.getElementById("actual-file-input");
    
    fileZone.addEventListener("click", () => fileInput.click());
    
    fileInput.addEventListener("change", (e) => {
        if(e.target.files.length > 0) {
            document.getElementById("mock-file-name").innerText = e.target.files[0].name;
            fileZone.style.display = "none";
            filePreview.style.display = "flex";
        }
    });
    
    document.getElementById("btn-remove-file").addEventListener("click", () => {
        fileInput.value = "";
        fileZone.style.display = "block";
        filePreview.style.display = "none";
    });

    uploadForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        if(!fileInput.files.length) {
            alert("Please select a file to upload.");
            return;
        }

        const noteData = {
            title: document.getElementById("upload-title").value,
            subject: document.getElementById("upload-subject").value,
            branch: document.getElementById("upload-branch").value,
            semester: parseInt(document.getElementById("upload-semester").value),
            type: document.getElementById("upload-type").value,
            description: document.getElementById("upload-desc").value || "No description provided.",
            fileType: fileInput.files[0].name.split('.').pop().toUpperCase(),
            pages: Math.floor(Math.random() * 30) + 5 // mock page count
        };

        const newNote = NotesManager.uploadNote(noteData);
        
        notificationData.unshift({
            id: `notif-${Date.now()}`,
            title: "Notes Uploaded",
            message: `Your notes "${newNote.title}" are pending review.`,
            time: "Just now",
            link: `#notes-my-uploads`
        });

        uploadForm.reset();
        fileInput.value = "";
        fileZone.style.display = "block";
        filePreview.style.display = "none";
        
        window.location.hash = "#notes-my-uploads";
        alert("Your notes have been uploaded and are pending review!");
    });

    // My Uploads
    function renderNotesMyUploads() {
        const myNotes = NotesManager.getUserUploads();
        
        const totalDownloads = myNotes.reduce((sum, note) => sum + note.downloads, 0);
        const totalSaves = myNotes.reduce((sum, note) => sum + note.saves, 0);

        document.getElementById("my-uploads-stats").innerHTML = `
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Total Uploads</span></div><div class="stat-value">${myNotes.length}</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Total Downloads</span></div><div class="stat-value">${totalDownloads}</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Total Saves</span></div><div class="stat-value">${totalSaves}</div></div>
        `;

        const container = document.getElementById("my-uploads-list");
        if (myNotes.length === 0) {
            container.innerHTML = `<div class="empty-state"><h3>No uploads yet</h3><p>Share your study material with classmates.</p><a href="#notes-upload" class="primary-cta no-underline">Upload Notes</a></div>`;
        } else {
            container.innerHTML = myNotes.map(n => {
                const statusStyle = statusMap[n.status] || statusMap["New"];
                return `
                <div class="feedback-card">
                    <div class="fb-header"><span class="fb-id">${n.title}</span><span class="status-badge ${statusStyle.class}"><i data-lucide="${statusStyle.icon}"></i> ${n.status}</span></div>
                    <div class="fb-meta"><span class="meta-item">Subject: <strong>${n.subject}</strong></span><span class="meta-item">Downloads: <strong>${n.downloads}</strong></span></div>
                    <div class="fb-footer"><span class="fb-date">Uploaded ${new Date(n.createdAt).toLocaleDateString()}</span></div>
                </div>`;
            }).join('');
        }
        updateIcons();
    }


    // ==========================================
    // SHARED UTILS / UI INTERACTIONS
    // ==========================================
    function renderNotificationsPage() {
        document.getElementById("notifications-page-list").innerHTML = notificationData.map(notif => `
            <div class="notif-page-item">
                <div class="notif-page-content">
                    <h4><a href="${notif.link}" style="text-decoration:none; color:var(--text-main);">${notif.title}</a></h4>
                    <p>${notif.message}</p>
                </div>
                <div class="notif-page-time">${notif.time}</div>
            </div>
        `).join('');
    }

    // Modal
    const anonymityModal = document.getElementById("anonymity-modal");
    document.getElementById("btn-how-anonymity-works")?.addEventListener("click", () => anonymityModal.classList.add("show"));
    document.getElementById("modal-close")?.addEventListener("click", () => anonymityModal.classList.remove("show"));
    anonymityModal?.addEventListener("click", (e) => {
        if (e.target === anonymityModal) anonymityModal.classList.remove("show");
    });
    
    // Sidebar Toggle
    const mainSidebar = document.getElementById("sidebar");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const collapseBtn = document.getElementById("sidebar-collapse-btn");

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => mainSidebar.classList.toggle("open"));
    }
    
    if (collapseBtn) {
        collapseBtn.addEventListener("click", (e) => {
            e.preventDefault();
            mainSidebar.classList.toggle("collapsed");
        });
    }
    
    // Dropdowns
    const notifBtn = document.getElementById("notification-btn");
    const notifDropdown = document.getElementById("notification-dropdown");
    const profBtn = document.getElementById("profile-btn");
    const profDropdown = document.getElementById("profile-dropdown");

    notifBtn.addEventListener("click", (e) => { e.stopPropagation(); notifDropdown.classList.toggle("show"); profDropdown.classList.remove("show"); });
    profBtn.addEventListener("click", (e) => { e.stopPropagation(); profDropdown.classList.toggle("show"); notifDropdown.classList.remove("show"); });
    
    document.addEventListener("click", (e) => {
        if (!notifDropdown.contains(e.target) || e.target.tagName === 'A') notifDropdown.classList.remove("show");
        if (!profDropdown.contains(e.target) || e.target.tagName === 'A') profDropdown.classList.remove("show");
    });


    // ==========================================
    // ASSIGNMENT DEADLINES LOGIC
    // ==========================================

    // Date Logic Helpers
    function getAssignmentStatus(dueDateStr, completed) {
        if (completed) return "Completed";
        const now = new Date();
        const due = new Date(dueDateStr);
        const diffMs = due - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMs < 0) return "Overdue";
        if (diffDays === 0) return "Due Today";
        if (diffDays === 1) return "Due Tomorrow";
        if (diffDays <= 7) return "Due Soon";
        return "Upcoming";
    }

    function getStatusClass(status) {
        if (status === "Completed") return "status-completed";
        if (status === "Overdue") return "status-overdue";
        if (status === "Due Today" || status === "Due Tomorrow" || status === "Due Soon") return "status-soon";
        return "status-upcoming";
    }

    function getTimeRemainingText(dueDateStr) {
        const now = new Date();
        const due = new Date(dueDateStr);
        const diffMs = due - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMs < 0) return `${Math.abs(diffDays)} day(s) overdue`;
        if (diffDays === 0) {
            const hours = Math.floor(diffMs / (1000 * 60 * 60));
            const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
            return `Due today • ${hours}h ${mins}m left`;
        }
        if (diffDays === 1) return `Due tomorrow`;
        return `Due in ${diffDays} days`;
    }

    // Dashboard Render
    function renderAssignmentsDashboard() {
        const assignments = AssignmentManager.getAll();
        
        // Update statuses dynamically before render
        assignments.forEach(a => a.status = getAssignmentStatus(a.dueDate, a.completed));
        
        const total = assignments.length;
        const dueSoon = assignments.filter(a => a.status === "Due Soon" || a.status === "Due Tomorrow" || a.status === "Due Today").length;
        const thisWeek = assignments.filter(a => {
            if (a.completed) return false;
            const diffDays = Math.ceil((new Date(a.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
            return diffDays >= 0 && diffDays <= 7;
        }).length;
        const overdue = assignments.filter(a => a.status === "Overdue").length;

        // Render KPIs
        document.getElementById("assignments-stats-grid").innerHTML = `
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Total Assignments</span><i data-lucide="clipboard-list" class="stat-icon"></i></div><div class="stat-value">${total}</div><div class="stat-desc">All active assignments</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Due Soon</span><i data-lucide="clock" class="stat-icon" style="color:#f59e0b;"></i></div><div class="stat-value">${dueSoon}</div><div class="stat-desc">Due within 7 days</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">This Week</span><i data-lucide="calendar" class="stat-icon"></i></div><div class="stat-value">${thisWeek}</div><div class="stat-desc">Deadlines this week</div></div>
            <div class="stat-card"><div class="stat-header"><span class="stat-title">Overdue</span><i data-lucide="alert-circle" class="stat-icon" style="color:#ef4444;"></i></div><div class="stat-value">${overdue}</div><div class="stat-desc">Needs your attention</div></div>
        `;

        // Render Urgent Banner
        const bannerContainer = document.getElementById("urgent-deadline-banner-container");
        const pending = assignments.filter(a => !a.completed).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        if (pending.length > 0 && pending[0].status !== "Upcoming") {
            const urgent = pending[0];
            bannerContainer.innerHTML = `
                <div class="urgent-banner">
                    <div class="urgent-banner-left">
                        <i data-lucide="alert-triangle" class="urgent-icon"></i>
                        <div class="urgent-content">
                            <h4>⚠ Deadline approaching</h4>
                            <p>${urgent.title}</p>
                            <small>Due: ${new Date(urgent.dueDate).toLocaleDateString()} • ${new Date(urgent.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</small>
                            <div class="urgent-progress">
                                <div class="progress-bar-bg" style="width: 150px; height: 4px;"><div class="progress-bar-fill" style="width: ${urgent.progress}%;"></div></div>
                                ${urgent.progress}% complete
                            </div>
                        </div>
                    </div>
                    <button class="primary-cta" onclick="openAssignmentDetail('${urgent.id}')">Continue Assignment <i data-lucide="arrow-right" class="cta-icon"></i></button>
                </div>
            `;
            bannerContainer.style.display = 'block';
        } else {
            bannerContainer.style.display = 'none';
        }

        // Render Upcoming List
        const listContainer = document.getElementById("upcoming-assignments-list");
        if (pending.length === 0) {
            listContainer.innerHTML = `<div class="empty-state"><i data-lucide="calendar-check" style="width:48px;height:48px;color:var(--primary-color);margin-bottom:16px;"></i><h3>No upcoming deadlines</h3><p>You're all caught up. New assignments will appear here.</p><button class="primary-cta" style="margin-top:16px;" onclick="document.getElementById('btn-add-assignment').click()">Add Assignment</button></div>`;
        } else {
            listContainer.innerHTML = pending.slice(0, 4).map(createAssignmentCardHTML).join('');
        }

        // Render Deadline Overview
        document.getElementById("deadline-overview-container").innerHTML = `
            <div style="display:flex; justify-content:space-between;"><span>This Week</span><strong>${thisWeek} assignments</strong></div>
            <div style="display:flex; justify-content:space-between;"><span>Next 7 Days</span><strong>${dueSoon} assignments</strong></div>
            <div style="display:flex; justify-content:space-between; color:#ef4444;"><span>Overdue</span><strong>${overdue} assignments</strong></div>
            <div style="display:flex; justify-content:space-between; color:#10b981;"><span>Completed</span><strong>${assignments.filter(a=>a.completed).length} assignments</strong></div>
        `;

        // Render Recent Activity (Mock)
        document.getElementById("assignment-recent-activity").innerHTML = `
            <div class="update-item"><p class="update-text"><i data-lucide="check-circle" class="inline-icon" style="color:#10b981"></i> Assignment marked completed: <strong>Calculus Problem Set</strong></p><span class="update-time">2 hours ago</span></div>
            <div class="update-item"><p class="update-text"><i data-lucide="plus-circle" class="inline-icon" style="color:var(--primary-color)"></i> Assignment added: <strong>Binary Trees</strong></p><span class="update-time">Yesterday</span></div>
            <div class="update-item"><p class="update-text"><i data-lucide="bell" class="inline-icon" style="color:#f59e0b"></i> Reminder set: <strong>Physics Lab Report</strong></p><span class="update-time">2 days ago</span></div>
        `;

        renderCalendar();
        updateIcons();
    }

    function createAssignmentCardHTML(a) {
        const statusClass = getStatusClass(a.status);
        const timeRemaining = getTimeRemainingText(a.dueDate);
        
        return `
            <div class="asn-card" onclick="openAssignmentDetail('${a.id}')">
                <div class="asn-card-header">
                    <span class="asn-subject">${a.subject}</span>
                    <span class="priority-label priority-${a.priority.toLowerCase()}">${a.priority}</span>
                </div>
                <h3>${a.title}</h3>
                <p class="asn-desc">${a.description}</p>
                
                <div class="asn-due">
                    <i data-lucide="clock"></i> ${timeRemaining} (${new Date(a.dueDate).toLocaleDateString()})
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar-bg"><div class="progress-bar-fill ${a.completed ? 'completed' : ''}" style="width: ${a.progress}%"></div></div>
                    <div class="progress-text">
                        <span>${a.progress}% Complete</span>
                        <span class="asn-status ${statusClass}"><span class="asn-dot"></span> ${a.status}</span>
                    </div>
                </div>
                
                <div class="asn-card-footer">
                    <span style="font-size: 0.8rem; color: var(--text-muted);"><i data-lucide="user" class="inline-icon"></i> ${a.instructor || 'Unknown'}</span>
                    <button class="primary-cta">${a.completed ? 'Review' : 'Continue'}</button>
                </div>
            </div>
        `;
    }

    // Calendar Render
    let currentCalDate = new Date();
    
    function renderCalendar() {
        const year = currentCalDate.getFullYear();
        const month = currentCalDate.getMonth();
        
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        document.getElementById("cal-month-year").innerText = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const container = document.getElementById("calendar-days-container");
        container.innerHTML = "";
        
        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            container.innerHTML += `<div class="cal-cell empty"></div>`;
        }
        
        const assignments = AssignmentManager.getAll();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const cellDate = new Date(year, month, i);
            const dateStr = cellDate.toISOString().split('T')[0];
            
            // Find assignments for this day
            const dayAssignments = assignments.filter(a => a.dueDate.startsWith(dateStr));
            let indicatorHTML = "";
            let extraClass = "";
            
            if (dayAssignments.length > 0) {
                const hasOverdue = dayAssignments.some(a => !a.completed && a.status === "Overdue");
                extraClass = hasOverdue ? "has-overdue" : "";
                indicatorHTML = `<div class="cal-indicator"></div>`;
            }
            
            // Highlight today
            const isToday = cellDate.toDateString() === new Date().toDateString() ? "active" : "";
            
            container.innerHTML += `<div class="cal-cell ${isToday} ${extraClass}" onclick="selectCalendarDate('${dateStr}')">${i}${indicatorHTML}</div>`;
        }
        
        // Select today by default
        selectCalendarDate(new Date().toISOString().split('T')[0]);
    }

    document.getElementById("cal-prev")?.addEventListener("click", () => { currentCalDate.setMonth(currentCalDate.getMonth() - 1); renderCalendar(); });
    document.getElementById("cal-next")?.addEventListener("click", () => { currentCalDate.setMonth(currentCalDate.getMonth() + 1); renderCalendar(); });

    window.selectCalendarDate = function(dateStr) {
        const assignments = AssignmentManager.getAll().filter(a => a.dueDate.startsWith(dateStr));
        const container = document.getElementById("calendar-selected-assignments");
        const displayDate = new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
        
        let html = `<div class="cal-sel-date-title">${displayDate}</div>`;
        if (assignments.length === 0) {
            html += `<p style="font-size:0.85rem; color:var(--text-muted);">No deadlines for this date.</p>`;
        } else {
            html += assignments.map(a => `
                <div class="cal-mini-asn" style="cursor:pointer;" onclick="openAssignmentDetail('${a.id}')">
                    <span><strong>${a.subject}</strong>: ${a.title}</span>
                    <span>${new Date(a.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
            `).join('');
        }
        container.innerHTML = html;
    };

    // All Assignments Render
    function renderAssignmentsAll() {
        const assignments = AssignmentManager.getAll();
        assignments.forEach(a => a.status = getAssignmentStatus(a.dueDate, a.completed));
        
        // Populate subject filter dynamically
        const subjects = [...new Set(assignments.map(a => a.subject))];
        const subjectSelect = document.getElementById("asn-filter-subject");
        if(subjectSelect.options.length <= 1) {
            subjects.forEach(s => subjectSelect.innerHTML += `<option value="${s}">${s}</option>`);
        }
        
        applyAsnFilters();
    }

    function applyAsnFilters() {
        let filtered = AssignmentManager.getAll();
        
        const status = document.getElementById("asn-filter-status").value;
        const subject = document.getElementById("asn-filter-subject").value;
        const search = document.getElementById("asn-search-input").value.toLowerCase();
        const sort = document.getElementById("asn-sort-select").value;

        if (status) filtered = filtered.filter(a => a.status === status);
        if (subject) filtered = filtered.filter(a => a.subject === subject);
        if (search) {
            filtered = filtered.filter(a => a.title.toLowerCase().includes(search) || a.subject.toLowerCase().includes(search));
        }

        if (sort === 'dueDate') filtered.sort((a,b) => new Date(a.dueDate) - new Date(b.dueDate));
        if (sort === 'priority') {
            const p = { 'High': 3, 'Medium': 2, 'Low': 1 };
            filtered.sort((a,b) => p[b.priority] - p[a.priority]);
        }
        if (sort === 'added') filtered.sort((a,b) => new Date(b.assignedDate) - new Date(a.assignedDate));
        if (sort === 'subject') filtered.sort((a,b) => a.subject.localeCompare(b.subject));

        const tbody = document.getElementById("assignments-table-body");
        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><h3>No assignments found</h3><p>Try changing your search or filters.</p></div></td></tr>`;
        } else {
            tbody.innerHTML = filtered.map(a => {
                const statusClass = getStatusClass(a.status);
                return `
                <tr onclick="openAssignmentDetail('${a.id}')">
                    <td class="title-col" data-label="Assignment"><strong>${a.title}</strong><span>${a.description.substring(0,40)}...</span></td>
                    <td data-label="Subject">${a.subject}</td>
                    <td data-label="Due Date">${new Date(a.dueDate).toLocaleDateString()} <br> <span style="font-size:0.8rem; color:var(--text-muted)">${new Date(a.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></td>
                    <td data-label="Priority"><span class="priority-label priority-${a.priority.toLowerCase()}">${a.priority}</span></td>
                    <td data-label="Progress"><div class="progress-bar-bg"><div class="progress-bar-fill ${a.completed ? 'completed':''}" style="width: ${a.progress}%"></div></div><span style="font-size:0.8rem">${a.progress}%</span></td>
                    <td data-label="Status"><span class="asn-status ${statusClass}"><span class="asn-dot"></span> ${a.status}</span></td>
                    <td data-label="Action"><button class="secondary-btn">View</button></td>
                </tr>`;
            }).join('');
        }
        updateIcons();
    }

    ['asn-filter-status', 'asn-filter-subject', 'asn-sort-select'].forEach(id => {
        document.getElementById(id)?.addEventListener('change', applyAsnFilters);
    });
    document.getElementById('asn-search-input')?.addEventListener('input', applyAsnFilters);
    document.getElementById('asn-btn-clear-filters')?.addEventListener('click', () => {
        document.getElementById('asn-filter-status').value = "";
        document.getElementById('asn-filter-subject').value = "";
        document.getElementById('asn-search-input').value = "";
        applyAsnFilters();
    });

    // Add/Edit Modal Logic
    const formModal = document.getElementById("assignment-form-modal");
    document.getElementById("btn-add-assignment")?.addEventListener("click", () => {
        document.getElementById("assignment-form").reset();
        document.getElementById("asn-form-id").value = "";
        document.getElementById("asn-form-title").innerText = "Add Assignment";
        
        // Default date to tomorrow
        const tmrw = new Date(); tmrw.setDate(tmrw.getDate() + 1);
        document.getElementById("asn-form-date").value = tmrw.toISOString().split('T')[0];
        
        formModal.classList.add("show");
    });
    
    document.getElementById("asn-form-close")?.addEventListener("click", () => formModal.classList.remove("show"));
    document.getElementById("asn-form-cancel")?.addEventListener("click", () => formModal.classList.remove("show"));

    document.getElementById("assignment-form")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("asn-form-id").value;
        const dateStr = document.getElementById("asn-form-date").value;
        const timeStr = document.getElementById("asn-form-time").value;
        
        const data = {
            title: document.getElementById("asn-form-title-input").value,
            subject: document.getElementById("asn-form-subject").value,
            priority: document.getElementById("asn-form-priority").value,
            description: document.getElementById("asn-form-desc").value || "No description provided.",
            dueDate: new Date(`${dateStr}T${timeStr}:00`).toISOString(),
            instructor: "Unknown"
        };
        
        if (id) {
            AssignmentManager.update(id, data);
            alert("Assignment updated successfully.");
        } else {
            data.progress = 0;
            AssignmentManager.add(data);
            alert("Assignment added successfully.");
        }
        
        formModal.classList.remove("show");
        handleRoute(); // refresh view
    });

    // Details Modal Logic
    const detailModal = document.getElementById("assignment-detail-modal");
    document.getElementById("asn-detail-close")?.addEventListener("click", () => detailModal.classList.remove("show"));

    window.openAssignmentDetail = function(id) {
        const a = AssignmentManager.getById(id);
        if (!a) return;
        
        const statusClass = getStatusClass(a.status);
        
        document.getElementById("asn-detail-content").innerHTML = `
            <div class="detail-header-block">
                <div class="detail-subject">${a.subject}</div>
                <h2 class="section-title" style="margin-bottom: 8px;">${a.title}</h2>
                <div class="asn-status ${statusClass}"><span class="asn-dot"></span> ${a.status}</div>
            </div>
            
            <div class="detail-desc">${a.description}</div>
            
            <div class="detail-info-grid">
                <div class="detail-info-item"><span class="detail-info-label">Instructor</span><span class="detail-info-value">${a.instructor}</span></div>
                <div class="detail-info-item"><span class="detail-info-label">Assigned</span><span class="detail-info-value">${new Date(a.assignedDate).toLocaleDateString()}</span></div>
                <div class="detail-info-item"><span class="detail-info-label">Due Date</span><span class="detail-info-value">${new Date(a.dueDate).toLocaleDateString()} • ${new Date(a.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                <div class="detail-info-item"><span class="detail-info-label">Priority</span><span class="priority-label priority-${a.priority.toLowerCase()}" style="width:fit-content">${a.priority}</span></div>
            </div>
            
            <div class="progress-edit-block">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="font-size:1.05rem; margin:0;">Progress</h3>
                    <span style="font-size:1.1rem; font-weight:700; color:var(--primary-color);" id="modal-prog-val">${a.progress}%</span>
                </div>
                <div class="progress-input-group">
                    <input type="range" id="modal-prog-slider" min="0" max="100" value="${a.progress}">
                    <button class="secondary-btn" id="modal-btn-update-prog" style="padding: 4px 12px; font-size: 0.8rem;">Update</button>
                </div>
            </div>
            
            <div style="display:flex; gap:12px; margin-top:24px; flex-wrap:wrap;">
                <button class="primary-cta" id="modal-btn-toggle" style="flex:1;">
                    <i data-lucide="${a.completed ? 'x' : 'check'}" class="cta-icon"></i> ${a.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                </button>
                <button class="secondary-btn" id="modal-btn-edit"><i data-lucide="edit" class="inline-icon"></i> Edit</button>
                <button class="secondary-btn" id="modal-btn-delete" style="color:#ef4444; border-color:rgba(239, 68, 68, 0.3);"><i data-lucide="trash" class="inline-icon"></i> Delete</button>
            </div>
        `;
        
        detailModal.classList.add("show");
        updateIcons();
        
        // Bind Detail Actions
        const slider = document.getElementById("modal-prog-slider");
        slider.addEventListener("input", (e) => { document.getElementById("modal-prog-val").innerText = e.target.value + "%"; });
        
        document.getElementById("modal-btn-update-prog").addEventListener("click", () => {
            AssignmentManager.updateProgress(a.id, slider.value);
            detailModal.classList.remove("show");
            handleRoute();
        });
        
        document.getElementById("modal-btn-toggle").addEventListener("click", () => {
            AssignmentManager.toggleComplete(a.id);
            detailModal.classList.remove("show");
            handleRoute();
        });
        
        document.getElementById("modal-btn-edit").addEventListener("click", () => {
            detailModal.classList.remove("show");
            document.getElementById("asn-form-id").value = a.id;
            document.getElementById("asn-form-title").innerText = "Edit Assignment";
            document.getElementById("asn-form-title-input").value = a.title;
            document.getElementById("asn-form-subject").value = a.subject;
            document.getElementById("asn-form-priority").value = a.priority;
            document.getElementById("asn-form-desc").value = a.description;
            
            const due = new Date(a.dueDate);
            document.getElementById("asn-form-date").value = due.toISOString().split('T')[0];
            document.getElementById("asn-form-time").value = due.toTimeString().substring(0,5);
            
            formModal.classList.add("show");
        });
        
        document.getElementById("modal-btn-delete").addEventListener("click", () => {
            if (confirm(`Are you sure you want to delete "${a.title}"?`)) {
                AssignmentManager.delete(a.id);
                detailModal.classList.remove("show");
                handleRoute();
            }
        });
    };

    // Close modals on outside click
    document.addEventListener("click", (e) => {
        if (e.target === detailModal) detailModal.classList.remove("show");
        if (e.target === formModal) formModal.classList.remove("show");
    });


    // --- INITIALIZATION ---
    handleRoute(); 
});
