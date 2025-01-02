import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Attack, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Koraidon extends PokemonCard {

  public tags = [CardTag.ANCIENT];

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = F;

  public hp: number = 130;

  public retreat = [C, C];

  public attacks = [
    {
      name: 'Unrelenting Onslaught',
      cost: [C, C],
      damage: 30,
      damageCalculator: '+',
      text: 'If 1 of your other Ancient Pokémon used an attack during your last turn, this attack does 150 more damage.'
    },
    {
      name: 'Shred',
      cost: [F, F, C],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '116';

  public name: string = 'Koraidon';

  public fullName: string = 'Koraidon SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const playerLastAttack = state.playerLastAttack?.[player.id];
      const originalCard = playerLastAttack ? this.findOriginalCard(state, playerLastAttack) : null;

      if (originalCard && originalCard !== this && originalCard.tags.includes(CardTag.ANCIENT)) {
        effect.damage += 150;
      }
    }
    return state;
  }

  private findOriginalCard(state: State, playerLastAttack: Attack): PokemonCard | null {
    let originalCard: PokemonCard | null = null;
    let originalCardId: number | null = null;

    state.players.forEach(player => {
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.attacks.some(attack => attack === playerLastAttack)) {
          originalCard = card;
          originalCardId = card.id;
        }
      });

      // Check deck, discard, hand, and lost zone
      [player.deck, player.discard, player.hand, player.lostzone].forEach(cardList => {
        cardList.cards.forEach(card => {
          if (card instanceof PokemonCard && card.attacks.some(attack => attack === playerLastAttack)) {
            originalCard = card;
            originalCardId = card.id;
          }
        });
      });
    });

    if (originalCard && originalCardId === this.id) {
      return null;
    }

    return originalCard;
  }
}