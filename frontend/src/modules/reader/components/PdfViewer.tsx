import React from 'react';
import { documentsService } from '../../../services/documents.service.js';

interface PdfViewerProps {
  documentId: string;
  currentPage: number;
  scale: number;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ documentId, currentPage }) => {
  const fileUrl = `${documentsService.getDocumentFileUrl(documentId)}#page=${currentPage}`;

  return (
    <div style={styles.viewerContainer}>
      <div style={styles.pageCard}>
        <iframe
          src={fileUrl}
          title="PDF Document Viewer"
          style={styles.iframe}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  viewerContainer: {
    display: 'flex',
    justifyContent: 'center',
    padding: '30px 16px',
    minHeight: '100vh',
    backgroundColor: 'var(--bg-app)',
  },
  pageCard: {
    width: '100%',
    maxWidth: '960px',
    height: 'calc(100vh - 80px)',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '8px',
    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    border: '1px solid var(--border-color)',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
};
