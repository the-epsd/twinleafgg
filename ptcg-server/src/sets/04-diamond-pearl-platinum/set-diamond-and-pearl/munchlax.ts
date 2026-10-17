import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { MOVE_CARDS, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Munchlax extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may put Snorlax from your hand onto Munchlax (this counts as evolving Munchlax) and remove all damage counters from Munchlax.'
  }];

  public attacks = [{
    name: 'Heave',
    cost: [C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Discard 2 cards from your hand. (If you can\'t discard 2 cards, this attack does nothing.) Flip 2 coins. This attack does 30 damage times the number of heads.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Munchlax';
  public fullName: string = 'Munchlax DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasSnorlax = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Snorlax');

      if (!hasSnorlax) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Snorlax') {
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
        if (selectedCards.length === 0) {
          return;
        }

        const evolution = selectedCards[0] as PokemonCard;
        const target = StateUtils.findCardList(state, this);

        MOVE_CARDS(store, state, player.hand, target, { cards: [evolution], sourceCard: this });
        const pokemonTarget = target as PokemonCardList;
        pokemonTarget.clearEffects();
        pokemonTarget.pokemonPlayedTurn = state.turn;

        const healEffect = new HealEffect(player, pokemonTarget, pokemonTarget.damage);
        store.reduceEffect(state, healEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length < 2) {
        effect.damage = 0;
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: false, min: 2, max: 2 }
      ), cards => {
        cards = cards || [];
        if (cards.length !== 2) {
          effect.damage = 0;
          return;
        }
        MOVE_CARDS(store, state, player.hand, player.discard, {
          cards,
          sourceCard: this,
          sourceEffect: this.attacks[0]
        });
        MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
          effect.damage = 30 * results.filter(r => r).length;
        });
      });
    }

    return state;
  }
}
