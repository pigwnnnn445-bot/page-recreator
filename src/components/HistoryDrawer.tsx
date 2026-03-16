import { X } from "lucide-react";
import sampleThumb from "@/assets/sample-video-thumb.jpg";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

// 模拟历史记录数据
const mockHistory = [
  {
    date: "2026-03-10",
    items: [
      { id: 1, thumb: sampleThumb },
    ],
  },
  {
    date: "2025-12-22",
    items: [
      { id: 2, thumb: sampleThumb },
      { id: 3, thumb: sampleThumb },
    ],
  },
];

const HistoryDrawer = ({ open, onClose }: HistoryPanelProps) => {
  if (!open) return null;

  return (
    <div className="w-80 flex-shrink-0 border-l border-border bg-card flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-foreground font-semibold text-base">历史记录</h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-hover-bg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 text-text-secondary" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        {mockHistory.map((group) => (
          <div key={group.date}>
            <p className="text-foreground font-semibold text-sm mb-3">{group.date}</p>
            <div className="grid grid-cols-2 gap-2">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={item.thumb}
                    alt="历史视频"
                    className="w-full aspect-video object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-border">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-hover-bg transition-colors cursor-pointer"
        >
          关闭
        </button>
      </div>
    </div>
  );
};

export default HistoryDrawer;
