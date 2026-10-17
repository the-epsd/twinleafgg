import { ChooseCardsPrompt, GameError, GameMessage, PokemonCard, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Chingling extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Baby Evolution',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may put Chimecho from your hand onto Chingling (this counts as evolving Chingling) and remove all damage counters from Chingling.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Uproar',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Chingling';
  public fullName: string = 'Chingling MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Baby Evolution
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEvolution = player.hand.cards.some(card => card instanceof PokemonCard && card.name === 'Chimecho');
      if (!hasEvolution) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const blocked: number[] = [];
      player.hand.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.name !== 'Chimecho') {
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

    // Uproar
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_EACH_OF_YOUR_OPPONENTS_POKEMON(10, effect, store, state);
    }

    return state;
  }
}
