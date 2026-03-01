import { ADD_POISON_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { BeginTurnEffect } from '../../game/store/effects/game-phase-effects';

import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType, State, StoreLike } from '../../game';
export class Poipole extends PokemonCard {
  public tags = [CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Spit Poison',
      cost: [C],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Poisoned.'
    },
    {
      name: 'Knockout Reviver',
      cost: [P, C],
      damage: 0,
      text: 'During your opponent\'s next turn, if this Pokémon is Knocked Out, your opponent can\'t take any Prize cards for it.'
    }
  ];

  public set: string = 'FLI';
  public name: string = 'Poipole';
  public fullName: string = 'Poipole FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '55';

  public readonly ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER = 'ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Spit Poison
    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    // Knockout Reviver
    if (WAS_ATTACK_USED(effect, 1, this)) {
      console.log('adding knockout reviver marker');
      effect.source.marker.addMarker(this.ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER, this);
    }

    if (effect instanceof BeginTurnEffect) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER);
      });
    }

    if (effect instanceof KnockOutEffect && effect.target.marker.hasMarker(this.ATTACK_EFFECT_KNOCKOUT_REVIVER_MARKER)) {
      console.log('knockout reviver activated');
      effect.prizeCount = 0;
    }

    return state;
  }
}