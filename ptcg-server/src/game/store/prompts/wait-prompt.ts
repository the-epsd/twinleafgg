import { Prompt } from './prompt';

export class WaitPrompt extends Prompt<void> {
  readonly type: string = 'WaitPrompt';
  public duration: number;
  public message?: string;
  /** When false, clients wait for `duration` without showing a wait dialog. Defaults to true. */
  public showVisual: boolean;

  constructor(playerId: number, duration: number, message?: string, showVisual: boolean = true) {
    super(playerId);
    this.duration = duration;
    this.message = message;
    this.showVisual = showVisual;
  }
}
