import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, SlotType, GameMessage, AttachEnergyPrompt, PlayerType, EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';


export class VictiniVMAX extends PokemonCard {

  public tags = [ CardTag.POKEMON_VMAX ];

  public regulationMark = 'E';

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Victini V';

  public cardType: CardType = CardType.FIRE;

  public hp: number = 190;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Spreading Flames',
      cost: [ CardType.COLORLESS ],
      damage: 0,
      text: 'Attach up to 3 {R} Energy cards from your discard pile to ' +
        'your Pokémon in any way you like.'
    },
    {
      name: 'Max Victory',
      cost: [CardType.FIRE, CardType.COLORLESS ],
      damage: 100,
      text: 'If your opponent’s Active Pokémon is a Pokémon V, this ' +
      'attack does 120 more damage.'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public name: string = 'Victini VMAX';

  public fullName: string = 'Victini VMAX BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
    
    
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { allowCancel: true, min: 0, max: 3 }  
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          const energyCard = transfer.card as EnergyCard;
          const attachEnergyEffect = new AttachEnergyEffect(player, energyCard, target);
          store.reduceEffect(state, attachEnergyEffect);
        }
      });
    }
  
  


    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      const defending = opponent.active.getPokemonCard();
      if (defending && (defending.tags.includes(CardTag.POKEMON_V) || 
                          defending.tags.includes(CardTag.POKEMON_VMAX) ||
                          defending.tags.includes(CardTag.POKEMON_VSTAR))) {
        effect.damage += 100;
      }
    }
    
    return state; 
  }
      
}
