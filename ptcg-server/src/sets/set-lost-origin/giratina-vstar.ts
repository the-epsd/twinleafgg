import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { ChooseCardsPrompt, ChoosePokemonPrompt, GameError, PlayerType, PokemonCard, SlotType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class GiratinaVSTAR extends PokemonCard {
  
  public stage: Stage = Stage.VSTAR;

  public cardTag = [ CardTag.POKEMON_VSTAR ];

  public evolvesFrom = 'Giratina V';

  public regulationMark = 'F';
  
  public cardType: CardType = CardType.DRAGON;
  
  public hp: number = 280;
  
  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];
  
  public attacks = [
    {
      name: 'Lost Impact',
      cost: [ CardType.GRASS, CardType.PSYCHIC, CardType.COLORLESS ],
      damage: 280,
      text: 'Put 2 Energy attached to your Pokémon in the Lost Zone.'
    },
    {
      name: 'Star Requium',
      cost: [ CardType.GRASS, CardType.PSYCHIC ],
      damage: 0,
      text: 'You can use this attack only if you have 10 or more cards in the Lost Zone. Your opponent\'s Active Pokémon is Knocked Out. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];
  
  public set: string = 'LOR';

  public set2: string = 'lostorigin';

  public setNumber: string = '131';
  
  public name: string = 'Giratina VSTAR';
  
  public fullName: string = 'Giratina VSTAR LOR';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
    
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH], 
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
  
          const target = targets[0];
  
          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            target, // Card source is target Pokemon
            { superType: SuperType.ENERGY },
            { min: 2, max:2, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
      
              target.moveCardsTo(cards, player.lostzone);

            }});
        }});
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      if (player.lostzone.cards.length <= 9) {
        throw new GameError (GameMessage.CANNOT_USE_POWER);  
      }

      if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
          
      if (player.lostzone.cards.length >= 10) {

        const opponent = StateUtils.getOpponent(state, player);

        const activePokemon = opponent.active.getPokemonCard();
        if (activePokemon) {
          activePokemon.hp = 0;
          player.marker.addMarker(this.VSTAR_MARKER, this);
        }
      }
    }

    return state;
  }
}
