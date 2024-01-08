import { CardTarget, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { GameMessage } from '../../game/game-message';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { AttachEnergyPrompt, EnergyCard, GameError, StateUtils } from '../../game';

export class ProfessorSadasVitality extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'G';

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '170';

  public name: string = 'Professor Sada\'s Vitality';

  public fullName: string = 'Professor Sada\'s Vitality PAR';

  public text: string =
    '';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC;});

      if (!hasEnergyInDiscard) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      
      let ancientPokemonInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.ANCIENT)) {
          ancientPokemonInPlay = true;
        }
      });

      if (!ancientPokemonInPlay) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.ANCIENT)) {
          blocked2.push(target);
        }
      });
  
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 0, max: 2, blocked: blocked2 }
      ), chosen => {
  
        chosen.forEach(target => {
  
          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_ACTIVE,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: true, min: 0, max: 1 }
          ), transfers => {
            transfers = transfers || [];
  
            if (transfers.length === 0) {
              return;
            }
  
            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.discard.moveCardTo(transfer.card, target);
              player.deck.moveTo(player.hand, 3);
            }
          });
        });
      });
    }
    return state;
  }
}