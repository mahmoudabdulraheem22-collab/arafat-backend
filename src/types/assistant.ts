export type RequestStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'human_requested'
  | 'completed'
  | 'failed';

export interface ProposedAction {
  actionType: string;
  payload: Record<string, any>;
  summary: string;
}

export interface UserContext {
  pilgrimName?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  currentView?: string;
  permitsCount?: number;
  healthStatus?: string;
  packageType?: string;
  [key: string]: any;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  intent?: string;
  requiresConfirmation?: boolean;
  proposedAction?: ProposedAction | null;
  status?: RequestStatus;
  suggestedReplies?: string[];
  error?: boolean;
}

export interface ChatApiResponse {
  success: boolean;
  conversationId: string;
  message: string;
  intent?: string;
  requiresConfirmation?: boolean;
  proposedAction?: ProposedAction | null;
  suggestedReplies?: string[];
  error?: string;
}
