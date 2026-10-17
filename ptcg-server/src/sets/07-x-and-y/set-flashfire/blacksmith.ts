import { TrainerType, CardType, EnergyType, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { CheckPokemonTypeEffect } from '../../../game/store/effects/check-effects';
import { State, StoreLike, TrainerCard, GameError, GameMessage, Player, PlayerType, SlotType, CardTarget, EnergyCard, AttachEnergyPrompt, StateUtils } from '../../../game';
import { MOVE_CARDS } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class Blacksmith extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '88';
  public name: string = 'Blacksmith';
  public fullName: string = 'Blacksmith FLF';
  public text: string = 'Attach 2 [R] Energy cards from your discard pile to 1 of your [R] Pokémon.';

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }

    const hasFireEnergy = player.discard.cards.some(
      (c) =>
        c.superType === SuperType.ENERGY &&
        c.energyType === EnergyType.BASIC &&
        (c as EnergyCard).provides.includes(CardType.FIRE),
    );
    if (!hasFireEnergy) {
      return false;
    }

    let hasFirePokemon = false;
    player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);
      store.reduceEffect(state, checkPokemonTypeEffect);
      if (checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE)) {
        hasFirePokemon = true;
      }
    });
    return hasFirePokemon;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      const fireEnergyCount = player.discard.cards.filter(
        (c) =>
          c.superType === SuperType.ENERGY &&
          c.energyType === EnergyType.BASIC &&
          (c as EnergyCard).provides.includes(CardType.FIRE),
      ).length;

      if (fireEnergyCount === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let hasFirePokemon = false;
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, _pokemonCard, target) => {
        const checkPokemonTypeEffect = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonTypeEffect);

        if (checkPokemonTypeEffect.cardTypes.includes(CardType.FIRE)) {
          hasFirePokemon = true;
        } else {
          blockedTo.push(target);
        }
      });

      if (!hasFirePokemon) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      MOVE_CARDS(store, state, player.hand, player.supporter, {
        cards: [effect.trainerCard],
        sourceCard: this,
      });

      // Do not discard the card yet
      effect.preventDefault = true;

      state = store.prompt(
        state,
        new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
          { allowCancel: false, min: 1, max: 2, blockedTo, sameTarget: true },
        ),
        (transfers) => {
          transfers = transfers || [];

          if (transfers.length === 0) {
            return;
          }

          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            MOVE_CARDS(store, state, player.discard, target, {
              cards: [transfer.card],
              sourceCard: this,
            });
          }
        },
      );
    }

    return state;
  }
}
