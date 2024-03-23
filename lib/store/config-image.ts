import { Store, StoreVersion } from "@/lib/constants";
import { createConfig } from "@/lib/store/config";

const defaultConfig = {
  model: "stable-diffusion",
  autoPrompt: true,
};

export const useImageConfig = createConfig(
  defaultConfig,
  Store.ConfigImage,
  StoreVersion,
);
