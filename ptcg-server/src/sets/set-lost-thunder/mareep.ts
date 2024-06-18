import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, CardList, ChooseCardsPrompt, GameError, GameMessage, PlayerType, ShowCardsPrompt, ShuffleDeckPrompt, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Mareep extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.LIGHTNING;
  
  public hp: number = 50;
  
  public weakness = [{ type: CardType.FIGHTING }];
  
  public resistance = [{ type: CardType.METAL, value: -20 }];
  
  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Tackle',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: ''
  }];
  
  public powers = [{
    name: 'Fluffy Pillow',
    powerType: PowerType.ABILITY,
    text: "Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may leave your opponent's Active Pokémon Asleep.",
    useWhenInPlay: true
  }];

  public set: string = 'LOT';
  public fullName: string = 'Mareep LOT';
  public name: string = 'Mareep';
  public setNumber: string = '75';
  
  public FLUFFY_PILLOW_MARKER = 'FLUFFY_PILLOW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FLUFFY_PILLOW_MARKER, this);
      return state;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
  
      player.marker.addMarker(this.FLUFFY_PILLOW_MARKER, this);
      const opponent = StateUtils.getOpponent(state, player);
      
      opponent.active.addSpecialCondition(SpecialCondition.ASLEEP);
    }
    
    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.FLUFFY_PILLOW_MARKER, this);
    }

    return state;
  }
}