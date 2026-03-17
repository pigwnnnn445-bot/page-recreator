import { X, Lightbulb } from "lucide-react";

interface ImageRequiredTipProps {
  open: boolean;
  onClose: () => void;
}

const ImageRequiredTip = ({ open, onClose }: ImageRequiredTipProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-28 bg-black/50" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-sm w-[90%] mx-4 shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-warning" />
            <span className="text-foreground font-semibold text-base">使用小提示</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-hover-bg transition-colors cursor-pointer">
            <X className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <p className="text-foreground text-sm leading-relaxed mb-8">
          🖼️ 先上传一张图片，这样我们才能为您制作精彩的视频！
        </p>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          好的
        </button>
      </div>
    </div>
  );
};

export default ImageRequiredTip;
