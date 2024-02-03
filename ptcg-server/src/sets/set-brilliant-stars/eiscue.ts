import { PokemonCard, Stage, CardType, CardTag, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Eiscue extends PokemonCard {

  public stage = Stage.BASIC;

  public cardType = CardType.WATER; 

  public hp = 110;

  public weakness = [{ type: CardType.METAL }];

  public resistance = [];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Block Slider',
      cost: [CardType.WATER, CardType.WATER],
      damage: 0,
      text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon for each Fusion Strike Energy attached to all of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Icicle Missile', 
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public regulationMark = 'F';

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Eiscue';

  public fullName: string = 'Eiscue BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
    
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);
        
      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType => {
          return em.card.tags.includes(CardTag.FUSION_STRIKE);
        }).length;
      });
        
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, energyCount * 40);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      }
      );
    }
    return state;
  }
}