import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ChoosePokemonPrompt, ConfirmPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { MOVE_CARDS, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Furret extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sentret';
  public hp: number = 90;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Keen Eye',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 2 cards and put them into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Baton Pass',
    cost: [C, C],
    damage: 40,
    text: 'You may switch Furret with 1 of your Benched Pokémon. If you do, move as many Energy cards attached to Furret as you like to the new Active Pokémon.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '27';
  public name: string = 'Furret';
  public fullName: string = 'Furret SW';

  public usedBatonPass = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Keen Eye
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, effect.player, this, {}, { min: 0, max: 2, allowCancel: true });
    }

    // Baton Pass
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedBatonPass = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedBatonPass) {
      this.usedBatonPass = false;
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON
      ), wantToSwitch => {
        if (!wantToSwitch) {
          return;
        }

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { allowCancel: false }
        ), selected => {
          const target = selected && selected[0];
          if (!target) {
            return;
          }

          const hasEnergy = player.active.cards.some(c => c.superType === SuperType.ENERGY);
          if (hasEnergy) {
            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.MOVE_ENERGY_CARDS,
              player.active,
              { superType: SuperType.ENERGY },
              { min: 0, allowCancel: false }
            ), cards => {
              const energy = cards || [];
              MOVE_CARDS(store, state, player.active, target, { cards: energy, sourceCard: this });
              player.switchPokemon(target);
            });
          } else {
            player.switchPokemon(target);
          }
        });
      });
    }

    if (effect instanceof EndTurnEffect) {
      this.usedBatonPass = false;
    }

    return state;
  }
}
