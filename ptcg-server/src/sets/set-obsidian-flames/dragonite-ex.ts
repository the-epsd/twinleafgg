import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Dragoniteex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public evolvesFrom = 'Dragonair';
  public cardType: CardType = N;
  public hp: number = 330;
  public weakness = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Wing Attack',
    cost: [C],
    damage: 70,
    text: ''
  },
  {
    name: 'Mighty Meteor',
    cost: [W, L],
    damage: 140,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 140 more damage.' +
      'If tails, during your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '159';
  public name: string = 'Dragonite ex';
  public fullName: string = 'Dragonite ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {

        if (!result) {
          player.active.cannotAttackNextTurnPending = true;
        }

        if (result) {
          effect.damage += 140;
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    
    return state;
  }
}