import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {DealDamageEffect, PutDamageEffect} from '../../game/store/effects/attack-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class RegirockEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX ];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: G }];
  public retreat = [ C, C, C ];

  public powers = [{
    name: 'Regi Power',
    powerType: PowerType.ABILITY,
    text: 'The attacks of your [F] Pokémon (excluding Regirock-EX) do 10 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Bedrock Press',
      cost: [ F, F, F ],
      damage: 100,
      text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 20 (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'FCO';
  public name: string = 'Regirock EX';
  public fullName: string = 'Regirock EX FCO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';

  public readonly BEDROCK_PRESS_MARKER = 'BEDROCK_PRESS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Regi Power
    if (effect instanceof PutDamageEffect && effect.source.getPokemonCard()?.cardType === CardType.FIGHTING){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const cardList = StateUtils.findCardList(state, this);
      if (cardList === undefined){ return state; }
      const owner = StateUtils.findOwner(state, cardList);

      if (player !== owner){ return state; }

      if (effect.damage > 0 && effect.target === opponent.active){
        effect.damage += 10;
      }
    }
    
    // Bedrock Press
    if (WAS_ATTACK_USED(effect, 0, this)){
      const opponent = effect.opponent;

      this.marker.addMarker(this.BEDROCK_PRESS_MARKER, this);
      opponent.marker.addMarker(this.BEDROCK_PRESS_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.marker.hasMarker(this.BEDROCK_PRESS_MARKER, this)){
      effect.damage -= 20;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BEDROCK_PRESS_MARKER, this)){
      const opponent = StateUtils.getOpponent(state, effect.player);

      effect.player.marker.removeMarker(this.BEDROCK_PRESS_MARKER, this);
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.getPokemonCard() === this){ card.marker.removeMarker(this.BEDROCK_PRESS_MARKER, this); }
      });
    }

    return state;
  }

}
