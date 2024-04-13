import { useState } from 'react';

export function useDiscordUser() {
  const [discordUser, setDiscordUser] = useState<DiscordUser>({} as DiscordUser);

  return {
    discordUser,
    setDiscordUser,
  };
}
