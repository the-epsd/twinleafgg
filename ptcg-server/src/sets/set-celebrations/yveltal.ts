import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard, ChooseCardsPrompt, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


export class Yveltal extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Cry of Destruction',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'Discard up to 3 Special Energy from your opponent\'s Pokémon.'
    },
    {
      name: 'Dark Feather',
      cost: [ CardType.DARK, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'CEL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '19';

  public name: string = 'Yveltal';

  public fullName: string = 'Yveltal CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const oppBench = opponent.bench.find(b => b.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL));
      const oppActive = opponent.active;

      const oppPokemon = oppBench || oppActive;


      const checkEnergy = new CheckProvidedEnergyEffect(player, oppPokemon);
      store.reduceEffect(state, checkEnergy);

      checkEnergy.energyMap.forEach(em => {
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.energyType === EnergyType.SPECIAL) {

          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH], 
            { min: 1, max: 6, allowCancel: false }
          ), targets => {
            targets.forEach(target => {
    
              return store.prompt(state, new ChooseCardsPrompt(
                player,
                GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
                target, // Card source is target Pokemon
                { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
                { max: 3, allowCancel: false }
              ), selected => {
                const cards = selected || [];
                if (cards.length > 0) {
    
                  targets.forEach(target => {
    
                    const discardEnergy = new DiscardCardsEffect(effect, cards);
                    discardEnergy.target = target;

                  });
                  return state;
                }
                return state;
              });
            });
            return state;
          });
        }
        return state;
      });
      return state;
    }
    return state;
  }
}