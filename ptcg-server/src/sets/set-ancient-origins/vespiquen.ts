import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {CONFIRMATION_PROMPT, DRAW_CARDS, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class Vespiquen extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Combee';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];

  public attacks = [
    {
      name: 'Intelligence Gathering',
      cost: [C],
      damage: 10,
      text: 'You may draw cards until you have 6 cards in your hand.'
    },
    {
      name: 'Bee Revenge',
      cost: [C, C],
      damage: 20,
      damageCalculation: '+',
      text: 'This attack does 10 more damage for each Pokémon in your discard pile.'
    }
  ];

  public set: string = 'AOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Vespiquen';
  public fullName: string = 'Vespiquen AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intelligence Gathering
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      
      if (player.hand.cards.length >= 6 || player.deck.cards.length === 0){
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result){
          let cardsToDraw = 6 - player.hand.cards.length;
          DRAW_CARDS(player, cardsToDraw);
        }
      });
    }

    // Bee Revenge
    if (WAS_ATTACK_USED(effect, 1, this)){
      const player = effect.player;
      let pokemonInDiscard = 0;

      player.discard.cards.forEach(card => {
        if (card instanceof PokemonCard){ pokemonInDiscard++; }
      });

      effect.damage += pokemonInDiscard * 10;
    }

    return state;
  }
}
