import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Gurdurr extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Timburr';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 100;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    { 
      name: 'Knuckle Punch', 
      cost: [CardType.FIGHTING], 
      damage: 20, 
      text: '' 
    },

    { 
      name: 'Superpower', 
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS], 
      damage: 50, 
      text: 'You may do 30 more damage. If you do, this Pokémon also does 30 damage to itself.' 
    },
  ];

  public set: string = 'TWM';

  public setNumber = '104';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Gurdurr';

  public fullName: string = 'Gurdurr TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Superpower
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          effect.damage += 30;
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = player.active;
          store.reduceEffect(state, damageEffect);
        }});
    }

    return state;
  }
}