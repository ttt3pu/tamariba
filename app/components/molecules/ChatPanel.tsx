import { FormEvent, useEffect, useRef, useState } from 'react';
import FormInput from '~/components/atoms/FormTextInput';
import { IoMdSend } from 'react-icons/io';
import { useWebSocket } from '~/hooks/useWebSocket';
import { useStore } from '~/store';
import { useFetcher } from '@remix-run/react';
import { createAvatarUrl } from '~/utils/client/createAvatarUrl';
import { createDateTime } from '~/utils/client/dateFormatter';

type Props = {
  className?: string;
};

export default function ChatPanel({ className }: Props) {
  const { sendChat, pushSetChatLogsCallbacks } = useWebSocket();
  const { discordUser, chatLogs } = useStore();
  const fetcher = useFetcher();

  const [chatInput, setChatInput] = useState('');

  const chatLogRef = useRef<HTMLDivElement | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!discordUser || !chatInput) {
      // TODO: error handling
      return;
    }

    fetcher.submit(
      {
        intent: 'new',
        user_id: discordUser!.id,
        content: chatInput,
      },
      {
        action: '/api/chat',
        method: 'POST',
      },
    );
  }

  // TODO: ユーザーが意図的にスクロールした場合を判定して無効化したい
  function scrollDown() {
    const el = chatLogRef.current;

    if (!el) {
      return;
    }

    el.scroll(0, el.scrollHeight);
  }

  useEffect(() => {
    pushSetChatLogsCallbacks(scrollDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fetcher.data) {
      return;
    }
    sendChat();
    setChatInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <div className={`flex flex-col max-h-[500px] ${className}`}>
      <div className="bg-gray-900 text-white p-4 mb-4 grow overflow-y-auto" ref={chatLogRef}>
        {chatLogs.map((chatLog, i) => (
          <p key={i} className="px-2 py-2 text-sm flex items-baseline">
            <img
              src={createAvatarUrl(chatLog.user)}
              alt={chatLog.user.name}
              className="w-6 mr-3 rounded-full shrink-0"
            />
            <span className="relative bottom-[0.5em] grow">
              <span className="mr-2">{chatLog.user.name}:</span>
              {chatLog.content}
              <span className="text-gray-500 ml-2">({createDateTime(chatLog.created_at)})</span>
            </span>
          </p>
        ))}
      </div>
      <form className="flex shrink-0" onSubmit={onSubmit}>
        <FormInput value={chatInput} handleChange={setChatInput} className="w-full" />
        <button className="shrink-0 h-10 w-10 ml-4 bg-blue-400 rounded-full text-white flex items-center justify-center">
          <IoMdSend className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}
