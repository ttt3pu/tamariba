import { useEffect, useRef } from 'react';

type Props = {
  videoId: string;
  className?: string;
};

export default function NicoPlayer({ videoId, className }: Props) {
  const enbContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enbContainer.current) {
      return;
    }

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://embed.nicovideo.jp/watch/${videoId}/script`;

    enbContainer.current.appendChild(script);
  }, []);

  return <div className={`w-full h-full nico-player ${className}`} ref={enbContainer} />;
}
