import { ImagePlus } from "lucide-react";

interface ImageUploadBoxProps {
  label: string;
  className?: string;
}

const ImageUploadBox = ({ label, className = "" }: ImageUploadBoxProps) => {
  return (
    <button
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card hover:bg-hover-bg transition-colors cursor-pointer ${className}`}
    >
      <ImagePlus className="w-6 h-6 text-text-muted" />
      <span className="text-sm text-text-muted">{label}</span>
    </button>
  );
};

export default ImageUploadBox;
