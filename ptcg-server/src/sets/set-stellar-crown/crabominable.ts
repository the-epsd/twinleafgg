import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PowerType, State, StoreLike, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Crabominable extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Crabrawler';

  public cardType: CardType = CardType.WATER;

  public hp: number = 160;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Food Prep',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Attacks used by this Pokémon cost [C] less for each Kofu card in your discard pile.'
  }];

  public attacks = [
    {
      name: 'Haymaker',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 250,
      text: 'During your next turn, this Pokémon can\'t use Haymaker.'
    }
  ];

  public set: string = 'SCR';

  public name: string = 'Crabominable';

  public fullName: string = 'Crabominable SCR';

  public setNumber: string = '42';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';


  public readonly HAYMAKER_MARKER_1 = 'HAYMAKER_MARKER_1';
  public readonly HAYMAKER_MARKER_2 = 'HAYMAKER_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Food Prep
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;

      if (effect.player !== player || player.active.getPokemonCard() !== this) {
        return state;
      }

      // i love checking for ability lock woooo
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      let kofuCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.name === 'Kofu') {
          kofuCount += 1;
        }
      });
      const index = effect.cost.indexOf(CardType.COLORLESS);
      effect.cost.splice(index, kofuCount);

      return state;
    }


    // Haymaker
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (player.marker.hasMarker(this.HAYMAKER_MARKER_1, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.marker.addMarker(this.HAYMAKER_MARKER_1, this);
    }

    // doing end of turn things with the markers
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.HAYMAKER_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.HAYMAKER_MARKER_1, this);
      effect.player.marker.removeMarker(this.HAYMAKER_MARKER_2, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.HAYMAKER_MARKER_1, this)) {
      effect.player.marker.addMarker(this.HAYMAKER_MARKER_2, this);
    }

    return state;
  }
}