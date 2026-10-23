import { describe, expect, it } from 'vitest';
import { sourcePlayerIdForShowCardsPrompt } from './showCardsOrigin';

const BOTTOM = 1;
const TOP = 2;
const seats = { bottomId: BOTTOM, topId: TOP };

describe('sourcePlayerIdForShowCardsPrompt', () => {
  it('prefers sourcePlayerId from the prompt', () => {
    expect(
      sourcePlayerIdForShowCardsPrompt(
        {
          playerId: BOTTOM,
          message: 'CARDS_SHOWED_BY_THE_OPPONENT',
          sourcePlayerId: BOTTOM,
        },
        seats,
      ),
    ).toBe(BOTTOM);
  });

  it('treats CARDS_SHOWED_BY_THE_OPPONENT as the other seat', () => {
    expect(
      sourcePlayerIdForShowCardsPrompt(
        { playerId: BOTTOM, message: 'CARDS_SHOWED_BY_THE_OPPONENT' },
        seats,
      ),
    ).toBe(TOP);
  });

  it('treats CARDS_SHOWED_BY_EFFECT as the viewer', () => {
    expect(
      sourcePlayerIdForShowCardsPrompt(
        { playerId: BOTTOM, message: 'CARDS_SHOWED_BY_EFFECT' },
        seats,
      ),
    ).toBe(BOTTOM);
  });
});
