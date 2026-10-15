import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, GameError, GameMessage, GamePhase, PlayerType, PokemonCardList, PowerType, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { PlaceDamageCountersEffect, PowerEffect } from '../../../game/store/effects/game-effects';
import { PlayStadiumEffect } from '../../../game/store/effects/play-card-effects';
import { NEXT_TURN_ATTACK_BONUS } from '../../../game/store/prefabs/attack-effects';
import {ABILITY_USED, WAS_ATTACK_USED, WAS_POWER_USED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

function* useStrongCharge(next: Function, store: StoreLike, state: State, effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;

  if (player.deck.cards.length === 0) {
    throw new GameError(GameMessage.CANNOT_USE_POWER);
  }

  const blocked = player.deck.cards
    .filter(c => c.name !== 'Grass Energy' && c.name !== 'Lightning Energy')
    .map(c => player.deck.cards.indexOf(c));

  yield store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.deck,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: false, min: 0, max: 2, blocked }
  ), transfers => {
    transfers = transfers || [];
    for (const transfer of transfers) {

      if (transfers.length > 1) {
        if (transfers[0].card.name === transfers[1].card.name) {
          throw new GameError(GameMessage.CAN_ONLY_SELECT_TWO_DIFFERENT_ENERGY_TYPES);
        }
      }

      const target = StateUtils.getTarget(state, player, transfer.to);
      MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: effect.card });
      next();
    }
  });
  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class Pecharunt extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Final Chain',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is Knocked Out by damage from an attack from your opponent\'s Pokémon, search your deck for a card and put it into your hand. Then, shuffle your deck.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Mochi Rush',
    cost: [D],
    damage: 20,
    text: 'During your next turn, this Pokémon\'s Mochi Rush attack does 50 more damage (before applying Weakness and Resistance).'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Pecharunt';
  public fullName: string = 'Pecharunt ASC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Final Chain
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const player = (effect as PowerEffect).player;
      const cardList = StateUtils.findCardList(state, this);
      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
      if (benchIndex === -1) {
      throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      player.bench[benchIndex].clearEffects();
      effect instanceof PlayStadiumEffect && effect.card == this; {
      if (state.phase == GamePhase.ATTACK) {
      const opponent = StateUtils.getOpponent(state, player);
      store.reduceEffect(
      state,
      new PlaceDamageCountersEffect(player, opponent.active, 10, this, this.powers[0]),
      );
      opponent.bench.forEach(b => {
      if (b.cards.length > 0) {
      store.reduceEffect(
      state,
      new PlaceDamageCountersEffect(player, b, 10, this, this.powers[0]),
      );
      }
      });
      }
      if (effect instanceof PlayStadiumEffect && effect.card !== this) {
      MOVE_CARDS(store, state, effect.player.stadium, effect.player.hand, { sourceCard: this });
      return state;
      }
      return state;
      }
      return state;
      const generator = useStrongCharge(() => generator.next(), store, state, effect);
      ABILITY_USED(effect.player, this);
      return generator.next().value;
      // TODO unmatched: "If this Pokemon is Knocked Out by damage from an attack from your opponent's Pokemon, search your deck for a card and put it into your hand."
      return state;
    }

    // Mochi Rush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      // Attack 1: Leaf Wallop
          // Ref: set-celestial-storm/metagross.ts (Meteor Mash - NEXT_TURN_ATTACK_BONUS)
          NEXT_TURN_ATTACK_BONUS(effect, {
      attack: this.attacks[0],
      source: this,
      bonusDamage: 50,
      bonusMarker: this.LEAF_WALLOP_MARKER,
      clearMarker: this.LEAF_WALLOP_CLEAR_MARKER
          });
          return state;
    }

    return state;
  }
}
