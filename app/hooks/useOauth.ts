import { useEffect, useState } from 'react';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useLocation, useNavigate } from '@remix-run/react';
import { useDiscordUser } from './useDiscordUser';

export function useOauth() {
  const [userManager, setUserManager] = useState<UserManager | undefined>();
  const location = useLocation();
  const navigate = useNavigate();
  const { discordUser, setDiscordUser } = useDiscordUser();

  useEffect(() => {
    const client = new UserManager({
      authority: 'https://discord.com',
      client_id: window.ENV.OAUTH_CLIENT_ID!,
      redirect_uri: window.ENV.OAUTH_REDIRECT_URL!,
      response_type: 'code',
      scope: 'identify',
      userStore: new WebStorageStateStore({ store: window.localStorage }),
      metadata: {
        authorization_endpoint: 'https://discord.com/oauth2/authorize',
        token_endpoint: 'https://discord.com/api/oauth2/token',
        revocation_endpoint: 'https://discord.com/api/oauth2/token/revoke',
      },
    });
    setUserManager(client);

    (async () => {
      if (location.pathname === '/callback') {
        await client.signinCallback();
        navigate('/');
      }

      const user = await client.getUser();

      if (!user) {
        return await client.signinRedirect();
      }

      const discordUserResponse: DiscordUser = await fetch('https://discordapp.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      }).then((r) => r.json());

      setDiscordUser({
        id: discordUserResponse.id,
        username: discordUserResponse.username,
        avatar: discordUserResponse.avatar,
      });
    })();
  }, []);
}
