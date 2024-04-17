import ReactYoutube from '~/libs/ReactYoutube.client';
import { ClientOnly } from 'remix-utils/client-only';

type Props = {
  videoId: string;
  className?: string;
};

export default function YouTubePlayer({ videoId, className }: Props) {
  const opts = {
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <ClientOnly fallback={<div>Video</div>}>
      {() => <ReactYoutube videoId={videoId} className={className} iframeClassName="w-full h-full" opts={opts} />}
    </ClientOnly>
  );
}
