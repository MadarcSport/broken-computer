<!-- Workspace-specific custom instructions for React Three Fiber project -->

## Project Overview

This is a React Three Fiber project - a modern TypeScript React application for building interactive 3D graphics using Three.js.

## Tech Stack

- **React**: 19.2.0 (UI framework)
- **Three.js**: r128 (3D graphics library)
- **React Three Fiber**: 8.17.0 (React renderer for Three.js)
- **Drei**: 9.128.0 (Useful helper components and utilities)
- **Vite**: 7.3.1 (Build tool and dev server)
- **TypeScript**: 5.9.3 (Type safety)

## Project Structure

```
src/
├── components/
│   └── Scene3D.tsx    # Main 3D scene with rotating cube
├── App.tsx            # Root component
├── App.css            # App styling
├── index.css          # Global styles
└── main.tsx           # Application entry point
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Key Features

- **3D Canvas**: Full-viewport Three.js canvas powered by React Three Fiber
- **Rotating Cube**: Example 3D geometry with animations
- **Lighting**: Ambient and point lights for realistic rendering
- **Responsive**: Canvas adapts to window size
- **Hot Module Replacement**: Fast refresh during development

## Development Guidelines

- All 3D components live in `src/components/`
- Use `useFrame` hook for animations that sync with render loop
- Use `useRef` for access to Three.js objects
- Import types from Three.js for type safety

## Customization Tips

1. **Change cube appearance**: Edit colors and geometry in `Scene3D.tsx`
2. **Add more objects**: Create new components and add them to the Canvas
3. **Adjust lighting**: Modify light intensity and position
4. **Control camera**: Adjust `camera` prop in Canvas component
