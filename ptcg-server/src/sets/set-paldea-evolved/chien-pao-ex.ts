import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, ShuffleDeckPrompt, PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';


export class ChienPaoex extends PokemonCard {

  public tags = [ CardTag.POKEMON_EX ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 220;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Shivery Chill',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active ' +
      'Spot, you may search your deck for up to 2 Basic [W] Energy ' +
      'cards, reveal them, and put them into your hand. Then, ' +
      'shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Hail Blade',
      cost: [CardType.WATER, CardType.WATER ],
      damage: 60,
      text: 'You may discard any amount of W Energy from your ' +
        'Pokémon. This attack does 60 damage for each card you ' +
        'discarded in this way.'
    }
  ];

  public set: string = 'PAL';

  public name: string = 'Chien-Pao ex';

  public fullName: string = 'Chien-Pao ex PAL';

  // Implement power
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      
      const player = effect.player;

      if (player.active.cards[0] !== this) {
        return state; // Not active
      }

      
      return store.prompt(state, new ChooseCardsPrompt(
        player.id, 
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck, 
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: 0, max: 2, allowCancel: true }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });

    }

    //    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
    //
    //      const player = effect.player;
    //    
    //      const checkEnergy = new CheckProvidedEnergyEffect(player);
    //      store.reduceEffect(state, checkEnergy);
    //    
    //      const waterEnergies = checkEnergy.energyMap.filter(em => 
    //        Array.isArray(em.provides) && em.provides.some(p => {
    //          if (p instanceof EnergyCard) {
    //            return p.energyType === EnergyType.BASIC && p.superType === SuperType.ENERGY && p.name === 'Water Energy';
    //          }
    //          return false;
    //        })
    //
    //      );
    //    
    //      
    //      return store.prompt(state, new ChooseCardsPrompt(
    //        player.id,
    //        GameMessage.CHOOSE_CARD_TO_DISCARD,
    //        PlayerType.BOTTOM_PLAYER,
    //        [ SlotType.ACTIVE, SlotType.BENCH ],
    //        waterEnergies.map(em => em.card),
    //      ), cards => {
    //    
    //        const discardEffect = new DiscardCardsEffect(effect, cards);
    //        discardEffect.target = player.active;
    //        store.reduceEffect(state, discardEffect);
    //    
    //        effect.damage = cards.length * 60;
    //    
    //      });
    //    
    //    }
    
    return state;
  }
}