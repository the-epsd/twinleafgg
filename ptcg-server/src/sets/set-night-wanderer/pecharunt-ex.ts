import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PowerType, StateUtils } from '../../game';


export class Pecharuntex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [ CardTag.POKEMON_ex ];

  public regulationMark = 'H';

  public cardType: CardType = CardType.DARK;

  public hp: number = 190;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Chains of Control',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, you may switch 1 of your Benched Darkness Pkmn (excl. Pecharunt ex) with your Active. Your new Active is now Poisoned. You can\'t use more than 1 Chains of Control Ability per turn.'
  }];

  public attacks = [{
    name: 'Irritating Burst',
    cost: [ CardType.DARK, CardType.DARK ],
    damage: 60,
    text: 'This attack does 60 damage for each Prize card your opponent has taken.'
  }];

  public set: string = 'SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '39';
  
  public name: string = 'Pecharunt ex';
  
  public fullName: string = 'Pecharunt ex SV6a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      const prizesTaken = 6 - opponent.getPrizeLeft();
      
      const damagePerPrize = 60;
      
      effect.damage = prizesTaken * damagePerPrize;
    }
    return state;
  }
}

