import { Effect } from '../../game/store/effects/effect';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GameError, GameMessage, PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';

export class Grant extends TrainerCard {

  public trainerType: TrainerType = TrainerType.SUPPORTER;

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '144';

  public name: string = 'Grant';

  public fullName: string = 'Grant ASR';

  public text: string =
    'During this turn, your [F] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).';

  public powers = [{
    name: 'Grant',
    useFromDiscard: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, if this Grant is in your discard pile, you may discard 2 cards, except any Grant, from your hand. If you do, put this Grant into your hand. (This effect doesn\'t use up your Supporter card for the turn.)'
  }];

  private readonly GRANT_MARKER = 'GRANT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect &&
      !effect.powers.find(p => p.name === this.powers[0].name)) {
      effect.powers.push(this.powers[0]);
    }

    if (effect instanceof TrainerEffect && effect.trainerCard === this) {
      const player = effect.player;
      const supporterTurn = player.supporterTurn;

      if (supporterTurn > 0) {
        throw new GameError(GameMessage.SUPPORTER_ALREADY_PLAYED);
      }

      player.hand.moveCardTo(effect.trainerCard, player.supporter);
      // We will discard this card after prompt confirmation
      effect.preventDefault = true;

      player.marker.addMarker(this.GRANT_MARKER, this);
      player.supporter.moveCardTo(effect.trainerCard, player.discard);
    }

    if (effect instanceof DealDamageEffect) {
      const player = effect.player;
      if (player.marker.hasMarker(this.GRANT_MARKER, this) && effect.damage > 0) {
        effect.damage += 30;
      }
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.GRANT_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      // Check if card is in the discard
      if (!player.discard.cards.includes(this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.discard.moveCardTo(this, player.hand);
    }

    return state;
  }
}

