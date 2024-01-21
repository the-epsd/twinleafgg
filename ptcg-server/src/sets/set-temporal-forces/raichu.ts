import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, CardTarget, GameError, GameMessage, PlayerType} from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';


export class Raichu extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Entangling Bolt',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to each other Pokémon in play with any damage counters on it. (Both yours and your opponent\'s. Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'SV5';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '24';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu SV5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      const blocked: CardTarget[] = [];
  
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      const oppHasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched && !oppHasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }
  
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          return state;
        } else {
          blocked.push(target);
        }
      });

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          return state;
        } else {
          blocked.push(target);
        }
  
        if (!blocked.length) {
          throw new GameError(GameMessage.CANNOT_USE_ATTACK);
        }
  
        if (blocked.length) {
          // Opponent has damaged benched Pokemon

          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
      return state;
    }
    return state;
  }
}