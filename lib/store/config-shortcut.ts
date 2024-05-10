import { shortcuts, Store, StoreVersion, variableCase } from "@/lib/constants";
import { createConfig } from "@/lib/store/config";

const defaultConfig = {
  current: shortcuts[0].value,
  variable: {
    case: variableCase[0].value,
  },
};

export const useShortcutConfig = createConfig(
  defaultConfig,
  Store.ConfigShortcut,
  StoreVersion,
);
