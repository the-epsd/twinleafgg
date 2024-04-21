import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, PokemonCard, PowerType, StateUtils } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Froslass extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;

  public evolvesFrom: string = 'Snorunt';

  public regulationMark = 'H';
  
  public cardType: CardType = CardType.WATER;
  
  public weakness = [{ type: CardType.METAL }];

  public hp: number = 90;
  
  public retreat = [ CardType.COLORLESS ];
  
  public powers = [{
    name: 'Chilling Curtain',
    powerType: PowerType.ABILITY,
    text: 'During Pokémon Checkup, put 1 damage counter on each Pokémon in play that has any Abilities (excluding any Froslass).'
  }];

  public attacks = [
    {
      name: 'Frost Smash',
      cost: [CardType.WATER, CardType.COLORLESS ],
      damage: 60,
      text: ''
    }
  ];
  
  public set: string = 'SV6';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '33';
  
  public name: string = 'Froslass';
  
  public fullName: string = 'Froslass SV6';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (state.phase === GamePhase.BETWEEN_TURNS) {

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (effect.card.name !== 'Froslass') {
            cardList.damage += 10;
          }
        });
        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (effect.card.name !== 'Froslass') {
            cardList.damage += 10;
          }
        });
        return state;
      }
      return state;
    }
    return state;
  }
}