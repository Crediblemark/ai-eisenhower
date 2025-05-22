
export enum Quadrant {
  DO = 'DO', // Urgent & Important
  SCHEDULE = 'SCHEDULE', // Not Urgent & Important
  DELEGATE = 'DELEGATE', // Urgent & Not Important
  DELETE = 'DELETE', // Not Urgent & Not Important
}

export interface Task {
  id: string;
  description: string;
  quadrant: Quadrant;
  aiRecommendation?: string;
  createdAt: number; // Using timestamp for simplicity
}

export interface AiCategorizationResponse {
  quadrant: Quadrant;
  recommendation: string;
}

export interface QuadrantDefinition {
  id: Quadrant;
  title: string;
  description: string;
  colorClasses: string; // Tailwind classes for background and border
  icon: React.ReactNode;
}
