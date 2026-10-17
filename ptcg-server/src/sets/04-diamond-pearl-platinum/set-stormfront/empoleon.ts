import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Empoleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Prinplup';
  public hp: number = 130;
  public cardType: CardType[] = [M];
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Emperor Aura',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you play Empoleon from your hand to evolve 1 of your Active Pokémon, you may use this power. Your opponent can\'t attach any Energy cards from his or her hand to his or her Pokémon during your opponent\'s next turn.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Steel Wing',
    cost: [C, C],
    damage: 40,
    text: 'During your opponent\'s next turn, any damage done to Empoleon by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Whirlpool',
    cost: [W, C, C],
    damage: 60,
    text: 'Flip a coin. If heads, discard an Energy card attached to the Defending Pokémon.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Empoleon';
  public fullName: string = 'Empoleon SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Emperor Aura
    if (JUST_EVOLVED(effect, this) && effect.target === effect.player.active
      && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (!wantToUse) {
          return;
        }
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.applyPlayLocks({ energy: true }, 1);
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Steel Wing
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 20);
    }

    // Whirlpool
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
        }
      });
    }

    return state;
  }
}
