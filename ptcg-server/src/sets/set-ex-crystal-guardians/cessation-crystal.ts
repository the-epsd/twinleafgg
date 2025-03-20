import { GameError, GameMessage, PowerType } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { AttachPokemonToolEffect } from '../../game/store/effects/play-card-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class CessationCrystal extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'CG';

  public name: string = 'Cessation Crystal';

  public fullName: string = 'Cessation Crystal CG';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public text: string = 'Attach Cessation Crystal to 1 of your Pokémon (excluding Pokémon-ex) that doesn\’t already have a Pokémon Tool attached to it. If the Pokémon Cessation Crystal is attached to is a Pokémon-ex, discard this card.\n\nAs long as Cessation Crystal is attached to an Active Pokémon, each player\’s Pokémon(both yours and your opponent\’s) can\’t use any Poké - Powers or Poké - Bodies.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect
      && (effect.power.powerType === PowerType.POKEBODY || effect.power.powerType === PowerType.POKEPOWER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let isActive = false;

      if (player.active.tool === this && !IS_TOOL_BLOCKED(store, state, player, this)) {
        if (player.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
          player.active.moveCardTo(this, player.discard);
        }
        else {
          isActive = true;
        }
      }

      if (opponent.active.tool === this && !IS_TOOL_BLOCKED(store, state, opponent, this)) {
        if (opponent.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
          opponent.active.moveCardTo(this, opponent.discard);
        }
        else {
          isActive = true;
        }
      }

      if (isActive) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttachPokemonToolEffect && effect.trainerCard == this) {
      if (effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)){
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    return state;
  }

}