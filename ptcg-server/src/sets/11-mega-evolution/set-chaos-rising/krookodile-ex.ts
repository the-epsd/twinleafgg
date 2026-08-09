import { PokemonCard, Stage, CardTag, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { BLOCK_RETREAT } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class KrookodileEx extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Krokorok';
  public hp: number = 320;
  public cardType: CardType = D;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Corner',
    cost: [D, C],
    damage: 80,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  },
  {
    name: 'Strong Bite',
    cost: [D, D, C],
    damage: 140,
    damageCalculation: '+',
    text: 'If this Pokémon has a Pokémon Tool attached, this attack does 140 more damage.'
  }];

  public regulationMark = 'I';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';
  public name: string = 'Krookodile ex';
  public fullName: string = 'Krookodile ex CRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Corner
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }
    // Strong Bite
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (player.active.tools.length > 0) {
        effect.damage += 90;
      }
    }

    return state;
  }
}
