import { CardTag, CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, HAS_EXTRA_ENERGY_BEYOND_ATTACK_COST, WAS_ATTACK_USED, WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_SURVIVES_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class MarshadowMachampGX extends PokemonCard {
  protected _tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [F];
  public hp: number = 270;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Revenge',
      cost: [F, C],
      damage: 30,
      damageCalculation: '+',
      text: "If any of your Pokémon were Knocked Out by damage from an opponent's attack during their last turn, this attack does 90 more damage.",
    },
    {
      name: 'Hundred-Blows Impact',
      cost: [F, F, C],
      damage: 160,
      text: '',
    },
    {
      name: 'Acme of Heroism-GX',
      cost: [F, F, C],
      damage: 200,
      gxAttack: true,
      text: "If this Pokémon has at least 1 extra Energy attached to it (in addition to this attack's cost), and if it would be Knocked Out by damage from an opponent's attack during their next turn, it is not Knocked Out, and its remaining HP becomes 10. (You can't use more than 1 GX attack in a game.)",
    },
  ];

  public set = 'UNB';
  public setNumber = '82';
  public cardImage = 'assets/cardback.png';
  public name = 'Marshadow & Machamp-GX';
  public fullName = 'Marshadow & Machamp-GX UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Revenge
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (
        WAS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_LAST_TURN(effect.player, { byAttackDamage: true })
      ) {
        effect.damage += 90;
      }
    }

    // Acme of Heroism-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      if (HAS_EXTRA_ENERGY_BEYOND_ATTACK_COST(store, state, player, effect.attack, 1)) {
        return THIS_POKEMON_SURVIVES_ON_TEN_HP_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
      }
    }

    return state;
  }
}
