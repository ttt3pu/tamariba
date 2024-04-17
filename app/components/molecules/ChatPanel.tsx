import { FormEvent, useState } from 'react';
import FormInput from '../atoms/FormTextInput';
import { IoMdSend } from 'react-icons/io';
import { useWebSocket } from '~/hooks/useWebSocket';
import { useStore } from '~/store';

export default function ChatPanel() {
  const { sendChat } = useWebSocket();
  const store = useStore();

  const [chatInput, setChatInput] = useState('');

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!store.discordUser || !chatInput) {
      // TODO: error handling
      return;
    }

    sendChat(chatInput);
    setChatInput('');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-900 text-white p-4 mb-4 grow">
        {store.chatLogs?.length &&
          store.chatLogs.map((chatLog, i) => (
            <p key={i} className=" px-2 py-1">
              {chatLog.user.name}: {chatLog.content}
            </p>
          ))}
      </div>
      <form className="flex" onSubmit={onSubmit}>
        <FormInput value={chatInput} handleChange={setChatInput} className="w-full" />
        <button className="shrink-0 h-10 w-10 ml-4 bg-blue-400 rounded-full text-white flex items-center justify-center">
          <IoMdSend className="w-6 h-6" />
        </button>
      </form>
    </div>
  );
}
