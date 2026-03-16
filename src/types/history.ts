export interface HistoryItem {
  id: string;
  status: "loading" | "completed";
  thumb?: string;
  videoUrl?: string;
  prompt: string;
  modelName: string;
  category: string;
  createdAt: Date;
}
