import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


export class RaichuV extends PokemonCard {

  public regulationMark = 'F';

  public tags = [ CardTag.POKEMON_V ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 200;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Fast Charge',
      cost: [CardType.LIGHTNING ],
      damage: 0,
      text: 'If you go first, you can use this attack during your first turn. Search your deck for a L Energy card and attach it to this Pokémon. Then, shuffle your deck.'
    },
    {
      name: 'Dynamic Spark',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING ],
      damage: 60,
      text: 'You may discard any amount of L Energy from your Pokémon. This attack does 60 damage for each card you discarded in this way.'
    }
  ];

  public set: string = 'BRS';

  public name: string = 'Raichu V';

  public fullName: string = 'Raichu V BRS';

  // Implement power
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
    
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH], 
        { min: 1, max: 6, allowCancel: false }
      ), targets => {
        targets.forEach(target => {

          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            target, // Card source is target Pokemon
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Lightning Energy' },
            { min: 1, allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
    
              const discardEnergy = new DiscardCardsEffect(effect, cards);
              discardEnergy.target = target;
              store.reduceEffect(state, discardEnergy);
    
              effect.damage = discardEnergy.cards.length * 60;
            }
          });
        });
      });
    }
    return state;
  }
}