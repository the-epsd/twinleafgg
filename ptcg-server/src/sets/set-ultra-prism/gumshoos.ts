import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SHOW_CARDS_TO_PLAYER } from '../../game/store/prefabs/prefabs';

export class Gumshoos extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Yungoos';
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Identify',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+' as '+',
      text: 'Your opponent reveals their hand. If you find a Pokémon there, this attack does 80 more damage.'
    },
    {
      name: 'Whap Down',
      cost: [C, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '113';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gumshoos';
  public fullName: string = 'Gumshoos UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Identify
    // Ref: set-breakpoint/sigilyph.ts (Psy Report - SHOW_CARDS_TO_PLAYER)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Reveal opponent's hand
      SHOW_CARDS_TO_PLAYER(store, state, player, opponent.hand.cards);

      // Check if opponent has any Pokemon in hand
      const hasPokemon = opponent.hand.cards.some(c => c.superType === SuperType.POKEMON);
      if (hasPokemon) {
        effect.damage += 80;
      }
    }

    return state;
  }
}
