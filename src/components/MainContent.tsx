import { Home, Clock, Play, Globe, Zap, Menu, Video, Copy, ArrowLeft, Download } from "lucide-react";
import HistoryDrawer from "./HistoryDrawer";
import VideoPreview from "./VideoPreview";
import PromptGeneratorDialog from "./PromptGeneratorDialog";
import { useState, useCallback } from "react";
import sampleThumb from "@/assets/sample-video-thumb.jpg";
import iconGuide from "@/assets/icon-guide.png";
import iconTips from "@/assets/icon-tips.png";
import iconPromptGen from "@/assets/icon-prompt-generator.webp";
import ThemeToggle from "./ThemeToggle";
import type { ModelInfo } from "@/types/api";
import type { HistoryItem } from "@/types/history";

interface MainContentProps {
  onMenuOpen: () => void;
  totalCost: number;
  models: ModelInfo[];
  onSelectModel: (model: ModelInfo) => void;
}

// 示例视频关联的模型信息
const SAMPLE_VIDEO = {
  modelId: 1110,
  category: "Veo",
  modelName: "veo3-fast",
  prompt: "一只可爱的橘猫在阳光下慵懒地伸懒腰，镜头缓缓推近，背景是温暖的午后庭院",
};

const MainContent = ({ onMenuOpen, totalCost, models, onSelectModel }: MainContentProps) => {
  const [prompt, setPrompt] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "mock-1",
      status: "loading",
      prompt: "一只可爱的小猫在开车，在法国埃菲尔铁塔附近",
      modelName: "veo3-fast",
      category: "Veo",
      createdAt: new Date("2026-03-16T10:30:00"),
    },
    {
      id: "mock-2",
      status: "completed",
      thumb: sampleThumb,
      videoUrl: "/videos/sample-generated.mp4",
      prompt: "一只可爱的小猫在开车，在法国埃菲尔铁塔附近",
      modelName: "veo3-fast",
      category: "Veo",
      createdAt: new Date("2026-03-16T09:15:00"),
    },
    {
      id: "mock-3",
      status: "completed",
      thumb: sampleThumb,
      videoUrl: "/videos/sample-generated.mp4",
      prompt: "雪夜中的圣诞小屋，烟囱冒着白烟，门前的圣诞树闪烁着彩灯",
      modelName: "veo3",
      category: "Veo",
      createdAt: new Date("2026-03-10T14:20:00"),
    },
    {
      id: "mock-4",
      status: "completed",
      thumb: sampleThumb,
      videoUrl: "/videos/sample-generated.mp4",
      prompt: "星空下的雪山木屋，温暖的灯光从窗户透出，雪花缓缓飘落",
      modelName: "veo3",
      category: "Veo",
      createdAt: new Date("2025-12-22T18:00:00"),
    },
    {
      id: "mock-5",
      status: "completed",
      thumb: sampleThumb,
      videoUrl: "/videos/sample-generated.mp4",
      prompt: "冬日暖阳下的欧式小镇，街道上铺满积雪，远处教堂钟声响起",
      modelName: "veo3-fast",
      category: "Veo",
      createdAt: new Date("2025-12-22T16:45:00"),
    },
  ]);
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);
  const [promptGenOpen, setPromptGenOpen] = useState(false);

  const handleMake = () => {
    setPrompt(SAMPLE_VIDEO.prompt);
    const targetModel = models.find(m => m.id === SAMPLE_VIDEO.modelId);
    if (targetModel) {
      onSelectModel(targetModel);
    }
  };

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      status: "loading",
      prompt: prompt.trim(),
      modelName: "veo3-fast",
      category: "Veo",
      createdAt: new Date(),
    };

    setHistoryItems(prev => [newItem, ...prev]);
    setGenerating(true);

    // Simulate completion after 5 seconds (demo purposes)
    setTimeout(() => {
      setHistoryItems(prev =>
        prev.map(item =>
          item.id === newItem.id
            ? { ...item, status: "completed" as const, thumb: sampleThumb, videoUrl: "/videos/sample-generated.mp4" }
            : item
        )
      );
      setGenerating(false);
    }, 5000);
  }, [prompt]);

  const handleDeleteItem = useCallback((id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
    if (previewItem?.id === id) setPreviewItem(null);
  }, [previewItem]);

  const handleSelectItem = useCallback((item: HistoryItem) => {
    if (item.status === "completed") {
      setPreviewItem(item);
      setHistoryOpen(false);
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-screen min-w-0">
      {/* Top area: content + history side by side */}
      <div className="flex-1 flex min-h-0">
        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Nav */}
          <header className="flex items-center justify-between px-4 md:px-6 py-4 gap-3">
            <button
              onClick={onMenuOpen}
              className="md:hidden p-2 rounded-lg hover:bg-hover-bg transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => { setPreviewItem(null); }}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-hover-bg transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" /> <span className="hidden sm:inline">首页</span>
              </button>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-hover-bg transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4" /> <span className="hidden sm:inline">历史记录</span>
              </button>
            </div>
          </header>

          {/* Main Area */}
          {previewItem ? (
            <>
              <VideoPreview item={previewItem} onBack={() => setPreviewItem(null)} />
              {/* Bottom Prompt Input - preview mode shows video prompt */}
              <div className="px-3 md:px-6 pb-3 md:pb-5">
                <div className="bg-card border border-border rounded-[24px] p-3 md:p-4 shadow-sm h-[88px] md:h-[100px] flex flex-col justify-between">
                  <p className="w-full text-foreground text-sm mb-3 truncate">{previewItem.prompt}</p>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setPromptGenOpen(true)}
                      className="inline-flex items-center justify-center gap-4 whitespace-nowrap px-3 py-1.5 text-text-secondary hover:text-foreground transition-colors cursor-pointer rounded-[16px] border border-border"
                      style={{ fontFamily: "Gilroy, ui-sans-serif, system-ui, sans-serif", fontSize: "14px" }}
                    >
                      <img src={iconPromptGen} alt="提示词生成器" className="w-4 h-4" /> 提示词生成器
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      生成 <Zap className="w-3.5 h-3.5" /> {totalCost}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-3 md:px-6 pb-2 md:pb-4 flex items-center justify-center">
                {generating ? (
                  /* Generating State */
                  <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                    <Video className="w-16 h-16 text-primary mb-6" />
                    <p className="text-text-muted text-sm md:text-base leading-relaxed mb-8">
                      视频生成大约需要20分钟🏖️。在这期间，您可以尽情体验其他有趣的AI模型，或者放松一下，生成过程不会中断哦！完成后，别忘了在历史记录中查看您的精彩视频！
                    </p>
                    <button
                      onClick={() => setGenerating(false)}
                      className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Copy className="w-5 h-5" /> 后台生成
                    </button>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto">
                    {/* Welcome */}
                    <div className="text-center mb-3 md:mb-8 mt-2 md:mt-8">
                      <h1 className="text-xl md:text-3xl font-bold text-title mb-1 md:mb-2">👋嘿！欢迎来到 Rita</h1>
                      <p className="text-text-muted text-xs md:text-base">这是您的专属频道，请发送第一条消息开始制作您自己的视频！</p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-8">
                      {/* Video Preview Card */}
                      <div className="bg-card rounded-xl border border-border p-3 md:p-4 shadow-sm md:row-span-2">
                        <div className="relative rounded-lg overflow-hidden mb-2 md:mb-4">
                          <video
                            src="/videos/sample-home.mp4"
                            muted
                            playsInline
                            preload="metadata"
                            className="w-full aspect-[2/1] md:aspect-video object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-foreground/30 transition-colors">
                              <Play className="w-6 h-6 text-primary-foreground fill-primary-foreground" />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-3 py-1.5 rounded-full bg-card-secondary text-text-secondary text-sm">Veo</span>
                          <span className="px-3 py-1.5 rounded-full bg-card-secondary text-text-secondary text-sm">veo3-fast</span>
                          <button
                            onClick={handleMake}
                            className="ml-auto px-4 py-1.5 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                          >
                            制作！
                          </button>
                        </div>
                      </div>

                      {/* Chat Assistant Card */}
                      <div className="bg-card rounded-xl border border-border p-3 md:p-4 shadow-sm">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-theme-1/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Globe className="w-4 h-4 text-theme-1" />
                          </div>
                          <p className="text-foreground text-sm leading-relaxed">
                            嗨！我是 GPT——你的视频提示助手！让我们一起改进你的提示吧。
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-card-secondary rounded-full px-4 py-2.5">
                          <span className="text-primary text-sm">💡 输入点想法试试看</span>
                          <div className="ml-auto w-7 h-7 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 flex items-center justify-center">
                            <span className="text-primary-foreground text-xs">😊</span>
                          </div>
                        </div>
                      </div>

                      {/* Guide & Tips */}
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex flex-col items-center justify-center gap-1.5 md:gap-2 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer shadow-sm">
                          <img src={iconGuide} alt="使用说明" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
                          <span className="text-foreground text-xs md:text-sm font-medium">使用说明</span>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-3 md:p-4 flex flex-col items-center justify-center gap-1.5 md:gap-2 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer shadow-sm">
                          <img src={iconTips} alt="生成技巧" className="w-10 h-10 md:w-16 md:h-16 object-contain" />
                          <span className="text-foreground text-xs md:text-sm font-medium">生成技巧</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Prompt Input - only show when not generating */}
              {!generating && (
                <div className="px-3 md:px-6 pb-3 md:pb-5">
                  <div className="bg-card border border-border rounded-[24px] p-3 md:p-4 shadow-sm h-[88px] md:h-[100px] flex flex-col justify-between">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="输入你的提示，例如：一只猫"
                      className="w-full bg-transparent text-foreground placeholder:text-text-muted outline-none text-sm mb-3"
                    />
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setPromptGenOpen(true)}
                        className="inline-flex items-center justify-center gap-4 whitespace-nowrap px-3 py-1.5 text-text-secondary hover:text-foreground transition-colors cursor-pointer rounded-[16px] border border-border"
                        style={{ fontFamily: "Gilroy, ui-sans-serif, system-ui, sans-serif", fontSize: "14px" }}
                      >
                        <img src={iconPromptGen} alt="提示词生成器" className="w-4 h-4" /> 提示词生成器
                      </button>
                      <button
                        onClick={handleGenerate}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                      >
                        生成 <Zap className="w-3.5 h-3.5" /> {totalCost}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* History Panel - inline, not overlay */}
        <HistoryDrawer
          open={historyOpen}
          onClose={() => setHistoryOpen(false)}
          items={historyItems}
          onDelete={handleDeleteItem}
          onSelect={handleSelectItem}
        />
      </div>

      <PromptGeneratorDialog
        open={promptGenOpen}
        onClose={() => setPromptGenOpen(false)}
        initialPrompt={prompt}
        onApplyPrompt={(p) => setPrompt(p)}
      />
    </div>
  );
};

export default MainContent;
