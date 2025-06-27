import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage, PowerType, GameError, PokemonCardList, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Pichu extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BABY];
  public cardType: CardType = L;
  public hp: number = 30;
  public retreat = [];

  public powers = [{
    name: 'Baby Rule',
    powerType: PowerType.BABY_RULE,
    text: 'If this Baby Pokémon is your Active Pokémon and your opponent tries to attack, your opponent flips a coin (before doing anything required in order to use that attack). If tails, your opponent\'s turn ends without an attack.'
  },
  {
    name: 'Evolves into Pikachu',
    powerType: PowerType.TRAINER_ABILITY,
    useWhenInPlay: true,
    text: 'Put Pikachu on the Baby Pokémon'
  }];

  public attacks = [{
    name: 'Zzzap',
    cost: [C],
    damage: 0,
    text: 'Does 20 damage to each Pokémon in play that has a Pokémon Power. Don\'t apply Weakness and Resistance.'
  }];

  public set: string = 'N1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';
  public name: string = 'Pichu';
  public fullName: string = 'Pichu N1';

  public readonly BABY_MARKER = 'BABY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Baby Rule effect
    if (effect instanceof UseAttackEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        store.reduceEffect(state, new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.BABY_RULE,
          text: ''
        }, this));
      } catch {
        return state;
      }

      // avoids recursion
      if (HAS_MARKER(this.BABY_MARKER, effect.player)) {
        return state;
      }
      ADD_MARKER(this.BABY_MARKER, effect.player, this);

      if (opponent.active.getPokemonCard() === this) {
        effect.preventDefault = true;

        COIN_FLIP_PROMPT(store, state, player, result => {
          if (!result) {
            const endTurnEffect = new EndTurnEffect(player);
            store.reduceEffect(state, endTurnEffect);
          } else {
            const useAttackEffect = new UseAttackEffect(player, effect.attack);
            store.reduceEffect(state, useAttackEffect);
          }
        });
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.BABY_MARKER, this);

    // Evolve into Pikachu
    if (WAS_POWER_USED(effect, 1, this)) {
      const player = effect.player;
      const hasPikachu = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Pikachu');

      // Check if Pikachu is in the player's hand
      if (!hasPikachu) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Blocking pokemon cards, that cannot be valid evolutions
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Pikachu') {
          blocked.push(index);
        }
      });

      let selectedCards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: true, blocked }
      ), selected => {
        selectedCards = selected || [];

        const evolution = selectedCards[0] as PokemonCard;

        const target = StateUtils.findCardList(state, this);

        // Evolve Pokemon
        player.hand.moveCardTo(evolution, target);
        const pokemonTarget = target as PokemonCardList;
        pokemonTarget.clearEffects();
        pokemonTarget.pokemonPlayedTurn = state.turn;

        // Heal all damage from the evolved Pokemon
        const healEffect = new HealEffect(player, pokemonTarget, pokemonTarget.damage);
        store.reduceEffect(state, healEffect);

        return state;
      });
    }

    // Zzzap
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check both players' Pokémon for Poké-Powers/Bodies
      [player, opponent].forEach(currentPlayer => {
        // Check active Pokémon
        const activeCard = currentPlayer.active.getPokemonCard();
        if (activeCard) {
          const stubPowerEffect = new PowerEffect(currentPlayer, {
            name: 'test',
            powerType: PowerType.POKEMON_POWER,
            text: ''
          }, activeCard);

          try {
            store.reduceEffect(state, stubPowerEffect);
            if (activeCard.powers.length) {
              // Apply 20 damage without Weakness/Resistance
              const damageEffect = new PutDamageEffect(effect, 20);
              damageEffect.target = currentPlayer.active;
              store.reduceEffect(state, damageEffect);
            }
          } catch {
            return state;
          }
        }

        // Check bench Pokémon
        currentPlayer.bench.forEach(bench => {
          const benchCard = bench.getPokemonCard();
          if (benchCard) {
            const stubPowerEffect = new PowerEffect(currentPlayer, {
              name: 'test',
              powerType: PowerType.POKEMON_POWER,
              text: ''
            }, benchCard);

            try {
              store.reduceEffect(state, stubPowerEffect);
              if (benchCard.powers.length) {
                // Apply 20 damage without Weakness/Resistance
                const damageEffect = new PutDamageEffect(effect, 20);
                damageEffect.target = bench;
                store.reduceEffect(state, damageEffect);
              }
            } catch {
              return state;
            }
          }
        });
      });

      return state;
    }

    return state;
  }
}
