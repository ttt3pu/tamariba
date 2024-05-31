import { useStore } from '~/store';

export default function VideoHistory() {
  const { videoLogs } = useStore();

  return (
    <div className="bg-gray-900 p-4">
      <h2 className="text-white font-bold border-b-gray-500 border-b pb-3 mb-3">再生履歴</h2>
      {videoLogs.map((videoLog, i) => (
        <p key={i} className="text-white">
          {videoLog.title}
        </p>
      ))}
    </div>
  );
}
