import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, StoreLike, State } from '../../game';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beedrillex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom = 'Kakuna';
  public hp: number = 310;
  public cardType: CardType = G;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Bee Rumble',
    cost: [G],
    damage: 110,
    damageCalculation: 'x' as 'x',
    text: 'This attack does 110 damage for each Beedrill you have in play (including Beedrill ex).'
  }];

  public regulationMark = 'J';
  public set: string = 'M4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Beedrill ex';
  public fullName: string = 'Beedrill ex M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let beedrillCount = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Beedrill' || card.name === 'Beedrill ex') {
          beedrillCount += 1;
        }
      });
      effect.damage = 110 * beedrillCount;
    }
    return state;
  }
}
