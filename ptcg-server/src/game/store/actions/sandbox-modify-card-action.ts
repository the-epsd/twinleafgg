import { Action } from './action';

export enum CardZone {
  HAND = 'hand',
  DECK = 'deck',
  DISCARD = 'discard',
  LOSTZONE = 'lostzone',
  PRIZES = 'prizes',
  STADIUM = 'stadium',
  SUPPORTER = 'supporter'
}

export class SandboxModifyCardAction implements Action {

  readonly type: string = 'SANDBOX_MODIFY_CARD';

  constructor(
    public clientId: number,
    public targetPlayerId: number,
    public action: 'add' | 'remove' | 'move',
    public cardName: string,
    public fromZone?: CardZone,
    public toZone?: CardZone,
    public fromIndex?: number,
    public toIndex?: number,
    public prizeIndex?: number
  ) { }

}


