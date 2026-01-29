import { PlaybackControls } from './components/PlaybackControls';
import { Library } from './components/Library';

function App() {
  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-indigo-500 selection:text-white pb-safe">
      <Library />
      <PlaybackControls />
    </div>
  );
}

export default App;
