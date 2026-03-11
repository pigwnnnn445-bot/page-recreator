import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import { useState, useMemo } from "react";
import {
  mockUserConfig,
  modelConfigMap,
  defaultModelConfig,
  type ModelInfo,
  type CreationMode,
} from "@/types/api";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const config = mockUserConfig;
  const models = config.data.enable_model;

  const [selectedModel, setSelectedModel] = useState<ModelInfo>(models[0]);
  const [selectedCreationMode, setSelectedCreationMode] = useState<CreationMode>("text_to_video");
  const [selectedQuality, setSelectedQuality] = useState<string>("");
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedRatio, setSelectedRatio] = useState<string>("");

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
      />
    </div>
  );
};

export default Index;
