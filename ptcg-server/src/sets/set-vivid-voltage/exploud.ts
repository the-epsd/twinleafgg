import { Attack, CardType, PlayerType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Exploud extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Loudred';
  public cardType: CardType = C;
  public hp: number = 160;
  public weakness: Weakness[] = [{ type: F }];
  public retreat: CardType[] = [C, C, C];

  public attacks: Attack[] = [
    {
      name: 'Round',
      cost: [C, C],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each of your Pokémon in play that has the Round attack.'
    },
    { name: 'Hyper Voice', cost: [C, C, C], damage: 120, text: '' },
  ];

  public set: string = 'VIV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '137';
  public name: string = 'Exploud';
  public fullName: string = 'Exploud VIV';

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