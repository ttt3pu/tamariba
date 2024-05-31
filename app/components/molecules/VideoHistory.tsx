import { VideoLogState, useStore } from '~/store';
import { createDateTime } from '~/utils/client/dateFormatter';

export default function VideoHistory() {
  const { videoLogs } = useStore();

  function createVideoLink(videoLog: VideoLogState) {
    switch (videoLog.platform) {
      case 'youtube':
        return `https://www.youtube.com/watch?v=${videoLog.video_id}`;
      case 'nico':
        return `https://www.nicovideo.jp/watch/${videoLog.video_id}`;
    }
  }

  return (
    <div className="bg-gray-900 p-4 max-h-[400px] overflow-y-auto">
      <h2 className="text-white font-bold border-b-gray-500 border-b pb-3 mb-3">再生履歴</h2>
      {videoLogs.map((videoLog, i) => (
        <p key={i} className="text-white text-xs [&:not(:last-child)]:mb-3">
          <span className="text-yellow-400">{createDateTime(videoLog.created_at)}</span>
          <span className="px-1">-</span>
          <a href={createVideoLink(videoLog)} target="_blank" rel="noopener noreferrer" className="hover:underline">
            {videoLog.title}
          </a>
        </p>
      ))}
    </div>
  );
}
