import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game';

export class SlakingV extends PokemonCard {

  public stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_V ];

  public cardType = CardType.COLORLESS;

  public hp = 230;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Kinda Lazy',
    powerType: PowerType.ABILITY,
    text: 'If you have exactly 2, 4, or 6 Prize cards remaining, this Pokémon can\'t attack.'
  }];

  public attacks = [
    {
      name: 'Heavy Impact',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 260,
      text: ''
    }
  ];

  public set: string = 'PGO';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public name: string = 'Slaking V';

  public fullName: string = 'Slaking V LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const prizes = effect.player.getPrizeLeft();

      if (prizes === 2 || prizes === 4 || prizes === 6) {
        effect.preventDefault = true;
      }
      return state;
    }
    return state;
  }
}