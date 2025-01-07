import { CardType, CoinFlipPrompt, GameMessage, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';

export class Combusken extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Torchic';

  public cardType: CardType = R;

  public hp: number = 80;

  public weakness = [{ type: W }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Lunge',
      cost: [R, C],
      damage: 60,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];
  
  public powers = [{
    name: 'Heat Boost',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Whenever you attach an Energy card from your hand to this Pokémon, remove all Special Conditions from it.'
  }];

  public set: string = 'DRM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '5';

  public name: string = 'Combusken';

  public fullName: string = 'Combusken DRM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }
    
    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      
      if (effect.target.specialConditions.length === 0) {
        return state;
      }
      
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      const conditions = effect.target.specialConditions.slice();
      conditions.forEach(condition => {
        effect.target.removeSpecialCondition(condition);
      });
    }
    
    return state;
  }
}