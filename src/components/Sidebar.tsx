import { ChevronDown, Phone, User } from "lucide-react";
import { useState } from "react";

const models = ["Seedance 1.5 pro", "Seedance 1.0", "Kling 1.6", "Wan 2.1"];
const qualities = ["720p", "1080p", "4K"];
const durations = ["5s", "10s", "15s"];

const modelIcons = [
  { color: "bg-blue-500", label: "IN" },
  { color: "bg-cyan-400", label: "" },
  { color: "bg-orange-400", label: "" },
  { color: "bg-purple-400", label: "" },
];

const Sidebar = () => {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedQuality, setSelectedQuality] = useState(qualities[0]);
  const [selectedDuration, setSelectedDuration] = useState(durations[0]);
  const [modelOpen, setModelOpen] = useState(false);

  return (
    <aside className="w-[280px] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col p-5">
      <h2 className="text-foreground font-semibold text-lg mb-6">视频制作</h2>

      {/* Model Selector */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">切换模型</span>
          <div className="flex gap-1">
            {modelIcons.map((icon, i) => (
              <div key={i} className={`w-5 h-5 rounded-full ${icon.color} flex items-center justify-center text-[8px] font-bold text-primary-foreground`}>
                {icon.label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setModelOpen(!modelOpen)}
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground text-sm flex items-center justify-between hover:border-primary/50 transition-colors"
          >
            {selectedModel}
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
          {modelOpen && (
            <div className="absolute top-full mt-1 z-10 p-2 rounded-2xl flex flex-col gap-1 w-[calc(100%+16px)] -ml-2 bg-card border border-border">
              {models.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                  className={`w-full px-4 py-2.5 text-sm text-left rounded-xl transition-colors ${m === selectedModel ? "text-accent bg-secondary" : "text-foreground hover:bg-secondary"}`}
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
        <span className="text-sm text-muted-foreground mb-2 block">视频质量</span>
        <div className="flex gap-2">
          {qualities.map((q) => (
            <button
              key={q}
              onClick={() => setSelectedQuality(q)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                q === selectedQuality
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div className="mb-6">
        <span className="text-sm text-muted-foreground mb-2 block">时长</span>
        <div className="flex gap-2">
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDuration(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                d === selectedDuration
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
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
          <span className="text-foreground text-sm font-medium">0</span>
          <p className="text-xs text-muted-foreground">在线</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-warning text-sm font-semibold flex items-center gap-1">⚡ 2104</span>
          <Phone className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
