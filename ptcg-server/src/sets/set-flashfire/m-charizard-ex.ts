import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MCharizardEX extends PokemonCard {

  public stage: Stage = Stage.MEGA;

  public tags = [CardTag.POKEMON_EX, CardTag.MEGA];

  public evolvesFrom = 'Charizard-EX';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 230;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Wild Blaze',
      cost: [CardType.FIRE, CardType.FIRE, CardType.DARK, CardType.COLORLESS, CardType.COLORLESS],
      damage: 300,
      text: 'Discard the top 5 cards of your deck.'
    }
  ];

  public set: string = 'FLF';

  public name: string = 'M Charizard-EX';

  public fullName: string = 'M Charizard EX FLF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '69';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof EvolveEffect) && effect.pokemonCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tools.length > 0 && cardList.tools[0].name === 'Charizard Spirit Link') {
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
      const opponent = StateUtils.getOpponent(state, player);

      // Discard 2 cards from opponent's deck 
      opponent.deck.moveTo(opponent.discard, 5);

    }
    return state;
  }

}
