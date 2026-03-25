import type { CreationMode } from "./api";

export interface VideoResult {
  thumb?: string;
  videoUrl: string;
}

export interface HistoryItem {
  id: string;
  status: "loading" | "completed" | "failed";
  thumb?: string;
  videoUrl?: string;
  videos?: VideoResult[]; // Multiple video results (e.g. Midjourney)
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
  cost?: number; // 配额消耗
}
