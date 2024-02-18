import { Store, StoreVersion } from "@/lib/constants";
import { createConfig } from "@/lib/store/config";

export interface ApiConfig {
  apiKey: string;
  model: string;
  temperature: number;
  plugins?: Plugins;
}

export interface Provider {
  [key: string]: ApiConfig;
}

interface TPlugins {
  [key: string]: {
    enabled: boolean;
    [key: string]: any;
  };
}

export type Plugins = typeof defaultPlugins & TPlugins;
const defaultPlugins = {
  googleSearch: {
    enabled: false,
    apiKey: "",
    engineId: "",
  },
  browseWebsite: {
    enabled: false,
    maxLength: 10000,
  },
  weatherInfo: {
    enabled: false,
    amapKey: "",
  },
  imageGeneration: {
    enabled: false,
  },
};

const defaultConfig = {
  autoGenerateTitle: false,
  provider: "openai",
  providerConfig: {
    openai: {
      apiKey: "",
      model: "gpt-3.5-turbo",
      temperature: 0.5,
      plugins: defaultPlugins,
    },
    google: {
      apiKey: "",
      model: "gemini-pro",
      temperature: 0.5,
    },
  } as Provider,
  apiConfig() {
    return this.providerConfig[this.provider];
  },
};

export const useConfig = createConfig(
  defaultConfig,
  Store.ConfigChat,
  StoreVersion,
);
