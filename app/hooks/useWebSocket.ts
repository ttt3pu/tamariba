import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { ChatLogState, VideoLogState, useStore } from '~/store';

type WsData = {
  type: 'chat' | 'video-log';
};

export function useWebSocket() {
  const [wsClient, setWsClient] = useState<WebSocket | undefined>();
  const { chatLogs, setChatLogs, setVideoLogs } = useStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [setChatLogsCallbacks, setSetChatLogsCallbacks] = useState<(() => any)[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function pushSetChatLogsCallbacks(callback: () => any) {
    setSetChatLogsCallbacks([...setChatLogsCallbacks, callback]);
  }

  const fetcherChat = useFetcher();
  const fetcherVideoLog = useFetcher();

  function wsSend(val: WsData) {
    wsClient!.send(JSON.stringify(val));
  }

  function sendChat() {
    wsSend({ type: 'chat' });
  }

  function sendVideoLog() {
    wsSend({ type: 'video-log' });
  }

  function getChat() {
    fetcherChat.submit(
      {
        intent: 'get',
      },
      {
        action: '/api/chat',
        method: 'GET',
      },
    );
  }

  function getVideoLogs() {
    fetcherVideoLog.submit(
      {
        intent: 'get',
      },
      {
        action: '/api/video_log',
        method: 'GET',
      },
    );
  }

  function onMessage(event: MessageEvent) {
    const data: WsData = JSON.parse(event.data);

    switch (data.type) {
      case 'chat':
        getChat();
        break;
      case 'video-log':
        getVideoLogs();
        break;
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
    getVideoLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetcherChat.data) {
      return;
    }
    setChatLogs(fetcherChat.data as ChatLogState[]);

    setTimeout(() => {
      setChatLogsCallbacks.forEach((callback) => {
        callback();
      });
    }, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcherChat.data, setChatLogs]);

  useEffect(() => {
    if (!fetcherVideoLog.data) {
      return;
    }
    setVideoLogs(fetcherVideoLog.data as VideoLogState[]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcherVideoLog.data, setVideoLogs]);

  return {
    chatLogs,
    sendChat,
    pushSetChatLogsCallbacks,
    sendVideoLog,
  };
}
