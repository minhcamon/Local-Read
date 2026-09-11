import { useState, useEffect } from 'react';
import { Header } from './components/common/Header.js';
import { LibraryPage } from './modules/library/pages/LibraryPage.js';
import { ReaderPage } from './modules/reader/pages/ReaderPage.js';
import type { ReadingTheme } from './types/index.js';

export function App() {
  const [theme, setTheme] = useState<ReadingTheme>('light');
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  // Apply theme class to <body>
  useEffect(() => {
    document.body.className = `theme-${theme}`;
  }, [theme]);

  const handleOpenBook = (bookId: string) => {
    setActiveBookId(bookId);
  };

  const handleBackToLibrary = () => {
    setActiveBookId(null);
  };

  return (
    <div>
      {/* Hide global header when in reader view to maximize distraction-free space */}
      {!activeBookId && (
        <Header
          currentTheme={theme}
          onThemeChange={setTheme}
          onImportClick={() => setIsImportModalOpen(true)}
        />
      )}

      {activeBookId ? (
        <ReaderPage bookId={activeBookId} onBack={handleBackToLibrary} />
      ) : (
        <LibraryPage
          onSelectBook={handleOpenBook}
          isImportModalOpen={isImportModalOpen}
          onCloseImportModal={() => setIsImportModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
