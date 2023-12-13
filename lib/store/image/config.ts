import { Store, StoreVersion } from "@/lib/constants";
import { createConfig } from "@/lib/store/config";

const defaultConfig = {
  model: "dall-e-3",
  style: "vivid",
  size: "1024x1024",
  quality: "standard",
};

type Config = typeof defaultConfig & {
  Update(fn: (c: Config) => void): void;
};

export const useImageConfig = createConfig<Config>(
  defaultConfig,
  Store.ConfigImage,
  StoreVersion,
);
