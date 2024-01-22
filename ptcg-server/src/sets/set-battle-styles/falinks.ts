import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Falinks extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.RAPID_STRIKE ];

  public cardType: CardType = CardType.FIGHTING;  

  public hp: number = 110;

  public weakness = [{ type: CardType.PSYCHIC }];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Rapid Strike Squad',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 20,
    text: 'This attack does 20 damage for each of your Rapid Strike Pokémon in play.'
  }];

  public set = 'BST';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber = '83';

  public name = 'Falinks';

  public fullName = 'Falinks BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      const vPokemons = player.bench.filter(card => card instanceof PokemonCard && card.tags.includes(CardTag.RAPID_STRIKE));
      const vPokemons2 = player.active.getPokemons().filter(card => card.tags.includes(CardTag.RAPID_STRIKE));

      const vPokes = vPokemons.length + vPokemons2.length;
      const damage = 20 * vPokes;

      effect.damage = damage;

    }
    return state;
  }
}


