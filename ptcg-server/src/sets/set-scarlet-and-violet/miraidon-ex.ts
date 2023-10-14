import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, 
  GameMessage, Card, ChooseCardsPrompt, ShuffleDeckPrompt, GameError, PokemonCardList, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Miraidonex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Tandem Unit',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for up ' +
    'to 2 Basic L Pokémon and put them onto your Bench. ' +
    'Then, shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Photon Blaster',
      cost: [ CardType.COLORLESS ],
      damage: 220,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'SVI';

  public set2: string = 'scarletviolet';

  public setNumber: string = '81';

  public name: string = 'Miraidon ex';

  public fullName: string = 'Miraidon ex SVI';

  public readonly TANDEM_UNIT_MARKER = 'TANDEM_UNIT_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.TANDEM_UNIT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
          
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
          
      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);
      
      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
             
          
      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC, cardType: CardType.LIGHTNING },
        { min: 0, max: 2, allowCancel: true }
      ), selectedCards => {
        cards = selectedCards || [];
          
      
        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
          player.marker.addMarker(this.TANDEM_UNIT_MARKER, this);
          return state;
        });
      
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
      
          if (effect instanceof EndTurnEffect) {
            effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
              if (player instanceof Miraidonex) {
                player.marker.removeMarker(this.TANDEM_UNIT_MARKER);
                return state;
              }
            });
            return state;
          }
        });
      });
    }
    return state;
  }
}