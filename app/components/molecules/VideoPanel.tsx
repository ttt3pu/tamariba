import { useFetcher } from '@remix-run/react';
import { FormEvent, useEffect, useState } from 'react';
import Button from '~/components/atoms/Button';
import FormInput from '~/components/atoms/FormTextInput';
// import NicoPlayer from '~/components/molecules/NicoPlayer';
import YouTubePlayer from '~/components/molecules/YoutubePlayer';
import { useStore } from '~/store';
import VideoHistory from './VideoHistory';
import { useWebSocket } from '~/hooks/useWebSocket';

export default function VideoPanel() {
  const { sendVideoLog } = useWebSocket();
  const [userInput, setUserInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fetcher = useFetcher();
  const { discordUser } = useStore();

  function addVideo(e: FormEvent) {
    e.preventDefault();
    setErrorMessage('');

    if (/youtube/.test(userInput)) {
      const videoId = userInput.split('?v=')[1].split('&')[0];
      fetcher.submit(
        {
          intent: 'new',
          video_id: videoId,
          platform: 'youtube',
          user_id: discordUser!.id,
        },
        {
          action: '/api/video_log',
          method: 'POST',
        },
      );
      return;
    } else if (/nicovideo/.test(userInput)) {
      const videoId = userInput.split('/watch/')[1].split('?')[0];
      fetcher.submit(
        {
          intent: 'new',
          video_id: videoId,
          platform: 'nico',
          user_id: discordUser!.id,
        },
        {
          action: '/api/video_log',
          method: 'POST',
        },
      );
      return;
    }

    setErrorMessage('正しい形式で入力してください');
  }

  useEffect(() => {
    if (!fetcher.data) {
      return;
    }
    sendVideoLog();
    setUserInput('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetcher.data]);

  return (
    <div className="grow">
      <div className="aspect-video mb-4">
        <YouTubePlayer videoId={userInput} className="w-full h-full" />
        {/* <NicoPlayer videoId="sm43660155" /> */}
      </div>

      <form className="flex mb-4" onSubmit={addVideo}>
        <FormInput
          value={userInput}
          handleChange={setUserInput}
          className="mr-4 grow"
          placeholder="https://www.youtube.com/watch?v=... | https://www.nicovideo.jp/watch/sm..."
        />
        <Button icon="add" className="shrink-0 w-[200px]">
          追加
        </Button>
      </form>
      {errorMessage && <p className=" text-red-400 mt-3 font-bold">{errorMessage}</p>}

      <VideoHistory />
    </div>
  );
}
