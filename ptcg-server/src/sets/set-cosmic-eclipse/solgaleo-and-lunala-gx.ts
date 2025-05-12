import { CardTag, CardType, GameError, GameMessage, PlayerType, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {AddSpecialConditionsEffect, PutCountersEffect, PutDamageEffect} from '../../game/store/effects/attack-effects';
import {PlaySupporterEffect} from '../../game/store/effects/play-card-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class SolgaleoLunalaGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: P }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Cosmic Burn',
      cost: [ P, P, P, C ],
      damage: 230,
      text: 'This Pokémon can\'t use Cosmic Burn during your next turn.'
    },
    {
      name: 'Light of the Protector-GX',
      cost: [ P, P, C ],
      damage: 200,
      gxAttack: true,
      text: 'If you played Lillie\'s Full Force from your hand during this turn, prevent all effects of attacks, including damage, done to each of your Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'CEC';
  public setNumber = '75';
  public cardImage = 'assets/cardback.png';
  public name = 'Solgaleo & Lunala-GX';
  public fullName = 'Solgaleo & Lunala-GX CEC';

  public readonly COSMIC_BURN_MARKER = 'COSMIC_BURN_MARKER';
  public readonly CLEAR_COSMIC_BURN_MARKER = 'CLEAR_COSMIC_BURN_MARKER';

  public readonly PLAYED_LILLIES_FULL_FORCE_MARKER = 'PLAYED_LILLIES_FULL_FORCE_MARKER';
  public readonly LIGHT_OF_THE_PROTECTOR_MARKER = 'LIGHT_OF_THE_PROTECTOR_MARKER';
  public readonly CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER = 'CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cosmic Burn
    if (WAS_ATTACK_USED(effect, 0, this)){
      if (effect.player.active.marker.hasMarker(this.COSMIC_BURN_MARKER, this)){
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      effect.player.active.marker.addMarker(this.COSMIC_BURN_MARKER, this);
    }

    // Light of the Protector-GX
    if (effect instanceof PlaySupporterEffect){
      const player = effect.player;

      if (effect.trainerCard.name === 'Lillie\'s Full Force'){
        player.marker.addMarker(this.PLAYED_LILLIES_FULL_FORCE_MARKER, this);
      }
    }


    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      if (player.marker.hasMarker(this.PLAYED_LILLIES_FULL_FORCE_MARKER, this)){
        player.marker.addMarker(this.LIGHT_OF_THE_PROTECTOR_MARKER, this);
        opponent.marker.addMarker(this.CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER, this);
      }
    }

    // Cosmic Burn Marker things
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_COSMIC_BURN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_COSMIC_BURN_MARKER, this);

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.marker.hasMarker(this.COSMIC_BURN_MARKER, this)){
          card.marker.removeMarker(this.COSMIC_BURN_MARKER, this);
        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.COSMIC_BURN_MARKER, this)) {
      effect.player.marker.addMarker(this.CLEAR_COSMIC_BURN_MARKER, this);
    }

    // Light of the Protector
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER, this)){
      const opponent = StateUtils.getOpponent(state, effect.player);

      effect.player.marker.removeMarker(this.CLEAR_LIGHT_OF_THE_PROTECTOR_MARKER, this);
      opponent.marker.removeMarker(this.LIGHT_OF_THE_PROTECTOR_MARKER, this);
    }

    if ((effect instanceof PutDamageEffect 
      || effect instanceof PutCountersEffect 
      || effect instanceof AddSpecialConditionsEffect) && effect.opponent.marker.hasMarker(this.LIGHT_OF_THE_PROTECTOR_MARKER, this)){
      effect.preventDefault = true;
    }

    return state;
  }
}