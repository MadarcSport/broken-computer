# React Three Fiber Project

A modern 3D graphics project built with React, Three.js, and React Three Fiber.

## Features

- 🎨 **3D Graphics**: Interactive 3D scenes using Three.js
- ⚛️ **React Integration**: React components for 3D objects and scenes
- 🚀 **Fast Development**: Vite for blazing-fast dev server and builds
- 📱 **Responsive**: Full-viewport canvas that adapts to window size
- 🔄 **Hot Reload**: Fast refresh during development
- 📝 **TypeScript**: Full type safety throughout the project

## Project Structure

```
src/
├── components/
│   └── Scene3D.tsx       # Main 3D scene component with rotating cube
├── App.tsx               # Root application component
├── App.css               # Application styling
├── index.css             # Global styles
└── main.tsx              # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will open at `http://localhost:5173/`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Technology Stack

| Technology        | Version | Purpose                         |
| ----------------- | ------- | ------------------------------- |
| React             | 19.2.0  | UI framework                    |
| Three.js          | r128    | 3D graphics library             |
| React Three Fiber | 8.17.0  | React renderer for Three.js     |
| Drei              | 9.128.0 | Helper components and utilities |
| Vite              | 7.3.1   | Build tool and dev server       |
| TypeScript        | 5.9.3   | Type safety                     |

## Scene Components

### Scene3D Component

The main 3D scene component featuring:

- A rotating cube with animation
- Ambient lighting for overall illumination
- Point light for realistic shadows and highlights
- Responsive camera setup

#### Key Features

- **useFrame Hook**: Synchronizes with the render loop for smooth animations
- **useRef**: Provides access to Three.js mesh objects
- **TypeScript Support**: Full type safety with Three.js types

### Rotating Cube

The example rotating cube component demonstrates:

- Basic mesh rendering
- Material properties (color, lighting)
- Animation patterns
- Position control

## Customization

### Change Cube Color

Edit the color in [Scene3D.tsx](src/components/Scene3D.tsx):

```tsx
<meshPhongMaterial color="#00a8ff" />
```

### Add More Objects

Create new components and add them to the Canvas in [Scene3D.tsx](src/components/Scene3D.tsx):

```tsx
<RotatingCube position={[0, 0, 0]} />
<YourNewComponent position={[2, 0, 0]} />
```

### Adjust Lighting

Modify light intensity and position in [Scene3D.tsx](src/components/Scene3D.tsx):

```tsx
<ambientLight intensity={0.5} />
<pointLight position={[10, 10, 10]} intensity={1} />
```

### Camera Control

Adjust the camera position in the Canvas element:

```tsx
<Canvas camera={{ position: [0, 0, 3] }}>
```

## Development Guidelines

1. **Component Organization**: Keep all 3D components in `src/components/`
2. **Animations**: Use the `useFrame` hook from React Three Fiber
3. **References**: Use `useRef` to access Three.js objects
4. **Types**: Always import and use types from Three.js for type safety
5. **Performance**: Consider using `useCallback` and `useMemo` for complex scenes

## Resources

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Drei Utilities](https://github.com/pmndrs/drei)
- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)

## License

MIT
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
globalIgnores(['dist']),
{
files: ['**/*.{ts,tsx}'],
extends: [
// Other configs...
// Enable lint rules for React
reactX.configs['recommended-typescript'],
// Enable lint rules for React DOM
reactDom.configs.recommended,
],
languageOptions: {
parserOptions: {
project: ['./tsconfig.node.json', './tsconfig.app.json'],
tsconfigRootDir: import.meta.dirname,
},
// other options...
},
},
])

```

```
