import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { AttachEnergyEffect } from '../../../game/store/effects/play-card-effects';
import { HealEffect } from '../../../game/store/effects/game-effects';

export class Magearna extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Auto Heal',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, whenever you attach an Energy card from your hand to 1 of your Pokémon, heal 90 damage from that Pokémon.',
  }];

  public attacks = [{
    name: 'Spike Draw',
    cost: [C],
    damage: 20,
    text: 'Draw 2 cards.'
  }];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '107';
  public name: string = 'Magearna';
  public fullName: string = 'Magearna JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Auto Heal
    if (effect instanceof AttachEnergyEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      const healEffect = new HealEffect(effect.player, effect.target, 90);
      store.reduceEffect(state, healEffect);
      return state;
    }

    // Spike Draw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 2);
    }

    return state;
  }
}
