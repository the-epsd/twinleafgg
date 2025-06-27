import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage, PowerType, GameError, PokemonCardList, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, COIN_FLIP_PROMPT, DRAW_CARDS, HAS_MARKER, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Cleffa extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.BABY];
  public cardType: CardType = C;
  public hp: number = 30;
  public retreat = [];

  public powers = [{
    name: 'Baby Rule',
    powerType: PowerType.BABY_RULE,
    text: 'If this Baby Pokémon is your Active Pokémon and your opponent tries to attack, your opponent flips a coin (before doing anything required in order to use that attack). If tails, your opponent\'s turn ends without an attack.'
  },
  {
    name: 'Evolves into Clefairy',
    powerType: PowerType.BABY_RULE,
    useWhenInPlay: true,
    text: 'Put Clefairy on the Baby Pokémon'
  }];

  public attacks = [{
    name: 'Eeeeeeek',
    cost: [C],
    damage: 0,
    text: 'Shuffle your hand into your deck, then draw 7 cards.'
  }];

  public set: string = 'N1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Cleffa';
  public fullName: string = 'Cleffa N1';

  public readonly BABY_MARKER = 'BABY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Baby Rule effect
    if (effect instanceof UseAttackEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

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

    // Evolve into Clefairy
    if (WAS_POWER_USED(effect, 1, this)) {
      const player = effect.player;
      const hasClefairy = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Clefairy');

      // Check if Clefairy is in the player's hand
      if (!hasClefairy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Blocking pokemon cards, that cannot be valid evolutions
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Clefairy') {
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

    // Eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeek
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MOVE_CARDS(store, state, player.hand, player.deck);
      SHUFFLE_DECK(store, state, player);
      DRAW_CARDS(player, 7);
    }

    return state;
  }
}
