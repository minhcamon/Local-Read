import React from 'react';
import type { Book } from '../../../types/index.js';

interface BookCardProps {
  book: Book;
  onOpen: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onOpen }) => {
  const percentage = book.lastProgress?.percentage ?? 0;
  const isReading = percentage > 0 && percentage < 100;
  const isCompleted = percentage >= 100;

  return (
    <div style={styles.card}>
      {/* Book Cover Placeholder or Image */}
      <div style={styles.coverArea} onClick={() => onOpen(book.id)}>
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} style={styles.coverImg} />
        ) : (
          <div style={styles.placeholderCover}>
            <span style={styles.placeholderTitle}>{book.title}</span>
            {book.author && <span style={styles.placeholderAuthor}>{book.author}</span>}
          </div>
        )}

        {/* Status Badge */}
        <div style={styles.badge}>
          {isCompleted ? 'Completed' : isReading ? `Reading • ${percentage}%` : 'Unread'}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressTrack}>
        <div style={{ ...styles.progressFill, width: `${percentage}%` }} />
      </div>

      {/* Metadata & Actions */}
      <div style={styles.meta}>
        <h3 style={styles.bookTitle} title={book.title}>
          {book.title}
        </h3>
        <p style={styles.bookAuthor}>{book.author || 'Unknown Author'}</p>

        <button style={styles.readBtn} onClick={() => onOpen(book.id)}>
          {isReading ? 'Continue Reading →' : 'Read Book →'}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    boxShadow: 'var(--card-shadow)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 150ms ease',
  },
  coverArea: {
    aspectRatio: '3 / 4',
    backgroundColor: 'var(--bg-app)',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  coverImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderCover: {
    padding: '24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    height: '100%',
  },
  placeholderTitle: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  placeholderAuthor: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '8px',
  },
  badge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    color: '#FFFFFF',
    fontSize: '0.75rem',
    padding: '3px 8px',
    borderRadius: '4px',
    backdropFilter: 'blur(4px)',
  },
  progressTrack: {
    height: '4px',
    backgroundColor: 'var(--border-color)',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'var(--accent-color)',
    transition: 'width 200ms ease',
  },
  meta: {
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  bookTitle: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  bookAuthor: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
    marginBottom: '12px',
  },
  readBtn: {
    marginTop: 'auto',
    backgroundColor: 'var(--bg-app)',
    color: 'var(--accent-color)',
    border: '1px solid var(--border-color)',
    padding: '8px',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 500,
  },
};
