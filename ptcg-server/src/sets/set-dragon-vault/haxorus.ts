import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_TOP_X_CARDS_FROM_YOUR_DECK } from '../../game/store/prefabs/prefabs';

export class Haxorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Fraxure';
  public cardType: CardType = N;
  public hp: number = 140;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Axe Slugger',
      cost: [C, C],
      damage: 60,
      damageCalculation: '+' as const,
      text: 'If the Defending Pok\u00e9mon is a Colorless Pok\u00e9mon, this attack does 60 more damage.'
    },
    {
      name: 'Dragon Pulse',
      cost: [F, M, C, C],
      damage: 100,
      text: 'Discard the top card of your deck.'
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '16';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Haxorus';
  public fullName: string = 'Haxorus DRV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Axe Slugger - +60 if defending is Colorless
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const defendingPokemon = opponent.active.getPokemonCard();

      if (defendingPokemon && defendingPokemon.cardType === CardType.COLORLESS) {
        effect.damage += 60;
      }
    }

    // Dragon Pulse - discard top card of deck
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      DISCARD_TOP_X_CARDS_FROM_YOUR_DECK(store, state, player, 1, this, effect.attack);
    }

    return state;
  }
}
