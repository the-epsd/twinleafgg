import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, StateUtils, GameError, GameMessage } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { CoinFlipEffect } from "../../game/store/effects/play-card-effects";
import { WAS_POWER_USED, ABILITY_USED, REMOVE_MARKER_AT_END_OF_TURN } from "../../game/store/prefabs/prefabs";

export class Talonflame extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Fletchinder';
  public cardType: CardType = R;
  public hp: number = 150;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Sky Hunt',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may flip a coin. If heads, your opponent discards a random card from their hand.'
  }];

  public attacks = [{
    name: 'Fire Wing',
    cost: [R, R],
    damage: 110,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Talonflame';
  public fullName: string = 'Talonflame M3';

  public readonly SKY_HUNT_MARKER = 'SKY_HUNT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sky Hunt ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.marker.hasMarker(this.SKY_HUNT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      ABILITY_USED(player, this);
      player.marker.addMarkerToState(this.SKY_HUNT_MARKER);

      const coinFlipEffect = new CoinFlipEffect(player, (result: boolean) => {
        if (result === true && opponent.hand.cards.length > 0) {
          const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
          const randomCard = opponent.hand.cards[randomIndex];
          opponent.hand.moveCardTo(randomCard, opponent.discard);
        }
      });

      return store.reduceEffect(state, coinFlipEffect);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SKY_HUNT_MARKER, this);

    return state;
  }
}
