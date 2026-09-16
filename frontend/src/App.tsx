import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout.js';
import { LibraryPage } from './modules/library/pages/LibraryPage.js';
import { ThoughtsPage } from './modules/thoughts/pages/ThoughtsPage.js';
import { ConnectionsPage } from './modules/connections/pages/ConnectionsPage.js';
import { ReaderPage } from './modules/reader/pages/ReaderPage.js';
import { booksService } from './services/books.service.js';
import type { ReadingTheme } from './types/index.js';

export function App() {
  const [theme, setTheme] = useState<ReadingTheme>('light');
  const [activeBookId, setActiveBookId] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [activeNav, setActiveNav] = useState<'bookshelf' | 'thoughts' | 'connections'>('bookshelf');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Apply theme class to <body>
  useEffect(() => {
    document.body.className = `theme-${theme} bg-surface font-body text-on-surface antialiased transition-colors duration-200`;
  }, [theme]);

  // Global Keyboard Shortcuts (e.g. '/' for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !activeBookId && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        const searchBtn = document.querySelector('button[aria-label="Tìm kiếm"]') as HTMLButtonElement;
        searchBtn?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeBookId]);

  const handleOpenBook = (bookId: string) => {
    setActiveBookId(bookId);
  };

  const handleBackToLibrary = () => {
    setActiveBookId(null);
  };

  const handleNavChange = (nav: 'bookshelf' | 'thoughts' | 'connections') => {
    setActiveNav(nav);
    setActiveBookId(null);
  };

  // Global Drag & Drop Handler
  const handleGlobalFileDrop = async (file: File) => {
    try {
      const createdBook = await booksService.importBook(file);
      if (createdBook?.id) {
        setActiveBookId(createdBook.id);
      }
    } catch (err: any) {
      console.error('Failed to import dropped PDF:', err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi nạp tệp PDF.');
    }
  };

  // 1. Reading Area (Full-screen, distraction-free reader canvas)
  if (activeBookId) {
    return (
      <ReaderPage
        bookId={activeBookId}
        onBack={handleBackToLibrary}
        currentTheme={theme}
        onThemeChange={setTheme}
      />
    );
  }

  // 2. Shared AppLayout for all non-reading pages (Library, Thoughts, Connections)
  return (
    <AppLayout
      currentTheme={theme}
      onThemeChange={setTheme}
      activeNav={activeNav}
      onNavChange={handleNavChange}
      onImportClick={() => setIsImportModalOpen(true)}
      onFileDrop={handleGlobalFileDrop}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      maxWidthClass={activeNav === 'bookshelf' ? 'max-w-6xl' : 'max-w-4xl'}
    >
      {activeNav === 'thoughts' ? (
        <ThoughtsPage onSelectBook={handleOpenBook} />
      ) : activeNav === 'connections' ? (
        <ConnectionsPage onSelectBook={handleOpenBook} />
      ) : (
        <LibraryPage
          onSelectBook={handleOpenBook}
          isImportModalOpen={isImportModalOpen}
          onCloseImportModal={() => setIsImportModalOpen(false)}
          searchQuery={searchQuery}
        />
      )}
    </AppLayout>
  );
}

export default App;
