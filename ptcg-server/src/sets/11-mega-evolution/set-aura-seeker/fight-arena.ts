import { PlayerType, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect, UseStadiumEffect } from '../../../game/store/effects/game-effects';
import { IS_STADIUM_EFFECT_BLOCKED } from '../../../game/store/prefabs/stadium-effect';

export class FightArena extends TrainerCard {
  protected _trainerType = TrainerType.STADIUM;
  public set = 'M7';
  public regulationMark = 'J';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name = 'Fight Arena';
  public fullName = 'Fight Arena FLO';
  public text =
    'Once during each player\'s turn, that player may heal 20 damage from each of their Pokémon (excluding Pokémon with a Rule Box).';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof UseStadiumEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const pokemon = cardList.getPokemonCard();
        if (!pokemon || pokemon.hasRuleBox()) {
          return;
        }
        if (IS_STADIUM_EFFECT_BLOCKED(store, state, player, cardList, this)) {
          return;
        }
        store.reduceEffect(state, new HealEffect(player, cardList, 20));
      });
    }

    return state;
  }
}
