import { describe, expect, it, vi } from 'vitest';
import { RemoteCommandApi } from './remoteCommandApi';
import type { CardTarget } from './types';

function createApi() {
  const emitGameAction = vi.fn(async () => ({ ok: false as const, error: '' }));
  return {
    api: new RemoteCommandApi({ emitGameAction }),
    emitGameAction,
  };
}

describe('RemoteCommandApi', () => {
  it('emits play-card action payloads', async () => {
    const { api, emitGameAction } = createApi();
    const target: CardTarget = { player: 0, slot: 1, index: 0 };

    await api.playCard(0, 3, target);

    expect(emitGameAction).toHaveBeenCalledWith('game:action:playCard', { handIndex: 3, target });
  });

  it('emits common turn action payloads', async () => {
    const { api, emitGameAction } = createApi();

    await api.attack(0, 'Slash');
    await api.useStadium(0);
    await api.passTurn(0);
    await api.concede(0);

    expect(emitGameAction).toHaveBeenNthCalledWith(1, 'game:action:attack', { attack: 'Slash' });
    expect(emitGameAction).toHaveBeenNthCalledWith(2, 'game:action:stadium', {});
    expect(emitGameAction).toHaveBeenNthCalledWith(3, 'game:action:passTurn', {});
    expect(emitGameAction).toHaveBeenNthCalledWith(4, 'game:concede', {});
  });

  it('emits ability, retreat, and prompt-resolution payloads', async () => {
    const { api, emitGameAction } = createApi();
    const target: CardTarget = { player: 1, slot: 2, index: 4 };

    await api.useAbility(0, 'Draw Power', target);
    await api.retreat(0, 2);
    await api.resolvePrompt(42, [1, 3]);

    expect(emitGameAction).toHaveBeenNthCalledWith(1, 'game:action:ability', { ability: 'Draw Power', target });
    expect(emitGameAction).toHaveBeenNthCalledWith(2, 'game:action:retreat', { to: 2 });
    expect(emitGameAction).toHaveBeenNthCalledWith(3, 'game:action:resolvePrompt', { id: 42, result: [1, 3] });
  });
});
