import { Effect } from '../../game/store/effects/effect';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType } from '../../game/store/card/card-types';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';

export class ClemontsQuickWit extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public set: string = 'SSP';

  public setNumber = '167';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Clemont\'s Quick Wit';

  public fullName: string = 'Clemont\'s Quick Wit SSP';

  public text: string = 'Heal 60 damage from each of your L Pokemon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      // Populate targets; Lightning Pokemon with damage counters
      const targets: PokemonCardList[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.cardType == CardType.LIGHTNING && cardList.damage > 0) { targets.push(cardList); }
      });

      // Can't play this card if there's no valid targets
      if (targets.length === 0) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }

      targets.forEach(target => {
        // Heal all our targets
        const healEffect = new HealEffect(player, target, 60);
        store.reduceEffect(state, healEffect);
      });
    }

    return state;
  }

}
