import { render, screen } from '@testing-library/react';
import App from './App';
import { vi, describe, it, expect } from 'vitest';

// Mocks
vi.mock('./components/PlaybackControls', () => ({
    PlaybackControls: () => <div data-testid="playback-controls" />
}));
vi.mock('./components/Library', () => ({
    Library: () => <div data-testid="library" />
}));

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        expect(screen.getByTestId('library')).toBeInTheDocument();
        expect(screen.getByTestId('playback-controls')).toBeInTheDocument();
    });
});
