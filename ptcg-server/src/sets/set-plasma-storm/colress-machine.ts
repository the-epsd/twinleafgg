import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt, GameError, StateUtils } from '../../game';

export class ColressMachine extends TrainerCard {

  public trainerType: TrainerType = TrainerType.ITEM;

  public tags = [CardTag.TEAM_PLASMA];

  public set: string = 'PLS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '119';

  public name: string = 'Colress Machine';

  public fullName: string = 'Colress Machine PLS';

  public text: string =
    'Search your deck for a Plasma Energy card and attach it to 1 of your Team Plasma Pokémon. Shuffle your deck afterward.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      let teamPlasmaPokemonInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.TEAM_PLASMA)) {
          teamPlasmaPokemonInPlay = true;
        }
      });

      if (!teamPlasmaPokemonInPlay) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.TEAM_PLASMA)) {
          blocked2.push(target);
        }
      });

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL, name: 'Plasma Energy' },
        { allowCancel: false, min: 0, max: 1, blockedTo: blocked2 }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      });
    }
    return state;
  }
}