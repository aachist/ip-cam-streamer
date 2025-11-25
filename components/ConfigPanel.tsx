import React from 'react';

interface ConfigPanelProps {
  url: string;
  setUrl: (val: string) => void;
  interval: number;
  setInterval: (val: number) => void;
  onStart: () => void;
  onStop: () => void;
  isRunning: boolean;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({
  url,
  setUrl,
  interval,
  setInterval,
  onStart,
  onStop,
  isRunning,
}) => {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 w-full max-w-md mx-auto mb-6">
      <h2 className="text-xl font-bold mb-4 text-blue-400">Настройки потока</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            URL камеры
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isRunning}
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            placeholder="http://192.168.0.166/image/jpeg.cgi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Период обновления (сек)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={interval}
            onChange={(e) => setInterval(parseFloat(e.target.value))}
            disabled={isRunning}
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div className="pt-2">
          {!isRunning ? (
            <button
              onClick={onStart}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Запустить поток
            </button>
          ) : (
            <button
              onClick={onStop}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Остановить поток
            </button>
          )}
        </div>
      </div>
    </div>
  );
};