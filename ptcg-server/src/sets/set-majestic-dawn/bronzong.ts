import { GamePhase, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { BetweenTurnsEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bronzor';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P, value: +20 }];
  public resistance = [{ type: R, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Pain Amplifier',
    powerType: PowerType.POKEBODY,
    text: 'As long as Bronzong is your Active Pokémon, put 1 damage counter on each of your opponent\'s Pokémon that has any Poké-Powers between turns.'
  }];

  public attacks = [{
    name: 'Pain Amplifier',
    cost: [],
    damage: 0,
    text: 'Put 1 damage counter on each of your opponent\'s Pokémon that already has damage counters on it.'
  },
  {
    name: 'Coating',
    cost: [P, C, C],
    damage: 60,
    text: 'During your opponent\'s next turn, any damage done to Bronzong by attacks is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Bronzong';
  public fullName: string = 'Bronzong MD';

  public readonly COATING_MARKER = 'COATING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const pokemon = cardList.getPokemonCard();

        if (pokemon) {
          const powersEffect = new CheckPokemonPowersEffect(opponent, cardList);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(p => p.powerType === PowerType.POKEPOWER)) {
            cardList.damage += 10;
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.damage === 0) {
          return;
        }
        const damageEffect = new PutCountersEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_MARKER(this.COATING_MARKER, effect.player, this);
    }

    if (effect instanceof PutDamageEffect
      && HAS_MARKER(this.COATING_MARKER, StateUtils.getOpponent(state, effect.player), this)
      && effect.target.getPokemonCard() === this) {

      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 20;
    }

    if (effect instanceof EndTurnEffect && effect.player !== StateUtils.findOwner(state, StateUtils.findCardList(state, this))) {
      REMOVE_MARKER(this.COATING_MARKER, StateUtils.getOpponent(state, effect.player), this);
    }

    return state;
  }
}