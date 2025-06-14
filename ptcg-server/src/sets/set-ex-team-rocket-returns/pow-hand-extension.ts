import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, SlotType, ChoosePokemonPrompt, CardTarget, MoveEnergyPrompt, PokemonCard, Card } from '../../game';
import { TrainerEffect, TrainerTargetEffect } from '../../game/store/effects/play-card-effects';
import { SelectOptionPrompt } from '../../game/store/prompts/select-option-prompt';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

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

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const blockedFrom: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList !== opponent.active) {
          blockedFrom.push(target);
        }
      });

      const options: { message: GameMessage, action: () => void }[] = [
        {
          message: GameMessage.MOVE_ENERGY_CARDS,
          action: () => {

            const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
              const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
              store.reduceEffect(state, checkProvidedEnergy);

              const blockedCards: Card[] = [];
              checkProvidedEnergy.energyMap.forEach(em => {
                if (em.provides.length === 0) {
                  blockedCards.push(em.card);
                }
              });

              cardList.cards.forEach(em => {
                if (cardList.getPokemons().includes(em as PokemonCard)) {
                  blockedCards.push(em);
                }
              });

              const blocked: number[] = [];
              blockedCards.forEach(bc => {
                const index = cardList.cards.indexOf(bc);
                if (index !== -1 && !blocked.includes(index)) {
                  blocked.push(index);
                }
              });

              if (blocked.length !== 0) {
                blockedMap.push({ source: target, blocked });
              }
            });

            store.prompt(state, new MoveEnergyPrompt(
              player.id,
              GameMessage.MOVE_ENERGY_CARDS,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              {},
              { min: 1, max: 1, allowCancel: false, blockedMap, blockedFrom }
            ), transfers => {
              if (transfers === null) {
                return;
              }

              for (const transfer of transfers) {

                const source = StateUtils.getTarget(state, player, transfer.from);
                const target = StateUtils.getTarget(state, player, transfer.to);
                source.moveCardTo(transfer.card, target);

                if (transfer.card instanceof PokemonCard) {
                  // Remove it from the source
                  source.removePokemonAsEnergy(transfer.card);

                  // Reposition it to be with energy cards (at the beginning of the card list)
                  target.cards.unshift(target.cards.splice(target.cards.length - 1, 1)[0]);

                  // Register this card as energy in the PokemonCardList
                  target.addPokemonAsEnergy(transfer.card);
                }
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