import mitt from "mitt";

export enum mittKey {
  SCROLL = "SCROLL",
  STOP_LOADING = "STOP_LOADING",
}

export const emitter = mitt();
