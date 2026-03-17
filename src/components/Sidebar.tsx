import { ChevronDown, X, Zap } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  type ModelInfo,
  type ModelConfig,
  type CreationMode,
  modelConfigMap,
  defaultModelConfig,
} from "@/types/api";
import ImageUploadBox from "@/components/ImageUploadBox";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
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
  onImageUploaded?: (hasImage: boolean) => void;
}

const creationModeLabels: Record<CreationMode, string> = {
  text_to_video: "文字转视频",
  image_to_video: "图像转视频",
};

const Sidebar = ({
  open, onClose, models,
  selectedModel, setSelectedModel,
  selectedCreationMode, setSelectedCreationMode,
  selectedQuality, setSelectedQuality,
  selectedDuration, setSelectedDuration,
  selectedRatio, setSelectedRatio,
  currentConfig, onImageSizeError, onImageRatioError, onImageUploaded,
}: SidebarProps) => {
  const [openDropdown, setOpenDropdown] = useState<'model' | 'mode' | null>(null);
  const modelOpen = openDropdown === 'model';
  const modeOpen = openDropdown === 'mode';
  const setModelOpen = (v: boolean) => setOpenDropdown(v ? 'model' : null);
  const setModeOpen = (v: boolean) => setOpenDropdown(v ? 'mode' : null);
  const asideRef = useRef<HTMLElement>(null);
  
  const modelListRef = useRef<HTMLDivElement>(null);

  const handleModelOpen = useCallback((nextOpen: boolean) => {
    setModelOpen(nextOpen);
  }, []);

  // Scroll sidebar to top when opened on mobile
  useEffect(() => {
    if (open && asideRef.current) {
      asideRef.current.scrollTop = 0;
    }
  }, [open]);

  useEffect(() => {
    if (modelOpen && modelListRef.current) {
      const container = modelListRef.current;
      const selectedEl = container.querySelector('[data-selected="true"]') as HTMLElement | null;
      if (selectedEl) {
        requestAnimationFrame(() => {
          selectedEl.scrollIntoView({ block: "nearest" });
        });
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

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-foreground/20 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        ref={asideRef}
        className={`
          fixed md:static z-50 top-0 right-0 md:left-0 h-full
          w-[280px] min-h-screen bg-sidebar border-l md:border-l-0 md:border-r border-border flex flex-col p-5
          transition-transform duration-300 ease-in-out overflow-y-auto
          ${open ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sidebar-foreground font-bold text-base">视频制作</h2>
          <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-accent transition-colors cursor-pointer">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Model Selector */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[hsl(240,1%,20%)] dark:text-sidebar-foreground">切换模型</span>
            <div className="flex -space-x-1.5">
              {models.slice(0, 4).map((m) => (
                m.icon ? (
                  <img key={m.id} src={m.icon} alt={m.name} className="w-6 h-6 rounded-full object-cover border-2 border-sidebar" />
                ) : (
                  <div key={m.id} className="w-6 h-6 rounded-full bg-secondary border-2 border-sidebar flex items-center justify-center text-[8px] text-muted-foreground font-bold">
                    {m.name.charAt(0)}
                  </div>
                )
              ))}
              {models.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-secondary border-2 border-sidebar flex items-center justify-center text-[9px] text-muted-foreground font-medium">
                  {models.length - 4}+
                </div>
              )}
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => handleModelOpen(!modelOpen)}
              className="w-full h-[48px] outline-none border border-border rounded-xl px-4 text-foreground text-sm flex items-center justify-between transition-colors cursor-pointer group"
            >
              <span className="truncate">{selectedModel.name}</span>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${modelOpen ? "rotate-180" : ""}`} />
            </button>
            {modelOpen && (
              <div ref={modelListRef} className="absolute top-full mt-1 z-10 p-2 rounded-2xl flex flex-col gap-1 w-[calc(100%+16px)] -ml-2 bg-card border border-border shadow-lg max-h-[400px] overflow-y-auto">
                {models.map((m) => {
                  const isComingSoon = m.status === "coming_soon";
                  return (
                    <button
                      key={m.id}
                      data-selected={m.id === selectedModel.id ? "true" : undefined}
                      onClick={() => !isComingSoon && handleSelectModel(m)}
                      disabled={isComingSoon}
                      className={`relative w-full px-4 py-3 text-left rounded-xl transition-colors border ${
                        isComingSoon
                          ? "opacity-50 cursor-not-allowed border-transparent"
                          : m.id === selectedModel.id
                            ? "bg-accent border-primary cursor-pointer"
                            : "hover:bg-accent border-transparent cursor-pointer"
                      }`}
                    >
                      {isComingSoon && (
                        <span
                          className="absolute font-medium text-orange-500 flex items-center justify-center"
                          style={{
                            left: "117px",
                            top: "12px",
                            width: "84px",
                            height: "16px",
                            borderRadius: "4px",
                            background: "rgba(255, 146, 8, 0.2)",
                            fontSize: "10px",
                          }}
                        >
                          Coming Soon
                        </span>
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-semibold text-sm ${isComingSoon ? "text-muted-foreground" : "text-foreground"}`}>
                          {m.name}
                        </span>
                        {!isComingSoon && (
                          <span className="flex items-center gap-1 text-indigo-500 dark:text-emerald-400 text-xs font-medium" style={{ fontFamily: "Gilroy, ui-sans-serif, system-ui, sans-serif" }}>
                            <Zap className="w-3.5 h-3.5" /> {m.cost}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs leading-relaxed ${isComingSoon ? "text-muted-foreground" : "text-secondary-foreground"}`}>
                        {m.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Creation Mode Selector */}
        {showCreationModeSelector && (
          <div className="mb-6">
            <span className="text-sm text-foreground dark:text-[hsl(240,1%,20%)] mb-2 block">创作模式</span>
            <div className="relative">
              <button
                onClick={() => setModeOpen(!modeOpen)}
                className="w-full h-[48px] outline-none border border-border rounded-xl px-4 text-foreground text-sm flex items-center justify-between transition-colors cursor-pointer"
              >
                <span className="truncate">{creationModeLabels[selectedCreationMode]}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${modeOpen ? "rotate-180" : ""}`} />
              </button>
              {modeOpen && (
                <div className="absolute top-full mt-1 z-10 p-2 rounded-2xl flex flex-col gap-1 w-full bg-card border border-border shadow-lg">
                  {currentConfig.creationModes.map((mode) => (
                    <button
                      key={mode}
                      onClick={() => { setSelectedCreationMode(mode); setModeOpen(false); }}
                      className={`w-full px-4 py-3 text-left rounded-xl text-sm font-medium transition-colors cursor-pointer border ${
                        mode === selectedCreationMode
                          ? "bg-accent border-primary"
                          : "hover:bg-accent border-transparent"
                      }`}
                    >
                      {creationModeLabels[mode]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Aspect Ratio */}
        {currentConfig.aspectRatios.filter(r => r.enabled).length > 0 && (
          <div className="mb-6">
            <span className="text-sm text-foreground dark:text-[hsl(240,1%,20%)] mb-2 block">比例</span>
            <div className="flex gap-2 flex-wrap">
              {currentConfig.aspectRatios.filter(r => r.enabled).map((r) => {
                const isSelected = r.label === selectedRatio;
                const iconMap: Record<string, { w: string; h: string }> = {
                  "1:1": { w: "w-3.5", h: "h-3.5" },
                  "16:9": { w: "w-4", h: "h-2.5" },
                  "4:3": { w: "w-3.5", h: "h-3" },
                  "9:16": { w: "w-2", h: "h-3.5" },
                  "3:4": { w: "w-3", h: "h-3.5" },
                  "12:9": { w: "w-5", h: "h-2" },
                };
                const icon = iconMap[r.label] ?? { w: "w-3.5", h: "h-3.5" };
                return (
                  <button
                    key={r.label}
                    onClick={() => setSelectedRatio(r.label)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                      isSelected
                        ? "bg-primary dark:bg-[hsl(240,74%,61%)] text-primary-foreground border-primary dark:border-[hsl(240,74%,61%)]"
                        : "bg-card border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    <span className={`${icon.w} ${icon.h} border-2 rounded-[2px] ${isSelected ? "border-primary-foreground" : "border-muted-foreground"}`} />
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Video Quality */}
        <div className="mb-6">
          <span className="text-sm text-foreground dark:text-[hsl(240,1%,20%)] mb-2 block">视频质量</span>
          <div className="flex gap-2 flex-wrap">
            {currentConfig.qualities.map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuality(q)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  q === selectedQuality
                    ? "bg-primary dark:bg-[hsl(240,74%,61%)] text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        {currentConfig.durations.length > 0 && (
          <div className="mb-6">
            <span className="text-sm text-foreground dark:text-[hsl(240,1%,20%)] mb-2 block">时长</span>
            <div className="flex gap-2 flex-wrap">
              {currentConfig.durations.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                    d === selectedDuration
                      ? "bg-primary dark:bg-[hsl(240,74%,61%)] text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image-to-video: Reference Image */}
        {isImageMode && currentConfig.enableReferenceImage && (
          <div className="mb-6">
            <span className="text-sm text-muted-foreground mb-2 block">
              参考图片 （<span className="text-destructive">!</span> 必填）
            </span>
            <ImageUploadBox label="上传" className="w-full h-[120px]" onSizeError={onImageSizeError} onRatioError={onImageRatioError} onImageSelected={(f) => onImageUploaded?.(!!f)} />
          </div>
        )}

        {/* Image-to-video: First & Last Frame */}
        {isImageMode && currentConfig.enableFirstLastFrame && (
          <div className="mb-6">
            <span className="text-sm text-muted-foreground mb-2 block">第一帧和最后一帧</span>
            <div className="flex gap-3">
              <ImageUploadBox label="上传第一帧" className="flex-1 h-[100px]" onSizeError={onImageSizeError} onRatioError={onImageRatioError} onImageSelected={(f) => onImageUploaded?.(!!f)} />
              <ImageUploadBox label="上传最后一帧" className="flex-1 h-[100px]" onSizeError={onImageSizeError} onRatioError={onImageRatioError} />
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
