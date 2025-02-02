import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class ScovillainEXSSP extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Capsakid';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 260;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Double Type',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is in play, it is [G] and [R] type.'
  }];

  public attacks = [
    {
      name: 'Spicy Rage',
      cost: [CardType.FIRE, CardType.FIRE],
      damage: 10,
      text: 'This attack does 70 more damage for each damage counter on this Pokemon.'
    }
  ];

  public set: string = 'SSP';

  public setNumber = '37';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Scovillain ex';

  public fullName: string = 'Scovillain ex SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      effect.damage += player.active.damage * 7;
    }

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      effect.cardTypes = [CardType.FIRE, CardType.GRASS];
      return state;
    }

    return state;
  }

}
