export interface ArchetypeCardRequirement {
  name: string;
  count?: string;
  set?: string;
  number?: string;
}

export interface ArchetypeVariant {
  identifier: string;
  name: string;
  icon: string;
  cards: ArchetypeCardRequirement[];
}

export interface ArchetypeDefinition {
  identifier: string;
  name: string;
  icons: string[];
  priority: number;
  cards: ArchetypeCardRequirement[];
  variants: ArchetypeVariant[];
  generation: number;
}

export interface ArchetypeMatch {
  definition: ArchetypeDefinition;
  variant?: ArchetypeVariant;
  icons: string[];
  priority: number;
  matchScore: number;
}

export interface DetectionResult {
  primary: ArchetypeMatch | null;
  secondary: ArchetypeMatch | null;
}
