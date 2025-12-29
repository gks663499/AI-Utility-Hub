
export enum ToolType {
  BLOG_COMMENTER = 'blog-commenter',
  HINDI_TUTOR = 'hindi-tutor',
  IMAGE_TOOLS = 'image-tools',
  SEO_ANALYZER = 'seo-analyzer',
  LOGO_ANIMATION = 'logo-animation',
  TRANSCRIPTION = 'transcription',
  USER_TESTING = 'user-testing'
}

export const TOOL_COSTS: Record<ToolType, number> = {
  [ToolType.BLOG_COMMENTER]: 1,
  [ToolType.HINDI_TUTOR]: 1,
  [ToolType.IMAGE_TOOLS]: 2,
  [ToolType.SEO_ANALYZER]: 5,
  [ToolType.LOGO_ANIMATION]: 10,
  [ToolType.TRANSCRIPTION]: 5,
  [ToolType.USER_TESTING]: 5,
};

export interface UserCredits {
  available: number;
  total: number;
}

export interface ToolRequest {
  id: string;
  type: ToolType;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  result?: any;
}

export interface TranscriptionSegment {
  startTime: string;
  endTime: string;
  text: string;
}

export interface SEOAuditResult {
  score: number;
  onPage: string[];
  keywords: string[];
  metaTags: Record<string, string>;
  recommendations: string[];
}
