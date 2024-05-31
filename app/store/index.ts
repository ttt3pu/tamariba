import { create } from 'zustand';
import { ChatLog as ChatLogSchema, User, VideoLog } from '@prisma/client';

export type ChatLogState = ChatLogSchema & {
  user: User;
};

export type VideoLogState = VideoLog & {
  user: User;
};

type State = {
  discordUser: DiscordUserState | null;
  chatLogs: ChatLogState[];
  videoLogs: VideoLogState[];
};

type Action = {
  setDiscordUser: (discordUser: DiscordUserState) => void;
  setChatLogs: (chatLogs: ChatLogState[]) => void;
  setVideoLogs: (videoLogs: VideoLogState[]) => void;
};

export const useStore = create<State & Action>((set) => ({
  discordUser: null,
  chatLogs: [],
  videoLogs: [],
  setChatLogs: (newChatLogs) =>
    set(() => ({
      chatLogs: newChatLogs,
    })),
  setDiscordUser: (newDiscordUser) =>
    set(() => ({
      discordUser: newDiscordUser,
    })),
  setVideoLogs: (newVideoLogs) =>
    set(() => ({
      videoLogs: newVideoLogs,
    })),
}));
