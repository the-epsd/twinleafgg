import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PlayerType, PowerType, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Garchomp extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Gabite';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 160;

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Sonic Slip',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may prevent all damage from and effects of attacks done to this Pokémon until the end of your opponent\'s next turn.'
  }];

  public attacks = [
    {
      name: 'Dragonblade',
      cost: [CardType.WATER, CardType.FIGHTING],
      damage: 160,
      text: 'Discard the top 2 cards of your deck.'
    }
  ];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '109';

  public regulationMark = 'F';

  public name: string = 'Garchomp';

  public fullName: string = 'Garchomp BRS';

  public readonly SONIC_SLIP_MARKER: string = 'SONIC_SLIP_MARKER';
  public readonly CLEAR_SONIC_SLIP_MARKER: string = 'CLEAR_SONIC_SLIP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      // Discard 2 cards from your deck 
      player.deck.moveTo(player.discard, 2);
      return state;
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.SONIC_SLIP_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SONIC_SLIP_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.SONIC_SLIP_MARKER)) {

      const sourcePokemon = effect.source.getPokemonCard();

      if (sourcePokemon !== this) {
        effect.preventDefault = true;
      }

      return state;

    }

    if (effect instanceof EndTurnEffect && effect.player === StateUtils.getOpponent(state, effect.player)) {
      const player = StateUtils.getOpponent(state, effect.player);
      player.marker.removeMarker(this.CLEAR_SONIC_SLIP_MARKER, this);
      player.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.marker.hasMarker(this.SONIC_SLIP_MARKER)) {
          cardList.marker.removeMarker(this.SONIC_SLIP_MARKER, this);
        }
      });
    }

    return state;
  }

}
