import { COIN_FLIP_PROMPT, IS_POKEMON_POWER_BLOCKED, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PowerType, State, StoreLike } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Moltres extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 100;
  public weakness = [];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Firegiver',
    powerType: PowerType.POKEMON_POWER,
    text: 'When you put Moltres into play during your turn (not during set-up), put from 1 to 4 (chosen at random) Fire Energy cards from your deck into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Dive Bomb',
    cost: [R, R, R],
    damage: 70,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'GB1';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'P02';
  public name: string = 'Moltres';
  public fullName: string = 'Moltres GB1';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && !IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const randomCount = Math.floor(Math.random() * 4) + 1;
      const fireEnergyInDeck = player.deck.cards.filter(card =>
        card.superType === SuperType.ENERGY && card.name === 'Fire Energy'
      ).length;
      const cardsToTake = Math.min(randomCount, fireEnergyInDeck);

      SEARCH_DECK_FOR_CARDS_TO_HAND(
        store,
        state,
        player,
        this,
        { superType: SuperType.ENERGY, name: 'Fire Energy' },
        { min: cardsToTake, max: cardsToTake }
      );
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}