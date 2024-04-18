export function createAvatarUrl(user: DiscordUserState) {
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
}
