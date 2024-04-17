import { useEffect } from 'react';
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { useFetcher, useLocation, useNavigate } from '@remix-run/react';
import { useStore } from '~/store';

export function useOauth() {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();
  const fetcher = useFetcher();

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

    (async () => {
      if (location.pathname === '/callback') {
        await client.signinCallback();
        navigate('/');
      }

      const user = await client.getUser();

      if (!user) {
        return await client.signinRedirect();
      }

      const discordUserResponse: DiscordUserResponse = await fetch('https://discordapp.com/api/users/@me', {
        headers: {
          Authorization: `Bearer ${user.access_token}`,
        },
      }).then((r) => r.json());

      store.setDiscordUser({
        id: discordUserResponse.id,
        name: discordUserResponse.username,
        avatar: discordUserResponse.avatar,
      });

      fetcher.submit(
        {
          intent: 'check',
          id: discordUserResponse.id,
          name: discordUserResponse.username,
          avatar: discordUserResponse.avatar,
        },
        {
          action: '/api/user',
          method: 'POST',
        },
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
