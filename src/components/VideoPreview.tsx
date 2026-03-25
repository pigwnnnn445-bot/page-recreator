import { Download, Play, Pause, VideoOff, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";
import type { HistoryItem } from "@/types/history";

interface VideoPreviewProps {
  item: HistoryItem;
  onBack: () => void;
  onRegenerate?: () => void;
}

const SingleVideoPlayer = ({ videoUrl, onDownload }: { videoUrl: string; onDownload: (url: string) => void }) => {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setPlaying(!playing);
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={`${videoUrl}#t=0.001`}
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          preload="metadata"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
          onClick={handlePlayPause}
        >
          <div className="w-16 h-16 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-foreground/30 transition-colors">
            {playing ? <Pause className="w-8 h-8 text-white fill-white" /> : <Play className="w-8 h-8 text-white fill-white" />}
          </div>
        </div>
      </div>
      <div className="flex justify-start pt-3 md:pt-4 pb-1">
        <button onClick={() => onDownload(videoUrl)} className="flex items-center justify-center gap-2 w-full md:w-auto px-12 py-3 rounded-full bg-primary dark:bg-[hsl(240,74%,61%)] text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer">
          <Download className="w-5 h-5" /> 下载
        </button>
      </div>
    </div>
  );
};

const MultiVideoCarousel = ({ videos, modelName }: { videos: { videoUrl: string }[]; modelName: string }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentVideo = videos[currentIndex];

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setPlaying(!playing);
  };

  const goTo = (index: number) => {
    setPlaying(false);
    if (videoRef.current) videoRef.current.pause();
    setCurrentIndex(index);
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${modelName || "video"}-${currentIndex + 1}-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${modelName || "video"}-${currentIndex + 1}-${Date.now()}.mp4`;
      a.click();
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden bg-black">
        <video
          key={currentIndex}
          ref={videoRef}
          src={`${currentVideo.videoUrl}#t=0.001`}
          onEnded={() => setPlaying(false)}
          className="absolute inset-0 w-full h-full object-contain"
          playsInline
          preload="metadata"
        />
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${playing ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
          onClick={handlePlayPause}
        >
          <div className="w-16 h-16 rounded-full bg-foreground/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-foreground/30 transition-colors">
            {playing ? <Pause className="w-8 h-8 text-white fill-white" /> : <Play className="w-8 h-8 text-white fill-white" />}
          </div>
        </div>

        {/* Left/Right arrows */}
        {currentIndex > 0 && (
          <button
            onClick={(e) => { e.stopPropagation(); goTo(currentIndex - 1); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors z-10"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}
        {currentIndex < videos.length - 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); goTo(currentIndex + 1); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {videos.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); goTo(i); }}
              className={`h-1 rounded-full transition-all cursor-pointer ${
                i === currentIndex ? "w-6 bg-white" : "w-4 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-start pt-3 md:pt-4 pb-1">
        <button onClick={() => handleDownload(currentVideo.videoUrl)} className="flex items-center justify-center gap-2 w-full md:w-auto px-12 py-3 rounded-full bg-primary dark:bg-[hsl(240,74%,61%)] text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer">
          <Download className="w-5 h-5" /> 下载 ({currentIndex + 1}/{videos.length})
        </button>
      </div>
    </div>
  );
};

const VideoPreview = ({ item, onRegenerate }: VideoPreviewProps) => {
  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `${item.modelName || "video"}-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.modelName || "video"}-${Date.now()}.mp4`;
      a.click();
    }
  };

  // Failed state
  if (item.status === "failed") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-3 md:px-6 py-2 md:py-4">
        <VideoOff className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-sm md:text-base mb-8">视频生成失败</p>
        {onRegenerate && (
          <button
            onClick={onRegenerate}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] text-white text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            <RefreshCw className="w-5 h-5" /> 重新生成
          </button>
        )}
      </div>
    );
  }

  const isMultiVideo = item.videos && item.videos.length > 1;

  return (
    <div className="flex-1 flex flex-col min-h-0 px-3 md:px-6 py-2 md:py-4 overflow-hidden">
      {isMultiVideo ? (
        <MultiVideoCarousel videos={item.videos!} modelName={item.modelName} />
      ) : (
        item.videoUrl && <SingleVideoPlayer videoUrl={item.videoUrl} onDownload={handleDownload} />
      )}
    </div>
  );
};

export default VideoPreview;
