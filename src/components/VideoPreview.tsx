import { Download, Play } from "lucide-react";
import type { HistoryItem } from "@/types/history";

interface VideoPreviewProps {
  item: HistoryItem;
  onBack: () => void;
}

const VideoPreview = ({ item }: VideoPreviewProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-y-auto px-3 md:px-6 py-4">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl">
          {/* Video display */}
          <div className="relative rounded-xl overflow-hidden">
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

          {/* Download button - left aligned */}
          <div className="flex justify-start mt-6">
            <button className="flex items-center gap-2 px-12 py-3.5 rounded-full bg-gradient-to-r from-theme-2 to-theme-1 text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer">
              <Download className="w-5 h-5" /> 下载
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
