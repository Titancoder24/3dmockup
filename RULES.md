# Mockup Studio - Development Rules & Guidelines

## Core Philosophy
1. **User Experience First** — Every feature should feel magical and instant
2. **AI-Powered Creation** — Use Gemini for device analysis and code generation
3. **Production Quality** — Output must look like $500 professional videos
4. **Universal Compatibility** — All animations work with all device types
5. **Zero Friction** — No uploads to servers, no waiting, no complexity

---

## Architecture Rules

### Component Structure
- Every device component MUST export: `default` (component), `metadata`, `dimensions`
- Device components accept standardized props: `screen`, `color`, `rotation`, `position`, `scale`
- Animation templates MUST implement the `MotionTemplate` interface
- Templates MUST return valid `AnimationState` from their `animate()` function

### State Management
- Use `useAppStore` for runtime application state (device selection, playback, etc.)
- Use `useSettingsStore` for persisted settings (API keys, preferences)
- Use `useAdminStore` for admin panel creation state
- NEVER store derived state — compute it from source state
- NEVER mutate state directly — always use store actions

### File Organization
```
devices/{category}/{DeviceName}.tsx   — Device components
templates/{category}/{TemplateName}.ts — Animation templates
components/{area}/{ComponentName}.tsx  — UI components
pages/{role}/{PageName}.tsx            — Page-level components
```

### Naming Conventions
- Device IDs: kebab-case (`iphone-15-pro`)
- Template IDs: kebab-case (`cinematic-zoom-reveal`)
- Component files: PascalCase (`IPhone15Pro.tsx`)
- Utility files: camelCase (`export.ts`)
- Types: PascalCase interfaces, camelCase properties

---

## Device Development Rules

### Creating a New Device
1. Create component file in `src/devices/{category}/{DeviceName}.tsx`
2. Export `metadata: DeviceMetadata` with all required fields
3. Export `dimensions: DeviceDimensions` with precise measurements
4. Export `default` function component accepting `DeviceComponentProps`
5. Register in `src/devices/registry.ts`

### Device Component Requirements
- MUST use `meshStandardMaterial` for device body (with metalness/roughness)
- MUST use `meshBasicMaterial` with `map={screen}` for screen display
- MUST handle `screen = null` case (show black screen)
- MUST support all color variants from metadata
- MUST cast and receive shadows where appropriate
- Screen plane Z position MUST be slightly in front of body to prevent z-fighting

### Measurement System
- All dimensions in relative units (not millimeters)
- Typical phone width: ~2.7 units
- Typical phone height: ~5.8 units
- Maintain proportional accuracy to real devices
- Screen offset Z must place screen visually on top of body

---

## Animation Template Rules

### Template Structure
```typescript
export const TemplateName: MotionTemplate = {
  id: 'template-id',           // Unique kebab-case ID
  name: 'Display Name',        // User-facing name
  description: 'Description',  // Brief description
  category: 'floating',        // Category type
  duration: 4,                 // Duration in seconds
  fps: 30,                     // Frames per second
  tags: ['tag1', 'tag2'],      // Searchable tags

  animate: (frame, totalFrames, deviceType) => ({
    camera: { position, target, fov },
    device: { position, rotation, scale },
    background: '#hex' | { type: 'gradient', colors: [] },
    lighting: { ambient, directional: { position, intensity } }
  })
}
```

### Template Requirements
- MUST work with ALL device types (phone, tablet, laptop, watch)
- MUST use `deviceType` parameter to adjust for different form factors
- MUST produce smooth animations (use proper easing functions)
- MUST handle edge cases: frame 0, last frame, single-frame
- Camera MUST never clip through device geometry
- Background MUST be consistent throughout animation (unless intentional)
- All rotations in radians

### Easing Functions
```typescript
// Linear
const linear = progress

// Ease Out Cubic
const easeOut = 1 - Math.pow(1 - progress, 3)

// Ease In Out
const easeInOut = progress < 0.5
  ? 2 * progress * progress
  : 1 - Math.pow(-2 * progress + 2, 2) / 2

// Sine wave (for floating)
const float = Math.sin(progress * Math.PI * 2) * amplitude
```

---

## Admin Panel Rules

### AI Integration
- ALWAYS validate API key exists before making API calls
- ALWAYS show loading states during API calls
- ALWAYS handle API errors gracefully with user-friendly messages
- NEVER log API keys to console
- API keys stored ONLY in localStorage via Zustand persist

### Device Creation Workflow
1. Upload reference images (validate format, size)
2. Run dual AI analysis (Gemini Pro + Flash)
3. Display comparison with discrepancy highlighting
4. User resolves discrepancies
5. Generate Three.js component code
6. Preview in live canvas
7. Save to device library

### Code Generation
- Generated code MUST follow device component requirements above
- Generated code MUST be valid TypeScript/JSX
- Generated code MUST include metadata and dimensions exports
- Validate generated code structure before displaying

---

## UI/UX Rules

### Design System
- **Dark mode only** (surface-950 base background)
- **Font**: Inter for UI, Poppins for display text
- **Primary color**: Blue (#3b82f6 / primary-500)
- **Border radius**: rounded-lg (8px) for cards, rounded-md (6px) for buttons
- **Spacing**: 4px grid (p-1 = 4px, p-2 = 8px, etc.)
- **Text sizes**: text-xs (12px) for labels, text-sm (14px) for body
- **Animations**: transition-colors for hover states, 200ms duration

### Interaction Patterns
- All changes MUST update preview in real-time (< 16ms)
- Loading states for ALL async operations
- Error states with actionable messages
- Hover states on all interactive elements
- Focus states for keyboard accessibility

### Responsive Design
- Desktop: Full split-pane layout (sidebar + canvas)
- Mobile: Stacked layout (canvas on top, controls below)
- Touch targets: Minimum 44x44px on mobile
- Canvas adapts to available space

---

## Performance Rules

### Rendering
- Target 60fps for 3D rendering
- Use `dpr={[1, 2]}` for adaptive device pixel ratio
- Lazy-load device components with `React.lazy()`
- Debounce slider updates (rotation, color changes)
- Use `preserveDrawingBuffer: true` only for export canvas

### Memory
- Clean up Three.js textures when components unmount
- Revoke blob URLs after download
- Limit texture sizes based on device capabilities
- Free export frames after encoding

### Bundle Size
- Tree-shake Three.js imports
- Code-split admin panel from user app
- Lazy-load Monaco editor (admin only)
- Compress all static assets

---

## Export Pipeline Rules

### Supported Configurations
| Setting | Options |
|---------|---------|
| Resolution | 720p (1280x720), 1080p (1920x1080), 4K (3840x2160) |
| Frame Rate | 24fps, 30fps, 60fps |
| Format | MP4 (via WebM conversion), WebM, GIF |
| Quality | 1-10 scale (maps to bitrate) |

### Export Process
1. Calculate total frames = duration × fps
2. For each frame: update animation state → render scene → capture frame
3. Encode frames to video using MediaRecorder API
4. Create downloadable blob
5. Present download button to user
6. Clean up memory after download

### Error Handling
- Out of memory: Reduce resolution automatically
- Encoding failure: Retry with lower quality
- Canvas access error: Show browser compatibility warning
- Always allow cancellation during export

---

## Testing Checklist

### Before Publishing a Device
- [ ] Renders correctly in Chrome, Safari, Firefox
- [ ] All color variants look accurate
- [ ] Screen texture maps correctly
- [ ] Compatible with all animation templates
- [ ] No console errors or warnings
- [ ] Performance: 60fps minimum

### Before Publishing a Template
- [ ] Works with phones, tablets, laptops, watches
- [ ] Animation is smooth (no jarring movements)
- [ ] Camera never clips through device
- [ ] Edge cases handled (frame 0, last frame)
- [ ] Easing feels natural

### Before Release
- [ ] Build succeeds with no errors
- [ ] All TypeScript types are satisfied
- [ ] No unused imports or variables
- [ ] Export pipeline produces valid video
- [ ] Mobile layout is functional
- [ ] API key settings save/load correctly

---

## Git Workflow
- Branch naming: `feature/description`, `fix/description`
- Commit messages: imperative mood ("Add iPhone 15 Pro device", not "Added")
- One feature per branch
- Test build before pushing

## Dependencies
Only add dependencies that are absolutely necessary. Current approved stack:
- `react`, `react-dom` — UI framework
- `three`, `@react-three/fiber`, `@react-three/drei` — 3D rendering
- `zustand` — State management
- `react-router-dom` — Routing
- `react-dropzone` — File uploads
- `react-hot-toast` — Notifications
- `lucide-react` — Icons
- `framer-motion` — UI animations
- `react-color` — Color pickers
- `@monaco-editor/react` — Code editor (admin only)
- `tailwindcss` — Styling
