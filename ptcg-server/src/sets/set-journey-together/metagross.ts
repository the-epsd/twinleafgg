import { Attack, CardType, PlayerType, PokemonCard, Resistance, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Metagross extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metang';
  public cardType: CardType = P;
  public hp: number = 170;
  public weakness: Weakness[] = [{ type: D }];
  public resistance: Resistance[] = [{ type: F, value: -30 }];
  public retreat: CardType[] = [C, C, C];

  public attacks: Attack[] = [
    { name: 'Wrack Down', cost: [P], damage: 60, text: '' },
    {
      name: 'Zen Headbutt',
      cost: [P, P],
      damage: 130,
      damageCalculation: '+',
      text: 'If you have Beldum and Metang on your Bench, this attack does 150 more damage.',
    },
  ];

  public set: string = 'JTG';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Metagross';
  public fullName: string = 'Metagross JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let hasBeldum = false;
      let hasMetang = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Beldum') {
          hasBeldum = true;
        } else if (card.name === 'Metang') {
          hasMetang = true;
        }
      });
      if (hasBeldum && hasMetang) {
        effect.damage += 150;
      }
    }

    return state;
  }
}