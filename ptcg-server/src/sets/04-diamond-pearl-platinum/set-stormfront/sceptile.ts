import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { Card, CardTarget, GameError, GameMessage, MoveEnergyPrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { BLOCK_IF_HAS_SPECIAL_CONDITION, HEAL_X_DAMAGE_FROM_THIS_POKEMON, IS_POKEPOWER_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Sceptile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Grovyle';
  public hp: number = 110;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Energy Trans',
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), move a Grass Energy card attached to 1 of your Pokémon to another of your Pokémon. This power can\'t be used if Sceptile is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Poison Leaf',
    cost: [C, C],
    damage: 40,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Slice Drain',
    cost: [G, G, C, C],
    damage: 60,
    text: 'Remove 2 damage counters from Sceptile.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Sceptile';
  public fullName: string = 'Sceptile SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Trans
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergy);
      const blockedCards: Card[] = [];
      checkProvidedEnergy.energyMap.forEach(em => {
      if (!em.provides.includes(CardType.GRASS) && !em.provides.includes(CardType.ANY)) {
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
      if (blocked.length !== 0) {
      blockedMap.push({ source: target, blocked });
      }
      });
      store.prompt(state, new MoveEnergyPrompt(
      effect.player.id,
      GameMessage.MOVE_ENERGY_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [SlotType.BENCH, SlotType.ACTIVE],
      {},
      { allowCancel: true, blockedMap }
      ), transfers => {
      if (transfers === null) {
      return;
      }
      for (const transfer of transfers) {
      const source = StateUtils.getTarget(state, player, transfer.from);
      const target = StateUtils.getTarget(state, player, transfer.to);
      MOVE_CARDS(store, state, source, target, { cards: [transfer.card], sourceCard: this });
      }
      });
    }

    // Poison Leaf
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    // Slice Drain
    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 20);
    }

    return state;
  }
}
