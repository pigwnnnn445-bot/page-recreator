import { X, Lightbulb } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const STORAGE_KEY = "hideImageRatioTip";

interface ImageRatioTipProps {
  open: boolean;
  onClose: () => void;
}

const ImageRatioTip = ({ open, onClose }: ImageRatioTipProps) => {
  const [noMoreTip, setNoMoreTip] = useState(false);

  if (!open) return null;

  const handleClose = () => {
    if (noMoreTip) {
      localStorage.setItem(STORAGE_KEY, "true");
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-card rounded-2xl p-6 max-w-sm w-[90%] mx-4 shadow-xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="text-foreground font-semibold text-base">使用小提示</span>
          </div>
          <button onClick={handleClose} className="p-1 rounded-lg hover:bg-accent transition-colors cursor-pointer">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <p className="text-foreground text-sm leading-relaxed mb-6">
          📐 推荐上传 1:1、3:4、4:3、16:9、9:16 或 21:9 的参考图，避免画面被裁切～
        </p>

        <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
          <Checkbox
            checked={noMoreTip}
            onCheckedChange={(checked) => setNoMoreTip(checked === true)}
          />
          <span className="text-sm text-muted-foreground">不再提示</span>
        </label>

        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-full bg-primary text-primary-foreground text-base font-medium hover:opacity-90 transition-opacity cursor-pointer"
        >
          好的
        </button>
      </div>
    </div>
  );
};

export const shouldShowRatioTip = () => {
  return localStorage.getItem(STORAGE_KEY) !== "true";
};

export default ImageRatioTip;
