import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, GamePhase, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, MOVE_CARDS, TAKE_X_PRIZES, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class HoOh extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Phoenix Turn',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your opponent\'s turn, if Ho-Oh would be Knocked Out by damage from an attack, you may flip a coin. If heads, Ho-Oh isn\'t discarded. Instead, remove all damage counters, Special Conditions, and other effects from Ho-Oh. Then, discard all cards attached to Ho-Oh (except for Energy cards). This counts as Ho-Oh being Knocked Out and your opponent takes a Prize card.'
  }];

  public attacks = [{
    name: 'Rainbow Wing',
    cost: [C, C, C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage times the number of different types of basic Energy cards attached to Ho-Oh.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Ho-Oh';
  public fullName: string = 'Ho-Oh SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Phoenix Turn
    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      if (state.players[state.activePlayer] !== opponent) {
        return state;
      }
      if (!player.marker.hasMarker(player.DAMAGE_DEALT_MARKER)) {
        return state;
      }
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Block engine discard until the player resolves the prompt
      effect.preventDefault = true;

      const discardAsNormalKo = () => {
        effect.preventDefault = false;
        const target = effect.target;
        const pokemons = target.getPokemons();
        const tools = [...target.tools];
        const otherCards = target.cards.filter(
          c => !(c instanceof PokemonCard) && !pokemons.includes(c as PokemonCard) && !tools.includes(c)
        );
        if (otherCards.length > 0) {
          MOVE_CARDS(store, state, target, player.discard, { cards: otherCards, sourceCard: this });
        }
        for (const tool of tools) {
          MOVE_CARDS(store, state, target, player.discard, { cards: [tool], sourceCard: this });
        }
        if (pokemons.length > 0) {
          MOVE_CARDS(store, state, target, player.discard, { cards: pokemons, sourceCard: this });
        }
      };

      const applyPhoenixTurn = () => {
        const target = effect.target;
        const prizeCount = Math.max(1, effect.prizeCount);
        TAKE_X_PRIZES(store, state, opponent, prizeCount);

        const tools = [...target.tools];
        for (const tool of tools) {
          MOVE_CARDS(store, state, target, player.discard, { cards: [tool], sourceCard: this });
        }
        const toDiscard = target.cards.filter(
          c => !(c instanceof PokemonCard) && !(c instanceof EnergyCard) && !target.tools.includes(c)
        );
        if (toDiscard.length > 0) {
          MOVE_CARDS(store, state, target, player.discard, { cards: toDiscard, sourceCard: this });
        }

        target.damage = 0;
        target.clearEffects();
      };

      return CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          discardAsNormalKo();
          return;
        }
        COIN_FLIP_PROMPT(store, state, player, heads => {
          if (!heads) {
            discardAsNormalKo();
            return;
          }
          applyPhoenixTurn();
        });
      });
    }

    // Rainbow Wing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const uniqueTypes = new Set<CardType>();
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);

      checkEnergy.energyMap.forEach(em => {
        if (em.card instanceof EnergyCard && em.card.energyType === EnergyType.BASIC) {
          em.provides.forEach(type => {
            if (type !== CardType.COLORLESS && type !== CardType.ANY) {
              uniqueTypes.add(type);
            } else if (type === CardType.COLORLESS) {
              uniqueTypes.add(CardType.COLORLESS);
            }
          });
        }
      });

      effect.damage = 20 * uniqueTypes.size;
    }

    return state;
  }
}
