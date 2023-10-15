import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, ShuffleDeckPrompt, PowerType, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';


export class ChienPaoex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [ CardTag.POKEMON_ex ];

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

  public set2: string = 'paldeaevolved';

  public setNumber: string = '61';

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
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
            { allowCancel: false }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {

              let totalDiscarded = 0; 

              targets.forEach(target => {

                const discardEnergy = new DiscardCardsEffect(effect, cards);
                discardEnergy.target = target;

                totalDiscarded += discardEnergy.cards.length;
      
                effect.damage = totalDiscarded * 60;

                store.reduceEffect(state, discardEnergy);
              });
              return state;
            }});
        });
        return state;
      });
    }
    return state;
  }
}