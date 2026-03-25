// 模型与用户配置的接口类型定义

export interface ModelInfo {
  id: number;
  name: string;
  icon: string;
  description: string;
  cost: number;
  status: "online" | "coming_soon";
  category?: string; // 模型分类，用于前台展示分类图标
}

export interface UserConfig {
  code: number;
  cost: number;
  message: string;
  type: string;
  data: {
    popup_type: string;
    charge_quota_remain: number;
    plan_tag: string;
    enable_model: ModelInfo[];
    service_end_ms: number;
    service_end_time: string;
    service_id: number;
    service_quota_all: number;
    service_quota_remain: number;
  };
}

// 模拟接口数据
export const mockUserConfig: UserConfig = {
  code: 0,
  cost: 7,
  message: "成功",
  type: "success",
  data: {
    popup_type: "service_renewal",
    charge_quota_remain: 913,
    plan_tag: "active",
    enable_model: [
      { id: 1119, name: "Seedance 1.5 pro", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "视频画面中的动作自然流畅，纹理细腻逼真，整体风格一致且高度精良。", cost: 35, status: "online", category: "seedance" },
      { id: 1120, name: "Seedance 2.0", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "拍摄对象更稳定，过渡更流畅，效果更接近即用型视频输出。", cost: 40, status: "coming_soon", category: "seedance" },
      { id: 1104, name: "Kling 1.6", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "高质量视频生成", cost: 60, status: "online", category: "kling" },
      { id: 1105, name: "Kling 1.5", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "日常视频创作", cost: 50, status: "online", category: "kling" },
      { id: 1107, name: "Gen-4 Turbo", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "生成速度快，适合高频视频创作。", cost: 80, status: "online", category: "gen" },
      { id: 1122, name: "Veo3.1", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "高保真视频生成", cost: 30, status: "online", category: "veo" },
      { id: 1109, name: "Veo3", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "稳定的视频输出质量", cost: 40, status: "online", category: "veo" },
      { id: 1110, name: "veo3-fast", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "快速生成，适合预览", cost: 20, status: "online", category: "veo" },
      { id: 1111, name: "veo3-pro", icon: "https://static.wahezu.cn/image/bbaa9922a32f07eea80f400c20497c87.webp", description: "专业级视频生成", cost: 60, status: "online", category: "veo" },
    ],
    service_end_ms: 25308006271,
    service_end_time: "2026-12-28 16:43:49",
    service_id: 59,
    service_quota_all: 1200,
    service_quota_remain: 1156,
  },
};

// 创作模式
export type CreationMode = "text_to_video" | "image_to_video";

// 比例配置（支持额外消耗配额）
export interface AspectRatioOption {
  label: string;
  enabled: boolean;
  extraCost?: number; // 额外消耗配额
}

// 模型配置
export interface ModelConfig {
  // 创作模式：支持文生视频、图生视频，可同时启用
  creationModes: CreationMode[];
  // 图生视频相关配置
  enableReferenceImage?: boolean; // 启用参考图上传
  enableFirstLastFrame?: boolean; // 启用首尾帧上传
  // 生图比例
  aspectRatios: AspectRatioOption[];
  // 生成质量：standard, pro, 540p, 720p, 1080p, 4k
  qualities: string[];
  // 生成时长：5s, 10s, 或空数组表示不启用
  durations: string[];
  // 基础消耗配额
  costPerGenerate: number;
  // 一次生成多段视频数量（如 Midjourney 一次生成4段）
  multiVideoCount?: number;
}

export const modelConfigMap: Record<number, ModelConfig> = {
  1119: {
    creationModes: ["text_to_video", "image_to_video"],
    enableReferenceImage: true,
    enableFirstLastFrame: true,
    qualities: ["standard", "pro"],
    durations: ["5s", "10s"],
    aspectRatios: [
      { label: "1:1", enabled: true, extraCost: 0 },
      { label: "16:9", enabled: true, extraCost: 5 },
      { label: "4:3", enabled: true, extraCost: 0 },
      { label: "9:16", enabled: true, extraCost: 5 },
      { label: "3:4", enabled: true, extraCost: 0 },
    ],
    costPerGenerate: 35,
  },
  1104: {
    creationModes: ["text_to_video", "image_to_video"],
    enableReferenceImage: true,
    enableFirstLastFrame: false,
    qualities: ["720p", "1080p"],
    durations: ["5s", "10s"],
    aspectRatios: [
      { label: "1:1", enabled: true },
      { label: "16:9", enabled: true },
      { label: "9:16", enabled: true },
    ],
    costPerGenerate: 60,
  },
  1105: {
    creationModes: ["text_to_video"],
    enableReferenceImage: false,
    enableFirstLastFrame: false,
    qualities: ["720p", "1080p"],
    durations: ["5s", "10s"],
    aspectRatios: [
      { label: "1:1", enabled: true },
      { label: "16:9", enabled: true },
      { label: "9:16", enabled: true },
    ],
    costPerGenerate: 50,
  },
  1107: {
    creationModes: ["text_to_video", "image_to_video"],
    enableReferenceImage: true,
    enableFirstLastFrame: true,
    qualities: ["standard", "pro", "1080p", "4k"],
    durations: ["5s", "10s"],
    aspectRatios: [
      { label: "1:1", enabled: true },
      { label: "16:9", enabled: true, extraCost: 10 },
      { label: "4:3", enabled: true },
      { label: "9:16", enabled: true, extraCost: 10 },
      { label: "3:4", enabled: true },
      { label: "12:9", enabled: true, extraCost: 15 },
    ],
    costPerGenerate: 80,
  },
  1122: {
    creationModes: ["image_to_video"],
    enableReferenceImage: true,
    enableFirstLastFrame: true,
    qualities: ["1080p", "4k"],
    durations: ["5s", "10s"],
    aspectRatios: [
      { label: "1:1", enabled: true },
      { label: "16:9", enabled: true },
      { label: "4:3", enabled: true },
    ],
    costPerGenerate: 30,
  },
  1109: {
    creationModes: ["text_to_video"],
    enableReferenceImage: false,
    enableFirstLastFrame: false,
    qualities: ["1080p", "4k"],
    durations: [], // 不启用时长
    aspectRatios: [
      { label: "1:1", enabled: true },
      { label: "16:9", enabled: true },
    ],
    costPerGenerate: 40,
  },
  1110: {
    creationModes: ["text_to_video", "image_to_video"],
    enableReferenceImage: true,
    enableFirstLastFrame: false,
    qualities: ["540p", "720p", "1080p"],
    durations: ["5s", "10s"],
    aspectRatios: [
      { label: "1:1", enabled: true },
      { label: "16:9", enabled: true },
      { label: "9:16", enabled: true },
    ],
    costPerGenerate: 20,
  },
  1111: {
    creationModes: ["text_to_video", "image_to_video"],
    enableReferenceImage: true,
    enableFirstLastFrame: true,
    qualities: ["standard", "pro", "1080p", "4k"],
    durations: ["5s", "10s"],
    aspectRatios: [
      { label: "1:1", enabled: true },
      { label: "16:9", enabled: true, extraCost: 5 },
      { label: "4:3", enabled: true },
      { label: "9:16", enabled: true, extraCost: 5 },
      { label: "3:4", enabled: true },
      { label: "12:9", enabled: true, extraCost: 10 },
    ],
    costPerGenerate: 60,
  },
};

export const defaultModelConfig: ModelConfig = {
  creationModes: ["text_to_video"],
  enableReferenceImage: false,
  enableFirstLastFrame: false,
  qualities: ["720p", "1080p"],
  durations: ["5s", "10s"],
  aspectRatios: [
    { label: "1:1", enabled: true },
    { label: "16:9", enabled: true },
    { label: "9:16", enabled: true },
  ],
  costPerGenerate: 30,
};
