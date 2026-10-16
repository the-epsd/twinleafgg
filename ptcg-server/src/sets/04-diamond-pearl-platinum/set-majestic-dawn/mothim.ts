import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, MoveEnergyPrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { AFTER_ATTACK, CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

const WORMADAM_NAMES = new Set([
  'Wormadam Plant Cloak',
  'Wormadam Sandy Cloak',
  'Wormadam Trash Cloak',
]);

export class Mothim extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Burmy';
  public hp: number = 80;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +20 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Disturbance Scales',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done by attacks from your Pokémon to the Defending Pokémon isn\'t affected by Resistance.'
  }];

  public attacks = [{
    name: 'Get Help',
    cost: [G],
    damage: 30,
    damageCalculation: 'x',
    text: 'Does 30 damage times the number of different types of Wormadam on your Bench.'
  },
  {
    name: 'Quick Touch',
    cost: [G, C],
    damage: 40,
    text: 'You may switch Mothim with 1 of your Benched Pokémon. If you do, move as many Energy cards attached to Mothim as you like to the new Active Pokémon.'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Mothim';
  public fullName: string = 'Mothim MD';

  public pendingQuickTouch = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Disturbance Scales
    if (effect instanceof AttackEffect) {
      const player = effect.player;
      let hasMothim = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
        if (card === this) {
          hasMothim = true;
        }
      });
      if (!hasMothim || IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }
      effect.ignoreResistance = true;
    }

    // Get Help
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const wormadamTypes = new Set<string>();
      player.bench.forEach(bench => {
        const card = bench.getPokemonCard();
        if (card && WORMADAM_NAMES.has(card.name)) {
          wormadamTypes.add(card.name);
        }
      });
      effect.damage = 30 * wormadamTypes.size;
    }

    // Quick Touch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }
      CONFIRMATION_PROMPT(store, state, player, wantToSwitch => {
        if (wantToSwitch) {
          this.pendingQuickTouch = true;
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    if (AFTER_ATTACK(effect, 1, this) && this.pendingQuickTouch) {
      this.pendingQuickTouch = false;
      const player = effect.player;
      const mothimSlot = StateUtils.findPokemonSlot(state, this);
      if (!mothimSlot) {
        return state;
      }

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false, min: 1, max: 1 },
      ), selected => {
        if (!selected || selected.length === 0) {
          return;
        }
        player.switchPokemon(selected[0], store, state);

        const hasEnergy = mothimSlot.cards.some(c => c.superType === SuperType.ENERGY);
        if (!hasEnergy) {
          return;
        }

        const blockedFrom: CardTarget[] = [];
        const blockedTo: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, _card, target) => {
          if (list !== mothimSlot) {
            blockedFrom.push(target);
          }
          if (target.slot !== SlotType.ACTIVE) {
            blockedTo.push(target);
          }
        });

        store.prompt(state, new MoveEnergyPrompt(
          player.id,
          GameMessage.MOVE_ENERGY_CARDS,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { superType: SuperType.ENERGY },
          { allowCancel: true, min: 0, blockedFrom, blockedTo },
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
      });
    }

    if (effect instanceof EndTurnEffect) {
      this.pendingQuickTouch = false;
    }

    return state;
  }
}
