import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, PowerType, GameError, ConfirmPrompt, AttachEnergyPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Yanmegaex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public regulationMark = 'I';
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yanma';
  public cardType: CardType = G;
  public hp: number = 280;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [
    {
      name: 'Buzz Boost',
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may search your deck for up to 3 Basic [G] Energy and attach them to this Pokémon. Then, shuffle your deck.'
    }
  ];

  public attacks = [
    {
      name: 'Jet Cyclone',
      cost: [G, G, G, C],
      damage: 210,
      text: 'Move 3 Energy from this Pokémon to 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Yanmega ex';
  public fullName: string = 'Yanmega ex DRI';
  public tachyonBits: number = 0;

  public readonly BUZZ_BOOST_MARKER = 'BUZZ_BOOST_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      this.movedToActiveThisTurn = false;
      this.tachyonBits = 0;
    }

    if (effect instanceof EndTurnEffect) {
      this.tachyonBits = 0;
      this.movedToActiveThisTurn = false;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BUZZ_BOOST_MARKER, this)) {
      this.tachyonBits = 0;
      effect.player.marker.removeMarker(this.BUZZ_BOOST_MARKER, this);
    }

    const player = state.players[state.activePlayer];

    if (this.movedToActiveThisTurn == true && player.active.getPokemonCard() == this) {
      this.tachyonBits++;

      if (this.tachyonBits === 1) {
        if (player.marker.hasMarker(this.BUZZ_BOOST_MARKER, this)) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }

        state = store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {

            // Try to reduce PowerEffect, to check if something is blocking our ability
            try {
              const stub = new PowerEffect(player, {
                name: 'test',
                powerType: PowerType.ABILITY,
                text: ''
              }, this);
              store.reduceEffect(state, stub);
            } catch {
              return state;
            }

            state = store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_TO_BENCH,
              player.deck,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.ACTIVE],
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
              { allowCancel: false, min: 0, max: 3 },
            ), transfers => {
              transfers = transfers || [];
              // cancelled by user
              if (transfers.length === 0) {
                SHUFFLE_DECK(store, state, player);
                return state;
              }

              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                player.deck.moveCardTo(transfer.card, target);
                SHUFFLE_DECK(store, state, player);
              }
            });
          }
        });
      }
    }

    // Jet Cyclone
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 3, max: 3, sameTarget: true }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }
    return state;
  }
}