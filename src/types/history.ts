import type { CreationMode } from "./api";

export interface HistoryItem {
  id: string;
  status: "loading" | "completed" | "failed";
  thumb?: string;
  videoUrl?: string;
  prompt: string;
  modelName: string;
  category: string;
  createdAt: Date;
  // Sidebar settings snapshot
  modelId: number;
  creationMode: CreationMode;
  quality: string;
  duration: string;
  ratio: string;
}
