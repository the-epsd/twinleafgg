import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, PlayerType, PokemonCardList } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Latias extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: C }];
  public resistance = [{ type: P, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Dual Aura',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have Latios or Latios ex in play, each player\'s Evolved Pokémon (excluding Pokémon-ex) can\'t use any Poké-Bodies.'
  }];

  public attacks = [{
    name: 'Spearhead',
    cost: [C],
    damage: 0,
    text: 'Draw a card.'
  },
  {
    name: 'Dragon Claw',
    cost: [R, C, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'HP';
  public name: string = 'Latias';
  public fullName: string = 'Latias HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Block Poké-Bodies from evos
    if (effect instanceof PowerEffect) {
      const pokemonCard = effect.card;
      const cardList = StateUtils.findCardList(state, pokemonCard);
      const opponent = StateUtils.getOpponent(state, effect.player);

      let isLatiosInPlayPlayer = false;
      let isThisInPlayPlayer = false;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Latios' || card.name === 'Latios ex') {
          isLatiosInPlayPlayer = true;
        }
        if (card === this) {
          isThisInPlayPlayer = true;
        }
      });

      let isLatiosInPlayOpponent = false;
      let isThisInPlayOpponent = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card.name === 'Latios' || card.name === 'Latios ex') {
          isLatiosInPlayOpponent = true;
        }
        if (card === this) {
          isThisInPlayOpponent = true;
        }
      });
      // ^ there is probably a better way to do this, but I don't know it. Feel free to change it

      if ((!isLatiosInPlayPlayer || !isThisInPlayPlayer) &&
        (!isLatiosInPlayOpponent || !isThisInPlayOpponent)) {
        return state;
      }

      const isEvolved = cardList instanceof PokemonCardList && cardList.getPokemons().length > 1;
      const isPokemonEx = cardList instanceof PokemonCardList && pokemonCard.tags.includes(CardTag.POKEMON_ex);
      if (!effect.power.exemptFromAbilityLock) {
        if (isEvolved && !isPokemonEx && effect.power.powerType === PowerType.POKEPOWER) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }
    }

    // Spearhead
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(effect.player, 1);
    }

    return state;
  }

}
