import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ConfirmPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect, PlayStadiumEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Copperajah extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Cufant';

  public cardType: CardType = CardType.METAL;

  public hp: number = 200;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Massive Body',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent can\'t play any Stadium cards from their hand.'
  }];

  public attacks = [
    {
      name: 'Nasal Lariat',
      cost: [CardType.METAL, CardType.METAL, CardType.METAL, CardType.COLORLESS],
      damage: 130,
      damageCalculation: '+',
      text: 'You may do 100 more damage. If you do, during your next turn, this Pokémon can\'t attack.'
    }
  ];

  public regulationMark: string = 'H';

  public set: string = 'SFA';

  public name: string = 'Copperajah';

  public fullName: string = 'Copperajah SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '42';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public readonly OPPONENT_CANNOT_PLAY_STADIUMS_MARKER = 'OPPONENT_CANNOT_PLAY_STADIUMS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {


    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_STADIUMS_MARKER, this);
    }

    if (effect instanceof PlayStadiumEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (player.active.cards[0] == this) {
        if (opponent.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_STADIUMS_MARKER, this))
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Check marker
      if (player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          effect.damage += 100;
          effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
          console.log('marker added');
        }
      });
    }
    return state;
  }
}
