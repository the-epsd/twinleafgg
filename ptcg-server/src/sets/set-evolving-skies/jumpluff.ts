import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { AttackEffect, Effect } from '../../game/store/effects/game-effects';

export class Jumpluff extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Skiploom';
  public tags = [CardTag.RAPID_STRIKE];
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public weakness = [{ type: CardType.FIRE }];

  public powers = [{
    name: 'Fluffy Barrage',
    powerType: PowerType.ABILITY,
    barrage: false,
    text: 'This Pokémon may attack twice each turn. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks = [{
    name: 'Spinning Attack',
    cost: [CardType.GRASS],
    damage: 60,
    text: ''
  }];

  public set: string = 'EVS';
  public regulationMark: string = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Jumpluff';
  public fullName: string = 'Jumpluff EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.source.cards.includes(this)) {
      if (!IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        this.powers[0].barrage = true;
      } else {
        this.powers[0].barrage = false;
      }
    }
    return state;
  }
}