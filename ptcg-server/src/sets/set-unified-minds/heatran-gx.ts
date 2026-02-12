import { Card, CardTag, CardTarget, CardType, EnergyCard, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { BLOCK_IF_GX_ATTACK_USED, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class HeatranGX extends PokemonCard {
  public cardType = R;
  public tags = [CardTag.POKEMON_GX];
  public hp = 190;
  public stage = Stage.BASIC;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Burning Road',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when this Pokémon moves from your Bench to become your Active Pokémon, you may move any number of [R] Energy from your other Pokémon to it.'
  }];

  public attacks = [{
    name: 'Steaming Stomp',
    cost: [R, R, C],
    damage: 130,
    text: ''
  },
  {
    name: 'Hot Burn-GX',
    cost: [R],
    damage: 50,
    damageCalculation: 'x',
    gxAttack: true,
    text: 'This attack does 50 damage times the amount of [R] Energy attached to this Pokémon. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'UNM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '25';
  public name: string = 'Heatran-GX';
  public fullName: string = 'Heatran-GX UNM';

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

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
      this.movedToActiveThisTurn = false;
      player.marker.removeMarker(this.ABILITY_USED_MARKER, this);
    }

    if (player === owner && !player.marker.hasMarker(this.ABILITY_USED_MARKER, this)) {
      if (this.movedToActiveThisTurn == true) {
        player.marker.addMarker(this.ABILITY_USED_MARKER, this);
        // Try to reduce PowerEffect, to check if something is blocking our ability
        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return state;
        }

        const blockedFrom: CardTarget[] = [];
        const blockedTo: CardTarget[] = [];
        const blockedMap: { source: CardTarget, blocked: number[] }[] = [];

        let hasEnergyOnBench = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList === player.active) {
            blockedFrom.push(target);
            return;
          }
          blockedTo.push(target);

          // Block energy that doesn't provide FIRE or ANY
          const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
          store.reduceEffect(state, checkProvidedEnergy);
          const blockedCards: Card[] = [];
          checkProvidedEnergy.energyMap.forEach(em => {
            if (!em.provides.includes(CardType.FIRE) && !em.provides.includes(CardType.ANY)) {
              blockedCards.push(em.card);
            }
          });
          const blocked: number[] = [];
          blockedCards.forEach(bc => {
            const index = cardList.cards.indexOf(bc);
            if (index !== -1 && !blocked.includes(index)) {
              blocked.push(index);
            }
          });
          if (blocked.length > 0) {
            blockedMap.push({ source: target, blocked });
          }

          if (cardList.cards.some(c => c instanceof EnergyCard && (c.provides.includes(CardType.FIRE) || c.provides.includes(CardType.ANY)))) {
            hasEnergyOnBench = true;
          }
        });

        if (hasEnergyOnBench === false) {
          return state;
        }

        return store.prompt(state, new MoveEnergyPrompt(
          player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE], // Only allow moving to active
          { superType: SuperType.ENERGY },
          { allowCancel: false, blockedTo, blockedFrom, blockedMap }
        ), transfers => {

          if (!transfers) {
            return;
          }

          for (const transfer of transfers) {

            // Can only move energy to the active Pokemon
            const target = player.active;
            const source = StateUtils.getTarget(state, player, transfer.from);
            transfers.forEach(transfer => {
              source.moveCardTo(transfer.card, target);
              return state;
            });
          }
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Check if player has used GX attack
      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return cardType === CardType.FIRE || cardType === CardType.ANY;
        }).length;
      });

      effect.damage = energyCount * 50;
    }

    return state;
  }
}