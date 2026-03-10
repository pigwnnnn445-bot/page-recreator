import { ChevronDown, User, X, Zap } from "lucide-react";
import { useState } from "react";

const models = ["Seedance 1.5 pro", "Seedance 1.0", "Kling 1.6", "Wan 2.1"];
const qualities = ["720p", "1080p", "4K"];
const durations = ["5s", "10s", "15s"];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedQuality, setSelectedQuality] = useState(qualities[0]);
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
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
              {selectedModel}
              <ChevronDown className="w-4 h-4 text-text-muted" />
            </button>
            {modelOpen && (
              <div className="absolute top-full mt-1 z-10 p-2 rounded-2xl flex flex-col gap-1 w-[calc(100%+16px)] -ml-2 bg-card border border-border shadow-lg">
                {models.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                    className={`w-full px-4 py-2.5 text-sm text-left rounded-xl transition-colors cursor-pointer ${
                      m === selectedModel ? "text-primary bg-menu-selected font-medium" : "text-foreground hover:bg-hover-bg"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Video Quality */}
        <div className="mb-6">
          <span className="text-sm text-text-secondary mb-2 block">视频质量</span>
          <div className="flex gap-2">
            {qualities.map((q) => (
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
          <div className="flex gap-2">
            {durations.map((d) => (
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

        {/* Bottom */}
        <div className="mt-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <span className="text-foreground text-sm font-medium">用户</span>
            <p className="text-xs text-text-muted">在线</p>
          </div>
          <span className="text-warning text-sm font-semibold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> 2104
          </span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
