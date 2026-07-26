import { TrainerCard } from '../../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../../game/store/card/card-types';
import { GamePhase } from '../../../game/store/state/state';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { Effect } from '../../../game/store/effects/effect';
import { StoreLike } from '../../../game/store/store-like';
import { State } from '../../../game/store/state/state';
import { StateUtils } from '../../../game/store/state-utils';
import { IS_TOOL_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class TremendousBomb extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'M5';
  public setNumber: string = '73';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tremendous Bomb';
  public fullName: string = 'Heroic Bomb M5';
  public text =
    "If the Pokémon this card is attached to isn't a Mega Evolution Pokémon ex, is in the Active Spot, and takes 240 or more damage from an attack from your opponent's Mega Evolution Pokémon ex (even if this Pokémon is Knocked Out), place 12 damage counters on the Attacking Pokémon." +
    'If you placed any damage counters in this way, discard this card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (!(effect instanceof DealDamageEffect)) {
      return state;
    }
    if (state.phase !== GamePhase.ATTACK) {
      return state;
    }
    if (effect.damage < 240) {
      return state;
    }

    const defenderOwner = StateUtils.findOwner(state, effect.target);
    if (effect.player === defenderOwner) {
      return state;
    }

    const heroicOnDefender = effect.target.tools.find(
      (t): t is TremendousBomb => t instanceof TremendousBomb,
    );
    if (heroicOnDefender === undefined) {
      return state;
    }

    if (IS_TOOL_BLOCKED(store, state, defenderOwner, heroicOnDefender)) {
      return state;
    }

    const defenderCard = effect.target.getPokemonCard();
    if (defenderCard === undefined) {
      return state;
    }

    const defenderIsMegaEx =
      defenderCard.tags.includes(CardTag.POKEMON_SV_MEGA) &&
      defenderCard.tags.includes(CardTag.POKEMON_ex);

    if (defenderIsMegaEx) {
      return state;
    }

    const attackerCard = effect.player.active.getPokemonCard();
    const attackerIsMegaEx =
      attackerCard?.tags.includes(CardTag.POKEMON_SV_MEGA) &&
      attackerCard?.tags.includes(CardTag.POKEMON_ex);

    if (!attackerIsMegaEx || effect.source !== effect.player.active) {
      return state;
    }

    const put = new PlaceDamageCountersEffect(defenderOwner, effect.player.active, 120);
    store.reduceEffect(state, put);

    effect.target.moveCardTo(heroicOnDefender, defenderOwner.discard);

    return state;
  }
}
