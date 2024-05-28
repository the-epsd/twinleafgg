import { PokemonCard, Stage, CardType, PowerType, State, StoreLike, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Banette extends PokemonCard {
  
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Shuppet';
  
  public regulationMark = 'F';
    
  public cardType: CardType = CardType.PSYCHIC;
    
  public hp: number = 100;
    
  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
    
  public retreat = [ CardType.COLORLESS ];
    
  public powers = [{
    name: 'Puppet Offering',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may put a Supporter card from your discard pile into your hand. If you do, put this Pokémon in the Lost Zone. (Discard all attached cards.)'
  }];
    
  public attacks = [
    {
      name: 'Spooky Shot',
      cost: [ CardType.PSYCHIC, CardType.PSYCHIC ],
      damage: 50,
      text: ''
    }
  ];
    
  public set: string = 'LOR';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '73';
    
  public name: string = 'Banette';
    
  public fullName: string = 'Banette LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {

          const pokemons = cardList.getPokemons();
          cardList.moveCardsTo(pokemons, player.lostzone);
          cardList.moveTo(player.discard);
          cardList.clearEffects();

        }
      });
    }
    return state;
  }
}