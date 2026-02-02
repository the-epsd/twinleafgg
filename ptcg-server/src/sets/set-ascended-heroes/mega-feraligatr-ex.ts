import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, StateUtils } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class MegaFeraligatrex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Croconaw';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = W;
  public hp: number = 370;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Mortal Crunch',
    cost: [W, W, C],
    damage: 200,
    damageCalculation: '+',
    text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 200 more damage.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Mega Feraligatr ex';
  public fullName: string = 'Mega Feraligatr ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.damage > 0) {
        effect.damage = 200 + 200;
      } else {
        effect.damage = 200;
      }
    }
    return state;
  }
}