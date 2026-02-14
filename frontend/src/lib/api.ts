import { ChatResponse, UploadResponse, SessionData, ProgressData, Curriculum } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const CHAT_URL = process.env.NEXT_PUBLIC_CHAT_URL || '';
const FETCH_TIMEOUT_MS = 120_000;

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
      signal: controller.signal,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP ${res.status}`);
    }
    return res.json();
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('Request timed out — is the backend running?');
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export async function sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
  // Use Lambda Function URL directly to bypass API Gateway 30s timeout
  if (CHAT_URL) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const res = await fetch(CHAT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message }),
        signal: controller.signal,
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${res.status}`);
      }
      return res.json();
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error('Request timed out — is the backend running?');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }
  return fetchAPI<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, message }),
  });
}

export async function uploadCurriculum(content: string, subject: string): Promise<UploadResponse> {
  return fetchAPI<UploadResponse>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ content, subject }),
  });
}

export async function uploadCurriculumPdf(pdfBase64: string, subject: string): Promise<UploadResponse> {
  return fetchAPI<UploadResponse>('/api/upload', {
    method: 'POST',
    body: JSON.stringify({ pdf_base64: pdfBase64, subject }),
  });
}

export async function getSession(sessionId: string): Promise<SessionData> {
  return fetchAPI<SessionData>(`/api/session/${sessionId}`);
}

export async function createBackendSession(curriculum: Curriculum): Promise<SessionData> {
  return fetchAPI<SessionData>('/api/session', {
    method: 'POST',
    body: JSON.stringify({ curriculum }),
  });
}

export async function getProgress(sessionId: string): Promise<ProgressData> {
  return fetchAPI<ProgressData>(`/api/progress/${sessionId}`);
}
