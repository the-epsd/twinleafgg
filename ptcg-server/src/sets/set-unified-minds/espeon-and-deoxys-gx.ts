import { CardTag, CardType, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';


export class EspeonDeoxysGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 260;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Psychic Club',
      cost: [P, C, C],
      damage: 10,
      damageCalculation: '+',
      text: 'This attack does 30 more damage for each of your Benched [P] Pokémon.'
    },
    {
      name: 'Cross Division-GX',
      cost: [P, C, C],
      damage: 0,
      gxAttack: true,
      text: 'Put 10 damage counters on your opponent\'s Pokémon in any way you like. If this Pokémon has at least 3 extra Energy attached to it (in addition to this attack\'s cost), put 20 damage counters on them instead. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'UNM';
  public setNumber = '72';
  public cardImage = 'assets/cardback.png';
  public name = 'Espeon & Deoxys-GX';
  public fullName = 'Espeon & Deoxys-GX UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psychic Club
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let psychics = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard()?.cardType === CardType.PSYCHIC) { psychics++; }
      });

      effect.damage += psychics * 30;
    }

    // Cross Division-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      let counters = 10;

      const extraEffectCost: CardType[] = [P, C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        counters = 20;
      }

      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(counters, store, state, effect);
    }

    return state;
  }
}