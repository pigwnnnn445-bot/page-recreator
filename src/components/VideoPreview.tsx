import { Download, Play } from "lucide-react";
import type { HistoryItem } from "@/types/history";

interface VideoPreviewProps {
  item: HistoryItem;
  onBack: () => void;
}

const VideoPreview = ({ item }: VideoPreviewProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 px-3 md:px-6 py-2 md:py-4 overflow-hidden">
      {/* Video - fills available space */}
      <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden">
        <img
          src={item.thumb}
          alt="视频预览"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-foreground/30 transition-colors">
            <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground" />
          </div>
        </div>
      </div>

      {/* Download button */}
      <div className="flex justify-start pt-3 md:pt-4 pb-1">
        <button className="flex items-center gap-2 px-12 py-3 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer">
          <Download className="w-5 h-5" /> 下载
        </button>
      </div>
    </div>
  );
};

export default VideoPreview;
