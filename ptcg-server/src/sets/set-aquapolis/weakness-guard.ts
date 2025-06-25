import { Attack, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_TRAINER_USED } from '../../game/store/prefabs/trainer-prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class WeaknessGuard extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '141';
  public name: string = 'Weakness Guard';
  public fullName: string = 'Weakness Guard AQ';

  public attacks: Attack[] = [{
    name: 'Stone Generator',
    cost: [C],
    damage: 0,
    text: 'If your opponent has any Evolved Pokémon in play, remove the highest Stage Evolution card from each of them and put those cards back into his or her hand.'
  }];

  public text: string =
    'Attach this card to 1 of your Evolved Pokémon (excluding Pokémon-ex and Pokémon that has an owner in its name) in play. That Pokémon may use this card\'s attack instead of its own. At the end of your turn, discard Ancient Technical Machine [Rock].';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), transfers => {
        player.supporter.moveCardTo(effect.trainerCard, transfers[0]);
      });
    }

    // Discard at end of opponent's turn
    if (effect instanceof EndTurnEffect) {
      const opponent = effect.player;
      const player = StateUtils.getOpponent(state, opponent);
      const cardList = StateUtils.findCardList(state, this);
      // Do nothing if the end turn effect is for this player (not opponent)
      if (effect.player === StateUtils.findOwner(state, cardList)) {
        return state;
      }

      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, index) => {
        if (cardList.cards.includes(this)) {
          cardList.moveCardTo(this, player.discard);
        }
      });
    }

    // Actual effect
    if (effect instanceof CheckPokemonStatsEffect && effect.target.cards.includes(this)) {
      const target = effect.target.getPokemonCard();
      if (target) {
        effect.weakness = [];
      }
    }

    return state;
  }
}