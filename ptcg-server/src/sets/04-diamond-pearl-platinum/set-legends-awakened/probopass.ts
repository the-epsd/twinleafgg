import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Probopass extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nosepass';
  public hp: number = 90;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Steel Coating',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Probopass by your opponent\'s attacks is reduced by 10 for each Metal Energy attached to Probopass (after applying Weakness and Resistance). You can\'t reduce more than 20 damage in this way.'
  }];

  public attacks = [{
    name: 'Metal Bomber',
    cost: [F, C, C],
    damage: 60,
    text: 'Choose a number of your opponent\'s Benched Pokémon up to the amount of Metal Energy attached to Probopass. This attack does 20 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Probopass';
  public fullName: string = 'Probopass LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Steel Coating
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (effect.player === owner) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      const checkEnergy = new CheckProvidedEnergyEffect(owner, effect.target);
      store.reduceEffect(state, checkEnergy);
      const metalCount = checkEnergy.energyMap.filter(em =>
        em.provides.includes(CardType.METAL) || em.provides.includes(CardType.ANY),
      ).length;
      const reduction = Math.min(20, metalCount * 10);
      effect.damage = Math.max(0, effect.damage - reduction);
    }

    // Metal Bomber
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

    return state;
  }
}
