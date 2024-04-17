import { create } from 'zustand';
import { ChatLog as ChatLogSchema, User } from '@prisma/client';

export type ChatLogState = ChatLogSchema & {
  user: User;
};

type State = {
  discordUser: DiscordUserState | null;
  chatLogs: ChatLogState[];
};

type Action = {
  setDiscordUser: (discordUser: DiscordUserState) => void;
  setChatLogs: (chatLogs: ChatLogState[]) => void;
};

export const useStore = create<State & Action>((set) => ({
  discordUser: null,
  chatLogs: [],
  setChatLogs: (newChatLogs) =>
    set(() => ({
      chatLogs: newChatLogs,
    })),
  setDiscordUser: (newDiscordUser) =>
    set(() => ({
      discordUser: newDiscordUser,
    })),
}));
