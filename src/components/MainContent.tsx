import { Home, Clock, Play, Globe, Zap } from "lucide-react";
import { useState } from "react";
import sampleThumb from "@/assets/sample-video-thumb.jpg";
import iconGuide from "@/assets/icon-guide.png";
import iconTips from "@/assets/icon-tips.png";

const MainContent = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Top Nav */}
      <header className="flex items-center justify-end px-6 py-4 gap-3">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-secondary transition-colors">
          <Home className="w-4 h-4" /> 首页
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground text-sm hover:bg-secondary transition-colors">
          <Clock className="w-4 h-4" /> 历史记录
        </button>
      </header>

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="max-w-3xl mx-auto">
          {/* Welcome */}
          <div className="text-center mb-8 mt-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">👋嘿！欢迎来到 Rita</h1>
            <p className="text-muted-foreground">这是您的专属频道，请发送第一条消息开始制作您自己的视频！</p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* Video Preview Card */}
            <div className="bg-card rounded-xl border border-border p-4 row-span-2">
              <div className="relative rounded-lg overflow-hidden mb-4">
                <img src={sampleThumb} alt="示例视频" className="w-full aspect-video object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-6 h-6 text-foreground fill-foreground" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">Veo</span>
                <span className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">veo3-fast</span>
                <button className="ml-auto px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  制作！
                </button>
              </div>
            </div>

            {/* Chat Assistant Card */}
            <div className="bg-card rounded-xl border border-border p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Globe className="w-4 h-4 text-success" />
                </div>
                <p className="text-foreground text-sm leading-relaxed">
                  嗨！我是 GPT——你的视频提示助手！让我们一起改进你的提示吧。
                </p>
              </div>
              <div className="flex items-center gap-2 bg-secondary rounded-full px-4 py-2.5">
                <span className="text-primary text-sm">💡 输入点想法试试看</span>
                <div className="ml-auto w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground text-xs">😊</span>
                </div>
              </div>
            </div>

            {/* Guide & Tips */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors cursor-pointer">
                <img src={iconGuide} alt="使用说明" className="w-16 h-16 object-contain" />
                <span className="text-foreground text-sm font-medium">使用说明</span>
              </div>
              <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors cursor-pointer">
                <img src={iconTips} alt="生成技巧" className="w-16 h-16 object-contain" />
                <span className="text-foreground text-sm font-medium">生成技巧</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Prompt Input */}
      <div className="px-6 pb-5">
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-4">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="输入你的提示，例如：一只猫"
              className="w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm mb-3"
            />
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" /> 提示生成器
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                生成 <Zap className="w-3.5 h-3.5" /> 35
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
