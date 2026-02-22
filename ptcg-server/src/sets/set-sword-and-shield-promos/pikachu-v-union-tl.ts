import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, CardTarget, CoinFlipPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PikachuVUNIONTopRight } from './pikachu-v-union-tr';
import { PikachuVUNIONBottomLeft } from './pikachu-v-union-bl';
import { PikachuVUNIONBottomRight } from './pikachu-v-union-br';
import { PlayItemEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class PikachuVUNIONTopLeft extends PokemonCard {
  public stage: Stage = Stage.VUNION;
  public tags = [CardTag.POKEMON_VUNION];
  public cardType: CardType = L;
  public hp: number = 300;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'Pikachu V-UNION Assembly',
      text: 'Once per game during your turn, combine 4 different Pikachu V-UNION from your discard pile and put them onto your bench.',
      useFromDiscard: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.VUNION_ASSEMBLY,
    }
  ];

  public attacks = [
    {
      name: 'Union Gain',
      cost: [C],
      damage: 0,
      text: 'Attach up to 2 [L] Energy cards from your discard pile to this Pokémon.'
    },
    {
      name: 'Shocking Shock',
      cost: [L, C],
      damage: 120,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Disconnect',
      cost: [L, L, C],
      damage: 150,
      text: 'During your opponent\'s next turn, they can\'t play any Item cards from their hand.'
    },
    {
      name: 'Electro Ball Together',
      cost: [L, L, C],
      damage: 250,
      text: ''
    }
  ];

  public set: string = 'SWSH';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '139';
  public name: string = 'Pikachu V-UNION';
  public fullName: string = 'Pikachu V-UNION (Top Left) SWSH';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // assemblin the v-union
    if (WAS_POWER_USED(effect, 0, this)) {
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
        if (card instanceof PikachuVUNIONTopLeft) { topLeftPiece = true; }
        if (card instanceof PikachuVUNIONTopRight) { topRightPiece = true; }
        if (card instanceof PikachuVUNIONBottomLeft) { bottomLeftPiece = true; }
        if (card instanceof PikachuVUNIONBottomRight) { bottomRightPiece = true; }
      });

      if (topLeftPiece && topRightPiece && bottomLeftPiece && bottomRightPiece) {
        if (slots.length > 0) {
          player.discard.cards.forEach(card => { if (card instanceof PikachuVUNIONTopRight) { player.discard.moveCardTo(card, slots[0]); } });
          player.discard.cards.forEach(card => { if (card instanceof PikachuVUNIONBottomLeft) { player.discard.moveCardTo(card, slots[0]); } });
          player.discard.cards.forEach(card => { if (card instanceof PikachuVUNIONBottomRight) { player.discard.moveCardTo(card, slots[0]); } });
          // gotta make sure the actual mon ends up on top
          player.discard.cards.forEach(card => { if (card instanceof PikachuVUNIONTopLeft) { player.discard.moveCardTo(card, slots[0]); } });
          player.assembledVUNIONs.push(this.name);
          slots[0].pokemonPlayedTurn = state.turn;
        }
      } else {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    // Union Gain
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let lightningsInDiscard = 0;
      // checking for energies in the discard
      player.discard.cards.forEach(card => {
        if (card instanceof EnergyCard && card.energyType === EnergyType.BASIC && card.name === 'Lightning Energy') {
          lightningsInDiscard++;
        }
      });

      if (lightningsInDiscard > 0) {
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
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
          { allowCancel: false, min: 0, max: Math.min(2, lightningsInDiscard), blockedTo: blocked }
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

    // Shocking Shock
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          return store.reduceEffect(state, specialCondition);
        }
      });
    }

    // Disconnect
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    if (effect instanceof PlayItemEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this)) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    return state;
  }
}