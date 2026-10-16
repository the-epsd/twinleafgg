import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS } from '../../../game/store/prefabs/attack-effects';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';

export class Steelix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Onix';
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: +30 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Outbreak Power',
    cost: [C],
    damage: 0,
    text: 'Choose a number of your opponent\'s Pokémon up to the amount of Energy attached to Steelix. This attack does 20 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Iron Tail',
    cost: [M, M, C, C],
    damage: 100,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 100 damage times the number of heads.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Steelix';
  public fullName: string = 'Steelix SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Outbreak Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkEnergy);
      const metalCount = checkEnergy.energyMap.filter(em =>
      em.provides.includes(CardType.METAL) || em.provides.includes(CardType.ANY),
      ).length;
      if (metalCount === 0 || !opponent.bench.some(b => b.cards.length > 0)) {
      return state;
      }
      const max = Math.min(metalCount, opponent.bench.filter(b => b.cards.length > 0).length);
      store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
      PlayerType.TOP_PLAYER,
      [SlotType.BENCH],
      { min: 1, max, allowCancel: false },
      ), targets => {
      targets.forEach(target => {
      const damageEffect = new PutDamageEffect(effect, 20);
      damageEffect.target = target;
      store.reduceEffect(state, damageEffect);
      });
      });
    }

    // Iron Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_A_COIN_UNTIL_YOU_GET_TAILS_DO_X_DAMAGE_PER_HEADS(store, state, effect, 100);
    }

    return state;
  }
}
