import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Regieleki extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Static Shock',
      cost: [ CardType.COLORLESS ],
      damage: 20,
      text: ''
    },
    {
      name: 'Teraspark',
      cost: [ CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS ],
      damage: 120,
      text: 'Discard all [L] Energy from this Pokémon. This attack also does 40 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '60';

  public name: string = 'Regieleki';

  public fullName: string = 'Regieleki EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      
      const min = Math.min(2, benched);
      const max = Math.min(2, benched);
      
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { min, max, allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 40);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        
        const player = effect.player;
        const cards = player.active.cards.filter(c => c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING));
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
        
        return state;
      });
    }
    
    return state;
  }
}