import { PokemonCard, PowerType, Player } from '../../../game';
import { GameError } from '../../../game/game-error';
import { GameMessage } from '../../../game/game-message';
import { SuperType, TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';
import { SEARCH_DECK_FOR_CARDS_TO_HAND } from '../../../game/store/prefabs/prefabs';
import { WAS_TRAINER_USED } from '../../../game/store/prefabs/trainer-prefabs';

export class GreensExploration extends TrainerCard {
  protected _trainerType: TrainerType = TrainerType.SUPPORTER;
  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '175';
  public name: string = "Green's Exploration";
  public fullName: string = "Green's Exploration UNB";
  public text: string = `You can play this card only if you have no Pokémon with Abilities in play.

Search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Then, shuffle your deck.`;

  // Abilities that are blocked (the stub PowerEffect throws) do not count
  private hasPokemonWithAbilities(store: StoreLike, state: State, player: Player): boolean {
    const pokemonWithAbilities: PokemonCard[] = [];
    const playerActive = player.active.getPokemonCard();

    const stubPowerEffectForActive = new PowerEffect(
      player,
      { name: 'test', powerType: PowerType.ABILITY, text: '' },
      player.active.getPokemonCard()!,
    );

    try {
      store.reduceEffect(state, stubPowerEffectForActive);

      if (playerActive && playerActive.powers.some((power) => power.powerType === PowerType.ABILITY)) {
        pokemonWithAbilities.push(playerActive);
      }
    } catch {
      // no abilities in active
    }

    if (player.bench.some((b) => b.cards.length > 0)) {
      const stubPowerEffectForBench = new PowerEffect(
        player,
        { name: 'test', powerType: PowerType.ABILITY, text: '' },
        player.bench.filter((b) => b.cards.length > 0)[0].getPokemonCard()!,
      );

      try {
        store.reduceEffect(state, stubPowerEffectForBench);

        const benchPokemon = player.bench
          .map((b) => b.getPokemonCard())
          .filter((card) => card !== undefined) as PokemonCard[];
        pokemonWithAbilities.push(
          ...benchPokemon.filter((card) =>
            card.powers.some((power) => power.powerType === PowerType.ABILITY),
          ),
        );
      } catch {
        // no abilities on bench
      }
    }

    return pokemonWithAbilities.length > 0;
  }

  public canPlay(store: StoreLike, state: State, player: Player): boolean {
    if (player.supporterTurn > 0) {
      return false;
    }
    if (player.deck.cards.length === 0) {
      return false;
    }
    if (this.hasPokemonWithAbilities(store, state, player)) {
      return false;
    }
    return true;
  }

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_TRAINER_USED(effect, this)) {
      const player = effect.player;

      if (player.supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      if (this.hasPokemonWithAbilities(store, state, player)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.TRAINER },
        { min: 0, max: 2, allowCancel: false },
      );
    }

    return state;
  }
}
