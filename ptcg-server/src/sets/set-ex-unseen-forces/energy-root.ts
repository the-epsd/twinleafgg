import { TrainerCard, TrainerType, State, StoreLike, GameError, GameMessage, PowerType, StateUtils } from '../../game';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';

export class EnergyRoot extends TrainerCard {
  public trainerType = TrainerType.TOOL;
  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Energy Root';
  public fullName: string = 'Energy Root UF';

  public text: string =
    'As long as Energy Root is attached to a Pokémon, that Pokémon gets +20 HP and can\'t use any Poké-Powers or Poké-Bodies.';

  private readonly HP_BONUS = 20;

  public reduceEffect(store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof CheckHpEffect && effect.target.tools.includes(this)) {
      const card = effect.target.getPokemonCard();

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

      if (card === undefined) {
        return state;
      }

      effect.hp += this.HP_BONUS;
    }

    if (effect instanceof PowerEffect
      && !IS_TOOL_BLOCKED(store, state, effect.player, this)
      && (effect.power.powerType === PowerType.POKEPOWER || effect.power.powerType === PowerType.POKEBODY)) {
      const pokemonSlot = effect.target ?? StateUtils.findPokemonSlot(state, effect.card);

      if (pokemonSlot?.tools.includes(this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    return state;
  }
}
