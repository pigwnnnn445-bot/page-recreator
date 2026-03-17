import { X, Video, VideoOff, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { HistoryItem } from "@/types/history";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
  items: HistoryItem[];
  onDelete: (id: string) => void;
  onSelect: (item: HistoryItem) => void;
}

const HistoryDrawer = ({ open, onClose, items, onDelete, onSelect }: HistoryPanelProps) => {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HistoryItem | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Group items by date
  const grouped = items.reduce<Record<string, HistoryItem[]>>((acc, item) => {
    const dateKey = item.createdAt.toISOString().split("T")[0];
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const isEmpty = items.length === 0;

  const handleDeleteClick = (item: HistoryItem) => {
    setMenuOpenId(null);
    setDeleteTarget(item);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div
        className={`flex-shrink-0 border-l border-border bg-card flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? 'max-lg:w-full max-lg:absolute max-lg:inset-0 max-lg:z-50 max-lg:border-l-0 lg:w-80 opacity-100'
            : 'w-0 opacity-0 border-l-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-foreground font-semibold text-base">历史记录</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-muted-foreground" />
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
              <p className="text-muted-foreground text-sm">暂无记录</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sortedDates.map((date) => (
                <div key={date}>
                  <p className="text-foreground font-semibold text-sm mb-3">{date}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {grouped[date].map((item) => (
                      <div
                        key={item.id}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        {item.status === "loading" ? (
                          <div className="w-full aspect-square bg-secondary rounded-lg flex flex-col items-center justify-center gap-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
                            <Video className="w-8 h-8 text-muted-foreground animate-pulse" />
                            <span className="text-muted-foreground text-xs animate-pulse">生成中...</span>
                          </div>
                        ) : item.status === "failed" ? (
                          <div
                            className="w-full aspect-square bg-secondary rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => onSelect(item)}
                          >
                            <VideoOff className="w-8 h-8 text-destructive" />
                            <span className="text-destructive text-xs">生成失败</span>
                          </div>
                        ) : (
                          <div
                            className="cursor-pointer"
                            onClick={() => onSelect(item)}
                          >
                            <video
                              src={item.videoUrl}
                              muted
                              playsInline
                              preload="metadata"
                              className="w-full aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity"
                            />
                          </div>
                        )}

                        {(item.status === "completed" || item.status === "failed") && (
                          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuOpenId === item.id ? menuRef : undefined}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpenId(menuOpenId === item.id ? null : item.id);
                              }}
                              className="w-7 h-7 rounded-full bg-foreground/40 backdrop-blur-sm flex items-center justify-center hover:bg-foreground/60 transition-colors cursor-pointer"
                            >
                              <MoreHorizontal className="w-4 h-4 text-white" />
                            </button>
                            {menuOpenId === item.id && (
                              <div className="absolute top-8 right-0 bg-popover border border-border rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteClick(item);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-destructive text-sm hover:bg-accent transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> 删除
                                </button>
                              </div>
                            )}
                          </div>
                        )}
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
            className="w-full py-2.5 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
          >
            关闭
          </button>
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="rounded-2xl max-w-sm">
          <AlertDialogHeader className="items-center text-center">
            <AlertDialogTitle className="text-primary text-lg">提示</AlertDialogTitle>
            <AlertDialogDescription className="text-foreground text-base pt-2">
              您确定要删除此 视频 吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex items-center justify-center gap-2 py-1">
            <input
              type="checkbox"
              id="dont-show"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="dont-show" className="text-foreground text-sm cursor-pointer">不再显示</label>
          </div>
          <AlertDialogFooter className="flex-row gap-3 sm:gap-3">
            <AlertDialogCancel className="flex-1 rounded-full border-border mt-0">
              取消
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="flex-1 rounded-full bg-gradient-to-r from-[hsl(240,74%,61%)] to-[hsl(160,56%,64%)] hover:opacity-90"
            >
              确认
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HistoryDrawer;
