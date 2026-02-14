export interface EmotionalState {
  engagement: number;
  confidence: number;
  frustration: number;
  curiosity: number;
  cognitive_load: number;
  flow_score?: number;
  dropout_risk?: number;
  message_index?: number;
}

export interface CurriculumNode {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  prerequisites: string[];
  learning_objectives: string[];
  content?: string;
}

export interface Curriculum {
  subject: string;
  nodes: CurriculumNode[];
}

export interface Message {
  role: 'user' | 'assistant' | 'module';
  content: string;
  title?: string;
  timestamp?: string;
}

export interface AgentLogEntry {
  tool: string;
  input_summary: string;
}

export interface ChatResponse {
  response: string;
  emotional_state: EmotionalState | null;
  agent_log: AgentLogEntry[];
  session_id: string;
}

export interface UploadResponse {
  session_id: string;
  curriculum: Curriculum;
}

export interface SessionData {
  session_id: string;
  curriculum: Curriculum;
  messages: Message[];
  emotional_history: EmotionalState[];
  completed_nodes: string[];
  current_node_id: string;
}

export interface ProgressData {
  session_id: string;
  emotional_history: EmotionalState[];
  completed_nodes: string[];
  total_nodes: number;
  progress_pct: number;
  current_node_id: string;
}
