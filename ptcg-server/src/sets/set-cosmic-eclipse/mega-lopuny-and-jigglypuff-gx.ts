import { CardTag, CardType, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON} from '../../game/store/prefabs/attack-effects';

export class MegaLopunnyJigglypuffGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 300;
  public weakness = [{ type: G }];
  public retreat = [ C, C, C, C ];

  public attacks = [
    {
      name: 'Jumping Balloon',
      cost: [ C, C, C ],
      damage: 60,
      damageCalculation: '+',
      text: 'This attack does 60 more damage for each of your opponent\'s Pokémon-GX and Pokémon-EX in play. '
    },
    {
      name: 'Puffy Smashers-GX',
      cost: [ C ],
      damage: 0,
      gxAttack: true,
      text: 'Your opponent\'s Active Pokémon is now Asleep. If this Pokémon has at least 4 extra Energy attached to it (in addition to this attack\'s cost), this attack does 200 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'CEC';
  public setNumber = '165';
  public cardImage = 'assets/cardback.png';
  public name = 'Mega Lopunny & Jigglypuff-GX';
  public fullName = 'Mega Lopunny & Jigglypuff-GX CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jumping Balloon
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;
      let gxsAndExs = 0;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard()?.tags.includes(CardTag.POKEMON_EX) || card.getPokemonCard()?.tags.includes(CardTag.POKEMON_GX)){
          gxsAndExs++;
        }
      });

      effect.damage += 60 * gxsAndExs;
    }

    // Puffy Smashers-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, opponent, this);

      const extraEffectCost: CardType[] = [C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(200, effect, store, state);
      }
    }

    return state;
  }
}