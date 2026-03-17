import { X } from "lucide-react";
import { useState, useEffect } from "react";

const STORAGE_KEY = "model-button-tip-dismissed";

const ModelButtonTip = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  if (!visible) return null;

  return (
    <div className="absolute bottom-full left-0 mb-1.5 z-10 animate-fade-in">
      <div className="relative flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs leading-relaxed shadow-lg max-w-[300px]">
        <span className="flex-1">
          这里不止能选模型哦～点开还能设置清晰度、时长、上传参考图等更多视频参数。
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); dismiss(); }}
          className="flex-shrink-0 mt-0.5 p-0.5 rounded-full hover:bg-primary-foreground/20 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Arrow pointing down to the button */}
      <div className="absolute -bottom-1.5 left-6 w-3 h-3 rotate-45 bg-primary" />
    </div>
  );
};

export default ModelButtonTip;
