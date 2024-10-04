import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, Card, ChooseEnergyPrompt, EnergyCard, GameError, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Cinderace extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 170;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS];
  public evolvesFrom = 'Raboot';

  public powers = [{
    name: 'Libero',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may attach up to 2 [R] Energy cards from your discard pile to it.'
  }];

  public attacks = [{
    name: 'Flare Striker',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 190,
    text: 'Discard 2 Energy from this Pokémon.'
  }]

  public set: string = 'SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Cinderace';
  public fullName: string = 'Cinderace SSH';

  public ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = state.players[state.activePlayer];
      player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
      this.movedToActiveThisTurn = false;
    }

    const cardList = StateUtils.findCardList(state, this);
    const owner = StateUtils.findOwner(state, cardList);

    const player = state.players[state.activePlayer];

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
      player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
    }

    if (player === owner && !player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
      if (this.movedToActiveThisTurn == true) {
        player.marker.addMarker(this.ABILITY_USED_MARKER, this);
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

        // Checking discard for fire energy
        const hasEnergyInDiscard = player.discard.cards.some(c => {
          return c instanceof EnergyCard
            && c.energyType === EnergyType.BASIC
            && c.provides.includes(CardType.FIRE);
        });
        if (!hasEnergyInDiscard) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        return store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
          { allowCancel: true, min: 1, max: 2 }
        ), transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
          }
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.FIRE, CardType.FIRE],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}