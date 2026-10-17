import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, SpecialCondition, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameError, GameMessage, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AbstractAttackEffect } from '../../../game/store/effects/attack-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { IS_POKEBODY_BLOCKED, MOVE_CARDS, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Budew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType[] = [P];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Poison Enzyme',
    powerType: PowerType.POKEBODY,
    text: 'Prevent all effects of attacks, including damage, done to Budew by your opponent\'s Poisoned Pokémon.'
  },
  {
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may put Roselia from your hand onto Budew (this counts as evolving Budew) and remove all damage counters from Budew.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Buddy-buddy',
    cost: [],
    damage: 0,
    text: 'Search your deck for a Pokémon, show it to your opponent, and put it into your hand. Shuffle your deck afterward.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '33';
  public name: string = 'Budew';
  public fullName: string = 'Budew SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Poison Enzyme
    if (effect instanceof AbstractAttackEffect && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      const attackerOwner = StateUtils.findOwner(state, effect.source);
      if (owner === attackerOwner) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (effect.source.specialConditions.includes(SpecialCondition.POISONED)) {
        effect.preventDefault = true;
      }
    }

    // Baby Evolution
    if (WAS_POWER_USED(effect, 1, this)) {
      const player = effect.player;
      const hasEvolution = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Roselia');
      if (!hasEvolution) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Roselia') {
          blocked.push(index);
        }
      });
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON },
        { min: 1, max: 1, allowCancel: true, blocked }
      ), selected => {
        const selectedCards = selected || [];
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

    // Buddy-buddy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, effect.player);
    }

    return state;
  }
}
