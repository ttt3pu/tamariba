import type { MetaFunction } from '@remix-run/node';
import { FormEvent, useState } from 'react';
import Button from '~/components/atoms/Button';
import FormInput from '~/components/atoms/FormTextInput';
import ChatPanel from '~/components/molecules/ChatPanel';
import YouTubePlayer from '~/components/molecules/YoutubePlayer';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  const [videoUserInput, setVideoUserInput] = useState('');
  const [playingVideoId, setPlayingVideoId] = useState('M7lc1UVf-VE');

  function addVideo(e: FormEvent) {
    e.preventDefault();
    const videoId = videoUserInput.split('?v=')[1];
    setPlayingVideoId(videoId);
    setVideoUserInput('');
  }

  return (
    <div className="flex">
      <div className="mr-8 w-2/5">
        <ChatPanel />
      </div>

      <div className="grow">
        <YouTubePlayer className="w-full aspect-video mb-8" videoId={playingVideoId} />

        <form className="flex" onSubmit={addVideo}>
          <FormInput
            value={videoUserInput}
            handleChange={setVideoUserInput}
            className="mr-4 grow"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <Button icon="add" className="shrink-0 w-[200px]">
            追加
          </Button>
        </form>
      </div>
    </div>
  );
}
