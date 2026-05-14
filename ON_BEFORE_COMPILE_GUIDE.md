# onBeforeCompile Guide (First-Time Friendly)

This guide explains how the cube color-tint shader was done with `onBeforeCompile` in your React Three Fiber scene.

## 1) What `onBeforeCompile` is

`onBeforeCompile` is a hook on Three.js materials (like `MeshStandardMaterial`) that lets you modify the generated GLSL shader right before it is compiled.

You use it when:
- You want a custom visual effect.
- You still want all standard PBR features (lights, roughness, metalness, environment reflections).
- You do not want to rewrite a full `ShaderMaterial` from scratch.

## 2) Why this was useful for your cube

You already had:
- A `map` (albedo texture).
- A standard PBR material.

You wanted:
- To keep all PBR behavior.
- To apply a selected color tint from UI buttons.

`onBeforeCompile` is perfect for this because you can inject just a few lines into the existing fragment shader.

## 3) The exact pattern used

### Step A: Keep a tint color object

```tsx
const albedoTintRef = useRef(new Color(tintHex));

useEffect(() => {
  albedoTintRef.current.set(tintHex);
}, [tintHex]);
```

Why this matters:
- The shader uniform stores a reference to a `Color` object.
- When you call `.set(...)`, the same object is updated.
- The shader sees the new color without recompiling the material.

### Step B: Add a uniform in `onBeforeCompile`

```tsx
onBeforeCompile={(shader) => {
  shader.uniforms.uAlbedoTint = { value: albedoTintRef.current };
}}
```

This creates a custom uniform named `uAlbedoTint` available in GLSL.

### Step C: Declare the uniform in GLSL

```tsx
shader.fragmentShader = shader.fragmentShader.replace(
  "void main() {",
  "uniform vec3 uAlbedoTint;\nvoid main() {"
);
```

You inject a uniform declaration before shader logic starts.

### Step D: Inject your color math where map color is handled

```tsx
shader.fragmentShader = shader.fragmentShader.replace(
  "#include <map_fragment>",
  "#include <map_fragment>\n  diffuseColor.rgb *= uAlbedoTint;"
);
```

This means:
- Sample albedo map as usual.
- Then multiply final albedo RGB by your tint.

## 4) Why some colors looked black

Your albedo texture is red-heavy.

With multiplication:
- `final = textureRGB * tintRGB`
- If a channel is low in either texture or tint, it gets darker quickly.

Example:
- Red texture has low blue channel.
- Blue tint has low red channel.
- Multiplying can push output close to black.

That is why neutral albedo textures are better for recoloring systems.

## 5) Best practice for recolorable materials

- Keep albedo near neutral (gray-ish / low chroma).
- Keep AO in AO map, not baked strongly into albedo.
- Avoid strong hue baked into the base color if runtime tinting is required.

## 6) Important gotchas with `onBeforeCompile`

1. Do not inject fragile string replacements that may not exist.
   - If `.replace(...)` misses the target chunk, your effect silently does nothing.

2. Uniform updates vs shader-source updates are different.
   - Changing uniform values: no recompile needed.
   - Changing injected GLSL code: set `material.needsUpdate = true`.

3. TypeScript note.
   - In simple projects people often write `(shader: any)`.
   - Later you can replace this with a stronger custom type if you want stricter TS.

## 7) Minimal mental model

Think of `onBeforeCompile` like this:
1. Start with standard Three.js PBR shader.
2. Add your own uniform(s).
3. Replace one include chunk with custom math.
4. Keep everything else untouched.

That is why it is such a good "first shader customization" technique.

## 8) What to try next (learning exercises)

1. Add a blend slider between original and tinted color.
2. Animate tint over time (slow hue shift).
3. Add a second uniform for tint strength.
4. Move shader patch logic into a reusable helper function.

---

If you want, I can also write a second markdown file with a visual diagram of the shader flow (Texture -> map_fragment -> tint math -> lighting output).
