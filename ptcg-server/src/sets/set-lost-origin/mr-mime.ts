import { GameLog, GameMessage, GamePhase, PlayerType, PokemonCard, SelectPrompt, Stage, State, StateUtils, StoreLike } from '../../game';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MrMime extends PokemonCard {
  public cardType = P;
  public hp = 90;
  public stage = Stage.BASIC;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Pound',
      cost: [C],
      damage: 20,
      text: ''
    },
    {
      name: 'Tricky Slap',
      cost: [P, C, C],
      damage: 90,
      text: 'You and your opponent play Rock-Paper-Scissors until someone wins. If you win, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
    }
  ];

  public regulationMark = 'F';
  public set: string = 'LOR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';
  public name: string = 'Mr. Mime';
  public fullName: string = 'Mr. Mime LOR';

  public readonly TRICKY_SLAP_MARKER = 'TRICKY_SLAP_MARKER';
  public readonly CLEAR_TRICKY_SLAP_MARKER = 'CLEAR_TRICKY_SLAP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tricky Slap
    if (WAS_ATTACK_USED(effect, 1, this)){
      const player = effect.player;
      const opponent = effect.opponent;
      // our options (idk why value is here because it definitely isn't used at all but eh)
      const options = [
        { value: 'Rock', message: 'Rock' },
        { value: 'Paper', message: 'Paper' },
        { value: 'Scissors', message: 'Scissors' }
      ];

      // simultaneous prompt showing gaming
      store.prompt(state, [
        new SelectPrompt(
          player.id, GameMessage.CHOOSE_OPTION,
          options.map(c => c.message),
          { allowCancel: false }
        ),
        new SelectPrompt(
          opponent.id, GameMessage.CHOOSE_OPTION,
          options.map(c => c.message),
          { allowCancel: false }
        ),
      ], results => {
        // variable time
        const playerChosenValue = results[0];
        const opponentChosenValue = results[1];
        // outputting what both players chose
        store.log(state, GameLog.LOG_PLAYER_CHOOSES, { name: player.name, string: options[playerChosenValue].message });
        store.log(state, GameLog.LOG_PLAYER_CHOOSES, { name: opponent.name, string: options[opponentChosenValue].message });
        // if they tie, restart it
        if (playerChosenValue === opponentChosenValue) { return this.reduceEffect(store, state, effect); }
        
        // Gotta make the win conditions
        if ((playerChosenValue === 1 && opponentChosenValue === 0) 
          || (playerChosenValue === 2 && opponentChosenValue === 1) 
          || (playerChosenValue === 0 && opponentChosenValue === 2)){
          player.active.marker.addMarker(this.TRICKY_SLAP_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_TRICKY_SLAP_MARKER, this);
        }
      });
    }

    // preventing damage is fun
    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) 
      && effect.target.cards.includes(this) && effect.target.marker.hasMarker(this.TRICKY_SLAP_MARKER, this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      // Card is not active, or damage source is unknown
      if (pokemonCard !== this || sourceCard === undefined)
        return state;

      // Do not ignore self-damage from Pokemon-Ex
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);
      if (player === opponent || state.phase !== GamePhase.ATTACK){
        return state;
      }

      effect.preventDefault = true;
    }

    // removing the thing
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_TRICKY_SLAP_MARKER, this)){
      const opponent = StateUtils.getOpponent(state, effect.player);
      effect.player.marker.removeMarker(this.CLEAR_TRICKY_SLAP_MARKER, this);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.marker.hasMarker(this.TRICKY_SLAP_MARKER, this)){
          cardList.marker.removeMarker(this.TRICKY_SLAP_MARKER, this);
        }
      });
    }
    
    return state;
  }
}
