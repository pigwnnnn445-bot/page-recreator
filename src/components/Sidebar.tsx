import { ChevronDown, X, Check } from "lucide-react";
import { useState, useMemo } from "react";
import {
  mockUserConfig,
  modelConfigMap,
  defaultModelConfig,
  type ModelInfo,
} from "@/types/api";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const config = mockUserConfig;
  const models = config.data.enable_model;

  const [selectedModel, setSelectedModel] = useState<ModelInfo>(models[0]);
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [modelOpen, setModelOpen] = useState(false);

  const currentConfig = useMemo(() => {
    return modelConfigMap[selectedModel.id] ?? defaultModelConfig;
  }, [selectedModel.id]);

  const handleSelectModel = (model: ModelInfo) => {
    setSelectedModel(model);
    setModelOpen(false);
    const cfg = modelConfigMap[model.id] ?? defaultModelConfig;
    setSelectedQuality(cfg.qualities[0]);
    setSelectedDuration(cfg.durations[0]);
  };

  useMemo(() => {
    if (!selectedQuality) setSelectedQuality(currentConfig.qualities[0]);
    if (!selectedDuration) setSelectedDuration(currentConfig.durations[0]);
  }, []);

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-foreground/20 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`
          fixed md:static z-50 top-0 left-0 h-full
          w-[280px] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col p-5
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sidebar-title font-bold text-base">视频制作</h2>
          <button onClick={onClose} className="md:hidden p-1 rounded-lg hover:bg-hover-bg transition-colors cursor-pointer">
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Model Selector */}
        <div className="mb-6">
          <span className="text-sm text-text-secondary mb-2 block">切换模型</span>
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="w-full bg-card-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer"
            >
              <span className="truncate">{selectedModel.name}</span>
              <ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${modelOpen ? "rotate-180" : ""}`} />
            </button>
            {modelOpen && (
              <div className="absolute top-full mt-1 z-10 p-2 rounded-2xl flex flex-col gap-1 w-[calc(100%+16px)] -ml-2 bg-card border border-border shadow-lg max-h-[320px] overflow-y-auto">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m)}
                    className={`w-full px-4 py-2.5 text-sm text-left rounded-xl transition-colors cursor-pointer flex items-center justify-between ${
                      m.id === selectedModel.id
                        ? "text-primary bg-menu-selected font-medium"
                        : "text-foreground hover:bg-hover-bg"
                    }`}
                  >
                    <span>{m.name}</span>
                    {m.id === selectedModel.id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Quality */}
        <div className="mb-6">
          <span className="text-sm text-text-secondary mb-2 block">视频质量</span>
          <div className="flex gap-2 flex-wrap">
            {currentConfig.qualities.map((q) => (
              <button
                key={q}
                onClick={() => setSelectedQuality(q)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
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
        <div className="mb-6">
          <span className="text-sm text-text-secondary mb-2 block">时长</span>
          <div className="flex gap-2 flex-wrap">
            {currentConfig.durations.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDuration(d)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
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
      </aside>
    </>
  );
};

export default Sidebar;
