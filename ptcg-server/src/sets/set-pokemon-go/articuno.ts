import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Articuno extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 120;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Ice Symbol',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Your Basic [W] Pokémon\'s attacks, except any Articuno, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Freezing Wind',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '24';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const legendaryBird = player.active.getPokemonCard();

      if (legendaryBird && legendaryBird.stage == Stage.BASIC && legendaryBird.cardType == CardType.WATER) {
        if (effect instanceof DealDamageEffect) {
          if (effect.card.name !== 'Articuno') {
            // exclude Articuno
            effect.damage += 10;
          }
          return state;
        }
        return state;
      }
      return state;
    }
    return state;
  }
}