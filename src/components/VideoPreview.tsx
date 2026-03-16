import { ArrowLeft, Download, Play } from "lucide-react";
import type { HistoryItem } from "@/types/history";

interface VideoPreviewProps {
  item: HistoryItem;
  onBack: () => void;
}

const VideoPreview = ({ item, onBack }: VideoPreviewProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
      <div className="px-3 md:px-6 pt-4 pb-2">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors cursor-pointer text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> 返回
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-3 md:px-6 pb-6">
        {/* Video display */}
        <div className="w-full max-w-4xl">
          <div className="relative rounded-xl overflow-hidden mb-6">
            <img
              src={item.thumb}
              alt="视频预览"
              className="w-full aspect-video object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-foreground/30 transition-colors">
                <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
              </div>
            </div>
          </div>

          {/* Download button */}
          <div className="flex justify-center mb-6">
            <button className="flex items-center gap-2 px-12 py-3.5 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer">
              <Download className="w-5 h-5" /> 下载
            </button>
          </div>

          {/* Prompt info */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-foreground text-sm leading-relaxed mb-3">{item.prompt}</p>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-card-secondary text-text-secondary text-xs">
                {item.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-card-secondary text-text-secondary text-xs">
                {item.modelName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
