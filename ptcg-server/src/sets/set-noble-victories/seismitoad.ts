import { Attack, CardType, PlayerType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Seismitoad extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Palpitoad';
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [C, C, C];

  public attacks: Attack[] = [
    {
      name: 'Round',
      cost: [C, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'Does 30 damage times the number of your Pokémon that have the Round attack.'
    },
    { name: 'Hyper Voice', cost: [W, W, C], damage: 70, text: '' },
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '24';
  public name: string = 'Seismitoad';
  public fullName: string = 'Seismitoad NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      let roundPokemon = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.attacks.some(attack => attack.name === 'Round')) {
          roundPokemon += 1;
        }
      });
      effect.damage = effect.attack.damage * roundPokemon;
    }

    return state;
  }
}