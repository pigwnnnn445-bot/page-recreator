import { Home, Clock, Play, Pause, Globe, Zap, Menu, Video, Copy, ArrowLeft, Download, SlidersHorizontal, ChevronRight } from "lucide-react";
import type { CreationMode, ModelConfig } from "@/types/api";
import HistoryDrawer from "./HistoryDrawer";
import VideoPreview from "./VideoPreview";
import PromptGeneratorDialog from "./PromptGeneratorDialog";
import ImageRequiredTip from "./ImageRequiredTip";
import ImageSizeTip from "./ImageSizeTip";
import ImageRatioTip from "./ImageRatioTip";
import { useState, useCallback, useRef } from "react";
import sampleThumb from "@/assets/sample-video-thumb.jpg";
import iconGuide from "@/assets/icon-guide.png";
import iconTips from "@/assets/icon-tips.png";
import iconPromptGen from "@/assets/icon-prompt-generator.webp";
import ThemeToggle from "./ThemeToggle";
import ModelButtonTip from "./ModelButtonTip";
import type { ModelInfo } from "@/types/api";
import type { HistoryItem } from "@/types/history";

interface MainContentProps {
  onMenuOpen: () => void;
  totalCost: number;
  models: ModelInfo[];
  onSelectModel: (model: ModelInfo) => void;
  selectedModel: ModelInfo;
  selectedCreationMode: CreationMode;
  selectedQuality: string;
  selectedDuration: string;
  selectedRatio: string;
  onRestoreFromHistory: (item: HistoryItem) => void;
  currentConfig: ModelConfig;
  imageSizeTipOpen: boolean;
  onCloseSizeTip: () => void;
  imageRatioTipOpen: boolean;
  onCloseRatioTip: () => void;
  hasUploadedImage: boolean;
}

const SAMPLE_VIDEO = {
  modelId: 1110,
  category: "Veo",
  modelName: "veo3-fast",
  prompt: "一只可爱的橘猫在阳光下慵懒地伸懒腰，镜头缓缓推近，背景是温暖的午后庭院",
};

const HomeVideoPlayer = ({ onMake }: { onMake: () => void }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setPlaying(!playing);
  };
  return (
    <div className="bg-card rounded-xl border border-border p-2 md:p-2.5 lg:p-3 shadow-sm h-full flex flex-col">
      <div className="relative rounded-lg overflow-hidden cursor-pointer group flex-1 min-h-0" onClick={handlePlayPause}>
        <video ref={videoRef} src="/videos/sample-home.mp4#t=0.001" muted playsInline preload="metadata" onEnded={() => setPlaying(false)} className="w-full aspect-[2.2/1] lg:aspect-auto lg:h-full lg:min-h-[200px] object-cover" />
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {playing ? <Pause className="w-5 h-5 text-white fill-white" /> : <Play className="w-5 h-5 text-white fill-white" />}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 pt-2 md:pt-2.5 px-0.5">
        <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-[11px] md:text-xs font-medium">Veo</span>
        <span className="px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-[11px] md:text-xs font-medium">veo3-fast</span>
        <button
          onClick={(e) => { e.stopPropagation(); onMake(); }}
          className="ml-auto px-4 py-1.5 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer shadow-md"
        >
          制作！
        </button>
      </div>
    </div>
  );
};

const MainContent = ({ onMenuOpen, totalCost, models, onSelectModel, selectedModel, selectedCreationMode, selectedQuality, selectedDuration, selectedRatio, onRestoreFromHistory, currentConfig, imageSizeTipOpen, onCloseSizeTip, imageRatioTipOpen, onCloseRatioTip, hasUploadedImage }: MainContentProps) => {
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const generateCountRef = useRef(0);
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);
  const [promptGenOpen, setPromptGenOpen] = useState(false);
  const [imageRequiredTipOpen, setImageRequiredTipOpen] = useState(false);
  
  const generatingItemIdRef = useRef<string | null>(null);
  const backgroundGenerationRef = useRef(false);

  const handleMake = () => {
    setPrompt(SAMPLE_VIDEO.prompt);
    const targetModel = models.find(m => m.id === SAMPLE_VIDEO.modelId);
    if (targetModel) {
      onSelectModel(targetModel);
    }
  };

  const isImageRequired = selectedCreationMode === "image_to_video" && !hasUploadedImage;

  const handleGenerate = useCallback(() => {
    if (!prompt.trim()) return;

    if (isImageRequired) {
      setImageRequiredTipOpen(true);
      return;
    }
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      status: "loading",
      prompt: prompt.trim(),
      modelName: selectedModel.name,
      category: selectedModel.category ?? "",
      createdAt: new Date(),
      modelId: selectedModel.id,
      creationMode: selectedCreationMode,
      quality: selectedQuality,
      duration: selectedDuration,
      ratio: selectedRatio,
    };

    setHistoryItems(prev => [newItem, ...prev]);
    setPrompt("");
    setPreviewItem(null);
    setGenerating(true);
    generatingItemIdRef.current = newItem.id;
    backgroundGenerationRef.current = false;

    generateCountRef.current += 1;
    const shouldFail = generateCountRef.current % 2 === 0;

    setTimeout(() => {
      const completedItem = shouldFail
        ? { ...newItem, status: "failed" as const }
        : { ...newItem, status: "completed" as const, thumb: sampleThumb, videoUrl: "/videos/sample-generated.mp4" };

      setHistoryItems(prev =>
        prev.map(item => item.id === newItem.id ? completedItem : item)
      );
      setGenerating(false);

      if (!backgroundGenerationRef.current && generatingItemIdRef.current === newItem.id) {
        setPreviewItem(completedItem);
      }
      generatingItemIdRef.current = null;
    }, 5000);
  }, [prompt, selectedModel, selectedCreationMode, selectedQuality, selectedDuration, selectedRatio, isImageRequired]);

  const handleDeleteItem = useCallback((id: string) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
    if (previewItem?.id === id) setPreviewItem(null);
  }, [previewItem]);

  const handleSelectItem = useCallback((item: HistoryItem) => {
    if (item.status === "completed" || item.status === "failed") {
      setPreviewItem(item);
      setPrompt(item.prompt);
      onRestoreFromHistory(item);
      setHistoryOpen(false);
    }
  }, [onRestoreFromHistory]);

  const handleRegenerate = useCallback(() => {
    if (!previewItem) return;
    setPrompt(previewItem.prompt);
    setPreviewItem(null);
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      status: "loading",
      prompt: previewItem.prompt,
      modelName: selectedModel.name,
      category: selectedModel.category ?? "",
      createdAt: new Date(),
      modelId: selectedModel.id,
      creationMode: selectedCreationMode,
      quality: selectedQuality,
      duration: selectedDuration,
      ratio: selectedRatio,
    };
    setHistoryItems(prev => [newItem, ...prev]);
    setPrompt("");
    setGenerating(true);
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
  }, [previewItem, selectedModel, selectedCreationMode, selectedQuality, selectedDuration, selectedRatio]);

  return (
    <div className="flex-1 flex flex-col min-w-0 relative" style={{ minHeight: '100dvh' }}>
      <div className="flex-1 flex min-h-0">
        <div className={`flex-1 flex flex-col min-w-0 ${historyOpen ? 'max-lg:hidden' : ''}`}>
          {/* Top Nav */}
          <header className="flex items-center justify-between px-4 lg:px-6 py-2 lg:py-4 gap-3">
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => { setPreviewItem(null); backgroundGenerationRef.current = true; setGenerating(false); setPrompt(""); }}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-accent transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" /> <span className="hidden sm:inline">首页</span>
              </button>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-accent transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4" /> <span className="hidden sm:inline">历史记录</span>
              </button>
            </div>
          </header>

          {/* Main Area */}
          {previewItem ? (
            <>
              <VideoPreview item={previewItem} onBack={() => setPreviewItem(null)} onRegenerate={handleRegenerate} />
              <div className="px-3 pb-3 lg:p-6 lg:pt-0">
                  <div className="md:hidden mb-2 relative">
                    <ModelButtonTip />
                    <button
                      onClick={onMenuOpen}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm hover:bg-accent transition-colors cursor-pointer w-fit"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">模型:</span>
                      <span className="font-medium truncate max-w-[120px]">{selectedModel.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                <div className="flex flex-col gap-4 lg:gap-6 bg-card border border-border px-3 py-2.5 lg:px-4 lg:py-3 rounded-2xl lg:rounded-3xl text-base">
                  <textarea
                    value={prompt}
                    onChange={(e) => {
                      setPrompt(e.target.value);
                      setIsTyping(true);
                      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                      typingTimerRef.current = setTimeout(() => setIsTyping(false), 1000);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    placeholder="输入你的提示，例如：一只猫"
                    rows={3}
                    className={`w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm resize-none overflow-y-auto max-h-[4.5rem] prompt-scrollbar`}
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setPromptGenOpen(true)}
                      className="inline-flex items-center justify-center gap-4 whitespace-nowrap px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-[16px] border border-border"
                      style={{ fontFamily: "Gilroy, ui-sans-serif, system-ui, sans-serif", fontSize: "14px" }}
                    >
                      <img src={iconPromptGen} alt="提示词生成器" className="w-4 h-4" /> 提示词生成器
                    </button>
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      生成 <Zap className="w-3.5 h-3.5" /> {totalCost}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-3 lg:px-6 pb-1 lg:pb-4 flex items-center justify-center">
                {generating ? (
                  <div className="flex flex-col items-center justify-center text-center max-w-lg mx-auto animate-fade-in">
                    <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: '2.5s' }} />
                      <div className="absolute inset-1 rounded-full bg-primary/5 animate-pulse" />
                      <Video className="relative w-10 h-10 text-primary animate-pulse" />
                    </div>
                    <div className="w-48 h-1.5 rounded-full bg-muted overflow-hidden mb-6">
                      <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] animate-[shimmer_2s_ease-in-out_infinite]" />
                    </div>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-8">
                      视频生成大约需要20分钟🏖️。在这期间，您可以尽情体验其他有趣的AI模型，或者放松一下，生成过程不会中断哦！完成后，别忘了在历史记录中查看您的精彩视频！
                    </p>
                    <button
                      onClick={() => { backgroundGenerationRef.current = true; setGenerating(false); setPrompt(""); }}
                      className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] text-white text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <Copy className="w-5 h-5" /> 后台生成
                    </button>
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-2 lg:mb-8 mt-1 lg:mt-8">
                      <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-foreground mb-0.5 lg:mb-2">👋嘿！欢迎来到 Rita</h1>
                      <p className="text-muted-foreground text-[11px] md:text-xs lg:text-base">这是您的专属频道，请发送第一条消息开始制作您自己的视频！</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3 lg:gap-4 mb-2 lg:mb-8">
                      <div className="lg:row-span-2 lg:min-h-0">
                        <HomeVideoPlayer onMake={handleMake} />
                      </div>

                      <div className="bg-card rounded-xl border border-border p-2.5 md:p-3 lg:p-4 shadow-sm">
                        <div className="flex items-start gap-2 lg:gap-3 mb-2 lg:mb-3">
                          <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Globe className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-emerald-500" />
                          </div>
                          <p className="text-foreground text-xs lg:text-sm leading-relaxed">
                            嗨！我是 GPT——你的视频提示助手！让我们一起改进你的提示吧。
                          </p>
                        </div>
                        <div className="flex items-center gap-2 bg-secondary rounded-full px-3 py-2 lg:px-4 lg:py-2.5 opacity-50 cursor-not-allowed pointer-events-none select-none">
                          <span className="text-primary text-xs lg:text-sm">💡 输入点想法试试看</span>
                          <div className="ml-auto w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] flex items-center justify-center">
                            <span className="text-white text-xs">😊</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 lg:gap-4">
                        <div className="bg-card rounded-xl border border-border p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center gap-1 lg:gap-2 shadow-sm opacity-50 cursor-not-allowed pointer-events-none select-none">
                          <img src={iconGuide} alt="使用说明" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain" />
                          <span className="text-foreground text-[11px] md:text-xs lg:text-sm font-medium">使用说明</span>
                        </div>
                        <div className="bg-card rounded-xl border border-border p-2 md:p-3 lg:p-4 flex flex-col items-center justify-center gap-1 lg:gap-2 shadow-sm opacity-50 cursor-not-allowed pointer-events-none select-none">
                          <img src={iconTips} alt="生成技巧" className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16 object-contain" />
                          <span className="text-foreground text-[11px] md:text-xs lg:text-sm font-medium">生成技巧</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {!generating && (
                <div className="px-3 pb-3 lg:p-6 lg:pt-0" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}>
                  <div className="md:hidden mb-2 relative">
                    <ModelButtonTip />
                    <button
                      onClick={onMenuOpen}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm hover:bg-accent transition-colors cursor-pointer w-fit"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">模型:</span>
                      <span className="font-medium truncate max-w-[120px]">{selectedModel.name}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-4 lg:gap-6 bg-card border border-border px-3 py-2.5 lg:px-4 lg:py-3 rounded-2xl lg:rounded-3xl text-base">
                    <textarea
                      value={prompt}
                      onChange={(e) => {
                        setPrompt(e.target.value);
                        setIsTyping(true);
                        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
                        typingTimerRef.current = setTimeout(() => setIsTyping(false), 1000);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                      placeholder="输入你的提示，例如：一只猫"
                      rows={2}
                      className={`w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm resize-none overflow-y-auto max-h-[3rem] lg:max-h-[4.5rem] prompt-scrollbar`}
                    />
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setPromptGenOpen(true)}
                        className="inline-flex items-center justify-center gap-4 whitespace-nowrap px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-[16px] border border-border"
                        style={{ fontFamily: "Gilroy, ui-sans-serif, system-ui, sans-serif", fontSize: "14px" }}
                      >
                        <img src={iconPromptGen} alt="提示词生成器" className="w-4 h-4" /> 提示词生成器
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={!prompt.trim()}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
      <ImageRequiredTip
        open={imageRequiredTipOpen}
        onClose={() => setImageRequiredTipOpen(false)}
      />
      <ImageSizeTip
        open={imageSizeTipOpen}
        onClose={onCloseSizeTip}
      />
      <ImageRatioTip
        open={imageRatioTipOpen}
        onClose={onCloseRatioTip}
      />
    </div>
  );
};

export default MainContent;
