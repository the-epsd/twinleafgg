import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class Lickitung extends PokemonCard {
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 90;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Tongue Wrap',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Supersonic',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused.'
  }];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '38';

  public name: string = 'Lickitung';

  public fullName: string = 'Lickitung JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    return state;
  }
}