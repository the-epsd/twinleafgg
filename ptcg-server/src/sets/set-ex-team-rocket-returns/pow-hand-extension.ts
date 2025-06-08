import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, CardTarget, AttachEnergyPrompt } from '../../game';
import { TrainerEffect, TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { MOVE_CARD_TO } from '../../game/store/prefabs/prefabs';

export class PowHandExtension extends TrainerCard {
  public trainerType: TrainerType = TrainerType.ITEM;
  public tags = [CardTag.ROCKETS_SECRET_MACHINE];
  public set: string = 'TRR';
  public name: string = 'Pow! Hand Extension';
  public fullName: string = 'Pow! Hand Extension TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public text = `You may use this card only if you have more Prize cards left than your opponent.
Move 1 Energy card attached to the Defending Pokémon to another of your opponent's Pokémon. Or, switch 1 of your opponent's Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.`;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() < opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blockedFrom: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList === player.active) {
          blockedFrom.push(target);
        }
      });

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.MOVE_ENERGY_CARDS,
          action: () => {

            store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_TO_BENCH,
              opponent.active,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { superType: SuperType.ENERGY },
              { allowCancel: false, min: 0, max: 1 }
            ), transfers => {
              transfers = transfers || [];
              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                MOVE_CARD_TO(state, transfer.card, target);
              }
            });
            player.supporter.moveCardTo(effect.trainerCard, player.discard);
          }
        },
        {
          message: GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          action: () => {
            player.hand.moveCardTo(effect.trainerCard, player.supporter);
            // We will discard this card after prompt confirmation
            effect.preventDefault = true;

            return store.prompt(state, new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON_TO_SWITCH,
              PlayerType.TOP_PLAYER,
              [SlotType.BENCH],
              { allowCancel: false }
            ), result => {
              const cardList = result[0];

              if (cardList) {
                const targetCard = new TrainerTargetEffect(player, effect.trainerCard, cardList);
                targetCard.target = cardList;
                store.reduceEffect(state, targetCard);
                if (targetCard.target) {
                  opponent.switchPokemon(targetCard.target);
                }
              }

              player.supporter.moveCardTo(effect.trainerCard, player.discard);
              return state;
            });
          }
        }
      ];

      return store.prompt(state, new SelectOptionPrompt(
        player.id,
        GameMessage.CHOOSE_OPTION,
        options.map(opt => opt.message),
        { allowCancel: false }
      ), choice => {
        const option = options[choice];
        option.action();
        player.supporter.moveCardTo(effect.trainerCard, player.discard);
        return state;
      });
    }

    return state;
  }
}