import { RING_EFFECT_OPTIONS, type RingEffectId } from "../shaders/ringEffects";

interface RingEffectPanelProps {
  selectedEffect: RingEffectId;
  onSelectEffect: (effect: RingEffectId) => void;
}

export function RingEffectPanel({
  selectedEffect,
  onSelectEffect,
}: RingEffectPanelProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        top: "50%",
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "10px",
        background: "rgba(12, 16, 22, 0.52)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: 12,
        backdropFilter: "blur(5px)",
        zIndex: 5,
      }}
    >
      {RING_EFFECT_OPTIONS.map((option) => {
        const isSelected = selectedEffect === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectEffect(option.id)}
            style={{
              minWidth: 148,
              textAlign: "left",
              padding: "8px 10px",
              borderRadius: 8,
              border: isSelected
                ? "2px solid #7fe5ff"
                : "1px solid rgba(255, 255, 255, 0.35)",
              background: isSelected
                ? "rgba(22, 55, 71, 0.82)"
                : "rgba(12, 16, 22, 0.8)",
              color: "#f2f7ff",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
