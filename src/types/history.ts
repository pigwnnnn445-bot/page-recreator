export interface HistoryItem {
  id: string;
  status: "loading" | "completed";
  thumb?: string;
  prompt: string;
  modelName: string;
  category: string;
  createdAt: Date;
}
