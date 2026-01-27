import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';

export class Sigilyph extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Reflect',
      cost: [P],
      damage: 0,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 40 (after applying Weakness and Resistance).'
    },
    {
      name: 'Telekinesis',
      cost: [P, C, C],
      damage: 0,
      text: 'Does 50 damage to 1 of your opponent\'s Pokémon. This attack\'s damage isn\'t affected by Weakness or Resistance.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Sigilyph';
  public fullName: string = 'Sigilyph EPO';

  public readonly REFLECT_MARKER = 'REFLECT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.marker.addMarker(this.REFLECT_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        const target = targets[0];
        const putDamage = new PutDamageEffect(effect, 50);
        putDamage.target = target;
        store.reduceEffect(state, putDamage);
      });
    }

    if (effect instanceof DealDamageEffect && effect.target.marker.hasMarker(this.REFLECT_MARKER, this)) {
      effect.damage = Math.max(0, effect.damage - 40);
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.REFLECT_MARKER, this);
    }

    return state;
  }
}
