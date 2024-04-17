// ref: https://discord.com/developers/docs/resources/user
type DiscordUserResponse = {
  id: number;
  username: string;
  avatar: string; // https://cdn.discordapp.com/avatars/[userId]/[avatorHash].png
};

type DiscordUserState = {
  id: number;
  name: string;
  avatar: string;
};
