import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError } from '../../game/game-error';
import { PokemonCardList } from '../..';

export class Gengar extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Haunter';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Propagation',
    useFromDiscard: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokemon is in '
      + 'your discard pile, you may put this Pokemon into your hand.'
  }];

  public attacks = [{
    name: 'Seed Bomb',
    cost: [ CardType.GRASS, CardType.COLORLESS ],
    damage: 20,
    text: ''
  }];

  public regulationMark = 'G';

  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '66';

  public name: string = 'Gengar';

  public fullName: string = 'Gengar LOR';

  public readonly PROPAGATION_MAREKER = 'PROPAGATION_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      // Check if card is in the discard
      if (player.discard.cards.includes(this) === false) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Power already used
      if (player.marker.hasMarker(this.PROPAGATION_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      player.marker.addMarker(this.PROPAGATION_MAREKER, this);

      const cards = player.discard.cards.filter(c => c instanceof PokemonCard && c.name == 'Gengar');
      cards.forEach((card, index) => {
        player.deck.moveCardTo(card, slots[index]);
        slots[index].pokemonPlayedTurn = state.turn;
      });

      if (effect instanceof EndTurnEffect) {
        effect.player.marker.removeMarker(this.PROPAGATION_MAREKER, this);
      }

      return state;
    }
    return state;
  }
}
