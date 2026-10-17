import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../../game/store/effects/game-effects';
import { ABILITY_USED, ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Slaking extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Vigoroth';
  public hp: number = 140;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +30 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Energetic Impulse',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Slaking is your Active Pokémon, you may flip a coin. If heads, Slaking\'s Lazy Blow attack\'s base damage is 130 during this turn. If tails, Slaking can\'t attack or retreat during this turn. (If Slaking is no longer your Active Pokémon, this effect ends.)',
  }];

  public attacks = [{
    name: 'Lazy Blow',
    cost: [C, C, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Slaking';
  public fullName: string = 'Slaking MT';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public readonly LAZY_BLOW_BOOST_MARKER = 'LAZY_BLOW_BOOST_MARKER';
  public readonly CANT_ATTACK_RETREAT_MARKER = 'CANT_ATTACK_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.LAZY_BLOW_BOOST_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.CANT_ATTACK_RETREAT_MARKER, this);

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (HAS_MARKER(this.ABILITY_USED_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ADD_MARKER(this.ABILITY_USED_MARKER, player, this);
      ABILITY_USED(player, this);

      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (player.active.getPokemonCard() !== this) {
          return;
        }
        if (result) {
          ADD_MARKER(this.LAZY_BLOW_BOOST_MARKER, player, this);
        } else {
          ADD_MARKER(this.CANT_ATTACK_RETREAT_MARKER, player, this);
        }
      });
    }

    // Clear impulse effects when Slaking leaves Active
    if (
      (effect instanceof AttackEffect || effect instanceof RetreatEffect)
      && HAS_MARKER(this.LAZY_BLOW_BOOST_MARKER, effect.player, this)
      && effect.player.active.getPokemonCard() !== this
    ) {
      REMOVE_MARKER(this.LAZY_BLOW_BOOST_MARKER, effect.player, this);
    }
    if (
      (effect instanceof AttackEffect || effect instanceof RetreatEffect)
      && HAS_MARKER(this.CANT_ATTACK_RETREAT_MARKER, effect.player, this)
      && effect.player.active.getPokemonCard() !== this
    ) {
      REMOVE_MARKER(this.CANT_ATTACK_RETREAT_MARKER, effect.player, this);
    }

    if (effect instanceof AttackEffect && effect.player.active.getPokemonCard() === this) {
      if (HAS_MARKER(this.CANT_ATTACK_RETREAT_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() === this) {
      if (HAS_MARKER(this.CANT_ATTACK_RETREAT_MARKER, effect.player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (HAS_MARKER(this.LAZY_BLOW_BOOST_MARKER, effect.player, this)) {
        effect.damage = 130;
      }
    }

    return state;
  }
}
