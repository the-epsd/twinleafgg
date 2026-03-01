import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Shiftryex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nuzleaf';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = D;
  public hp: number = 140;
  public weakness = [{ type: G }, { type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Dark Eyes',
    powerType: PowerType.POKEBODY,
    text: 'After your opponent\'s Pokémon uses a Poké-Power, put 2 damage counters on that Pokémon.'
  }];

  public attacks = [{
    name: 'Target Attack',
    cost: [D, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. If that Pokémon already has any damage counters on it, this attack does 50 damage instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Blade Arms',
    cost: [D, C, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '97';
  public name: string = 'Shiftry ex';
  public fullName: string = 'Shiftry ex CG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.POKEPOWER) {
      // Ignore synthetic probe effects emitted by IS_POKEPOWER_BLOCKED.
      if (!effect.card.powers.includes(effect.power)) {
        return state;
      }

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isShiftryInPlay = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (card === this) {
          isShiftryInPlay = true;
        }
      });

      if (!isShiftryInPlay || IS_POKEBODY_BLOCKED(store, state, opponent, this)) {
        return state;
      }

      const target = StateUtils.findCardList(state, effect.card);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === target) {
          const placeCountersEffect = new PlaceDamageCountersEffect(player, cardList, 20, this);
          state = store.reduceEffect(state, placeCountersEffect);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        const damage = target.damage > 0 ? 50 : 30;
        let damageEffect: DealDamageEffect | PutDamageEffect;
        if (target === opponent.active) {
          damageEffect = new DealDamageEffect(effect, damage);
        } else {
          damageEffect = new PutDamageEffect(effect, damage);
        }
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}