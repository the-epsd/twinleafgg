import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, StateUtils, CardTag, CardType, Stage, EnergyCard, SpecialCondition, CardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import {AddSpecialConditionsEffect} from '../../game/store/effects/attack-effects';

export class Magcargoex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Slugma';
  public cardType: CardType = R;
  public hp: number = 270;
  public weakness = [{ type: W }];
  public retreat = [ C, C, C ];

  public attacks = [
    {
      name: 'Hot Magma',
      cost: [ R, C ],
      damage: 70,
      text: 'Your opponent\'s Active Pokémon is now Burned.'
    },
    {
      name: 'Ground Burn',
      cost: [ R, R, C ],
      damage: 140,
      damageCalculation: '+',
      text: 'Discard the top card of each player\'s deck. This attack does 140 more damage for each Energy card discarded in this way.'
    }
  ];

  public set: string = 'TWM';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Magcargo ex';
  public fullName: string = 'Magcargo ex TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Hot Magma
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      return store.reduceEffect(state, specialCondition);
    }

    // Ground Burn
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const playerTopDeck = new CardList();
      const opponentTopDeck = new CardList();
      let damageScaling = 0;

      player.deck.moveTo(playerTopDeck, 1);
      opponent.deck.moveTo(opponentTopDeck, 1);

      if (playerTopDeck.cards[0] instanceof EnergyCard){
        damageScaling++;
      }
      if (opponentTopDeck.cards[0] instanceof EnergyCard){
        damageScaling++;
      }

      effect.damage += (140 * damageScaling);

      playerTopDeck.moveTo(player.discard);
      opponentTopDeck.moveTo(opponent.discard);
    }
    return state;
  }
}