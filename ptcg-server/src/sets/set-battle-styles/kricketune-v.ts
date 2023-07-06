/* eslint-disable indent */
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { PowerType } from '../../game';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CardTag } from '../../game/store/card/card-types';

export class KricketuneV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 180;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Exciting Stage',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, , you may draw cards until you have ' +
      '3 cards in your hand. If this Pokémon is in the Active Spot, ' +
      'you may draw cards until you have 4 cards in your hand ' +
      'instead. You can’t use more than 1 Exciting Stage Ability ' +
      'each turn.'
  }];

  public attacks = [
    {
      name: 'X-Scissor',
      cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 80,
      text: 'Flip a coin. If heads, this attack does 80 more damage.' +
      ''
    }
  ];

  public set: string = 'BST';

  public name: string = 'Kricketune V';

  public fullName: string = 'Kricketune V BST 006';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.marker.hasMarker('ability_used')) {
        return state;
      }

      player.marker.addMarker('ability_used', this);
      while (player.hand.cards.length < 3) {
        player.deck.moveTo(player.hand, 1);
      }
    }
  
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], (results: boolean[]) => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage += 80 * heads;
        return state;
      });
    } 

    return state;
  }
}
