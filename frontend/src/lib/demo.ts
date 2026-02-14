import { Curriculum, CurriculumNode, UploadResponse, SessionData } from './types';

const DEMO_SESSION_PREFIX = 'demo-';
const STORAGE_KEY = 'mindhacker_demo_session';

/** Parse curriculum text (chapters separated by ===) into structured nodes. */
function parseCurriculum(content: string, subject: string): Curriculum {
  const sections = content.split(/^===$/m).map(s => s.trim()).filter(Boolean);

  const nodes: CurriculumNode[] = sections.map((section, i) => {
    const lines = section.split('\n').filter(l => l.trim());
    const titleLine = lines.find(l => /^chapter\s+\d+/i.test(l)) || lines[0] || `Module ${i + 1}`;
    const title = titleLine.replace(/^chapter\s+\d+:\s*/i, '').trim();

    // Extract learning objectives
    const objStart = section.indexOf('Learning Objectives:');
    const objectives: string[] = [];
    if (objStart !== -1) {
      const objBlock = section.slice(objStart);
      const objLines = objBlock.split('\n').slice(1);
      for (const line of objLines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('-')) {
          objectives.push(trimmed.slice(1).trim());
        }
      }
    }

    // Description: first real paragraph after the title
    const contentLines = lines.filter(l => !l.startsWith('Learning Objectives') && !l.startsWith('-') && l !== titleLine);
    const description = contentLines[0]?.slice(0, 200) || title;

    return {
      id: `node-${i + 1}`,
      title,
      description,
      difficulty: Math.min(1, 0.3 + i * 0.15),
      prerequisites: i > 0 ? [`node-${i}`] : [],
      learning_objectives: objectives,
      content: section,
    };
  });

  return { subject, nodes };
}

/** Generate a unique demo session ID. */
function generateDemoId(): string {
  return DEMO_SESSION_PREFIX + Math.random().toString(36).slice(2, 10);
}

/** Create a demo session entirely client-side. */
export function createDemoSession(content: string, subject: string): UploadResponse {
  const curriculum = parseCurriculum(content, subject);
  const sessionId = generateDemoId();

  const sessionData: SessionData = {
    session_id: sessionId,
    curriculum,
    messages: [],
    emotional_history: [],
    completed_nodes: [],
    current_node_id: curriculum.nodes[0]?.id || '',
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(`${STORAGE_KEY}_${sessionId}`, JSON.stringify(sessionData));
  }

  return { session_id: sessionId, curriculum };
}

/** Check if a session ID is a demo session. */
export function isDemoSession(sessionId: string): boolean {
  return sessionId.startsWith(DEMO_SESSION_PREFIX);
}

/** Load demo session data from sessionStorage. */
export function loadDemoSession(sessionId: string): SessionData | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem(`${STORAGE_KEY}_${sessionId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}
