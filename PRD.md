# Mockup Studio - Product Requirements Document (PRD)

## Vision
A browser-based professional mockup video creator that generates device mockup videos in minutes. Everything runs client-side using Three.js, React, and modern web technologies. No backend required.

## Target Users
- **Primary**: Mobile app designers, product managers, indie developers
- **Secondary**: Marketing teams, content creators, freelance designers
- **Tertiary**: Agencies creating client presentations

## Problem Statement
Creating professional device mockup videos currently requires:
- Expensive software (After Effects, Blender)
- Significant time investment (hours per video)
- Design expertise and 3D knowledge
- Server-side rendering infrastructure

Mockup Studio eliminates all of these barriers.

## Core Value Proposition
- **5-Minute Workflow**: Select device → Upload screenshot → Choose animation → Export
- **Production Quality**: Output looks like $500 professional videos
- **Zero Friction**: No uploads to servers, no waiting, no complexity
- **AI-Powered**: Gemini API for device analysis and code generation

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| 3D Engine | Three.js + React Three Fiber + Drei |
| State Management | Zustand (with persist middleware) |
| Styling | Tailwind CSS v4 |
| Video Export | MediaRecorder API (WebM) / FFmpeg.wasm (MP4) |
| AI Integration | Google Gemini API (Pro + Flash) |
| Routing | React Router v6 |
| Storage | Browser localStorage |

### Architecture Diagram
```
┌─────────────────────────────────────────────┐
│                  Browser                     │
├─────────────────────────────────────────────┤
│  React App                                   │
│  ┌─────────────┐  ┌──────────────────────┐ │
│  │ User Studio  │  │   Admin Panel        │ │
│  │ (/)          │  │   (/admin)           │ │
│  │              │  │                      │ │
│  │ • Device     │  │ • Device Creator     │ │
│  │   Selector   │  │   (AI Analysis)      │ │
│  │ • Screenshot │  │ • Template Creator   │ │
│  │   Upload     │  │   (AI Generation)    │ │
│  │ • Template   │  │ • API Key Settings   │ │
│  │   Gallery    │  │ • Analytics          │ │
│  │ • Customize  │  │                      │ │
│  │ • Export     │  │                      │ │
│  └──────┬───────┘  └──────────┬───────────┘ │
│         │                     │              │
│  ┌──────┴─────────────────────┴───────────┐ │
│  │         Zustand State Store             │ │
│  │  • App Store (runtime state)            │ │
│  │  • Settings Store (persisted)           │ │
│  │  • Admin Store (creation state)         │ │
│  └────────────────────────────────────────┘ │
│         │                                    │
│  ┌──────┴────────────────────────────────┐  │
│  │        Three.js / R3F Canvas          │  │
│  │  • Device Registry (lazy loaded)      │  │
│  │  • Template Registry                  │  │
│  │  • Animation System                   │  │
│  │  • Export Pipeline                    │  │
│  └───────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│  External APIs (optional)                    │
│  • Google Gemini (device analysis/codegen)   │
│  • OpenRouter (cross-validation)             │
└─────────────────────────────────────────────┘
```

---

## Feature Specifications

### Phase 1: Foundation (MVP)

#### 1.1 Device System
- **Device Registry**: Centralized registry mapping device IDs to lazy-loaded React components
- **Built-in Devices**: iPhone 15 Pro, Samsung S24 Ultra, iPad Pro, MacBook Pro 16", Apple Watch Ultra
- **Device Component Interface**: Standardized props (screen, color, rotation, position, scale)
- **Metadata**: Each device has id, name, brand, category, year, colors, tags

#### 1.2 Animation Templates
- **Template System**: JavaScript objects with `animate(frame, totalFrames, deviceType)` function
- **Universal Compatibility**: All templates work with all device types
- **Built-in Templates**: 360° Rotation, Float & Bounce, Cinematic Zoom Reveal, Zoom Out, Desk Setup, Slow Spin
- **Template Categories**: Floating, Desk, Cinematic, Hand, Multi-Device

#### 1.3 User Studio Interface
- **Split Layout**: Left sidebar (controls) + Right canvas (3D preview)
- **Step-by-step Workflow**: Device → Screenshot → Template → Customize → Export
- **Accordion Navigation**: Collapsible panels for each workflow step
- **Real-time Preview**: 60fps Three.js rendering with live updates

#### 1.4 Export Pipeline
- **Formats**: MP4, WebM, GIF
- **Resolutions**: 720p, 1080p, 4K
- **Frame Rates**: 24fps, 30fps, 60fps
- **Quality Control**: 1-10 slider with file size estimation
- **Progress UI**: Real-time progress bar with frame counter

### Phase 2: Admin Panel

#### 2.1 Device Creator (AI-Powered)
- **Image Upload**: Drag-drop for up to 5 reference images
- **Dual AI Analysis**: Gemini Pro + Flash for cross-validation
- **Comparison View**: Side-by-side results with discrepancy highlighting
- **Code Generation**: AI generates complete Three.js React component
- **Code Preview**: Syntax-highlighted preview with copy/save functionality

#### 2.2 Template Creator (AI-Powered)
- **Natural Language Input**: Describe animation, AI writes the code
- **Code Editor**: Monaco editor with syntax highlighting
- **Live Preview**: Three.js preview with timeline scrubber
- **Universal Testing**: Auto-test with phone, tablet, laptop, watch

#### 2.3 Settings
- **API Key Management**: Gemini + OpenRouter keys with test buttons
- **Secure Storage**: Keys stored in localStorage, never sent to third-party servers
- **Auto-Save Configuration**: Toggle + interval settings

### Phase 3: Polish

#### 3.1 Customization
- **Background**: Solid color, gradient, or transparent
- **Device Colors**: Per-device color options from metadata
- **Rotation Offsets**: X/Y/Z axis sliders
- **Text Overlays**: Font, size, weight, color, position, animation

#### 3.2 Project Management
- **Save/Load**: Projects saved to localStorage
- **Auto-Save**: Configurable interval (15s-5min)
- **Reset**: Clear all settings and start fresh

#### 3.3 Keyboard Shortcuts
- Space: Play/pause
- Arrow keys: Frame step
- R: Reset view
- F: Fullscreen
- E: Export

---

## Success Metrics
| Metric | Target |
|--------|--------|
| Time to first export | < 5 minutes |
| Export success rate | > 95% |
| 3D rendering FPS | 60fps |
| Initial page load | < 2 seconds |
| Core Web Vitals | All green |

---

## File Structure
```
src/
├── components/
│   ├── canvas/        # Three.js scene, timeline
│   ├── ui/            # Device selector, upload, gallery, customize
│   ├── export/        # Export dialog
│   └── layout/        # Shared layout components
├── pages/
│   ├── admin/         # Admin panel pages
│   └── user/          # Mockup studio page
├── devices/
│   ├── phones/        # Phone device components
│   ├── tablets/       # Tablet device components
│   ├── laptops/       # Laptop device components
│   ├── watches/       # Watch device components
│   └── registry.ts    # Device registry & search
├── templates/
│   ├── floating/      # Floating animation templates
│   ├── desk/          # Desk scene templates
│   ├── cinematic/     # Cinematic templates
│   └── registry.ts    # Template registry & search
├── store/             # Zustand stores
├── types/             # TypeScript type definitions
├── utils/             # AI integration, export pipeline
└── hooks/             # Custom React hooks
```

---

## Deployment Strategy
- **Hosting**: Vercel / Netlify / Cloudflare Pages (static)
- **Build**: Vite with tree-shaking and code splitting
- **CI/CD**: GitHub Actions for automated builds
- **Caching**: Aggressive asset caching with content hashing
