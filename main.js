const FILES = [
    { name: 'about-me.md', type: 'file' },
    { name: 'experience.md', type: 'file' },
    { name: 'leadership.md', type: 'file' },
    { name: 'projects.md', type: 'file' },
    { name: 'links.md', type: 'file' },
];

const EDUCATION = [
    {
        school: 'University of British Columbia',
        degree: 'Bachelors in Computer Science and Business, B.Comm',
        date: 'Expected May 2028',
        location: 'Vancouver, BC',
        gpa: '4.33',
        awards: [
            "Stuart Clark Gilmour Memorial Scholarship in Commerce ('26)",
            "Trek Excellence Scholarship ('24, '25, '26)",
            "Dean's List ('24, '25, '26)",
            "Sauder School of Business Scholarship ('25)",
            "CUS Junior Award ('25)",
            "John Young Memorial Prize in Economics ('24)",
        ],
        coursework: [
            'Operating Systems (98%)',
            'Computer Networking (100%)',
            'Algorithmic Design and Analysis (96%)',
        ],
    },
];

const EXPERIENCE = [
    {
        role: 'Research Intern',
        org: 'Systopia Lab',
        link: 'https://systopia.cs.ubc.ca/',
        date: 'Sep 2026 – Present · Hybrid',
        desc: [
            'Extending Bubbles, a systematic concurrency-testing framework for Go distributed systems, to control and replay goroutine schedules and inter-node RPC delivery.',
            'Evaluating Bubbles against real-world Go systems to measure concurrency bug discovery, deterministic reproduction, integration friction, schedule-search effectiveness, and runtime overhead.',
        ],
    },
    {
        role: 'Software Engineering Intern',
        org: 'Tesla – FleetNet',
        link: 'https://www.tesla.com/',
        date: 'May 2026 – Aug 2026 · Palo Alto, CA',
        desc: [
            'Recovered $30K/month in Robotaxi revenue by eliminating a distributed billing race, deriving final payment details instead of relying on trip data produced by competing writers.',
            'Engineered production-faithful testing for 1B+ in-car assistant interactions by streaming Opus-in-Ogg over QUIC and encapsulating multi-turn vehicle/tool state machines to exercise production server paths.',
            'Designed an idempotent FSD trial-notification pipeline for 1.5M+ European vehicles, using an in-memory cache and telemetry snapshot backfills to reconcile missed eligibility transitions and support global rollout.',
            'Expanded WebRTC dashcam streaming to new fleet types and scaled TURN/ICE infrastructure to support 10,000+ concurrent sessions and 10+ TB/day of real-time video traffic.',
        ],
    },
    {
        role: 'Software Engineering Intern',
        org: 'DataVisor',
        link: 'https://www.datavisor.com/',
        date: 'Jan 2025 – Apr 2025 · Mountain View, CA',
        desc: [
            'Built a MySQL-backed coordination layer using serializable transactions to apply logical ClickHouse configuration changes exactly once across A/B clusters, ensuring consistent cross-region rollouts.',
            'Secured dashboard embedding for 5+ enterprise clients (1M+ users) by engineering a server-side JWT authentication system with Metabase and ZooKeeper integration.',
        ],
    },
];

const LEADERSHIP = [
    {
        role: 'Teaching Assistant – Computer Hardware and Operating Systems (CPSC 313)',
        org: 'University of British Columbia',
        link: 'https://www.ubc.ca/',
        date: 'Sep 2026 · Vancouver, BC',
        desc: [
            'Taught 300+ students computer systems and operating systems concepts through labs and office hours, covering pipelining, caches, threads, and processes.',
        ],
    },
    {
        role: 'Lead Software Engineer',
        org: 'UBC BizTech',
        link: 'https://www.ubcbiztech.com/',
        date: 'May 2025 – Apr 2026 · Vancouver, BC',
        desc: [
            'Enabled 10k+ networking interactions via custom NFC hardware integration, contributing to Club of the Year and Conference of the Year awards and driving a 30% YoY increase in attendee retention.',
            'Led and mentored 10 engineers in delivering full-stack projects, conducting code reviews and guiding technical design, development, and deployment.',
        ],
    },
    {
        role: 'Teaching Assistant – Object-Oriented Programming (CPSC 210)',
        org: 'University of British Columbia',
        link: 'https://www.cs.ubc.ca/course-section/cpsc-210-101-2023w',
        date: 'Sep 2024 – Dec 2024 · Vancouver, BC',
        desc: [
            'Facilitated learning for 500+ students in Object-Oriented Design and Java; conducted code reviews and labs to reinforce abstraction, polymorphism, and design patterns.',
        ],
    },
];

const PROJECTS = [
    {
        name: 'PSync – Decentralized File Synchronization System',
        date: 'Dec 2025',
        desc: [
            'Developed P2P file sync daemon in Go with WebRTC and vector clock-based gossip protocol, achieving ≤ 50ms sync and 40x faster performance than cloud-based alternatives with zero server-side storage.',
            'Implemented SHA-256 Merkle tree reconciliation in Go for efficient comparison and deterministic conflict resolution, enabling efficient sync across 10K+ files with causal consistency guarantees.',
        ],
        link: 'https://github.com/kevinxiao27/psync',
    },
    {
        name: 'Nerve – Real-Time Emergency Dispatch Dashboard',
        date: 'Mar 2025',
        desc: [
            'Placed 2nd, winning $2000 prize out of 60+ teams, including the CDL & Venture Founder prize.',
            'Built a React dashboard for emergency responders with live video streaming and TensorFlow sentiment analysis.',
        ],
        link: 'https://devpost.com/software/nerve-1vlr0m',
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
    relativeNumbers: false,
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

function appendDescriptionLines(lines, descriptions) {
    descriptions.forEach(description => {
        const wrapped = wrapText(description, 74);
        wrapped.forEach((line, i) => {
            lines.push({ html: `${i === 0 ? '<span class="prompt">▸</span> ' : '  '}${escapeHtml(line)}` });
        });
    });
}

// ── Content Lines ────────────────────────────────────

function buildAboutMeLines() {
    const lines = [
        { html: '<span class="heading">Kevin Xiao</span>' },
        { html: '<span class="subheading">CS + Business @ UBC · Prev @ Tesla</span>' },
        { html: '<span class="subheading">I solve problems at the intersection of complex systems and effective interfaces.</span>' },
        { html: '' },
        { html: '<span class="divider-line">────────────────────────────────────────</span>' },
        { html: '' },
    ];
    return lines.concat(buildEducationLines());
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
        appendDescriptionLines(lines, exp.desc);
    });
    return lines;
}

function buildLeadershipLines() {
    const lines = [];
    LEADERSHIP.forEach((entry, i) => {
        if (i > 0) {
            lines.push({ html: '' });
            lines.push({ html: '<span class="divider-line">────────────────────────────────────────</span>' });
            lines.push({ html: '' });
        }
        lines.push({ html: `<span class="heading">${escapeHtml(entry.role)}</span>` });
        lines.push({ html: `<span class="subheading"><a class="link" href="${entry.link}" target="_blank" rel="noopener">${escapeHtml(entry.org)}</a> · ${escapeHtml(entry.date)}</span>` });
        lines.push({ html: '' });
        appendDescriptionLines(lines, entry.desc);
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
        lines.push({ html: '<span class="prompt">Awards and Scholarships:</span>' });
        edu.awards.forEach(award => {
            lines.push({ html: `<span class="prompt">-</span> ${escapeHtml(award)}` });
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
        appendDescriptionLines(lines, proj.desc);
        lines.push({ html: '' });
        lines.push({ html: `<span class="prompt">&gt;</span> <a class="link" href="${proj.link}" target="_blank" rel="noopener">${extractDomain(proj.link)}</a>` });
        if (proj.prod) {
            lines.push({ html: `<span class="prompt">&gt;</span> <a class="link" href="${proj.prod}" target="_blank" rel="noopener">${extractDomain(proj.prod)}</a>` });
        }
    });
    return lines;
}

function buildLinkLines() {
    return [
        { html: '<span class="prompt">&gt;</span> <a class="link" href="https://github.com/kevinxiao27" target="_blank" rel="noopener">github.com/kevinxiao27</a>' },
        { html: '<span class="prompt">&gt;</span> <a class="link" href="https://www.linkedin.com/in/kevxiao/" target="_blank" rel="noopener">linkedin.com/in/kevxiao</a>' },
        { html: '<span class="prompt">&gt;</span> <a class="link" href="mailto:kevin.xiao27@gmail.com">kevin.xiao27@gmail.com</a>' },
    ];
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
    $modeIndicator.textContent = state.mode === Mode.KILLED ? '' : 'NORMAL';
    $modeIndicator.className = '';

    let path = '~/portfolio';
    if (state.mode === Mode.FILE_CONTENT) path = `~/portfolio/${state.openFile}`;
    else if (state.mode === Mode.HELP) path = '~/help';
    else if (state.mode === Mode.KILLED) path = '~/';
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
      <div class="bio">Prev @ Tesla</div>
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
        const lineNum = state.relativeNumbers && !isCursor ? dist : i + 1;
        const [base, ...rest] = file.name.split('.');
        const ext = rest.length ? '.' + rest.join('.') : '';
        html += `
      <div class="file-line${isCursor ? ' cursor' : ''}" data-index="${i}">
        <span class="line-number">${lineNum}</span>
        <span class="file-icon" aria-hidden="true"></span>
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
        case 'about-me.md': lines = buildAboutMeLines(); break;
        case 'experience.md': lines = buildExperienceLines(); break;
        case 'leadership.md': lines = buildLeadershipLines(); break;
        case 'projects.md': lines = buildProjectLines(); break;
        case 'links.md': lines = buildLinkLines(); break;
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
        const lineNum = state.relativeNumbers && !isCursor ? dist : i + 1;
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
        { html: '  <span class="prompt">[n]G</span>        go to file / line n' },
        { html: '' },
        { html: '<span class="heading">Commands</span>' },
        { html: '' },
        { html: '  <span class="prompt">:help</span>       show this help' },
        { html: '  <span class="prompt">:kill</span>       terminate portfolio' },
        { html: '  <span class="prompt">:q</span>          close overlay' },
        { html: '  <span class="prompt">:rnu</span>        toggle relative line numbers' },
        { html: '  <span class="prompt">:fullscreen</span> toggle fullscreen' },
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
      <div class="kill-msg">Process terminated</div>
      <span class="kill-reopen" id="kill-reopen">Reopen vim-folio</span>
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
    } else if (trimmed === 'rnu') {
        state.relativeNumbers = !state.relativeNumbers;
        render();
        showNotification(state.relativeNumbers ? 'relative line numbers' : 'absolute line numbers');
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
