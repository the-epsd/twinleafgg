import { State } from '../state/state';

export abstract class Prompt<T> {

  readonly abstract type: string;
  public id: number;
  public result: T | undefined;
  /** If false, unresolved prompt does not block non-resolve Store.dispatch actions. */
  public blocksDispatch: boolean = true;

  constructor(public playerId: number) {
    this.id = 0;
  }

  public decode(result: any, state: State): T | null {
    return result;
  }

  public validate(result: T | null, state: State): boolean {
    return true;
  }

}
