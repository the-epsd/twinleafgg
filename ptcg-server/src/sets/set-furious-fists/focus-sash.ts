import { GameLog, PlayerType, PokemonCardList, StateUtils } from '../../game';
import { CardType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class FocusSash extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'FFI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '91';

  public name = 'Focus Sash';

  public fullName = 'Focus Sash FFI';

  public text: string =
    'If the [F] Pokémon this card is attached to has full HP and would be Knocked Out by damage from an opponent\'s attack, that Pokémon is not Knocked Out and its remaining HP becomes 10 instead. Then, discard this card.';


  private canDiscard = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.target.tool === this && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const targetPlayer = StateUtils.findOwner(state, effect.target);

      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);

      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);

      if (effect.damage <= 0 || player === targetPlayer || !checkPokemonTypeEffect.cardTypes.includes(CardType.FIGHTING)) {
        return state;
      }

      if (effect.target.damage === 0 && effect.damage >= checkHpEffect.hp) {

        try {
          const toolEffect = new ToolEffect(player, this);
          store.reduceEffect(state, toolEffect);
        } catch {
          return state;
        }

        effect.preventDefault = true;
        effect.target.damage = checkHpEffect.hp - 10;
        store.log(state, GameLog.LOG_PLAYER_PLAYS_TOOL, { card: this.name });
        this.canDiscard = true;
      }

      if (this.canDiscard) {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, index) => {
          if (cardList.cards.includes(this)) {
            try {
              const toolEffect = new ToolEffect(player, this);
              store.reduceEffect(state, toolEffect);
            } catch {
              return state;
            }

            cardList.moveCardTo(this, player.discard);
            cardList.tool = undefined;
          }
        });
      }
    }
    return state;
  }
}