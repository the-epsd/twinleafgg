import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, CardTarget, ConfirmPrompt, EnergyCard, GameError, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_IF_HAS_SPECIAL_CONDITION, IS_POKEPOWER_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';

export class Electivire extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electabuzz';
  public hp: number = 100;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: 20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Intense Voltage',
    powerType: PowerType.POKEPOWER,
    text: 'As often as you like during your turn (before your attack), if Elekid is anywhere under Electivire, you may move a Lightning Energy attached to your Pokémon to Electivire. This power can\'t be used if Electivire is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Giga Impact',
    cost: [L, L, L, C],
    damage: 60,
    text: 'You may discard all Lightning Energy attached to Electivire. If you do, this attack\'s base damage is 120 instead of 60.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Electivire';
  public fullName: string = 'Electivire DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intense Voltage
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      const hasElekid = cardList.getPokemons().some(p => p.name === 'Elekid');
      if (!hasElekid) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blockedMap: { source: CardTarget; blocked: number[] }[] = [];
      const blockedTo: CardTarget[] = [];

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card !== this) {
          blockedTo.push(target);
        }

        const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, list);
        store.reduceEffect(state, checkProvidedEnergy);
        const blockedCards: Card[] = [];
        checkProvidedEnergy.energyMap.forEach(em => {
          if (!em.provides.includes(CardType.LIGHTNING) && !em.provides.includes(CardType.ANY)) {
            blockedCards.push(em.card);
          }
        });
        const blocked: number[] = [];
        blockedCards.forEach(bc => {
          const index = list.cards.indexOf(bc);
          if (index !== -1 && !blocked.includes(index)) {
            blocked.push(index);
          }
        });
        if (blocked.length !== 0) {
          blockedMap.push({ source: target, blocked });
        }
      });

      return store.prompt(state, new MoveEnergyPrompt(
        effect.player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 1, max: 1, blockedMap, blockedTo },
      ), transfers => {
        if (transfers === null) {
          return;
        }
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          MOVE_CARDS(store, state, source, cardList, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    // Giga Impact
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const lightningCards = player.active.cards.filter(c =>
        c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING)
      );

      if (lightningCards.length === 0) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK,
      ), wantToDiscard => {
        if (wantToDiscard) {
          const discardEnergy = new DiscardCardsEffect(effect, lightningCards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
          effect.damage = 120;
        }
      });
    }

    return state;
  }
}
