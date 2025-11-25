import React, { useState, useEffect } from 'react';
import { ConfigPanel } from './components/ConfigPanel';
import { StreamViewer } from './components/StreamViewer';

const App: React.FC = () => {
  // Default URL provided in requirements
  const [url, setUrl] = useState<string>('http://192.168.0.166/image/jpeg.cgi');
  const [interval, setInterval] = useState<number>(1.0); // Default 1 second
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isHttps, setIsHttps] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsHttps(window.location.protocol === 'https:');
    }
  }, []);

  const isHttpUrl = url.toLowerCase().startsWith('http://');
  const showMixedContentWarning = isHttps && isHttpUrl;

  const handleStart = () => {
    if (interval < 0.1) {
      alert("Интервал должен быть не менее 0.1 секунды");
      return;
    }
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 py-4 shadow-sm">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h1 className="text-xl font-bold tracking-tight">IP Камера</h1>
          </div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            GitHub
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Column: Controls */}
        <div className="lg:w-1/3">
          <ConfigPanel 
            url={url}
            setUrl={setUrl}
            interval={interval}
            setInterval={setInterval}
            onStart={handleStart}
            onStop={handleStop}
            isRunning={isRunning}
          />
          
          {showMixedContentWarning ? (
            <div className="bg-yellow-900 bg-opacity-40 border border-yellow-700 rounded-lg p-4 text-sm text-yellow-200 mb-4">
              <h3 className="font-bold mb-2 flex items-center gap-2 text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Внимание: GitHub Pages (HTTPS)
              </h3>
              <p className="opacity-90 mb-2">
                Вы пытаетесь открыть <b>HTTP</b> ссылку на защищенном <b>HTTPS</b> сайте. Браузер заблокирует это соединение ("Mixed Content").
              </p>
              <div className="bg-black bg-opacity-30 p-2 rounded border border-yellow-800/50 mt-2">
                <p className="font-semibold text-yellow-100 mb-1">Как исправить:</p>
                <ol className="list-decimal list-inside space-y-1 ml-1 opacity-90">
                  <li>Нажмите на значок 🔒 или 🛡️ в адресной строке браузера.</li>
                  <li>Выберите «Настройки сайта» или «Разрешения».</li>
                  <li>Найдите «Небезопасный контент» (Insecure Content) и выберите <b>«Разрешить»</b>.</li>
                </ol>
              </div>
            </div>
          ) : (
             <div className="bg-blue-900 bg-opacity-20 border border-blue-800 rounded-lg p-4 text-sm text-blue-200">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Инфо
              </h3>
              <p className="opacity-80">
                Для просмотра локальных камер (192.168.x.x) убедитесь, что вы находитесь в той же сети.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Viewer */}
        <div className="lg:w-2/3">
          <StreamViewer 
            url={url}
            intervalSeconds={interval}
            isRunning={isRunning}
            isHttps={isHttps}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4 text-center text-gray-500 text-sm">
        <p>Обновление изображения из локальной сети</p>
      </footer>
    </div>
  );
};

export default App;