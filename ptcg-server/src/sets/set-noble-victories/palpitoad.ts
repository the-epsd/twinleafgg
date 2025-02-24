import { Attack, CardType, PlayerType, PokemonCard, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Palpitoad extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Tympole';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness: Weakness[] = [{ type: G }];
  public retreat: CardType[] = [C, C];

  public attacks: Attack[] = [
    { name: 'Mud Shot', cost: [W], damage: 20, text: '' },
    {
      name: 'Round',
      cost: [C, C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Does 20 damage times the number of your Pokémon that have the Round attack.'
    },
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Palpitoad';
  public fullName: string = 'Palpitoad NVI';

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