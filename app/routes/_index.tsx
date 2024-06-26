import type { MetaFunction } from '@remix-run/node';
import ChatPanel from '~/components/molecules/ChatPanel';
import VideoPanel from '~/components/molecules/VideoPanel';
import VideoHistory from '~/components/molecules/VideoHistory';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return (
    <div className="flex h-screen p-10">
      <div className="mr-8 w-2/5">
        <ChatPanel className="mb-8" />
        <VideoHistory />
      </div>

      <VideoPanel />
    </div>
  );
}
