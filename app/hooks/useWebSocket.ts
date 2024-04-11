import { useCallback, useEffect, useState } from 'react';

export function useWebSocket() {
  const [wsClient, setWsClient] = useState<WebSocket | undefined>();
  const [chatLogs, setChatLogs] = useState<string[]>([]);

  function sendChat(text: string) {
    wsClient!.send(JSON.stringify({ type: 'chat', value: text }));
  }

  function onMessage(event: MessageEvent) {
    const message = JSON.parse(event.data).value;
    setChatLogs((prevChatLogs) => [...prevChatLogs, message]);
  }

  const onMessageCallback = useCallback(onMessage, []);

  useEffect(() => {
    const client = new WebSocket(`ws://localhost:${window.ENV.WS_PORT}`);
    setWsClient(client);

    client.addEventListener('open', () => {
      console.log('WebSocket connected');
    });

    client.addEventListener('message', onMessageCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onMessageCallback]);

  return {
    chatLogs,
    sendChat,
  };
}
