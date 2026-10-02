import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../../game/store/card/card-types';
import { PowerType, StateUtils, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_TRAINER_TARGET, IS_TRAINER_TARGET, WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';


export class Rhyperior extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = "Rhydon"
  public cardType: CardType[] = [F];
  public hp: number = 200;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Wide Wall',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to all of your Pokémon.'
  }];


  public attacks = [{
    name: 'Drill Run',
    cost: [F, C, C],
    damage: 180,
    text: 'Discard an Energy from your opponent\'s Active Pok\u00e9mon.'
  }];

  public regulationMark = 'H';
  public set: string = 'SCR';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rhyperior';
  public fullName: string = 'Rhyperior SCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power 1: Wide Wall
    // Ref: set-astral-radiance/diancie.ts
    if (IS_TRAINER_TARGET(effect, { trainerType: TrainerType.SUPPORTER })) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.cards.includes(this) || IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      BLOCK_TRAINER_TARGET(effect)
    }

    // Attack 1: Drill Run
    // Ref: set-furious-fists/tyrunt.ts (Crunch)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
    };

    return state;
  }
}