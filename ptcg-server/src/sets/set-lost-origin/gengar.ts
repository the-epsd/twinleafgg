import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError } from '../../game/game-error';
import { PokemonCardList, StateUtils } from '../..';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Gengar extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Haunter';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Netherworld Gate',
    useFromDiscard: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in your discard pile, you may put it onto your Bench. If you do, put 3 damage counters on this Pokémon.'
  }];

  public attacks = [{
    name: 'Screaming Circle',
    cost: [CardType.PSYCHIC],
    damage: 0,
    text: 'Put 2 damage counters on your opponent\'s Active Pokémon for each of your opponent\'s Benched Pokémon.'
  }];

  public regulationMark = 'G';

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '66';

  public name: string = 'Gengar';

  public fullName: string = 'Gengar LOR';

  public readonly NETHERWORLD_GATE_MARKER = 'NETHERWORLD_GATE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      console.log('Number of bench slots open: ' + slots.length);
      // Check if card is in the discard
      if (!player.discard.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Power already used
      if (player.marker.hasMarker(this.NETHERWORLD_GATE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // No open slots, throw error
      if (slots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Add Marker
      player.marker.addMarker(this.NETHERWORLD_GATE_MARKER, this);

      const cards = player.discard.cards.filter(c => c === this);
      cards.forEach((card, index) => {
        player.discard.moveCardTo(card, slots[index]);
        slots[index].damage += 30; // Add 30 damage
      });
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.NETHERWORLD_GATE_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      const attackEffect = effect as AttackEffect;
      const damageEffect = new PutDamageEffect(attackEffect, opponentBenched * 20);
      return store.reduceEffect(state, damageEffect);
    }

    return state;
  }
}

