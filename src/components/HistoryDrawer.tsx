import { X, FileText } from "lucide-react";
import sampleThumb from "@/assets/sample-video-thumb.jpg";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

// 模拟历史记录数据（空数组表示暂无记录）
const mockHistory: { date: string; items: { id: number; thumb: string }[] }[] = [];

const HistoryDrawer = ({ open, onClose }: HistoryPanelProps) => {
  if (!open) return null;

  const isEmpty = mockHistory.length === 0;

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
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="relative mb-4">
              <div className="w-24 h-28 rounded-lg bg-muted/50 flex flex-col items-start justify-center px-4 gap-1.5 shadow-sm">
                <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
                <div className="w-10 h-1.5 rounded-full bg-muted-foreground/20" />
                <div className="w-14 h-1.5 rounded-full bg-muted-foreground/20" />
                <div className="w-8 h-1.5 rounded-full bg-muted-foreground/20" />
                <div className="w-11 h-1.5 rounded-full bg-muted-foreground/20" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-20 h-24 rounded-lg bg-muted/30 -z-10 rotate-3" />
            </div>
            <p className="text-text-muted text-sm">暂无记录</p>
          </div>
        ) : (
          <div className="space-y-6">
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
        )}
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
