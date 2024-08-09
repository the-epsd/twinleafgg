import { ConfirmPrompt, GameMessage, PokemonCardList, PowerType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

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

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Discard 2 cards from your deck 
      player.deck.moveTo(player.discard, 2);
      return state;
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const cardList = StateUtils.findCardList(state, this) as PokemonCardList;          
          cardList.marker.addMarker(this.SONIC_SLIP_MARKER, this);
        }
      });      
      
      return state;
    }
    
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.SONIC_SLIP_MARKER, this)) {
      effect.preventDefault = true;
      return state;
    }
    
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      const owner = StateUtils.findOwner(state, cardList);
      
      if (owner !== player) {
        cardList.marker?.removeMarker(this.SONIC_SLIP_MARKER, this);
      }
    }

    return state;
  }

}
