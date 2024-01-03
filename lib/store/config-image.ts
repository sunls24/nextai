import { Store, StoreVersion } from "@/lib/constants";
import { createConfig } from "@/lib/store/config";

const defaultConfig = {
  model: "dall-e-3",
  style: "vivid",
  size: "1024x1024",
  quality: "standard",
  autoPrompt: true,
};

export const useImageConfig = createConfig(
  defaultConfig,
  Store.ConfigImage,
  StoreVersion,
);
