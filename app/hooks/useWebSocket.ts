import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ChatLogState, useStore } from '~/store';

export function useWebSocket() {
  const [wsClient, setWsClient] = useState<WebSocket | undefined>();
  const { chatLogs, setChatLogs, discordUser } = useStore();
  const fetcher = useFetcher();

  function sendChat(text: string) {
    wsClient!.send(JSON.stringify({ type: 'chat', value: text }));
    fetcher.submit(
      {
        intent: 'new',
        user_id: discordUser!.id,
        content: text,
      },
      {
        action: '/api/chat',
        method: 'POST',
      },
    );
  }

  function getChat() {
    fetcher.submit(
      {
        intent: 'get',
      },
      {
        action: '/api/chat',
        method: 'GET',
      },
    );
  }

  function onMessage(event: MessageEvent) {
    const data: {
      type: 'chat';
      value: string;
    } = JSON.parse(event.data);

    if (data.type === 'chat') {
      getChat();
    }
  }

  useEffect(() => {
    const client = new WebSocket(`ws://localhost:${window.ENV.WS_PORT}`);
    setWsClient(client);

    client.addEventListener('open', () => {
      console.log('WebSocket connected');
    });

    client.addEventListener('message', onMessage);
    getChat();
  }, []);

  useEffect(() => {
    if (!fetcher.data) {
      return;
    }
    //  FIXME: リアルタイム通信できていない。callbackとか使う必要がありそう
    setChatLogs(fetcher.data as ChatLogState[]);
  }, [fetcher.data, setChatLogs]);

  return {
    chatLogs,
    sendChat,
  };
}
