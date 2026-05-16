# Physics Falling Spheres - Beginner's Guide

## Overview

This document explains how the falling sphere system works in your Scene3D_2 component. It uses **Rapier**, a physics engine for React Three Fiber, to simulate real gravity, collisions, and bouncing.

---

## What Happens When You Click "Fall"?

1. **5 spheres spawn** at random positions above the cube
2. **Gravity pulls them down** at 9.81 m/s² (realistic Earth gravity)
3. **Spheres bounce** off the cube and each other
4. **Spheres remove themselves** when they fall below the visible scene

---

## Key Components

### 1. Physics World Setup

```tsx
<Physics gravity={[0, -9.81, 0]}>{/* All physics objects go here */}</Physics>
```

- `gravity={[0, -9.81, 0]}` = pulls objects downward at 9.81 units/second²
- X and Z axes are 0 (no sideways gravity)
- Negative Y = downward direction

---

### 2. Creating the Falling Spheres (`FallingPhysicsBurst`)

#### Spawn Function

```tsx
function createBurstSpheres(seedBase: number): FallingPhysicsSphere[] {
  return Array.from({ length: 5 }, (_, index) => {
    const seed = seedBase * 13 + index * 17;
    const x = ((seed % 100) / 100 - 0.5) * 2.3; // Random X position ±1.15
    const z = (((seed * 7) % 100) / 100 - 0.5) * 2.3; // Random Z position ±1.15
    const y = 3.2 + index * 0.15; // Stack them slightly above each other
    return { id: seed, position: [x, y, z] };
  });
}
```

**What it does:**

- Creates 5 spheres with unique IDs
- Positions them randomly around X and Z (left-right and front-back)
- Stacks them slightly on the Y axis (up-down) so they don't start exactly at the same spot
- Uses math to create pseudo-random positions from a seed

---

### 3. Rigid Bodies (The Physics Objects)

Each falling sphere is a `RigidBody`:

```tsx
<RigidBody
  colliders="ball"
  position={sphere.position}
  collisionGroups={interactionGroups(1, [0, 1])}
  restitution={0.72}
  friction={0.45}
  linearDamping={0.02}
  angularDamping={0.1}
>
  <Sphere args={[0.1, 18, 18]}>{/* Visual appearance */}</Sphere>
</RigidBody>
```

#### Property Breakdown:

| Property           | Value         | Meaning                                                                                       |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------- |
| `colliders="ball"` | —             | Use a sphere-shaped collision shape (automatic size from visual)                              |
| `position`         | `[x, y, z]`   | Where the sphere starts in 3D space                                                           |
| `collisionGroups`  | `(1, [0, 1])` | Group 1 (spheres) collide with groups 0 (cube) and 1 (other spheres)                          |
| `restitution`      | `0.72`        | **Bounciness** - 0.0 = no bounce, 1.0 = bounces perfectly. 0.72 = lively bounce               |
| `friction`         | `0.45`        | **Grip** - Higher = more sticky, Lower = more slippery. 0.45 = slides a bit when hitting cube |
| `linearDamping`    | `0.02`        | **Air resistance** - Slows sideways/falling motion. Low = fast falling                        |
| `angularDamping`   | `0.1`         | **Spin resistance** - Slows rotation. Low = spins more freely                                 |

---

### 4. The Cube Collider (What Spheres Bounce Off)

```tsx
function CubeCollider({
  position = [0, 0, 0],
  scale = 1.5,
}: {
  position?: Vector3Tuple;
  scale?: number;
}) {
  const halfSize = 0.5 * scale;

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={position}
      collisionGroups={interactionGroups(0, 1)}
    >
      <CuboidCollider args={[halfSize, halfSize, halfSize]} friction={0.95} />
    </RigidBody>
  );
}
```

**What it does:**

- **`type="fixed"`** = the cube doesn't move (static/immovable)
- **`colliders={false}`** = the RigidBody has no visual collision shape
- **`<CuboidCollider>`** = defines a box-shaped invisible collision boundary
- **`friction={0.95}`** = very sticky (cube surface doesn't slide easily)
- **`collisionGroups={interactionGroups(0, 1)}`** = group 0, collides with group 1 (the falling spheres)

---

### 5. Collision Groups (Sphere-to-Sphere Interaction)

```tsx
collisionGroups={interactionGroups(1, [0, 1])}
```

- **First number (1)** = this object is in group 1
- **Array [0, 1]** = this object collides with groups 0 AND 1
  - Group 0 = the cube
  - Group 1 = other spheres

**Why do we need this?**
Without collision groups, spheres might not collide with each other. By explicitly telling each sphere "collide with group 0 (cube) and group 1 (yourselves)", we force sphere-to-sphere collisions.

---

### 6. Cleanup - Removing Spheres

```tsx
useFrame(() => {
  const killY = -5.6;
  let initializedBodies = 0;
  let belowCount = 0;

  bodyRefs.current.forEach((body) => {
    if (!body) return;

    initializedBodies += 1;
    if (body.translation().y < killY) {
      belowCount += 1; // Count how many are below the kill line
    }
  });

  // When all 5 spheres have fallen below, remove the entire burst
  if (
    initializedBodies === spheres.current.length &&
    belowCount === spheres.current.length &&
    !doneRef.current
  ) {
    doneRef.current = true;
    onDone(burstId); // Tell parent to remove this burst
  }
});
```

**How it works:**

- Every frame, check if all spheres are below `y = -5.6` (far below the cube)
- When they are, trigger cleanup and tell the parent component to remove this burst
- Prevents spheres from piling up in memory forever

---

## Tuning the Physics

Want to change how the spheres behave? Edit these values:

### Make spheres bouncier:

```tsx
restitution={0.72}  // Increase to 0.85 or higher
```

### Make spheres fall slower:

```tsx
linearDamping={0.02}  // Increase to 0.08 or higher
```

### Make spheres stick to the cube more:

```tsx
friction={0.45}  // Increase to 0.75 or higher
```

### Change gravity strength:

```tsx
<Physics gravity={[0, -9.81, 0]}>  // Make it -5 for weaker gravity
```

### Change spawn height:

```tsx
const y = 3.2 + index * 0.15; // Increase 3.2 to 5.0 to spawn higher
```

### Spawn more or fewer spheres:

```tsx
Array.from({ length: 5 }, ...)  // Change 5 to 10 or 3
```

---

## Visual Flow Diagram

```
Click "Fall" Button
        ↓
createBurstSpheres() creates 5 spheres
        ↓
Each RigidBody starts at its position
        ↓
Physics gravity pulls them down every frame
        ↓
Rapier detects collisions:
- Sphere hits cube → bounces (restitution applies)
- Sphere hits sphere → bounces
        ↓
linearDamping slows them down gradually
        ↓
useFrame() checks if all are below killY
        ↓
All 5 removed from scene (cleanup)
```

---

## Common Questions

### Q: Why don't my spheres collide with each other?

**A:** Make sure `collisionGroups={interactionGroups(1, [0, 1])}` is on each sphere. If it's missing, spheres pass through each other.

### Q: Why do spheres get stuck on the cube?

**A:** Too much friction or too little restitution. Lower `friction` (try 0.3) or increase `restitution` (try 0.85).

### Q: Can I spawn a different number of spheres?

**A:** Yes! In `createBurstSpheres()`, change `{ length: 5 }` to any number you want.

### Q: How do I make spheres visible longer?

**A:** Increase the negative `killY` value. Change `killY = -5.6` to `killY = -10` to let them fall farther before removal.

### Q: What does "RigidBody" mean?

**A:** In physics engines, a "rigid body" is an object with mass, velocity, and collision. It follows real physics rules. Opposite of a "soft body" which deforms.

---

## Files Involved

- **Scene3D_2.tsx** - Main component with all physics setup
- **@react-three/rapier** - Physics engine library
- **three.js** - 3D graphics (provides Sphere, Vector3Tuple, etc.)

---

## Next Steps

Try adjusting these values and rebuild to see how physics responds:

1. Double the restitution (make it bouncier)
2. Spawn 10 spheres instead of 5
3. Increase spawn height to 6.0
4. Lower friction to 0.2

Happy physics experimenting! 🎾
