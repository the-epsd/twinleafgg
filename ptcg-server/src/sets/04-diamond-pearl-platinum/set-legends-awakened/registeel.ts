import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, Card, ChooseCardsPrompt, ChooseEnergyPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Registeel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Regi Heal',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may discard 2 cards from your hand. Then, remove 3 damage counters from Registeel. This power can\'t be used if Registeel is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Rotating Claws',
    cost: [M, C, C],
    damage: 50,
    text: 'You may discard an Energy card attached to Registeel. If you do, search your discard pile for an Energy card (excluding the one you discarded) and attach it to Registeel.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Registeel';
  public fullName: string = 'Registeel LA';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Regi Heal
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (player.hand.cards.length < 2) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 2, max: 2 },
      ), cards => {
        cards = cards || [];
        if (cards.length < 2) {
          return;
        }
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
        const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
        const healEffect = new HealEffect(player, cardList, 30);
        store.reduceEffect(state, healEffect);
      });
      return state;
    }

    // Rotating Claws
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);
      if (checkProvidedEnergy.energyMap.length === 0) {
        return state;
      }
      CONFIRMATION_PROMPT(
        store,
        state,
        player,
        (result) => {
          if (!result) {
            return;
          }
          state = store.prompt(
            state,
            new ChooseEnergyPrompt(
              player.id,
              GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
              checkProvidedEnergy.energyMap,
              [CardType.COLORLESS],
              { allowCancel: false },
            ),
            (energy) => {
              const cards: Card[] = (energy || []).map((e) => e.card);
              if (cards.length === 0) {
                return;
              }
              const discarded = cards[0];
              const discardEnergy = new DiscardCardsEffect(effect, cards);
              discardEnergy.target = player.active;
              store.reduceEffect(state, discardEnergy);
              const blocked: number[] = [];
              player.discard.cards.forEach((card, index) => {
                if (card === discarded || card.superType !== SuperType.ENERGY) {
                  blocked.push(index);
                }
              });
              const hasOtherEnergy = player.discard.cards.some(
                (card, index) => !blocked.includes(index),
              );
              if (!hasOtherEnergy) {
                return;
              }
              state = store.prompt(
                state,
                new AttachEnergyPrompt(
                  player.id,
                  GameMessage.ATTACH_ENERGY_TO_ACTIVE,
                  player.discard,
                  PlayerType.BOTTOM_PLAYER,
                  [SlotType.ACTIVE],
                  { superType: SuperType.ENERGY },
                  { allowCancel: false, min: 1, max: 1, blocked },
                ),
                (transfers) => {
                  transfers = transfers || [];
                  if (transfers.length === 0) {
                    return;
                  }
                  for (const transfer of transfers) {
                    const target = StateUtils.getTarget(state, player, transfer.to);
                    MOVE_CARDS(store, state, player.discard, target, {
                      cards: [transfer.card],
                      sourceCard: this,
                      sourceEffect: this.attacks[0],
                    });
                  }
                },
              );
            },
          );
        },
        GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK,
      );
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
