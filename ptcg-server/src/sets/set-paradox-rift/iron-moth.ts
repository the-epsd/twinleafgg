import { BoardEffect, CardTag, CardTarget, CardType, EnergyCard, EnergyType, GameError, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class IronMoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 130;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public tags = [CardTag.FUTURE];

  public powers = [{
    name: 'Thermal Reactor',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may move any amount of [R] Energy from your other Pokémon to it.'
  }];

  public attacks = [{
    name: 'Heat Ray',
    cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
    damage: 120,
    text: 'During your next turn, this Pokémon can\'t use Heat Ray.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public name: string = 'Iron Moth';
  public fullName: string = 'Iron Moth PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

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
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
          { allowCancel: true, blockedTo: blockedTo, blockedFrom: blockedFrom }
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

          player.marker.addMarker(this.ABILITY_USED_MARKER, this);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });
        });
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
    }

    return state;
  }

}
