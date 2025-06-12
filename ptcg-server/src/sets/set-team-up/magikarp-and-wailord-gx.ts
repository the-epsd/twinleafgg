import { CardTag, CardType, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {PutDamageEffect} from '../../game/store/effects/attack-effects';

export class MagikarpWailordGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 300;
  public weakness = [{ type: G }];
  public retreat = [ C, C, C, C ];

  public attacks = [
    {
      name: 'Super Splash',
      cost: [ W, W, W, W, W ],
      damage: 180,
      text: ''
    },
    {
      name: 'Towering Splash-GX',
      cost: [ W ],
      damage: 10,
      gxAttack: true,
      text: 'If this Pokémon has at least 7 extra [W] Energy attached to it (in addition to this attack\'s cost), this attack does 100 damage to each of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'TEU';
  public setNumber = '160';
  public cardImage = 'assets/cardback.png';
  public name = 'Magikarp & Wailord-GX';
  public fullName = 'Magikarp & Wailord-GX TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Towering Splash-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const extraEffectCost: CardType[] = [W, W, W, W, W, W, W, W];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
          if (card !== opponent.active){
            const damage = new PutDamageEffect(effect, 100);
            damage.target = card;
            store.reduceEffect(state, damage);
          }
        });
      }
    }

    return state;
  }
}