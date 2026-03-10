// 模型与用户配置的接口类型定义

export interface ModelInfo {
  id: number;
  name: string;
  icon: string;
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
      { id: 1119, name: "Seedance 1.5 pro", icon: "" },
      { id: 1104, name: "Kling 1.6", icon: "" },
      { id: 1105, name: "Kling 1.5", icon: "" },
      { id: 1107, name: "Gen-4 Turbo", icon: "" },
      { id: 1122, name: "Veo3.1", icon: "" },
      { id: 1109, name: "Veo3", icon: "" },
      { id: 1110, name: "veo3-fast", icon: "" },
      { id: 1111, name: "veo3-pro", icon: "" },
    ],
    service_end_ms: 25308006271,
    service_end_time: "2026-12-28 16:43:49",
    service_id: 59,
    service_quota_all: 1200,
    service_quota_remain: 1156,
  },
};

// 模型对应的质量和时长配置（可按后台扩展）
export interface ModelConfig {
  qualities: string[];
  durations: string[];
  costPerGenerate: number;
}

export const modelConfigMap: Record<number, ModelConfig> = {
  1119: { qualities: ["720p", "1080p", "4K"], durations: ["5s", "10s", "15s"], costPerGenerate: 35 },
  1104: { qualities: ["720p", "1080p"], durations: ["5s", "10s"], costPerGenerate: 30 },
  1105: { qualities: ["720p", "1080p"], durations: ["5s", "10s"], costPerGenerate: 25 },
  1107: { qualities: ["720p", "1080p", "4K"], durations: ["5s", "10s", "15s", "30s"], costPerGenerate: 50 },
  1122: { qualities: ["1080p", "4K"], durations: ["5s", "10s", "15s"], costPerGenerate: 45 },
  1109: { qualities: ["1080p", "4K"], durations: ["5s", "10s"], costPerGenerate: 40 },
  1110: { qualities: ["720p", "1080p"], durations: ["5s", "10s"], costPerGenerate: 20 },
  1111: { qualities: ["1080p", "4K"], durations: ["5s", "10s", "15s", "30s"], costPerGenerate: 60 },
};

// 默认配置
export const defaultModelConfig: ModelConfig = {
  qualities: ["720p", "1080p"],
  durations: ["5s", "10s"],
  costPerGenerate: 30,
};
