const FILES = [
    { name: 'home.md', type: 'file' },
    { name: 'education.md', type: 'file' },
    { name: 'experience.md', type: 'file' },
    { name: 'projects.md', type: 'file' },
];

const EDUCATION = [
    {
        school: 'University of British Columbia',
        degree: 'Bachelors in Computer Science and Business, B.Comm',
        date: 'Expected May 2027',
        location: 'Vancouver, BC',
        gpa: '4.33/4.33 (92%)',
        awards: [
            'Ranked 2/737',
            'Top Junior Student Award (2/2000)',
            'Trek Excellence Scholarship (Top 5%)',
            "Dean's List (3 terms)",
            'John Young Memorial Scholarship (Top 4 ECON 101/102 students)',
            'Sauder School of Business Scholarship',
        ],
        coursework: [
            'Operating Systems (98%)',
            'Computer Networking (100%)',
            'Relational Databases (97%)',
            'Software Construction (99%)',
            'Models of Computation (98%)',
            'Algorithms and Data Structures (94%)',
            'Computation & Programming (99%)',
            'Computer Systems (91%)',
        ],
    },
];

const EXPERIENCE = [
    {
        role: 'Software Engineering Intern',
        org: 'Tesla',
        link: 'https://www.tesla.com/',
        date: 'Incoming May 2026',
        desc: 'Fleetnet and Robotaxi. Working on distributed systems',
    },
    {
        role: 'Lead Software Engineer',
        org: 'UBC BizTech',
        link: 'https://www.ubcbiztech.com/',
        date: 'May 2024 – Present',
        desc: 'Enabled 4,070+ connections for 270 attendees at flagship conference with NFC cards and an internal networking platform using serverless architecture and DynamoDB. Engaged 200+ concurrent audience and judges with real-time reactions and scoring (< 100 ms response time) using a WebSocket microservice and AWS API Gateway. Automated feedback distribution for 150+ hackathon attendees and judges using z-score normalization and a NFC workflow.',
    },
    {
        role: 'Software Engineer Intern — Backend Decision Team',
        org: 'DataVisor',
        link: 'https://www.datavisor.com/',
        date: 'Jan 2025 – Apr 2025',
        desc: 'Led a business intelligence enhancement project used by 5+ clients with 1M+ users, securing dashboard embeddings by parsing tree-structured Metabase data and custom client configurations. Resolved recurring P1 issue requiring 100+ hours across 10+ infra team members by synchronizing ClickHouse table configs with post-deployment jobs across 12 environments. Eliminated 100% of manual time spent by 300+ fraud investigators templating fraud case notes by building a templating service with Liquibase-based rollback support.',
    },
    {
        role: 'Undergraduate Teaching Assistant — Software Construction | OOP',
        org: 'University of British Columbia',
        link: 'https://www.cs.ubc.ca/course-section/cpsc-210-101-2023w',
        date: 'Sept 2024 – Present',
        desc: 'Mentored over 50 students through personal office hours, guiding them through library documentation and providing design pattern advice for personal projects. Explained object-oriented programming and design concepts to over 500 students on the class discussion board, encouraging in-depth exploration of topics such as robustness and iterator implementation.',
    },
    {
        role: 'Frontend Development Intern',
        org: 'NAOS Blockchain Capital',
        link: 'https://www.naos.xyz/',
        date: 'Jan 2024 – Jul 2024',
        desc: "Increased social media impressions by 180% by integrating TikTok's oEmbed API into the company's static site, revamping the media carousel to include posts from multiple social platforms. Reduced manual customer information aggregation time by 90% by developing internal tools using Puppeteer to web scrape, parse, and export over 2 GB of data to Excel for cross-functional use.",
    },
];

const PROJECTS = [
    {
        name: 'PSync — P2P File System Mirroring',
        date: 'December 2025',
        desc: 'A peer-to-peer application layer protocol for mirroring file systems across devices. Built a signalling server for WebRTC peer discovery with public key authentication, a daemon that watches for filesystem changes and broadcasts them to peers with vector clock-based conflict resolution, and a Merkle tree structure for efficient synchronization. Designed for near real-time sync of Obsidian vaults without cloud storage.',
        link: 'https://github.com/kevinxiao27/psync',
    },
    {
        name: 'Nerve — Real-Time Emergency Dispatch Dashboard',
        date: 'March 2025',
        desc: 'ProductX Hackathon (2nd Place & CDL/Venture Founder Prize). Won $500 prize out of 60+ teams, plus CDL & Venture Founder awards. Built a real-time dashboard to stream body-cam video/audio from field units with AI-powered event summarization and sentiment detection using TensorFlow. Led architecture and data ingestion using Socket.io, Express.js, Supabase, and AssemblyAI — batching videos for ingestion and streaming updates over WebSockets.',
        link: 'https://devpost.com/software/nerve-1vlr0m',
    },
    {
        name: 'UXOpen Live Voting Platform',
        date: 'May 2024',
        desc: 'Architected and led development of core WebSocket microservice for an end-to-end live voting platform, supporting 100+ concurrent users; documented system design and database schemas for seamless handoff. Reduced DynamoDB read costs by 40% by transitioning from relational scans to a single-table query schema with Global Secondary Indexes.',
        link: 'https://github.com/ubc-biztech/serverless-biztechapp',
    },
    {
        name: 'GeoPlots',
        date: 'July 2024',
        desc: "Developed a geo-data focused journaling web app with rapid data visualization, utilizing Leaflet and Next.js for optimized data fetching. Enhanced identity and authorization with Firebase SDK for route-guarding and secured API calls. Decreased location input time by 70% using MapTiler's reverse geocoding API, mapping coordinates to addresses quickly.",
        link: 'https://github.com/kevinxiao27/geoplot',
        prod: 'https://geoplot-journal.vercel.app/',
    },
    {
        name: 'SwiftGift — ProduHacks',
        date: 'March 2024',
        desc: "Delivered personalized gift recommendations by structuring OpenAI's GPT-3.5 output based on user preferences. Refined code coupling by 40% through implementing a custom middleware to sanitize and validate user inputs. Diminished database read and write times by 30% by integrating MongoDB indexing to avoid large table scans and inefficient queries.",
        link: 'https://github.com/kevinxiao27/swiftgift',
    },
    {
        name: 'CacheYouLater — nwHacks 2024',
        date: 'January 2024',
        desc: 'nwHacks submission for community and connection based on real life and virtual geocaching integration. Utilizing a noSQL database through a RESTFUL API with user authentication and JWT Token, I seamlessly integrated the backend and frontend using Next.js.',
        link: 'https://github.com/kevinxiao27/movie-ticket-booking',
    },
];

// ── State ────────────────────────────────────────────

const Mode = { IDLE: 'IDLE', FILE_TREE: 'FILE_TREE', FILE_CONTENT: 'FILE_CONTENT', HELP: 'HELP', KILLED: 'KILLED' };

const state = {
    mode: Mode.IDLE,
    overlayOpen: false,
    cursor: 0,
    contentCursor: 0,
    openFile: null,
    countStr: '',
    pendingG: false,
};

// ── DOM ──────────────────────────────────────────────

const $content = document.getElementById('content');
const $terminal = document.getElementById('terminal');
const $modeIndicator = document.getElementById('mode-indicator');
const $currentPath = document.getElementById('current-path');
const $cursorPos = document.getElementById('cursor-pos');
const $commandBar = document.getElementById('command-bar');
const $commandInput = document.getElementById('command-input');
const $countDisplay = document.getElementById('count-display');
const $notification = document.getElementById('notification');


// ── Hash Routing ──────────────────────────────────────

function getHashForState() {
    if (state.mode === Mode.FILE_CONTENT && state.openFile) return '#/' + state.openFile;
    if (state.overlayOpen) return '#/';
    return '';
}

function updateHash() {
    history.replaceState(null, '', getHashForState());
}

function pushHash() {
    history.pushState(null, '', getHashForState());
}

function handleHash() {
    const h = location.hash;
    if (h.startsWith('#/') && h.length > 2) {
        const fileName = h.slice(2);
        if (FILES.some(f => f.name === fileName)) {
            state.mode = Mode.FILE_CONTENT;
            state.openFile = fileName;
            state.contentCursor = 0;
            state.overlayOpen = true;
            state.countStr = '';
            state.pendingG = false;
            render();
            return;
        }
    }
    if (h === '#/') {
        state.mode = Mode.FILE_TREE;
        state.overlayOpen = true;
        state.openFile = null;
        state.cursor = 0;
        state.countStr = '';
        state.pendingG = false;
        render();
        return;
    }
    state.mode = Mode.IDLE;
    state.overlayOpen = false;
    state.openFile = null;
    state.countStr = '';
    state.pendingG = false;
    render();
}

window.addEventListener('popstate', handleHash);

// ── Background ───────────────────────────────────────

// ── Helpers ──────────────────────────────────────────

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showNotification(msg) {
    $notification.textContent = msg;
    $notification.classList.remove('hidden');
    clearTimeout(showNotification._t);
    showNotification._t = setTimeout(() => $notification.classList.add('hidden'), 1500);
}

function extractDomain(url) {
    try { return new URL(url).hostname + new URL(url).pathname.replace(/\/$/, ''); }
    catch { return url; }
}

function getVisibleFiles() {
    return FILES;
}

function clampCursor() {
    const n = getVisibleFiles().length;
    if (state.cursor < 0) state.cursor = 0;
    if (state.cursor >= n) state.cursor = n - 1;
}

function getCount() {
    const n = parseInt(state.countStr) || 1;
    state.countStr = '';
    return n;
}

function wrapText(text, width) {
    const words = text.split(' ');
    const lines = [];
    let line = '';
    words.forEach(word => {
        if (line.length + word.length + 1 > width) {
            lines.push(line);
            line = word;
        } else {
            line = line ? line + ' ' + word : word;
        }
    });
    if (line) lines.push(line);
    return lines;
}

// ── Content Lines ────────────────────────────────────

function buildHomeLines() {
    return [
        { html: '<span class="heading">Kevin Xiao</span>' },
        { html: '<span class="subheading">CS + Business @ UBC · Incoming @ Tesla</span>' },
        { html: '' },
        { html: '<span class="divider-line">────────────────────────────────────────</span>' },
        { html: '' },
        { html: '<span class="prompt">&gt;</span> <a class="link" href="https://github.com/kevinxiao27" target="_blank" rel="noopener">github.com/kevinxiao27</a>' },
        { html: '<span class="prompt">&gt;</span> <a class="link" href="https://www.linkedin.com/in/kevinxiaoxyz/" target="_blank" rel="noopener">linkedin.com/in/kevinxiaoxyz</a>' },
        { html: '<span class="prompt">&gt;</span> <a class="link" href="mailto:kevin.xiao27@gmail.com" target="_blank" rel="noopener">kevin.xiao27@gmail.com</a>' },
        { html: '' },
        { html: '<span class="divider-line">────────────────────────────────────────</span>' },
        { html: '' },
    ];
}

function buildExperienceLines() {
    const lines = [];
    EXPERIENCE.forEach((exp, i) => {
        if (i > 0) {
            lines.push({ html: '' });
            lines.push({ html: '<span class="divider-line">────────────────────────────────────────</span>' });
            lines.push({ html: '' });
        }
        lines.push({ html: `<span class="heading">${escapeHtml(exp.role)}</span>` });
        lines.push({ html: `<span class="subheading"><a class="link" href="${exp.link}" target="_blank" rel="noopener">${escapeHtml(exp.org)}</a> · ${escapeHtml(exp.date)}</span>` });
        lines.push({ html: '' });
        wrapText(exp.desc, 76).forEach(l => lines.push({ html: escapeHtml(l) }));
    });
    return lines;
}

function buildEducationLines() {
    const lines = [];
    EDUCATION.forEach((edu, i) => {
        if (i > 0) {
            lines.push({ html: '' });
            lines.push({ html: '<span class="divider-line">────────────────────────────────────────</span>' });
            lines.push({ html: '' });
        }
        lines.push({ html: `<span class="heading">${escapeHtml(edu.degree)}</span>` });
        lines.push({ html: `<span class="subheading">${escapeHtml(edu.school)} · ${escapeHtml(edu.date)}</span>` });
        lines.push({ html: `<span class="subheading">${escapeHtml(edu.location)} · GPA: ${escapeHtml(edu.gpa)}</span>` });
        lines.push({ html: '' });
        lines.push({ html: '<span class="prompt">Awards</span>' });
        edu.awards.forEach(award => {
            lines.push({ html: `<span class="prompt">▸</span> ${escapeHtml(award)}` });
        });
        lines.push({ html: '' });
        lines.push({ html: '<span class="prompt">Relevant Coursework</span>' });
        edu.coursework.forEach(course => {
            lines.push({ html: `<span class="prompt">▸</span> ${escapeHtml(course)}` });
        });
    });
    return lines;
}

function buildProjectLines() {
    const lines = [];
    PROJECTS.forEach((proj, i) => {
        if (i > 0) {
            lines.push({ html: '' });
            lines.push({ html: '<span class="divider-line">────────────────────────────────────────</span>' });
            lines.push({ html: '' });
        }
        lines.push({ html: `<span class="heading">${escapeHtml(proj.name)}</span>` });
        lines.push({ html: `<span class="subheading">${escapeHtml(proj.date)}</span>` });
        lines.push({ html: '' });
        wrapText(proj.desc, 76).forEach(l => lines.push({ html: escapeHtml(l) }));
        lines.push({ html: '' });
        lines.push({ html: `<span class="prompt">&gt;</span> <a class="link" href="${proj.link}" target="_blank" rel="noopener">${extractDomain(proj.link)}</a>` });
        if (proj.prod) {
            lines.push({ html: `<span class="prompt">&gt;</span> <a class="link" href="${proj.prod}" target="_blank" rel="noopener">${extractDomain(proj.prod)}</a>` });
        }
    });
    return lines;
}

// ── Render ───────────────────────────────────────────

function render() {
    switch (state.mode) {
        case Mode.IDLE: renderSplash(); break;
        case Mode.FILE_TREE: renderFileTree(); break;
        case Mode.FILE_CONTENT: renderFileContent(); break;
        case Mode.HELP: renderHelp(); break;
        case Mode.KILLED: renderKillScreen(); break;
    }
    updateStatusBar();
}

function updateStatusBar() {
    $modeIndicator.textContent = state.mode === Mode.KILLED ? 'KILLED' : 'NORMAL';
    $modeIndicator.className = '';

    let path = '~/portfolio';
    if (state.mode === Mode.FILE_CONTENT) path = `~/portfolio/${state.openFile}`;
    else if (state.mode === Mode.HELP) path = '~/help';
    else if (state.mode === Mode.KILLED) path = '~/dead';
    $currentPath.textContent = path;

    if (state.mode === Mode.FILE_TREE) {
        $cursorPos.textContent = `${state.cursor + 1}/${FILES.length}`;
    } else if (state.mode === Mode.FILE_CONTENT) {
        $cursorPos.innerHTML = '<span class="readonly-badge">[readonly]</span>';
    } else {
        $cursorPos.textContent = '';
    }

    $countDisplay.textContent = state.countStr;
}

function renderSplash() {
    $content.innerHTML = `
    <div class="splash">
      <div class="name">Kevin Xiao</div>
      <div class="bio">CS + Business @ UBC</div>
      <div class="bio">Incoming @ Tesla</div>
      <div class="links">
        <a href="https://github.com/kevinxiao27" target="_blank" rel="noopener">github.com/kevinxiao27</a>
        <a href="https://www.linkedin.com/in/kevinxiaoxyz/" target="_blank" rel="noopener">linkedin.com/in/kevinxiaoxyz</a>
        <a href="mailto:kevin.xiao27@gmail.com" target="_blank" rel="noopener">kevin.xiao27@gmail.com</a>
      </div>
      <div class="hint" id="splash-hint">press <kbd>-</kbd> to explore. type <kbd>:help</kbd> for commands.</div>
    </div>
  `;
}

function renderFileTree() {
    const files = FILES;
    if (state.cursor >= files.length) state.cursor = files.length - 1;

    let html = '<div class="file-tree">';
    files.forEach((file, i) => {
        const isCursor = i === state.cursor;
        const dist = Math.abs(i - state.cursor);
        const lineNum = isCursor ? (i + 1) : dist;
        const [base, ...rest] = file.name.split('.');
        const ext = rest.length ? '.' + rest.join('.') : '';
        html += `
      <div class="file-line${isCursor ? ' cursor' : ''}" data-index="${i}">
        <span class="line-number">${lineNum}</span>
        <span class="file-icon">📄</span>
        <span class="file-name">${base}<span class="ext">${ext}</span></span>
      </div>
    `;
    });
    html += '</div>';
    $content.innerHTML = html;

    // auto-scroll to keep cursor visible
    const cursorEl = $content.querySelector('.file-line.cursor');
    if (cursorEl) {
        const containerRect = $content.getBoundingClientRect();
        const cursorRect = cursorEl.getBoundingClientRect();
        if (state.cursor === 0) {
            $content.scrollTop = 0;
        } else if (cursorRect.top < containerRect.top + 32) {
            cursorEl.scrollIntoView({ block: 'start', behavior: 'instant' });
        } else if (cursorRect.bottom > containerRect.bottom - 32) {
            cursorEl.scrollIntoView({ block: 'end', behavior: 'instant' });
        }
    }
}

function renderFileContent() {
    let lines;
    switch (state.openFile) {
        case 'home.md': lines = buildHomeLines(); break;
        case 'experience.md': lines = buildExperienceLines(); break;
        case 'education.md': lines = buildEducationLines(); break;
        case 'projects.md': lines = buildProjectLines(); break;
        default:
            $content.innerHTML = '<div class="no-results">file not found</div>';
            return;
    }

    if (lines.length === 0) return;
    if (state.contentCursor >= lines.length) state.contentCursor = lines.length - 1;

    let html = '<div class="content-lines">';
    html += '<div class="back-btn"><span class="back-arrow">←</span> back to file tree</div>';
    lines.forEach((line, i) => {
        const isCursor = i === state.contentCursor;
        const dist = Math.abs(i - state.contentCursor);
        const lineNum = isCursor ? (i + 1) : dist;
        html += `
      <div class="content-line${isCursor ? ' cursor' : ''}">
        <span class="line-number">${lineNum}</span>
        <span class="line-text">${line.html}</span>
      </div>
    `;
    });
    html += '</div>';
    $content.innerHTML = html;
 
    // auto-scroll to keep cursor visible
    const cursorEl = $content.querySelector('.content-line.cursor');
    if (cursorEl) {
        const containerRect = $content.getBoundingClientRect();
        const cursorRect = cursorEl.getBoundingClientRect();
        if (state.contentCursor === 0) {
            $content.scrollTop = 0;
        } else if (cursorRect.top < containerRect.top + 64) {
            cursorEl.scrollIntoView({ block: 'start', behavior: 'instant' });
        } else if (cursorRect.bottom > containerRect.bottom - 32) {
            cursorEl.scrollIntoView({ block: 'end', behavior: 'instant' });
        }
    }
}

function renderHelp() {
    const lines = [
        { html: '<span class="heading">Navigation</span>' },
        { html: '' },
        { html: '  <span class="prompt">-</span>           open / close file tree' },
        { html: '  <span class="prompt">j</span> / <span class="prompt">k</span>       move cursor down / up' },
        { html: '  <span class="prompt">l</span> / <span class="prompt">Enter</span>   open file / follow link' },
        { html: '  <span class="prompt">h</span> / <span class="prompt">Esc</span>     go back' },
        { html: '  <span class="prompt">gg</span>          go to first line' },
        { html: '  <span class="prompt">G</span>           go to last line' },
        { html: '' },
        { html: '<span class="heading">Commands</span>' },
        { html: '' },
        { html: '  <span class="prompt">:help</span>       show this help' },
        { html: '  <span class="prompt">:kill</span>       terminate portfolio' },
        { html: '  <span class="prompt">:q</span>          close overlay' },
        { html: '  <span class="prompt">:fullscreen</span> toggle fullscreen' },
        { html: '' },
        { html: '<span class="heading">Title Bar</span>' },
        { html: '' },
        { html: '  <span class="help-dot-red">&#9679;</span> red       terminate portfolio' },
        { html: '  <span class="prompt">&#9679;</span> green     toggle fullscreen' },
        { html: '' },
        { html: '<span class="heading">Files</span>' },
        { html: '' },
        { html: '  <span class="prompt">home.md</span>        about me' },
        { html: '  <span class="prompt">education.md</span>    education & awards' },
        { html: '  <span class="prompt">experience.md</span>   work history' },
        { html: '  <span class="prompt">projects.md</span>     selected projects' },
        { html: '' },
        { html: '<span class="divider-line">────────────────────────────────────────</span>' },
        { html: '' },
        { html: '<span class="subheading">press any key to close</span>' },
    ];

    let html = '<div class="content-lines help-screen">';
    lines.forEach((line, _) => {
        html += `
      <div class="content-line">
        <span class="line-number" style="visibility:hidden">0</span>
        <span class="line-text">${line.html}</span>
      </div>
    `;
    });
    html += '</div>';
    $content.innerHTML = html;
}

function renderKillScreen() {
    $content.innerHTML = `
    <div class="kill-screen">
      <div class="kill-command">$ kill -9 portfolio</div>
      <div class="kill-msg">&cross; Process terminated.</div>
      <div class="kill-sub">But I'm still here. Contact me:</div>
      <div class="kill-links">
        <a href="https://github.com/kevinxiao27" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/kevinxiaoxyz/" target="_blank" rel="noopener">LinkedIn</a>
        <span class="kill-reopen" id="kill-reopen">Reopen terminal</span>
      </div>
    </div>
  `;
}

// ── Command Mode ─────────────────────────────────────

function openCommand() {
    $commandBar.classList.remove('hidden');
    $commandInput.value = '';
    $commandInput.focus();
}

function closeCommand() {
    $commandBar.classList.add('hidden');
    $commandInput.blur();
}

function executeCommand(cmd) {
    const trimmed = cmd.trim();
    if (trimmed === 'wq' || trimmed === 'q' || trimmed === 'q!' || trimmed === 'qa') {
        if (state.mode === Mode.IDLE) {
            triggerKill();
        } else {
            closeOverlay();
        }
    } else if (trimmed === 'help') {
        state.mode = Mode.HELP;
        state.overlayOpen = false;
        history.replaceState(null, '', '');
        render();
    } else if (trimmed === 'kill') {
        triggerKill();
    } else if (trimmed === 'fullscreen') {
        toggleFullscreen();
    }
}

$commandInput.addEventListener('keydown', e => {
    e.stopPropagation();
    if (e.key === 'Escape') { e.preventDefault(); closeCommand(); return; }
    if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand($commandInput.value);
        closeCommand();
        return;
    }
});

// ── Title Bar Dots ────────────────────────────────────

function toggleFullscreen() {
    $terminal.classList.toggle('terminal-fullscreen');
}

function triggerKill() {
    state.mode = Mode.KILLED;
    state.overlayOpen = false;
    state.openFile = null;
    state.countStr = '';
    state.pendingG = false;
    history.replaceState(null, '', '');
    render();
}

document.getElementById('title-bar').addEventListener('click', e => {
    const dot = e.target.closest('.dot');
    if (!dot) return;
    if (dot.classList.contains('dot-red')) {
        triggerKill();
    } else if (dot.classList.contains('dot-green')) {
        toggleFullscreen();
    }
});

// ── Click Handling ────────────────────────────────────

$content.addEventListener('click', e => {
    // don't intercept link clicks
    if (e.target.closest('a')) return;

    // splash: click hint to open overlay
    if (state.mode === Mode.IDLE) {
        if (e.target.closest('#splash-hint') || e.target.closest('.splash')) {
            openOverlay();
        }
        return;
    }

    // kill screen: click reopen
    if (state.mode === Mode.KILLED) {
        if (e.target.closest('#kill-reopen')) {
            state.mode = Mode.IDLE;
            render();
        }
        return;
    }

    // help: click anywhere to dismiss
    if (state.mode === Mode.HELP) {
        state.mode = Mode.IDLE;
        render();
        return;
    }

    // file tree: click a file entry to open it
    if (state.mode === Mode.FILE_TREE) {
        const fileLine = e.target.closest('.file-line');
        if (fileLine) {
            const idx = parseInt(fileLine.dataset.index, 10);
            if (!isNaN(idx)) {
                state.cursor = idx;
                openFile(idx);
            }
        }
        return;
    }

    // file content: click a line to move cursor, or back button
    if (state.mode === Mode.FILE_CONTENT) {
        if (e.target.closest('.back-btn')) {
            closeFile();
            return;
        }
        const contentLine = e.target.closest('.content-line');
        if (contentLine) {
            const lines = Array.from($content.querySelectorAll('.content-line'));
            const idx = lines.indexOf(contentLine);
            if (idx >= 0) {
                state.contentCursor = idx;
                updateHash();
                render();
            }
        }
        return;
    }
});

// ── Overlay ──────────────────────────────────────────

function openOverlay() {
    state.overlayOpen = true;
    state.mode = Mode.FILE_TREE;
    state.cursor = 0;
    state.countStr = '';
    state.pendingG = false;
    pushHash();
    render();
}

function closeOverlay() {
    state.overlayOpen = false;
    state.mode = Mode.IDLE;
    state.openFile = null;
    state.countStr = '';
    state.pendingG = false;
    history.replaceState(null, '', '');
    render();
}

function openFile(index) {
    const files = getVisibleFiles();
    if (index < 0 || index >= files.length) return;
    const wasContent = state.mode === Mode.FILE_CONTENT;
    state.mode = Mode.FILE_CONTENT;
    state.openFile = files[index].name;
    state.contentCursor = 0;
    state.countStr = '';
    if (wasContent) {
        updateHash();
    } else {
        pushHash();
    }
    render();
}

function closeFile() {
    state.mode = Mode.FILE_TREE;
    state.openFile = null;
    state.contentCursor = 0;
    updateHash();
    render();
}

// ── Keybinds ─────────────────────────────────────────

let gTimeout = null;

document.addEventListener('keydown', e => {
    if (document.activeElement === $commandInput) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // killed: block all input
    if (state.mode === Mode.KILLED) {
        e.preventDefault();
        return;
    }

    // help: dismiss on any key
    if (state.mode === Mode.HELP) {
        e.preventDefault();
        state.mode = Mode.IDLE;
        render();
        return;
    }

    const key = e.key;

    // global: toggle overlay / back
    if (key === '-') {
        e.preventDefault();
        if (state.mode === Mode.FILE_CONTENT) {
            closeFile();
        } else if (state.overlayOpen) {
            closeOverlay();
        } else {
            openOverlay();
        }
        return;
    }

    if (state.mode === Mode.IDLE) {
        if (key === ':') {
            e.preventDefault();
            e.stopPropagation();
            openCommand();
        }
        return;
    }

    // ── FILE_TREE ──────────────────────────────────────
    if (state.mode === Mode.FILE_TREE) {
        e.preventDefault();

        if (/^[0-9]$/.test(key)) {
            if (state.countStr === '' && key === '0') return;
            state.countStr += key;
            updateStatusBar();
            return;
        }

        if (state.pendingG) {
            state.pendingG = false;
            clearTimeout(gTimeout);
            if (key === 'g') {
                const count = getCount();
                state.cursor = count > 1 ? Math.min(count - 1, getVisibleFiles().length - 1) : 0;
                render();
                return;
            }
        }

        switch (key) {
            case 'j': case 'ArrowDown': {
                const n = getCount();
                state.cursor = Math.min(state.cursor + n, getVisibleFiles().length - 1);
                render();
                break;
            }
            case 'k': case 'ArrowUp': {
                const n = getCount();
                state.cursor = Math.max(state.cursor - n, 0);
                render();
                break;
            }
            case 'l': case 'Enter': case 'ArrowRight':
                getCount();
                openFile(state.cursor);
                break;
            case 'h': case 'Escape': case 'ArrowLeft':
                getCount();
                closeOverlay();
                break;
            case 'g':
                state.pendingG = true;
                gTimeout = setTimeout(() => { state.pendingG = false; }, 500);
                break;
            case 'G': {
                const n = getCount();
                state.cursor = n > 1
                    ? Math.min(n - 1, FILES.length - 1)
                    : FILES.length - 1;
                render();
                break;
            }
            case ':':
                getCount();
                openCommand();
                break;
            case 'i':
                showNotification('E21: read-only mode');
                getCount();
                break;
            default:
                getCount();
                break;
        }
        return;
    }

    // ── FILE_CONTENT ───────────────────────────────────
    if (state.mode === Mode.FILE_CONTENT) {
        e.preventDefault();

        if (/^[0-9]$/.test(key)) {
            if (state.countStr === '' && key === '0') return;
            state.countStr += key;
            updateStatusBar();
            return;
        }

        const totalLines = $content.querySelectorAll('.content-line').length;

        if (state.pendingG) {
            state.pendingG = false;
            clearTimeout(gTimeout);
            if (key === 'g') {
                const count = getCount();
                state.contentCursor = count > 1 ? Math.min(count - 1, totalLines - 1) : 0;
                render();
                return;
            }
        }

        switch (key) {
            case 'j': case 'ArrowDown': {
                const n = getCount();
                state.contentCursor = Math.min(state.contentCursor + n, totalLines - 1);
                render();
                break;
            }
            case 'k': case 'ArrowUp': {
                const n = getCount();
                state.contentCursor = Math.max(state.contentCursor - n, 0);
                render();
                break;
            }
            case 'h': case 'Escape': case 'ArrowLeft':
                getCount();
                closeFile();
                break;
            case 'g':
                state.pendingG = true;
                gTimeout = setTimeout(() => { state.pendingG = false; }, 500);
                break;
            case 'G': {
                const n = getCount();
                state.contentCursor = n > 1
                    ? Math.min(n - 1, totalLines - 1)
                    : totalLines - 1;
                render();
                break;
            }
            case 'l': case 'ArrowRight': {
                const cursorEl = $content.querySelector('.content-line.cursor');
                if (cursorEl) {
                    const link = cursorEl.querySelector('a.link');
                    if (link) window.open(link.href, '_blank', 'noopener');
                }
                getCount();
                break;
            }
            case ':':
                getCount();
                openCommand();
                break;
            case 'i':
                showNotification('E21: read-only mode');
                getCount();
                break;
            default:
                getCount();
                break;
        }
        return;
    }
});

// ── Init ─────────────────────────────────────────────
if (location.hash) {
    handleHash();
} else {
    render();
}
