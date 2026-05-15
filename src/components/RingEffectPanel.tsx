import { RING_EFFECT_OPTIONS, type RingEffectId } from "../shaders/ringEffects";

interface RingEffectPanelProps {
  selectedEffect: RingEffectId;
  onSelectEffect: (effect: RingEffectId) => void;
}

const MOBILE_SHORT_LABELS: Record<RingEffectId, string> = {
  iridescentOilFilm: "Arc",
  wireframeGlowOverlay: "Wire",
  dissolveRebuild: "Diss",
  chromaticRefractionFake: "Radar",
};

export function RingEffectPanel({
  selectedEffect,
  onSelectEffect,
}: RingEffectPanelProps) {
  return (
    <div className="ring-effect-panel">
      {RING_EFFECT_OPTIONS.map((option) => {
        const isSelected = selectedEffect === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelectEffect(option.id)}
            className={`ring-effect-button ${isSelected ? "is-selected" : ""}`}
            title={option.label}
            aria-label={option.label}
          >
            <span className="ring-label-full">{option.label}</span>
            <span className="ring-label-short">
              {MOBILE_SHORT_LABELS[option.id]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
