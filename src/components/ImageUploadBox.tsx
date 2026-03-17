import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";

const ACCEPTED_FORMATS = "image/jpeg,image/png,image/webp";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const MIN_RATIO = 1 / 2.5; // 1:2.5
const MAX_RATIO = 2.5 / 1; // 2.5:1

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

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      onSizeError?.();
      e.target.value = "";
      return;
    }

    // Check aspect ratio (soft warning, image still accepted)
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.width / img.height;
      if (ratio < MIN_RATIO || ratio > MAX_RATIO) {
        onRatioError?.();
      }
      setPreview(objectUrl);
      onImageSelected?.(file);
    };
    img.src = objectUrl;
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
          <img src={preview} alt="uploaded" className="w-full h-full object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={handleClick}
          className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card hover:bg-hover-bg transition-colors cursor-pointer ${className}`}
        >
          <ImagePlus className="w-6 h-6 text-text-muted" />
          <span className="text-sm text-text-muted">{label}</span>
        </button>
      )}
    </>
  );
};

export default ImageUploadBox;
