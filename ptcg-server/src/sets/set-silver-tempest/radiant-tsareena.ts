import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { PokemonCardList } from '../../game';
import { RemoveSpecialConditionsEffect } from '../../game/store/effects/attack-effects';


export class RadiantTsareena extends PokemonCard {

  public tags = [CardTag.RADIANT];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 140;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Elegant Heal',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may heal 20 damage from each of your Pokémon.'
  }];

  public attacks = [{
    name: 'Aroma Shot',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'This Pokémon recovers from all Special Conditions.'
  }];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Radiant Tsareena';

  public fullName: string = 'Radiant Tsareena SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 20);
        state = store.reduceEffect(state, healEffect);
        return state;
      });
      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;

        const removeSpecialCondition = new RemoveSpecialConditionsEffect(effect, undefined);
        removeSpecialCondition.target = player.active;
        state = store.reduceEffect(state, removeSpecialCondition);
        return state;
      }
    }
    return state;
  }
}