import { useState, useCallback, useEffect } from "react";
import { X, RefreshCw, Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";

interface PromptGeneratorDialogProps {
  open: boolean;
  onClose: () => void;
  initialPrompt: string;
  onApplyPrompt: (prompt: string) => void;
}

const MOCK_PROMPT_SETS = [
  [
    "一幅神秘场景，描绘隐藏在浓雾弥漫的密林中的古老日本神社，泛着幽幽灯光，樱花轻轻飘落。氛围融合宁静与神秘，以柔和的色调和细腻的笔触表现。",
    "一幅超现实抽象作品，表现\u201C非存在\u201D的概念，包含旋转的虚空、碎裂的形状消失于黑暗中，以及从深渊中若隐若现的闪烁光芒。风格梦幻且具宇宙感，色彩鲜明对比，形态流动。",
    "未来城市夜幕下的景象，高耸的玻璃与金属摩天大楼，通过发光的桥梁相连，有悬浮的交通工具。霓虹灯映照出五彩斑斓的倒影，背景是充满宇宙色彩的天空，点缀着遥远的星辰。",
    "受蒸汽朋克启发的场景，描绘复杂的飞行器在飘浮的岛屿、飞艇和机械生物中穿梭。温暖的色调与细致的机械细节营造出冒险和发明的氛围。",
  ],
  [
    "清晨薄雾中的江南水乡，白墙黛瓦倒映在平静的河面上，一叶扁舟缓缓驶过古桥，晨光洒落在青石板路上，营造出诗意而宁静的氛围。",
    "浩瀚星空下的冰岛极光，绚丽的绿色和紫色光带在天空中舞动，倒映在镜面般的冰湖中，远处是覆雪的火山，画面充满梦幻与壮丽。",
    "繁忙的东京涩谷十字路口，霓虹灯闪烁的夜晚，行人如潮水般涌过，雨滴在地面反射出五彩光芒，镜头从高处俯瞰，展现都市的活力与节奏。",
    "一只金色的巨龙盘旋在云海之上，鳞片在阳光下闪耀，身后拖着长长的云雾尾迹，远处是连绵的雪山和瀑布，画面充满东方神话的磅礴气势。",
  ],
];

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" ? window.innerWidth >= 1024 : true);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return isDesktop;
}

const PromptGeneratorInner = ({
  inputText,
  setInputText,
  results,
  isOptimizing,
  generateResults,
  handleRefresh,
  handleSelectResult,
  handleEditResult,
  onClose,
}: {
  inputText: string;
  setInputText: (v: string) => void;
  results: string[] | null;
  isOptimizing: boolean;
  generateResults: () => void;
  handleRefresh: () => void;
  handleSelectResult: (i: number) => void;
  handleEditResult: (i: number) => void;
  onClose: () => void;
}) => (
  <>
    <div className="flex items-center justify-between p-4 pb-0 flex-shrink-0">
      <h2 className="text-foreground text-base font-semibold">提示词生成器</h2>
      <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1">
        <X className="w-5 h-5" />
      </button>
    </div>
    <div className="p-4 flex flex-col gap-3 overflow-y-auto min-h-0">
      <div className="bg-secondary rounded-xl p-3 flex flex-col min-h-[140px] md:min-h-[180px] flex-shrink-0">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入你的提示，例如：可爱的猫"
          className="flex-1 w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm resize-none"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={generateResults}
            disabled={!inputText.trim() || isOptimizing}
            className="px-5 py-2 rounded-full bg-primary dark:bg-[hsl(240,74%,61%)] text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isOptimizing ? "优化中..." : "优化"}
          </button>
        </div>
      </div>

      {results && (
        <>
          <div className="flex flex-col gap-2">
            {results.map((result, index) => (
              <div key={index} className="bg-secondary rounded-xl p-3 flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-foreground text-sm leading-relaxed flex-1">{result}</p>
                <button
                  onClick={() => handleEditResult(index)}
                  className="flex-shrink-0 mt-0.5 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            {results.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSelectResult(index)}
                className="flex-1 py-2 rounded-lg border border-border text-foreground text-sm font-medium hover:bg-accent transition-colors cursor-pointer"
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={handleRefresh}
              disabled={isOptimizing}
              className="py-2 px-3 rounded-lg border border-border text-foreground hover:bg-accent transition-colors cursor-pointer disabled:opacity-40"
            >
              <RefreshCw className={`w-4 h-4 ${isOptimizing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </>
      )}
    </div>
  </>
);

const PromptGeneratorDialog = ({
  open,
  onClose,
  initialPrompt,
  onApplyPrompt,
}: PromptGeneratorDialogProps) => {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number>(0);
  const [editText, setEditText] = useState("");
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (open) {
      setInputText(initialPrompt || "");
      setResults(null);
      setIsOptimizing(false);
    }
  }, [open, initialPrompt]);

  const generateResults = useCallback(() => {
    if (!inputText.trim()) return;
    setIsOptimizing(true);
    setTimeout(() => {
      const randomSet = MOCK_PROMPT_SETS[Math.floor(Math.random() * MOCK_PROMPT_SETS.length)];
      setResults([...randomSet]);
      setIsOptimizing(false);
    }, 1500);
  }, [inputText]);

  const handleRefresh = useCallback(() => {
    generateResults();
  }, [generateResults]);

  const handleSelectResult = useCallback(
    (index: number) => {
      if (results) {
        onApplyPrompt(results[index]);
        onClose();
      }
    },
    [results, onApplyPrompt, onClose]
  );

  const handleEditResult = useCallback(
    (index: number) => {
      if (results) {
        setEditIndex(index);
        setEditText(results[index]);
        setEditDialogOpen(true);
      }
    },
    [results]
  );

  const handleEditApply = useCallback(() => {
    onApplyPrompt(editText);
    setEditDialogOpen(false);
    onClose();
  }, [editText, onApplyPrompt, onClose]);

  const innerProps = {
    inputText,
    setInputText,
    results,
    isOptimizing,
    generateResults,
    handleRefresh,
    handleSelectResult,
    handleEditResult,
    onClose,
  };

  return (
    <>
      {/* Desktop: Dialog */}
      {isDesktop ? (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
          <DialogContent className="sm:max-w-[560px] max-h-[90vh] p-0 gap-0 bg-card border-border rounded-2xl overflow-hidden flex flex-col [&>button]:hidden">
            <PromptGeneratorInner {...innerProps} />
          </DialogContent>
        </Dialog>
      ) : (
        /* Mobile/Tablet: Bottom Drawer */
        <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
          <DrawerContent className="h-[55vh] max-h-[85vh] bg-card border-border rounded-t-2xl p-0 flex flex-col">
            <PromptGeneratorInner {...innerProps} />
          </DrawerContent>
        </Drawer>
      )}

      {/* Edit sub-dialog */}
      {isDesktop ? (
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[560px] p-0 gap-0 bg-card border-border rounded-2xl overflow-hidden">
            <DialogHeader className="p-4 pb-0">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-foreground text-base font-semibold">
                  提示词生成器
                </DialogTitle>
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-bold">
                  {editIndex + 1}
                </span>
              </div>
            </DialogHeader>
            <div className="p-4">
              <div className="bg-secondary rounded-xl p-3 flex flex-col min-h-[220px]">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 w-full bg-transparent text-foreground outline-none text-sm resize-none leading-relaxed"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleEditApply}
                    disabled={!editText.trim()}
                    className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    生成
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DrawerContent className="max-h-[85vh] bg-card border-border rounded-t-2xl p-0 flex flex-col">
            <div className="flex items-center gap-2 p-4 pb-0">
              <h2 className="text-foreground text-base font-semibold">提示词生成器</h2>
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs font-bold">
                {editIndex + 1}
              </span>
              <button onClick={() => setEditDialogOpen(false)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="bg-secondary rounded-xl p-3 flex flex-col min-h-[220px]">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="flex-1 w-full bg-transparent text-foreground outline-none text-sm resize-none leading-relaxed"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleEditApply}
                    disabled={!editText.trim()}
                    className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    生成
                  </button>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default PromptGeneratorDialog;
