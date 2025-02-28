import { Attack, CardType, GamePhase, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike, Weakness } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, BLOCK_RETREAT_IF_MARKER, IS_ABILITY_BLOCKED, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Maractus extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness: Weakness[] = [{ type: R }];
  public retreat: CardType[] = [C, C];

  public powers: Power[] = [{
    name: 'Explosive Needle',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is in the Active Spot and is Knocked Out by damage from an ' +
      'attack from your opponent\'s Pokémon, put 6 damage counters on the Attacking Pokémon.',
  }];

  public attacks: Attack[] = [{
    name: 'Corner',
    cost: [C],
    damage: 20,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  }];

  public set: string = 'SV9';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Maractus';
  public fullName: string = 'Maractus SV9';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER: string = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this ||
        state.phase !== GamePhase.ATTACK ||
        IS_ABILITY_BLOCKED(store, state, player, this)
      ) {
        return state;
      }

      const checkHpEffect = new CheckHpEffect(player, effect.target);
      store.reduceEffect(state, checkHpEffect);
      const currentHp = checkHpEffect.hp - effect.target.damage;

      if (effect.damage >= currentHp) {
        effect.source.damage += 60;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, effect.target, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }

}