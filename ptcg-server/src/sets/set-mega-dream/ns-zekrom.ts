import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, PokemonCardList, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class NsZekrom extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.NS];
  public cardType: CardType = N;
  public hp: number = 130;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shred',
    cost: [C, C, C],
    damage: 70,
    shredAttack: true,
    text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
  },
  {
    name: 'Rampage Thunder',
    cost: [],
    damage: 250,
    text: 'This Pokemon can\'t attack during your next turn.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'M2a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'N\'s Zekrom';
  public fullName: string = 'N\'s Zekrom M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cannot attack next turn (check before allowing any attack)
    if (effect instanceof AttackEffect && effect.source.cards.includes(this)) {
      if (effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Rampage Thunder - prevent attack next turn
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      // Check marker
      if (effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(PokemonCardList.ATTACK_USED_MARKER, this);
    }

    // Handle marker transitions at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(PokemonCardList.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(PokemonCardList.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(PokemonCardList.ATTACK_USED_2_MARKER, this);
    }

    return state;
  }
}



