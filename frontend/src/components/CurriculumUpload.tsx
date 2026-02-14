'use client';

import { useState, useRef, useCallback } from 'react';
import { uploadCurriculum, uploadCurriculumPdf } from '@/lib/api';
import { Curriculum } from '@/lib/types';

/**
 * Sanitize text pasted from Word, PDF viewers, or other rich-text sources.
 * Strips Wingdings/Symbol font chars (Private Use Area), control chars,
 * and normalizes common smart-quote / em-dash substitutions.
 */
function sanitizeText(raw: string): string {
  let text = raw;

  // Replace common smart quotes and dashes with ASCII equivalents
  text = text.replace(/[\u2018\u2019\u201A\u201B]/g, "'");
  text = text.replace(/[\u201C\u201D\u201E\u201F]/g, '"');
  text = text.replace(/[\u2013\u2014]/g, '-');
  text = text.replace(/\u2026/g, '...');
  text = text.replace(/\u00A0/g, ' '); // non-breaking space

  // Replace Wingdings/Symbol mapped chars (Private Use Area U+E000-U+F8FF)
  // and other common symbol font bullets with plain equivalents
  text = text.replace(/[\uE000-\uF8FF]/g, '');
  text = text.replace(/[\uF020-\uF0FF]/g, ''); // Symbol font range
  text = text.replace(/[\u2022\u25CF\u25CB\u25AA\u25AB\u2023\u25B6\u25C6]/g, '- '); // bullets → dash

  // Strip remaining control characters (except newlines/tabs)
  text = text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Collapse excessive whitespace (but preserve paragraph breaks)
  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{4,}/g, '\n\n\n');
  text = text.replace(/^\s+$/gm, '');

  return text.trim();
}

interface Props {
  onUploadComplete: (sessionId: string, curriculum: Curriculum) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  setError: (msg: string) => void;
}

export default function CurriculumUpload({ onUploadComplete, isLoading, setIsLoading, setError }: Props) {
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    const name = file.name.toLowerCase();
    setFileName(file.name);
    setPdfBase64(null);

    if (!subject) {
      const autoName = file.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');
      setSubject(autoName);
    }

    if (name.endsWith('.pdf')) {
      // Store as base64 — backend will extract text
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
      );
      setPdfBase64(base64);
      setContent('[PDF uploaded — text will be extracted on the server]');
    } else {
      const text = await file.text();
      setContent(sanitizeText(text));
    }
  }, [subject]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const plain = e.clipboardData.getData('text/plain');
    const cleaned = sanitizeText(plain);
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const newContent = content.substring(0, start) + cleaned + content.substring(end);
    setContent(newContent);
    // Clear any previously loaded PDF since user is pasting text
    setPdfBase64(null);
    setFileName('');
  }, [content]);

  const handleSubmit = async () => {
    if (!pdfBase64 && !content.trim()) return;
    setIsLoading(true);
    setError('');
    try {
      const res = pdfBase64
        ? await uploadCurriculumPdf(pdfBase64, subject)
        : await uploadCurriculum(content, subject);
      onUploadComplete(res.session_id, res.curriculum);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse curriculum');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Subject input */}
      <div>
        <label className="block text-sm font-heading font-semibold text-foreground/70 mb-2">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Introduction to Python, World History..."
          className="w-full px-5 py-3 input-glass text-sm text-foreground placeholder:text-ice-dark"
        />
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`relative rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'glass-strong glow-amber-strong border-amber/40'
            : fileName
            ? 'glass glow-amber border-amber/20'
            : 'glass hover:glass-strong hover:shadow-lg border-dashed border-2 border-ice/60 hover:border-amber/30'
        }`}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".txt,.md,.pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            fileName
              ? 'bg-gradient-to-br from-amber/15 to-amber/5 glow-amber'
              : isDragging
              ? 'bg-gradient-to-br from-amber/20 to-amber/10 scale-110'
              : 'bg-gradient-to-br from-ice-light to-ice/30'
          }`}>
            {fileName ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EEAB3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 15l2 2 4-4" />
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#A8C4CF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={isDragging ? 'animate-float-fast' : ''}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            )}
          </div>
          {fileName ? (
            <>
              <p className="text-sm font-heading font-semibold gradient-text-static">{fileName}</p>
              <p className="text-xs text-ice-dark">{pdfBase64 ? 'PDF ready — text will be extracted on submit' : 'Click to change file'}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-heading font-semibold text-foreground">
                Drop curriculum file here or click to browse
              </p>
              <p className="text-xs text-ice-dark">
                Supports .txt, .md, .pdf files
              </p>
            </>
          )}
        </div>
      </div>

      {/* Text paste area */}
      <div>
        <label className="block text-sm font-heading font-semibold text-foreground/70 mb-2">
          Or paste curriculum text
        </label>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value); setPdfBase64(null); setFileName(''); }}
          onPaste={handlePaste}
          placeholder="Paste your curriculum content here..."
          rows={6}
          readOnly={!!pdfBase64}
          className={`w-full px-5 py-4 input-glass text-sm text-foreground placeholder:text-ice-dark resize-none ${pdfBase64 ? 'opacity-50' : ''}`}
        />
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={(!pdfBase64 && !content.trim()) || isLoading}
        className="w-full py-4 btn-primary shimmer rounded-2xl flex items-center justify-center gap-2.5 text-base font-heading"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-20" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-80" />
            </svg>
            {pdfBase64 ? 'Extracting & parsing...' : 'Parsing curriculum...'}
          </>
        ) : (
          <>
            Start Learning
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </>
        )}
      </button>
    </div>
  );
}
