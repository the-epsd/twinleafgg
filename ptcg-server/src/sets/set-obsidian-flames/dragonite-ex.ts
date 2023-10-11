import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';


export class Dragoniteex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex ];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dragonair';

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 330;

  public weakness = [];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [{
    name: 'Wing Attack',
    cost: [ CardType.COLORLESS ],
    damage: 70,
    text: ''
  }, {
    name: 'Mighty Meteor',
    cost: [ CardType.WATER, CardType.LIGHTNING ],
    damage: 140,
    text: 'Flip a coin. If heads, this attack does 140 more damage.' +
    'If tails, during your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'OBF';

  public set2: string = 'obsidianflames';

  public setNumber: string = '159';

  public name: string = 'Dragonite ex';

  public fullName: string = 'Dragonite ex OBF';

  NO_ATTACK_NEXT_TURN_MARKER = 'NO_ATTACK_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
  
      const player = effect.player;
  
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
  
        if (result === true) {
          effect.damage += 140;
        } else {
          player.marker.addMarker(this.NO_ATTACK_NEXT_TURN_MARKER, this);
        }
  
      });
  
    }
  
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.NO_ATTACK_NEXT_TURN_MARKER)) {
      effect.player.marker.removeMarker(this.NO_ATTACK_NEXT_TURN_MARKER, this); 
    }
  
    if (effect instanceof PutDamageEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }
  
      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
  
      // Target is this Squirtle
      if (effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);
        } catch {
          return state;
        }
  
        effect.preventDefault = true;
      }
    }
  
    return state;
  }
}