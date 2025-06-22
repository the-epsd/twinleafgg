import { Prompt } from './prompt';

export class WaitPrompt extends Prompt<void> {
  readonly type: string = 'WaitPrompt';
  public duration: number;
  public message?: string;

  constructor(playerId: number, duration: number, message?: string) {
    super(playerId);
    this.duration = duration;
    this.message = message;
  }
} 