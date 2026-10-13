import { GameError, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { Effect } from '../../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { IS_POKEBODY_BLOCKED, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Absol extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Shining Horn',
    powerType: PowerType.POKEBODY,
    text: "As long as Absol is the only Pokémon you have in play, your opponent's Basic Pokémon can't attack.",
  }];

  public attacks = [{
    name: 'Extra Call',
    cost: [C],
    damage: 0,
    text: 'Search your deck for a Pokémon-ex, show it to your opponent, and put it into your hand. Shuffle your deck afterward.',
  },
  {
    name: 'Feint Attack',
    cost: [D, C],
    damage: 0,
    text: "Choose 1 of your opponent's Pokémon. This attack does 20 damage to that Pokémon.This attack's damage isn't affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.",
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Absol';
  public fullName: string = 'Absol LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shining Horn
    if (
      effect instanceof AttackEffect &&
      effect.source.getPokemonCard()?.stage === Stage.BASIC
    ) {
      const attackingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, attackingPlayer);

      if (IS_POKEBODY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      if (abilityOwner.active.getPokemonCard() !== this) {
        return state;
      }

      const hasBenchPokemon = abilityOwner.bench.some((b) => b.cards.length > 0);
      if (hasBenchPokemon) {
        return state;
      }

      if (!CAN_APPLY_ABILITY_TO_TARGET(
        store,
        state,
        abilityOwner,
        this.powers[0],
        this,
        attackingPlayer.active,
      )) {
        return state;
      }

      throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
    }

    // Extra Call
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const blocked: number[] = [];
      effect.player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.hasTag(CardTag.POKEMON_ex)) {
          return;
        }
        blocked.push(index);
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store,
        state,
        effect.player,
        {},
        { min: 0, max: 1, allowCancel: false, blocked },
      );
    }

    // Feint Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
