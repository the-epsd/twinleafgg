import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Vikavolt extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Charjabug';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 160;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Mach Bolt',
      cost: [CardType.LIGHTNING],
      damage: 50,
      text: ''
    },
    {
      name: 'Serial Cannon',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 120,
      damageCalculation: '+',
      text: 'This attack does 80 more damage for each of your Benched Vikavolt.'
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '56';

  public name: string = 'Vikavolt';

  public fullName: string = 'Vikavolt TEF';

  public reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      let charjabugInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card.name === 'Charjabug') {
          charjabugInPlay++;
        }
      });

      effect.damage += 80 * charjabugInPlay;

    }

    return state;
  }

}