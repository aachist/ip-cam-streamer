import React, { useState, useEffect } from 'react';

interface StreamViewerProps {
  url: string;
  intervalSeconds: number;
  isRunning: boolean;
  isHttps: boolean;
}

export const StreamViewer: React.FC<StreamViewerProps> = ({
  url,
  intervalSeconds,
  isRunning,
  isHttps,
}) => {
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Effect to handle the interval timer
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;

    if (isRunning) {
      // Reset state on start
      setError(false);
      setLoading(true);

      timerId = setInterval(() => {
        setTimestamp(Date.now());
      }, intervalSeconds * 1000);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [isRunning, intervalSeconds]);

  const handleImageLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError(true);
  };

  // Construct URL with cache busting
  // We use the 't' query parameter to force the browser to fetch a new image
  const displayUrl = `${url}${url.includes('?') ? '&' : '?'}t=${timestamp}`;
  const isLocalIp = url.includes('192.168.') || url.includes('10.') || url.includes('172.');

  if (!isRunning) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gray-800 rounded-lg border border-gray-700 border-dashed">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <span className="text-gray-400">Поток остановлен</span>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-700 min-h-[300px]">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 z-20 text-center p-6 overflow-y-auto">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-400 font-bold text-lg mb-2">Ошибка загрузки</p>
          
          <div className="bg-gray-800 p-4 rounded text-left text-sm max-w-md w-full border border-gray-700">
            <p className="text-white font-semibold mb-2">Возможные причины:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-300 mb-4">
              <li>Камера требует ввода логина/пароля.</li>
              <li>Браузер блокирует доступ к локальной сети (Private Network Access).</li>
              <li>URL указан неверно.</li>
            </ul>

            <div className="space-y-3">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-700 hover:bg-blue-600 text-white py-2 rounded transition-colors font-medium"
              >
                1. Проверить ссылку в новой вкладке
              </a>
              <p className="text-xs text-gray-500 text-center">
                (Если откроется - вернитесь сюда, поток может заработать)
              </p>
            </div>

            {isHttps && isLocalIp && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-yellow-400 font-bold text-xs mb-1 uppercase tracking-wide">Для Chrome/Edge:</p>
                <p className="text-gray-400 text-xs">
                  Если ссылка открывается в новой вкладке, но здесь ошибка сохраняется, отключите защиту локальной сети:
                  <br/>
                  1. Скопируйте: <code className="bg-gray-900 p-0.5 rounded text-gray-200 select-all">chrome://flags/#block-insecure-private-network-requests</code>
                  <br/>
                  2. Вставьте в адресную строку новой вкладки.
                  <br/>
                  3. Установите значение <b>Disabled</b>.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* The Image */}
      <img
        key={timestamp} // React key forces a re-render/re-request
        src={displayUrl}
        alt="Live Stream"
        className="w-full h-auto block object-contain"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ minHeight: '300px' }} // Ensure container has height even if image fails
      />
      
      {/* Status Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-4 py-2 flex justify-between items-center text-xs text-gray-300">
        <span className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500 animate-pulse'}`}></span>
          {error ? 'Оффлайн' : 'Онлайн'}
        </span>
        <span>Обновлено: {new Date(timestamp).toLocaleTimeString('ru-RU')}</span>
      </div>
    </div>
  );
};
