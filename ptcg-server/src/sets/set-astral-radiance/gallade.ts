import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, 
  GameMessage, 
  ChooseCardsPrompt,
  ShuffleDeckPrompt,
  GameError,
  PlayerType} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Gallade extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Kirlia';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 160;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Buddy Catch',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a ' +
      'Supporter card, reveal it, and put it into your hand. Then, ' +
      'shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Swirling Slice',
      cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 160,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon'
    }
  ];

  public set: string = 'ASR';

  public name: string = 'Gallade';

  public fullName: string = 'Gallade ASR';
  
  public readonly BUDDY_CATCH_MARKER = 'BUDDY_CATCH_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.BUDDY_CATCH_MARKER, this);
    }
      
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.BUDDY_CATCH_MARKER, this);
    }
      
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.BUDDY_CATCH_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
        
      return store.prompt(state, new ChooseCardsPrompt(
        player.id, 
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck, 
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 2, allowCancel: true }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);
  
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
          player.marker.addMarker(this.BUDDY_CATCH_MARKER, this);
        });
      });
    }
    if (effect instanceof EndTurnEffect) {
    
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
        if (player instanceof Gallade) {
          player.marker.removeMarker(this.BUDDY_CATCH_MARKER);
        }
      });
      return state;
    }
    return state;
  }
}