import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class GarchompCLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom = 'Garchomp C';
  public cardType: CardType = C;
  public tags = [CardTag.POKEMON_LV_X, CardTag.POKEMON_SP];
  public hp: number = 110;
  public weakness = [{ type: C }];
  public retreat = [];

  public powers = [
    {
      name: 'LV.X Rule',
      powerType: PowerType.LV_X_RULE,
      text: 'Put this card onto your Active Garchomp C. Garchomp C LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
    },
    {
      name: 'Healing Breath',
      powerType: PowerType.POKEPOWER,
      text: 'Once during your turn (before your attack), when you put Garchomp C LV.X from your hand onto your Active Garchomp C, you may remove all damage counters from each of your Pokémon SP.'
    }
  ];

  public attacks = [{
    name: 'Dragon Rush',
    cost: [C, C, C],
    damage: 0,
    text: 'Discard 2 Energy attached to Garchomp C. Choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) Garchomp C can\'t use Dragon Rush during your next turn.'
  }];

  public set: string = 'SV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '145';
  public name: string = 'Garchomp C';
  public fullName: string = 'Garchomp C LV.X SV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Healing Breath
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
            if (card.getPokemonCard()?.tags.includes(CardTag.POKEMON_SP)) {
              const healing = new HealEffect(player, card, card.damage);
              store.reduceEffect(state, healing);
            }
          });

        }
      });
    }

    // Dragon Rush
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Dragon Rush')) {
        player.active.cannotUseAttacksNextTurnPending.push('Dragon Rush');
      }
    }

    // making sure it gets put on the active pokemon
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      if (effect.target !== effect.player.active) { throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
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

    if (effect instanceof CheckPokemonPowersEffect) {
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