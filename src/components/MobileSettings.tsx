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

const iconMap: Record<string, { w: string; h: string }> = {
  "1:1": { w: "w-3", h: "h-3" },
  "16:9": { w: "w-3.5", h: "h-2" },
  "4:3": { w: "w-3", h: "h-2.5" },
  "9:16": { w: "w-2", h: "h-3" },
  "3:4": { w: "w-2.5", h: "h-3" },
  "12:9": { w: "w-4", h: "h-1.5" },
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
    <div className="px-5 pb-2 space-y-4 md:hidden">
      {/* Model Selector */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-text-secondary">切换模型</span>
          <div className="flex -space-x-1.5">
            {models.slice(0, 4).map((m) =>
              m.icon ? (
                <img key={m.id} src={m.icon} alt={m.name} className="w-5 h-5 rounded-full object-cover border-2 border-background" />
              ) : (
                <div key={m.id} className="w-5 h-5 rounded-full bg-card-secondary border-2 border-background flex items-center justify-center text-[7px] text-text-muted font-bold">
                  {m.name.charAt(0)}
                </div>
              )
            )}
            {models.length > 4 && (
              <div className="w-5 h-5 rounded-full bg-card-secondary border-2 border-background flex items-center justify-center text-[8px] text-text-muted font-medium">
                {models.length - 4}+
              </div>
            )}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setModelOpen(!modelOpen)}
            className="w-full h-[44px] outline-none border border-border rounded-xl px-3 text-foreground text-sm flex items-center justify-between cursor-pointer"
          >
            <span className="truncate">{selectedModel.name}</span>
            <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${modelOpen ? "rotate-180" : ""}`} />
          </button>
          {modelOpen && (
            <div ref={modelListRef} className="absolute top-full mt-1 z-20 p-2 rounded-2xl flex flex-col gap-1 w-[calc(100%+16px)] -ml-2 bg-card border border-border shadow-lg max-h-[300px] overflow-y-auto">
              {models.map((m) => {
                const isComingSoon = m.status === "coming_soon";
                return (
                  <button
                    key={m.id}
                    data-selected={m.id === selectedModel.id ? "true" : undefined}
                    onClick={() => !isComingSoon && handleSelectModel(m)}
                    disabled={isComingSoon}
                    className={`relative w-full px-3 py-2.5 text-left rounded-xl transition-colors border ${
                      isComingSoon
                        ? "opacity-50 cursor-not-allowed border-transparent"
                        : m.id === selectedModel.id
                          ? "bg-menu-selected border-primary cursor-pointer"
                          : "hover:bg-hover-bg border-transparent cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold text-sm ${isComingSoon ? "text-text-muted" : "text-foreground"}`}>
                        {m.name}
                      </span>
                      {isComingSoon ? (
                        <span className="text-[10px] font-medium text-[hsl(30,100%,50%)] px-1.5 py-0.5 rounded bg-[hsla(30,100%,50%,0.2)]">Coming Soon</span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-theme-2 dark:text-theme-1 text-xs font-medium" style={{ fontFamily: "Gilroy, ui-sans-serif, system-ui, sans-serif" }}>
                          <Zap className="w-3 h-3" /> {m.cost}
                        </span>
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed mt-0.5 ${isComingSoon ? "text-text-muted" : "text-text-secondary"}`}>
                      {m.description}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Creation Mode */}
      {showCreationModeSelector && (
        <div>
          <span className="text-xs text-text-secondary mb-1.5 block">创作模式</span>
          <div className="flex h-[40px] rounded-full border border-border bg-card p-1">
            {currentConfig.creationModes.map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedCreationMode(mode)}
                className={`flex-1 h-full rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  mode === selectedCreationMode
                    ? "bg-background text-foreground shadow-sm"
                    : "text-text-secondary hover:text-foreground"
                }`}
              >
                {creationModeLabels[mode]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Aspect Ratio */}
      {enabledRatios.length > 0 && (
        <div>
          <span className="text-xs text-text-secondary mb-1.5 block">比例</span>
          <div className="flex gap-2 flex-wrap">
            {enabledRatios.map((r) => {
              const isSelected = r.label === selectedRatio;
              const icon = iconMap[r.label] ?? { w: "w-3", h: "h-3" };
              return (
                <button
                  key={r.label}
                  onClick={() => setSelectedRatio(r.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border text-text-secondary hover:bg-hover-bg"
                  }`}
                >
                  <span className={`${icon.w} ${icon.h} border-[1.5px] rounded-[1.5px] ${isSelected ? "border-primary-foreground" : "border-text-muted"}`} />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Quality */}
      <div>
        <span className="text-xs text-text-secondary mb-1.5 block">视频质量</span>
        <div className="flex gap-2 flex-wrap">
          {currentConfig.qualities.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                q === selectedQuality
                  ? "bg-primary text-primary-foreground"
                  : "bg-card-secondary text-text-secondary hover:bg-hover-bg"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      {currentConfig.durations.length > 0 && (
        <div>
          <span className="text-xs text-text-secondary mb-1.5 block">时长</span>
          <div className="flex gap-2 flex-wrap">
            {currentConfig.durations.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                  d === selectedDuration
                    ? "bg-primary text-primary-foreground"
                    : "bg-card-secondary text-text-secondary hover:bg-hover-bg"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Material block: Image upload for image mode */}
      {isImageMode && currentConfig.enableReferenceImage && (
        <div>
          <span className="text-xs text-text-secondary mb-1.5 block">
            参考图片 （<span className="text-destructive">!</span> 必填）
          </span>
          <ImageUploadBox label="上传参考图" className="w-full h-[90px]" onSizeError={onImageSizeError} onRatioError={onImageRatioError} />
        </div>
      )}
    </div>
  );
};

export default MobileSettings;
