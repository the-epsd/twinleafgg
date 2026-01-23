import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, SlotType, GameMessage } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Hydreigon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Zweilous';
  public cardType: CardType = D;
  public hp: number = 150;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Dark Aura',
    powerType: PowerType.ABILITY,
    text: 'Each basic Energy attached to your Pokemon provides Dark Energy instead of its usual type.'
  }];

  public attacks = [{
    name: 'Berserker Blade',
    cost: [D, D, C, C],
    damage: 60,
    text: 'Does 40 damage to 2 of your opponent\'s Benched Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  }];

  public set: string = 'NVI';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Hydreigon';
  public fullName: string = 'Hydreigon NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dark Aura - convert all basic energy to Dark
    if (effect instanceof CheckProvidedEnergyEffect) {
      const player = effect.player;

      // Check if this Hydreigon is in play for this player
      let hydreigonInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          hydreigonInPlay = true;
        }
      });

      if (!hydreigonInPlay) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Only affect player's own Pokemon
      let sourceOwner: any = null;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === effect.source) {
          sourceOwner = player;
        }
      });

      if (sourceOwner !== player) {
        return state;
      }

      // Convert all basic energy to provide Dark
      effect.energyMap.forEach(em => {
        if (em.card.energyType === EnergyType.BASIC) {
          em.provides = em.provides.map(() => CardType.DARK);
        }
      });
    }

    // Berserker Blade - damage 2 benched Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 2, allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          targets.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 40);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        }
      });
    }

    return state;
  }
}
