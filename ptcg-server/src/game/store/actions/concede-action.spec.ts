import { ConcedeAction } from './concede-action';

describe('ConcedeAction', () => {
  it('should create an instance', () => {
    const action = new ConcedeAction(123);
    expect(action).toBeTruthy();
    expect(action.type).toBe('CONCEDE_GAME');
    expect(action.playerId).toBe(123);
  });
});