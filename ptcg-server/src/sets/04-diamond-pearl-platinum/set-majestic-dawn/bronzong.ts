import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, PlayerType } from "../../../game";
import { PutCountersEffect } from "../../../game/store/effects/attack-effects";
import { CheckPokemonPowersEffect } from "../../../game/store/effects/check-effects";
import { Effect } from "../../../game/store/effects/effect";
import { BetweenTurnsEffect } from "../../../game/store/effects/game-phase-effects";
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Bronzong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Bronzor';
  public cardType: CardType[] = [P];
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

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof BetweenTurnsEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const pokemon = cardList.getPokemonCard();

        if (pokemon) {
          const powersEffect = new CheckPokemonPowersEffect(opponent, card);
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
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 20);
    }

    return state;
  }
}