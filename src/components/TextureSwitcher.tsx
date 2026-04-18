interface TextureSwitcherProps {
  current: "color2" | "color3";
  onSwitch: (next: "color2" | "color3") => void;
}

export function TextureSwitcher({ current, onSwitch }: TextureSwitcherProps) {
  return (
    <section style={{ marginTop: 24, textAlign: "center" }}>
      <button
        onClick={() => onSwitch(current === "color2" ? "color3" : "color2")}
        style={{ padding: "8px 16px", fontSize: 16 }}
      >
        Switch to {current === "color2" ? "color3.png" : "color2.png"}
      </button>
      <div style={{ marginTop: 8, fontSize: 14 }}>
        Current texture:{" "}
        <b>{current === "color2" ? "color2.png" : "color3.png"}</b>
      </div>
    </section>
  );
}
