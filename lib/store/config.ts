import { createWithEqualityFn as create } from "zustand/traditional";
import { persist } from "zustand/middleware";

type Config<T> = T & {
  update: (fn: (cfg: T) => void) => void;
};

export function createConfig<T>(
  def: T,
  name: string,
  version: number,
  migrate?: (state: T, version: number) => void,
) {
  return create<Config<T>>()(
    persist(
      (set, get) => ({
        ...def,
        update(fn: (cfg: T) => void) {
          const config = get();
          fn(config);
          set({ ...config });
        },
      }),
      {
        name,
        version,
        migrate:
          migrate &&
          ((persistedState, version) => {
            const state = persistedState as Config<T>;
            migrate(state, version);
            return state;
          }),
      },
    ),
  );
}
