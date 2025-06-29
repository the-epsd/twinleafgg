import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, ChooseCardsPrompt, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, IS_POKEMON_POWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DarkFeraligatr extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dark Croconaw';
  public tags = [CardTag.DARK];
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Scare',
    powerType: PowerType.POKEMON_POWER,
    text: 'As long as Dark Feraligatr is your Active Pokémon, all of your opponent\'s Baby Pokémon Powers stop working and your opponent\'s Baby Pokémon can\'t attack. This power stops working while Dark Feraligatr is Asleep, Confused, or Paralyzed.'
  }];

  public attacks = [{
    name: 'Crushing Blow',
    cost: [W, W, W],
    damage: 50,
    text: 'If the Defending Pokémon has any Energy cards attached to it, flip a coin. If heads, choose 1 of those cards and discard it.'
  }];

  public set: string = 'N4';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Dark Feraligatr';
  public fullName: string = 'Dark Feraligatr N4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Baby Rule effect blocking
    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.BABY_RULE) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // is not active Pokemon
      if (opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // is affected by a special condition
      if (opponent.active.getPokemonCard() === this &&
        (opponent.active.specialConditions.includes(SpecialCondition.ASLEEP) ||
          opponent.active.specialConditions.includes(SpecialCondition.CONFUSED) ||
          opponent.active.specialConditions.includes(SpecialCondition.PARALYZED))) {
        return state;
      }

      if (IS_POKEMON_POWER_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }
    // Babies can not attack
    if (effect instanceof AttackEffect && effect.source.getPokemonCard()?.tags.includes(CardTag.BABY)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_POKEMON_POWER_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      if (opponent.active.getPokemonCard() === this &&
        opponent.active.specialConditions.includes(SpecialCondition.ASLEEP) ||
        opponent.active.specialConditions.includes(SpecialCondition.CONFUSED) ||
        opponent.active.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      if (effect.opponent.active.getPokemonCard() === this) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state; // No energy to discard
      }

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            const card = selected[0];
            if (!card) {
              return;
            }
            opponent.active.moveCardTo(card, opponent.discard);
          });
        }
      });
    }

    return state;
  }
}