import type { State } from '../index.js';
import type { ResolvePromptType } from '../types/resolvePrompt.js';
/** Validate before clearing a prompt or resuming its saved effects. */
export declare function validatePromptResolution(state: State, action: ResolvePromptType): boolean;
