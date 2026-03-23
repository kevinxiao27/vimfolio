const FILES = [
    { name: 'home.md', type: 'file' },
    { name: 'experience.md', type: 'file' },
    { name: 'projects.md', type: 'file' },
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

const Mode = { IDLE: 'IDLE', FILE_TREE: 'FILE_TREE', FILE_CONTENT: 'FILE_CONTENT', SEARCH: 'SEARCH' };

const state = {
    mode: Mode.IDLE,
    overlayOpen: false,
    cursor: 0,
    contentCursor: 0,
    openFile: null,
    searchQuery: '',
    countStr: '',
    pendingG: false,
};

// ── DOM ──────────────────────────────────────────────

const $content = document.getElementById('content');
const $modeIndicator = document.getElementById('mode-indicator');
const $currentPath = document.getElementById('current-path');
const $cursorPos = document.getElementById('cursor-pos');
const $searchBar = document.getElementById('search-bar');
const $searchInput = document.getElementById('search-input');
const $commandBar = document.getElementById('command-bar');
const $commandInput = document.getElementById('command-input');
const $countDisplay = document.getElementById('count-display');


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
            state.searchQuery = '';
            $searchBar.classList.add('hidden');
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
        state.searchQuery = '';
        $searchBar.classList.add('hidden');
        render();
        return;
    }
    state.mode = Mode.IDLE;
    state.overlayOpen = false;
    state.openFile = null;
    state.searchQuery = '';
    state.countStr = '';
    state.pendingG = false;
    $searchBar.classList.add('hidden');
    render();
}

window.addEventListener('popstate', handleHash);

// ── Background ───────────────────────────────────────

// ── Helpers ──────────────────────────────────────────

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function extractDomain(url) {
    try { return new URL(url).hostname + new URL(url).pathname.replace(/\/$/, ''); }
    catch { return url; }
}

function getVisibleFiles() {
    if (state.searchQuery) return FILES.filter(f => f.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
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
        case Mode.SEARCH: renderFileTree(); break;
    }
    updateStatusBar();
}

function updateStatusBar() {
    $modeIndicator.textContent = state.mode === Mode.SEARCH ? 'SEARCH' : 'NORMAL';
    $modeIndicator.className = state.mode === Mode.SEARCH ? 'search-mode' : '';

    const path = state.mode === Mode.FILE_CONTENT ? `~/portfolio/${state.openFile}` : '~/portfolio';
    $currentPath.textContent = path;

    if (state.mode === Mode.FILE_TREE || state.mode === Mode.SEARCH) {
        $cursorPos.textContent = `${state.cursor + 1}/${getVisibleFiles().length}`;
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
      <div class="hint" id="splash-hint">press <kbd>-</kbd> to explore. Inspired by nvim. </div>
    </div>
  `;
}

function renderFileTree() {
    const files = getVisibleFiles();
    if (files.length === 0) {
        $content.innerHTML = '<div class="no-results">no matches found</div>';
        return;
    }
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
}

function renderFileContent() {
    let lines;
    switch (state.openFile) {
        case 'home.md': lines = buildHomeLines(); break;
        case 'experience.md': lines = buildExperienceLines(); break;
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
        if (cursorRect.top < containerRect.top + 64) {
            cursorEl.scrollIntoView({ block: 'start', behavior: 'instant' });
        } else if (cursorRect.bottom > containerRect.bottom - 32) {
            cursorEl.scrollIntoView({ block: 'end', behavior: 'instant' });
        }
    }
}

// ── Search ───────────────────────────────────────────

function openSearch() {
    state.mode = Mode.SEARCH;
    state.searchQuery = '';
    state.countStr = '';
    $searchBar.classList.remove('hidden');
    $searchInput.value = '';
    $searchInput.focus();
    render();
}

function closeSearch() {
    state.mode = Mode.FILE_TREE;
    state.searchQuery = '';
    $searchBar.classList.add('hidden');
    $searchInput.blur();
    clampCursor();
    render();
}

$searchInput.addEventListener('input', e => {
    state.searchQuery = e.target.value;
    state.cursor = 0;
    render();
});

$searchInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); closeSearch(); return; }
    if (e.key === 'Enter') {
        e.preventDefault();
        const files = getVisibleFiles();
        if (files.length > 0) { closeSearch(); openFile(state.cursor); }
        return;
    }
    if (e.key === 'ArrowDown') { e.preventDefault(); state.cursor++; clampCursor(); render(); return; }
    if (e.key === 'ArrowUp') { e.preventDefault(); state.cursor--; clampCursor(); render(); return; }
});

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
        closeOverlay();
    }
}

$commandInput.addEventListener('keydown', e => {
    if (e.key === 'Escape') { e.preventDefault(); closeCommand(); return; }
    if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand($commandInput.value);
        closeCommand();
        return;
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

    // file tree: click a file entry to open it
    if (state.mode === Mode.FILE_TREE || state.mode === Mode.SEARCH) {
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
    state.searchQuery = '';
    state.countStr = '';
    state.pendingG = false;
    $searchBar.classList.add('hidden');
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
    if (document.activeElement === $searchInput) return;
    if (document.activeElement === $commandInput) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
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

    if (state.mode === Mode.IDLE) return;

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
            case 'G': {
                const n = getCount();
                state.cursor = n > 1
                    ? Math.min(n - 1, getVisibleFiles().length - 1)
                    : getVisibleFiles().length - 1;
                render();
                break;
            }
            case 'g':
                state.pendingG = true;
                gTimeout = setTimeout(() => { state.pendingG = false; }, 500);
                break;
            case '/':
                getCount();
                openSearch();
                break;
            case ':':
                getCount();
                openCommand();
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
                // follow link under cursor
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
