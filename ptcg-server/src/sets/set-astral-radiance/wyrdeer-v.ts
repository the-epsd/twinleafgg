import { CardTag, CardTarget, CardType, EnergyCard, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class WyrdeerV extends PokemonCard {

  public cardType = CardType.COLORLESS;

  public tags = [CardTag.POKEMON_V];

  public hp = 220;

  public stage = Stage.BASIC;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Frontier Road',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may move any amount of Energy from your other Pokémon to it.'
  }];

  public attacks = [{
    name: 'Psyshield Bash',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 40,
    damageCalculation: 'x',
    text: 'This attack does 40 damage for each Energy attached to this Pokémon.'
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '134';

  public name: string = 'Wyrdeer V';

  public fullName: string = 'Wyrdeer V ASR';

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

        const blockedFrom: CardTarget[] = [];
        const blockedTo: CardTarget[] = [];

        let hasEnergyOnBench = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (cardList === player.active) {
            blockedFrom.push(target);
            return;
          }
          blockedTo.push(target);
          if (cardList.cards.some(c => c instanceof EnergyCard)) {
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
          { allowCancel: false, blockedTo: blockedTo, blockedFrom: blockedFrom }
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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let totalDamage = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
        store.reduceEffect(state, checkProvidedEnergy);

        checkProvidedEnergy.energyMap.forEach(em => {
          em.provides.forEach(energyType => {
            if (energyType !== CardType.ANY) {
              totalDamage += 40;
            }
          });
        });
      });

      effect.damage = totalDamage;
    }
    return state;
  }
}