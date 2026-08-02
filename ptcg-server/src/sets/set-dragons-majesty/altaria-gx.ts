import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, BLOCK_IF_GX_ATTACK_USED, PREVENT_DAMAGE } from '../../game/store/prefabs/prefabs';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';

export class AltariaGx extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Swablu';
  public cardType: CardType = N;
  public hp: number = 200;
  public weakness = [{ type: Y }];
  public retreat = [C];

  public attacks = [{
    name: 'Bright Tone',
    cost: [Y, C],
    damage: 50,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Pokémon-GX and Pokémon-EX.'
  },
  {
    name: 'Sonic Edge',
    cost: [W, Y, C],
    damage: 110,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  },
  {
    name: 'Euphoria GX',
    cost: [Y, C],
    damage: 0,
    text: 'Your opponent\'s Active Pokémon is now Asleep. Heal all damage from all of your Pokémon. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'DRM';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Altaria GX';
  public fullName: string = 'Altaria GX DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Bright Tone
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceTags: [CardTag.POKEMON_GX, CardTag.POKEMON_EX] });
    }

    // Sonic Edge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 110);
    }

    // Euphoria GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);

      // Heal all damage from all of your Pokemon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.damage > 0) {
          const healEffect = new HealTargetEffect(effect, cardList.damage);
          healEffect.target = cardList;
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
