import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ShuffleDeckPrompt } from '../../game/store/prompts/shuffle-prompt';


export class Dudunsparce extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dunsparce';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Mud-Slap',
    cost: [ CardType.COLORLESS ],
    damage: 30,
    text: ''
  }, {
    name: 'Deck and Cover',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 100,
    text: 'Your opponent\'s Active Pokémon is now Paralyzed. Shuffle this Pokémon and all attached cards into your deck.'
  }];

  public regulationMark = 'G';

  public set: string = 'PAL';

  public set2: string = 'paldeaevolved';

  public setNumber: string = '157';

  public name: string = 'Dudunsparce';

  public fullName: string = 'Dudunsparce PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const specialConditionEffect = new AddSpecialConditionsEffect(
        effect, [ SpecialCondition.PARALYZED ]
      );
      store.reduceEffect(state, specialConditionEffect);

      player.active.moveTo(player.deck);
      player.active.clearEffects();

      return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
        player.deck.applyOrder(order);
      });
    }

    return state;
  }

}
