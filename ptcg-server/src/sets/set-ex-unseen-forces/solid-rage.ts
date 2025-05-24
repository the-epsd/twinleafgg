import { GameError, GameMessage, PlayerType } from '../../game';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachPokemonToolEffect } from '../../game/store/effects/play-card-effects';
import { IS_TOOL_BLOCKED } from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class SolidRage extends TrainerCard {
  public trainerType: TrainerType = TrainerType.TOOL;
  public set: string = 'UF';
  public name: string = 'Solid Rage';
  public fullName: string = 'Solid Rage UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '92';

  public text: string =
    'Attach Solid Rage to 1 of your Evolved Pokémon (excluding Pokémon-ex) that doesn\'t already have a Pokémon Tool attached to it. If the Pokémon Solid Rage is attached to is a Basic Pokémon or Pokémon-ex, discard Solid Rage.\n\nIf you have more Prize cards left than your opponent, the Pokémon that Solid Rage is attached to does 20 more damage to the Active Pokémon (before applying Weakness and Resistance).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachPokemonToolEffect && effect.trainerCard == this) {
      if (effect.target.getPokemonCard()?.tags.includes(CardTag.POKEMON_ex)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    if (effect instanceof PutDamageEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_TOOL_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }

      const attack = effect.attack;
      if (player.getPrizeLeft() > opponent.getPrizeLeft()) {
        if (attack && attack.damage > 0 && effect.target === opponent.active) {
          effect.damage += 20;
        }
      }
    }

    if (effect instanceof CheckTableStateEffect) {
      state.players.forEach(player => {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (!cardList.cards.includes(this)) {
            return;
          }
          const attachedTo = cardList.getPokemonCard();

          if (!!attachedTo && (attachedTo.tags.includes(CardTag.POKEMON_ex))) {
            cardList.moveCardTo(this, player.discard);
            attachedTo.tools === undefined;
          }
        });
      });
    }

    return state;
  }
}
