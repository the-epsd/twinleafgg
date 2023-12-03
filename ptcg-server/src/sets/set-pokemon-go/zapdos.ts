import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Zapdos extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Lightning Symbol',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Your Basic [L] Pokémon\'s attacks, except any Zapdos, do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 110,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'PGO';
  
  public set2: string = 'pokemongo';
  
  public setNumber: string = '29';
  
  public name: string = 'Zapdos';
  
  public fullName: string = 'Zapdos PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const damage = 10; // set base damage boost to 10

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.isBasic() && card.cardType === CardType.LIGHTNING) {
          // check if basic lightning pokemon

          if (card.name !== 'Zapdos') {
            // exclude Zapdos
            effect.damage += damage;
          }
        }
      });

      return state;
    }

    return state;
  }
}