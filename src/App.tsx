import React from 'react';
import { CodedexApp } from './components/CodedexView/CodedexApp';
import { MusicPlayer } from './components/AudioPlayer/MusicPlayer';

export const App: React.FC = () => {
  return (
    <>
      <CodedexApp />
      <MusicPlayer />
    </>
  );
};

export default App;
