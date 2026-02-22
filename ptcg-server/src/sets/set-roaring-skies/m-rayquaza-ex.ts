import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Card, ChooseEnergyPrompt, GameMessage, PlayerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MRayquazaEX extends PokemonCard {

  public stage: Stage = Stage.MEGA;

  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];

  public evolvesFrom = 'Rayquaza-EX';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 230;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Delta Wild',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'Any damage done to this Pokémon by attacks from your opponent\'s Grass, Fire, Water, or Lightning Pokémon is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Dragon Ascent',
      cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 300,
      text: 'Discard 2 Energy attached to this Pokémon.'
    }
  ];

  public set: string = 'ROS';

  public name: string = 'M Rayquaza-EX';

  public fullName: string = 'M Rayquaza EX ROS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof EvolveEffect) && effect.pokemonCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tools.length > 0 && cardList.tools[0].name === 'Rayquaza Spirit Link') {
          return state;
        } else {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
          return state;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    // Delta Plus
    if (effect instanceof PutDamageEffect) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ANCIENT_TRAIT,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (effect.target.cards.includes(this)) {
        const checkPokemonType = new CheckPokemonTypeEffect(effect.source);
        store.reduceEffect(state, checkPokemonType);
        if (checkPokemonType.cardTypes.includes(CardType.GRASS) ||
          checkPokemonType.cardTypes.includes(CardType.FIRE) ||
          checkPokemonType.cardTypes.includes(CardType.WATER) ||
          checkPokemonType.cardTypes.includes(CardType.LIGHTNING)) {
          effect.damage -= 20;
        }

      }
    }
    return state;
  }

}
