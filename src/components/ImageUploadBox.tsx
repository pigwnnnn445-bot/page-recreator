import { ImagePlus, RefreshCw, ZoomIn, Trash2 } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MIN_RATIO = 1 / 2.5;
const MAX_RATIO = 2.5 / 1;

interface ImageUploadBoxProps {
  label: string;
  className?: string;
  onImageSelected?: (file: File | null) => void;
  onSizeError?: () => void;
  onRatioError?: () => void;
}

const ImageUploadBox = ({ label, className = "", onImageSelected, onSizeError, onRatioError }: ImageUploadBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [zoomed, setZoomed] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const processFile = useCallback((file: File) => {
    if (file.size > MAX_SIZE_BYTES) {
      onSizeError?.();
      return;
    }
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio < MIN_RATIO || ratio > MAX_RATIO) {
        onRatioError?.();
      }
      if (preview) URL.revokeObjectURL(preview);
      setPreview(objectUrl);
      onImageSelected?.(file);
    };
    img.src = objectUrl;
  }, [preview, onSizeError, onRatioError, onImageSelected]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
    e.target.value = "";
  };

  const handleReplace = (e: React.MouseEvent) => {
    e.stopPropagation();
    inputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    onImageSelected?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FORMATS}
        className="hidden"
        onChange={handleChange}
      />
      {preview ? (
        <div className={`relative rounded-xl overflow-hidden border border-border bg-card group ${className}`}>
          <img src={preview} alt="uploaded" className="w-full h-full object-contain" />
          <div className="absolute bottom-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleReplace}
              title="替换"
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setZoomed(true); }}
              title="放大"
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleRemove}
              title="删除"
              className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card hover:bg-accent transition-colors cursor-pointer ${className}`}
        >
          <ImagePlus className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{label}</span>
        </button>
      )}

      {/* Zoom overlay */}
      {zoomed && preview && createPortal(
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center cursor-pointer"
          onClick={() => setZoomed(false)}
        >
          <img src={preview} alt="zoomed" className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" />
        </div>,
        document.body
      )}
    </>
  );
};

export default ImageUploadBox;
