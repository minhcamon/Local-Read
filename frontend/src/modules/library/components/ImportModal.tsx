import React, { useState } from 'react';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File, title: string, author: string) => Promise<void>;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setError('Only PDF files are supported in MVP.');
        return;
      }
      setSelectedFile(file);
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      await onImport(selectedFile, title, author);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2>Import Local PDF</h2>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.fileBox}>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              id="pdf-upload"
              style={{ display: 'none' }}
            />
            <label htmlFor="pdf-upload" style={styles.uploadLabel}>
              {selectedFile ? (
                <div>
                  <strong>{selectedFile.name}</strong>
                  <p style={styles.fileSize}>
                    ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </p>
                </div>
              ) : (
                <div>
                  <p style={{ fontWeight: 500 }}>Click to browse or drag PDF here</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Supported format: PDF only
                  </p>
                </div>
              )}
            </label>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Book Title</label>
            <input
              type="text"
              style={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sapiens: A Brief History of Humankind"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Author (Optional)</label>
            <input
              type="text"
              style={styles.input}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Yuval Noah Harari"
            />
          </div>

          <div style={styles.footer}>
            <button type="button" style={styles.cancelBtn} onClick={onClose} disabled={isUploading}>
              Cancel
            </button>
            <button type="submit" style={styles.submitBtn} disabled={isUploading || !selectedFile}>
              {isUploading ? 'Importing...' : 'Add to Library'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    backdropFilter: 'blur(3px)',
  },
  modal: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    border: '1px solid var(--border-color)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  closeBtn: {
    fontSize: '1.2rem',
    color: 'var(--text-secondary)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  fileBox: {
    border: '2px dashed var(--border-color)',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center',
    backgroundColor: 'var(--bg-app)',
    cursor: 'pointer',
  },
  uploadLabel: {
    cursor: 'pointer',
    display: 'block',
  },
  fileSize: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginTop: '4px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.85rem',
    fontWeight: 500,
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
  },
  error: {
    padding: '8px 12px',
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
    borderRadius: '6px',
    fontSize: '0.85rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)',
  },
  submitBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    backgroundColor: 'var(--accent-color)',
    color: '#FFFFFF',
    fontWeight: 500,
  },
};
