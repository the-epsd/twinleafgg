import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AFTER_ATTACK, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH } from '../../game/store/prefabs/prefabs';

export class Regirock extends PokemonCard {

  public cardType = CardType.FIGHTING;

  public stage = Stage.BASIC;

  public hp = 130;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Regi Gate',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for a Basic Pokémon and put it onto your Bench. Then, shuffle your deck.'
    },
    {
      name: 'Giga Impact',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      damage: 140,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '75';

  public name: string = 'Regirock';

  public fullName: string = 'Regirock ASR';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER || this.ATTACK_USED_2_MARKER)) {
      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (AFTER_ATTACK(effect, 0, this)) {
      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { superType: SuperType.POKEMON, stage: Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    return state;

  }
}