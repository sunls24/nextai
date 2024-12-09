import { Store, StoreVersion } from "@/lib/constants";
import { createConfig } from "@/lib/store/config";

const defaultPlugins = {
  googleSearch: false,
};

const defaultConfig = {
  autoGenerateTitle: true,
  customModels: "",
  mode: "",
  apiConfig: {
    apiKey: "",
    model: "gpt-3.5-turbo",
    temperature: 0.5,
    systemPrompt: true,
    plugins: defaultPlugins,
  },
};

export const useConfig = createConfig(
  defaultConfig,
  Store.ConfigChat,
  StoreVersion,
);
