import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State/*, CardTag*/ } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Natu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 40;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Lost March',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 20,
      text: 'This attack does 20 damage for each of your Pokémon, except Prism Star (Prism Star) Pokémon, in the Lost Zone.'
    }
  ];

  public set: string = 'LOT';

  public setNumber = '87';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Natu';

  public fullName: string = 'Natu LOT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.lostzone.cards.forEach(c => {
        if (c instanceof PokemonCard /*&& !c.tags.includes(CardTag.PRISM_STAR)*/) {
          pokemonCount += 1;
        }
      });

      effect.damage = pokemonCount * 20;
    }

    return state;
  }

}
