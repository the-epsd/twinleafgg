import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ConfirmPrompt, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PowerEffect } from '../../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Alakazam extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Kadabra';
  public hp: number = 100;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +30 }];
  public retreat = [C];

  public powers = [{
    name: 'Power Cancel',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your opponent\'s turn, when your opponent\'s Pokémon uses any Poké-Power, you may discard 2 cards from your hand and prevent all effects of that Poké-Power. (This counts as that Pokémon using its Poké-Power.) This power can\'t be used if Alakazam is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Psychic Guard',
    cost: [P, P, C],
    damage: 50,
    text: 'During your opponent\'s next turn, any damage done to Alakazam by attacks from your opponent\'s Stage 2 Evolved Pokémon is reduced by 30 (after applying Weakness and Resistance).'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Alakazam';
  public fullName: string = 'Alakazam MT';

  public readonly POWER_CANCEL_MARKER = 'POWER_CANCEL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Clear once-per-opponent-turn marker at end of that opponent's turn
    if (effect instanceof EndTurnEffect && HAS_MARKER(this.POWER_CANCEL_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.POWER_CANCEL_MARKER, effect.player, this);
    }

    // Power Cancel — react when opponent uses a Poké-Power
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      // Ignore synthetic probe effects
      if (!effect.card.powers.includes(effect.power)) {
        return state;
      }
      // Don't cancel our own Power Cancel recursion probes
      if (effect.card === this) {
        return state;
      }

      const powerUser = effect.player;
      const alakazamOwner = StateUtils.getOpponent(state, powerUser);

      let isInPlay = false;
      let alakazamList = alakazamOwner.active;
      alakazamOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isInPlay = true;
          alakazamList = cardList;
        }
      });

      if (!isInPlay) {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, alakazamOwner, this)) {
        return state;
      }
      if (alakazamList.specialConditions.length > 0) {
        return state;
      }
      if (HAS_MARKER(this.POWER_CANCEL_MARKER, powerUser, this)) {
        return state;
      }
      if (alakazamOwner.hand.cards.length < 2) {
        return state;
      }

      // Ask Alakazam's owner whether to cancel
      return store.prompt(state, new ConfirmPrompt(
        alakazamOwner.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToCancel => {
        if (!wantToCancel) {
          return;
        }

        store.prompt(state, new ChooseCardsPrompt(
          alakazamOwner,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          alakazamOwner.hand,
          {},
          { min: 2, max: 2, allowCancel: true }
        ), selected => {
          const cards = selected || [];
          if (cards.length < 2) {
            return;
          }

          MOVE_CARDS(store, state, alakazamOwner.hand, alakazamOwner.discard, {
            cards,
            sourceCard: this,
          });
          ADD_MARKER(this.POWER_CANCEL_MARKER, powerUser, this);
          ABILITY_USED(alakazamOwner, this);
          // Counts as the Pokémon using its Poké-Power; prevent its effects
          effect.preventDefault = true;
        });
      });
    }

    // Psychic Guard
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
      effect.player.active.damageReductionNextTurnFilter = { sourceStage: Stage.STAGE_2 };
    }

    return state;
  }
}
