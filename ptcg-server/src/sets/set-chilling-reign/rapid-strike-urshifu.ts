import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RapidStrikeUrshifu extends PokemonCard {
  public regulationMark = 'E';
  public tags = [CardTag.RAPID_STRIKE];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 140;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Slashing Claw',
      cost: [C],
      damage: 40,
      text: ''
    },
    {
      name: 'Rapid-Fisted Rush',
      cost: [W, C],
      damage: 30,
      damageCalculation: 'x',
      text: 'This attack does 30 damage for each of your Rapid Strike Pokémon in play.'
    }
  ];

  public set: string = 'CRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Rapid Strike Urshifu';
  public fullName: string = 'Rapid Strike Urshifu CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      let rapidStrikePokemonCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.tags.includes(CardTag.RAPID_STRIKE)) {
          rapidStrikePokemonCount++;
        }
      });
      effect.damage = rapidStrikePokemonCount * 30;
    }

    return state;
  }

}
