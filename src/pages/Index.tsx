import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { useState, useMemo, useCallback } from "react";
import {
  mockUserConfig,
  modelConfigMap,
  defaultModelConfig,
  type ModelInfo,
  type CreationMode,
} from "@/types/api";
import type { HistoryItem } from "@/types/history";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [imageSizeTipOpen, setImageSizeTipOpen] = useState(false);

  const config = mockUserConfig;
  const models = config.data.enable_model;

  // Default to first online (non-coming_soon) model
  const firstOnlineModel = models.find(m => m.status === "online") ?? models[0];
  const initialConfig = modelConfigMap[firstOnlineModel.id] ?? defaultModelConfig;
  const [selectedModel, setSelectedModel] = useState<ModelInfo>(firstOnlineModel);
  const [selectedCreationMode, setSelectedCreationMode] = useState<CreationMode>(initialConfig.creationModes[0]);
  const [selectedQuality, setSelectedQuality] = useState<string>(initialConfig.qualities[0]);
  const [selectedDuration, setSelectedDuration] = useState<string>(initialConfig.durations.length > 0 ? initialConfig.durations[0] : "");
  const initialEnabledRatios = initialConfig.aspectRatios.filter(r => r.enabled);
  const [selectedRatio, setSelectedRatio] = useState<string>(initialEnabledRatios.length > 0 ? initialEnabledRatios[0].label : "");

  const currentConfig = useMemo(() => {
    return modelConfigMap[selectedModel.id] ?? defaultModelConfig;
  }, [selectedModel.id]);

  // 总消耗 = 基础消耗 + 比例额外消耗
  const totalCost = useMemo(() => {
    const baseCost = currentConfig.costPerGenerate;
    const ratioOption = currentConfig.aspectRatios.find(r => r.label === selectedRatio && r.enabled);
    const extraCost = ratioOption?.extraCost ?? 0;
    return baseCost + extraCost;
  }, [currentConfig, selectedRatio]);

  // Restore sidebar settings from a history item
  const handleRestoreFromHistory = useCallback((item: HistoryItem) => {
    const model = models.find(m => m.id === item.modelId);
    if (model) setSelectedModel(model);

    const cfg = modelConfigMap[item.modelId] ?? defaultModelConfig;
    if (cfg.creationModes.includes(item.creationMode)) {
      setSelectedCreationMode(item.creationMode);
    }
    if (cfg.qualities.includes(item.quality)) {
      setSelectedQuality(item.quality);
    }
    if (item.duration && cfg.durations.includes(item.duration)) {
      setSelectedDuration(item.duration);
    }
    const ratioOption = cfg.aspectRatios.find(r => r.label === item.ratio && r.enabled);
    if (ratioOption) {
      setSelectedRatio(item.ratio);
    }
  }, [models]);

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        models={models}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        selectedCreationMode={selectedCreationMode}
        setSelectedCreationMode={setSelectedCreationMode}
        selectedQuality={selectedQuality}
        setSelectedQuality={setSelectedQuality}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        selectedRatio={selectedRatio}
        setSelectedRatio={setSelectedRatio}
        currentConfig={currentConfig}
      />
      <MainContent
        onMenuOpen={() => setSidebarOpen(true)}
        totalCost={totalCost}
        models={models}
        onSelectModel={setSelectedModel}
        selectedModel={selectedModel}
        selectedCreationMode={selectedCreationMode}
        selectedQuality={selectedQuality}
        selectedDuration={selectedDuration}
        selectedRatio={selectedRatio}
        onRestoreFromHistory={handleRestoreFromHistory}
        currentConfig={currentConfig}
      />
    </div>
  );
};

export default Index;
