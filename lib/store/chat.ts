import { createWithEqualityFn as create } from "zustand/traditional";
import { createJSONStorage, persist } from "zustand/middleware";
import { generateId, Message } from "ai";
import {
  AUTO_TOPIC_LENGTH,
  DEFAULT_TOPIC,
  Store,
  StoreVersion,
  TOPIC_MAX_LENGTH,
} from "@/lib/constants";

interface ChatSession {
  id: string;
  topic: string;
  messages: Message[];
}

function createEmptySession(): ChatSession {
  return {
    id: generateId(),
    topic: DEFAULT_TOPIC,
    messages: [],
  };
}

interface ChatStore {
  sessions: ChatSession[];
  currentIndex: number;

  selectSession(index: number): void;

  currentSession(): ChatSession;

  newSession(): void;

  deleteSession(index: number): void;

  deleteOtherSession(): void;

  updateTopic(index: number, topic: string): void;

  updateCurrentTopic(topic: string): void;

  saveMessage(list: Message[]): void;

  checkAutoTopic(newTopic: () => void): void;

  resetSession(): void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      sessions: [createEmptySession()],
      currentIndex: 0,

      selectSession(index: number) {
        if (index === get().currentIndex) {
          return;
        }
        set({ currentIndex: index });
      },

      currentSession() {
        return get().sessions[get().currentIndex];
      },

      newSession() {
        const sessions = get().sessions;
        sessions.push(createEmptySession());
        const currentIndex = sessions.length - 1;
        set({ sessions, currentIndex });
      },

      deleteSession(index: number) {
        const sessions = get().sessions;
        sessions.splice(index, 1);
        let currentIndex = get().currentIndex;
        if (sessions.length === 0) {
          sessions.push(createEmptySession());
        } else if (index === currentIndex) {
          currentIndex = Math.max(0, Math.min(index, sessions.length - 1));
        } else if (index < currentIndex) {
          currentIndex--;
        }
        set({ sessions, currentIndex });
      },

      deleteOtherSession() {
        set({
          sessions: [get().sessions[get().currentIndex]],
          currentIndex: 0,
        });
      },

      updateTopic(index: number, topic: string) {
        if (topic.length > TOPIC_MAX_LENGTH) {
          topic = topic.substring(0, TOPIC_MAX_LENGTH);
        }
        const sessions = get().sessions;
        sessions[index].topic = topic;
        set({ sessions });
      },

      updateCurrentTopic(topic: string) {
        if (!topic) {
          return;
        }
        get().updateTopic(get().currentIndex, topic);
      },

      saveMessage(list: Message[]) {
        get().currentSession().messages = list;
        set({ sessions: get().sessions });
      },

      checkAutoTopic(newTopic: () => void) {
        const currentSession = get().currentSession();
        if (
          currentSession.topic !== DEFAULT_TOPIC ||
          currentSession.messages.length < AUTO_TOPIC_LENGTH
        ) {
          return;
        }
        newTopic();
      },

      resetSession() {
        const current = get().currentSession();
        current.messages = [];
        current.topic = DEFAULT_TOPIC;
        set({ sessions: get().sessions });
      },
    }),
    {
      name: Store.Chat,
      version: StoreVersion,
      storage: createJSONStorage(() => localStorage, {
        reviver: (key, value) => {
          if (key == "createdAt") {
            return new Date(value as string);
          }
          return value;
        },
      }),
    },
  ),
);
