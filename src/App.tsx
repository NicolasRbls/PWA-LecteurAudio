import { PlaybackControls } from './components/PlaybackControls';
import { Library } from './components/Library';
import { MeshGradient } from './components/ui/MeshGradient';

function App() {
  return (
    <div className="min-h-screen relative pb-32">
      <MeshGradient />
      <div className="relative z-0">
        <Library />
      </div>
      <PlaybackControls />
    </div>
  );
}

export default App;
