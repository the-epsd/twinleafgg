import { Attack, CardType, PlayerType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Tympole extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [C];

  public attacks: Attack[] = [
    { name: 'Get Loud', cost: [W], damage: 10, text: '' },
    {
      name: 'Round',
      cost: [C, C],
      damage: 10,
      damageCalculation: 'x',
      text: 'This attack does 10 damage times the number of your Pokémon that have the Round attack.'
    },
  ];

  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Tympole';
  public fullName: string = 'Tympole BKP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
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