import { EnergyCard, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

export class XerneasBREAK extends PokemonCard {
  public stage: Stage = Stage.BREAK;
  public tags = [ CardTag.BREAK ];
  public evolvesFrom = 'Xerneas';
  public cardType: CardType = Y;
  public hp: number = 150;

  public powers = [{
    name: 'BREAK Evolution Rule',
    powerType: PowerType.BREAK_RULE,
    text: 'Xerneas BREAK retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.'
  }];

  public attacks = [{
    name: 'Life Stream',
    cost: [Y, Y],
    damage: 20,
    damageCalculation: 'x',
    text: 'This attack does 20 damage times the amount of Energy attached to all of your Pokémon.'
  }]

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '82';
  public name: string = 'Xerneas BREAK';
  public fullName: string = 'Xerneas BREAK STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Life Stream
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      let energies = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        const energyOnPokemon = card.cards.filter(c => c instanceof EnergyCard);
        energies += energyOnPokemon.length;
      });

      effect.damage = energies * 20;
    }
    
    // slapping on the weakness, resistance, and retreat of the previous evolutions
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const cardList = effect.target;
      const previousPokemon = cardList.getPokemonCard();

      if (previousPokemon) {
        this.weakness = [...previousPokemon.weakness];
        this.resistance = [...previousPokemon.resistance];
        this.retreat = [...previousPokemon.retreat];
      }
    }
    
    // Trying to get all of the previous stage's attacks and powers
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
          player.showAllStageAbilities = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Add attacks from the previous stage to this one
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.attacks.push(...(evolutionCard.attacks || []));
        }
      }
    }

    if (effect instanceof CheckPokemonPowersEffect){
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Adds the powers from the previous stage
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}