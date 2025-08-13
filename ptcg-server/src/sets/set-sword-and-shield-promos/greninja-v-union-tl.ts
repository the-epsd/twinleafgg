import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, CardTarget, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, ShowCardsPrompt, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GreninjaVUNIONTopRight } from './greninja-v-union-tr';
import { GreninjaVUNIONBottomLeft } from './greninja-v-union-bl';
import { GreninjaVUNIONBottomRight } from './greninja-v-union-br';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class GreninjaVUNIONTopLeft extends PokemonCard {
  public stage: Stage = Stage.VUNION;
  public tags = [CardTag.POKEMON_VUNION];
  public cardType: CardType = W;
  public hp: number = 300;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Greninja V-UNION Assembly',
      text: 'Once per game during your turn, combine 4 different Greninja V-UNION from your discard pile and put them onto your bench.',
      useFromDiscard: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.VUNION_ASSEMBLY,
    },
    {
      name: 'Ninja Body',
      text: 'Whenever your opponent plays an Item card from their hand, prevent all effects of that card done to this Pokémon.',
      powerType: PowerType.ABILITY
    },
    {
      name: 'Antidote Jutsu',
      text: 'This Pokémon can\'t be Poisoned.',
      powerType: PowerType.ABILITY
    },
    {
      name: 'Feel the Way',
      text: 'Once during your turn, you may have your opponent reveal their hand.',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY
    }
  ];

  public attacks = [
    {
      name: 'Union Gain',
      cost: [C],
      damage: 0,
      text: 'Attach up to 2 [W] Energy cards from your discard pile to this Pokémon.'
    },
    {
      name: 'Aqua Edge',
      cost: [W],
      damage: 130,
      text: ''
    },
    {
      name: 'Twister Shuriken',
      cost: [W, W, C],
      damage: 0,
      text: 'This attack does 100 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Waterfall Bind',
      cost: [W, W, C],
      damage: 180,
      text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
    }
  ];

  public set: string = 'SWSH';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '155';
  public name: string = 'Greninja V-UNION';
  public fullName: string = 'Greninja V-UNION (Top Left) SWSH';

  public readonly WATERFALL_BIND_MARKER = 'WATERFALL_BIND_MARKER';
  public readonly FEEL_THE_WAY_MARKER = 'FEEL_THE_WAY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // assemblin the v-union
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.assembledVUNIONs.includes(this.name)) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let topLeftPiece = false;
      let topRightPiece = false;
      let bottomLeftPiece = false;
      let bottomRightPiece = false;
      player.discard.cards.forEach(card => {
        if (card instanceof GreninjaVUNIONTopLeft) { topLeftPiece = true; }
        if (card instanceof GreninjaVUNIONTopRight) { topRightPiece = true; }
        if (card instanceof GreninjaVUNIONBottomLeft) { bottomLeftPiece = true; }
        if (card instanceof GreninjaVUNIONBottomRight) { bottomRightPiece = true; }
      });

      if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
        if (slots.length > 0) {
          player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONTopRight) { player.discard.moveCardTo(card, slots[0]); } });
          player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONBottomLeft) { player.discard.moveCardTo(card, slots[0]); } });
          player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONBottomRight) { player.discard.moveCardTo(card, slots[0]); } });
          // gotta make sure the actual mon ends up on top
          player.discard.cards.forEach(card => { if (card instanceof GreninjaVUNIONTopLeft) { player.discard.moveCardTo(card, slots[0]); } });
          player.assembledVUNIONs.push(this.name);
          slots[0].pokemonPlayedTurn = state.turn;
        }
      } else {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    // Ninja Body
    if (effect instanceof PlayItemEffect && effect.target && effect.target.cards.includes(this)) {
      /*const player = StateUtils.findOwner(state, effect.target);

      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }*/

      // effect.preventDefault = true;
    }

    // Antidote Jutsu
    if (effect instanceof AddSpecialConditionsEffect && effect.target.cards.includes(this) && effect.specialConditions.includes(SpecialCondition.POISONED)) {
      effect.preventDefault = true;
    }

    // Feel the Way
    if (effect instanceof PowerEffect && effect.power === this.powers[3]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (this.marker.hasMarker(this.FEEL_THE_WAY_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (opponent.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_EFFECT,
        opponent.hand.cards,
      ), () => { });

      this.marker.addMarker(this.FEEL_THE_WAY_MARKER, this);
      player.marker.addMarker(this.FEEL_THE_WAY_MARKER, this);
    }

    // Union Gain
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let watersInDiscard = 0;
      // checking for energies in the discard
      player.discard.cards.forEach(card => {
        if (card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Water Energy') {
          watersInDiscard++;
        }
      });

      if (watersInDiscard > 0) {
        const blocked: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
          if (card !== this) {
            blocked.push(target);
          }
        });

        state = store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          player.discard,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
          { allowCancel: false, min: 0, max: Math.min(2, watersInDiscard), blockedTo: blocked }
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

    // Twister Shuriken
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const opponent = effect.opponent;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (target.slot === SlotType.BENCH) {
          const damage = new PutDamageEffect(effect, 100);
          damage.target = cardList;
          store.reduceEffect(state, damage);
        }
      });
    }

    // Waterfall Bind
    if (WAS_ATTACK_USED(effect, 3, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.FEEL_THE_WAY_MARKER, this)) {
      effect.player.marker.removeMarker(this.FEEL_THE_WAY_MARKER, this);
      this.marker.removeMarker(this.FEEL_THE_WAY_MARKER, this);
    }

    return state;
  }
}