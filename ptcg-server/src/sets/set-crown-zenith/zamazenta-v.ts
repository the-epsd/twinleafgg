import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, GameError, GameMessage } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class ZamazentaV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [ { type: CardType.GRASS, value: -30 } ];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];
  
  public powers = [{
    name: 'Regal Stance',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has any Energy attached, it takes 30 less damage from attacks (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Revenge Blast',
      cost: [ CardType.METAL, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 120,
      text: 'This attack does 30 more damage for each Prize card your opponent has taken.'
    },
  ];

  public set: string = 'CRZ';

  public set2: string = 'crownzenith';

  public setNumber: string = '98';

  public name: string = 'Zamazenta V';

  public fullName: string = 'Zamazenta V CRZ';

  public readonly REGAL_STANCE_MARKER = 'REGAL_STANCE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
        
      const player = effect.player;

      if (player.marker.hasMarker(this.REGAL_STANCE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      player.hand.moveCardsTo(cards, player.discard);
      player.deck.moveTo(player.hand, 5);
      player.marker.addMarker(this.REGAL_STANCE_MARKER, this);
      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.REGAL_STANCE_MARKER, this);
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const prizesTaken = 6 - opponent.getPrizeLeft();
      
      const damagePerPrize = 30;
      
      effect.damage = this.attacks[0].damage + (prizesTaken * damagePerPrize);
    }
    return state;
  }
}