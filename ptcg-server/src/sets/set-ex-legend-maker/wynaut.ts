import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage, PowerType, GameError, PokemonCardList, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Wynaut extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may put Wobbuffet from your hand onto Wynaut (this counts as evolving Wynaut) and remove all damage counters from Wynaut.'
  }];

  public attacks = [{
    name: 'Confusion Wave',
    cost: [C],
    damage: 0,
    text: 'Both Wynaut and the Defending Pokémon are now Confused.'
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Wynaut';
  public fullName: string = 'Wynaut LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasWobbuffet = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Wobbuffet');

      // Check if Wobbuffet is in the player's hand
      if (!hasWobbuffet) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Blocking pokemon cards, that cannot be valid evolutions
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Wobbuffet') {
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

    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }

    return state;
  }
}
