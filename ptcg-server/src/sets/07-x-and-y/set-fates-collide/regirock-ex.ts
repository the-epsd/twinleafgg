import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class RegirockEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Regi Power',
    powerType: PowerType.ABILITY,
    text: 'The attacks of your [F] Pokémon (excluding Regirock-EX) do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Bedrock Press',
      cost: [F, F, F],
      damage: 100,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'FCO';
  public name: string = 'Regirock-EX';
  public fullName: string = 'Regirock EX FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Regi Power


    // Bedrock Press
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 20;
    }

    return state;
  }

}
