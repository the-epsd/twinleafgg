import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Card, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


export class VictiniV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIRE;

  public hp: number = 190;

  public weakness = [{ type: CardType.WATER }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'V Bullet',
      cost: [ CardType.FIRE ],
      damage: 10,
      text: 'If your opponent’s Active Pokémon is a Pokémon V, this ' +
        'attack does 50 more damage.'
    },
    {
      name: 'Dragon Burst',
      cost: [CardType.FIRE, CardType.COLORLESS ],
      damage: 120,
      text: 'Discard all Energy from this Pokémon.'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

  public name: string = 'Victini V';

  public fullName: string = 'Victini V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      const defending = opponent.active.getPokemonCard();
      if (defending && (defending.tags.includes(CardTag.POKEMON_V) || 
                          defending.tags.includes(CardTag.POKEMON_VMAX) ||
                          defending.tags.includes(CardTag.POKEMON_VSTAR))) {
        effect.damage += 50;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
        
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);  
        
      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);  
      const discardEnergy = new DiscardCardsEffect(effect, cards);  
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);  
    }
    
    return state; 
  }
      
}
