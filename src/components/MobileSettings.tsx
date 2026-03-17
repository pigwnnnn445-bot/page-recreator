import { ChevronDown, Zap } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  type ModelInfo,
  type ModelConfig,
  type CreationMode,
  modelConfigMap,
  defaultModelConfig,
} from "@/types/api";
import ImageUploadBox from "@/components/ImageUploadBox";

interface MobileSettingsProps {
  models: ModelInfo[];
  selectedModel: ModelInfo;
  setSelectedModel: (m: ModelInfo) => void;
  selectedCreationMode: CreationMode;
  setSelectedCreationMode: (mode: CreationMode) => void;
  selectedQuality: string;
  setSelectedQuality: (q: string) => void;
  selectedDuration: string;
  setSelectedDuration: (d: string) => void;
  selectedRatio: string;
  setSelectedRatio: (r: string) => void;
  currentConfig: ModelConfig;
  onImageSizeError?: () => void;
  onImageRatioError?: () => void;
}

const creationModeLabels: Record<CreationMode, string> = {
  text_to_video: "文字转视频",
  image_to_video: "图像转视频",
};

const MobileSettings = ({
  models,
  selectedModel,
  setSelectedModel,
  selectedCreationMode,
  setSelectedCreationMode,
  selectedQuality,
  setSelectedQuality,
  selectedDuration,
  setSelectedDuration,
  selectedRatio,
  setSelectedRatio,
  currentConfig,
  onImageSizeError,
  onImageRatioError,
}: MobileSettingsProps) => {
  const [modelOpen, setModelOpen] = useState(false);
  const modelListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (modelOpen && modelListRef.current) {
      const selectedEl = modelListRef.current.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (selectedEl) {
        requestAnimationFrame(() => selectedEl.scrollIntoView({ block: "nearest" }));
      }
    }
  }, [modelOpen]);

  const handleSelectModel = (model: ModelInfo) => {
    setSelectedModel(model);
    setModelOpen(false);
    const cfg = modelConfigMap[model.id] ?? defaultModelConfig;
    setSelectedCreationMode(cfg.creationModes[0]);
    setSelectedQuality(cfg.qualities[0]);
    setSelectedDuration(cfg.durations.length > 0 ? cfg.durations[0] : "");
    const enabledRatios = cfg.aspectRatios.filter(r => r.enabled);
    setSelectedRatio(enabledRatios.length > 0 ? enabledRatios[0].label : "");
  };

  const showCreationModeSelector = currentConfig.creationModes.length > 1;
  const isImageMode = selectedCreationMode === "image_to_video";
  const enabledRatios = currentConfig.aspectRatios.filter(r => r.enabled);

  return (
    <div className="px-4 pb-3 space-y-3 md:hidden">
      {/* Model Selector */}
      <div className="relative">
        <button
          onClick={() => setModelOpen(!modelOpen)}
          className="w-full h-10 outline-none border border-border rounded-xl px-3 text-foreground text-sm flex items-center justify-between cursor-pointer"
        >
          <span className="truncate">{selectedModel.name}</span>
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 text-theme-2 dark:text-theme-1 text-xs font-medium" style={{ fontFamily: "Gilroy, ui-sans-serif, system-ui, sans-serif" }}>
              <Zap className="w-3 h-3" /> {selectedModel.cost}
            </span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${modelOpen ? "rotate-180" : ""}`} />
          </div>
        </button>
        {modelOpen && (
          <div ref={modelListRef} className="absolute top-full mt-1 z-20 p-2 rounded-2xl flex flex-col gap-1 w-full bg-card border border-border shadow-lg max-h-[300px] overflow-y-auto">
            {models.map((m) => {
              const isComingSoon = m.status === "coming_soon";
              return (
                <button
                  key={m.id}
                  data-selected={m.id === selectedModel.id ? "true" : undefined}
                  onClick={() => !isComingSoon && handleSelectModel(m)}
                  disabled={isComingSoon}
                  className={`w-full px-3 py-2 text-left rounded-xl transition-colors text-sm ${
                    isComingSoon
                      ? "opacity-50 cursor-not-allowed"
                      : m.id === selectedModel.id
                        ? "bg-menu-selected text-foreground"
                        : "hover:bg-hover-bg text-foreground cursor-pointer"
                  }`}
                >
                  {m.name}
                  {isComingSoon && <span className="ml-2 text-[10px] text-[hsl(30,100%,50%)]">Coming Soon</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Inline pills row: Creation Mode + Ratio + Quality + Duration */}
      <div className="flex gap-1.5 flex-wrap">
        {/* Creation Mode */}
        {showCreationModeSelector && currentConfig.creationModes.map((mode) => (
          <button
            key={mode}
            onClick={() => setSelectedCreationMode(mode)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
              mode === selectedCreationMode
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-text-secondary hover:bg-hover-bg"
            }`}
          >
            {creationModeLabels[mode]}
          </button>
        ))}

        {/* Aspect Ratio */}
        {enabledRatios.map((r) => (
          <button
            key={r.label}
            onClick={() => setSelectedRatio(r.label)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
              r.label === selectedRatio
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-text-secondary hover:bg-hover-bg"
            }`}
          >
            {r.label}
          </button>
        ))}

        {/* Quality */}
        {currentConfig.qualities.map((q) => (
          <button
            key={q}
            onClick={() => setSelectedQuality(q)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
              q === selectedQuality
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-text-secondary hover:bg-hover-bg"
            }`}
          >
            {q}
          </button>
        ))}

        {/* Duration */}
        {currentConfig.durations.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDuration(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
              d === selectedDuration
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border text-text-secondary hover:bg-hover-bg"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Material block: Image upload for image mode */}
      {isImageMode && currentConfig.enableReferenceImage && (
        <ImageUploadBox label="上传参考图" className="w-full h-[100px]" onSizeError={onImageSizeError} onRatioError={onImageRatioError} />
      )}
    </div>
  );
};

export default MobileSettings;
