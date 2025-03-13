import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EvolveEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class MRayquazaEX extends PokemonCard {

  public stage: Stage = Stage.MEGA;

  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];

  public evolvesFrom = 'Rayquaza EX';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 230;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Delta Wild',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'Any damage done to this Pokémon by attacks from your opponent\'s Grass, Fire, Water, or Lightning Pokémon is reduced by 20(after applying Weakness and Resistance).'
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

  public name: string = 'M Rayquaza EX';

  public fullName: string = 'M Rayquaza EX ROS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '61';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof EvolveEffect) && effect.pokemonCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool && cardList.tool.name === 'Rayquaza Spirit Link') {
          return state;
        } else {
          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
          return state;
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard 2 cards from opponent's deck 
      opponent.deck.moveTo(opponent.discard, 5);

    }
    return state;
  }

}
