import { PokemonCard } from '../../game/store/card/pokemon-card'; 
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class RadiantHawlucha extends PokemonCard {

  public stage = Stage.BASIC;

  public tags = [CardTag.RADIANT];

  public cardType = CardType.FIGHTING;
  
  public hp = 90;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Big Match',
    powerType: PowerType.ABILITY, 
    text: 'As long as this Pokémon is on your Bench, your Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon VMAX (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Spiral Kick',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 50,
    text: ''
  }];

  public regulationMark = 'F';

  public set: string = 'ASR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '81';

  public name: string = 'Radiant Hawlucha';

  public fullName: string = 'Radiant Hawlucha ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (player.active.getPokemonCard() === this) {
        return state;
      }

      if (effect.target !== player.active && effect.target !== opponent.active) {
        return state;
      }
        
      const targetCard = effect.target.getPokemonCard();
      if (targetCard && targetCard.tags.includes(CardTag.POKEMON_VMAX)) {
        effect.damage += 30;
      }
    }
        
    return state;
  }
}
        