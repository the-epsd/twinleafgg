import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, ShuffleDeckPrompt, PowerType, Card, CardTarget, ChoosePokemonPrompt, PlayerType, PokemonCardList, SlotType, GameError, ConfirmPrompt } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';


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
      
      let hasPokemonWithEnergy = false;
      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c.superType === SuperType.ENERGY)) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push(target);
        }
      });
      
      if (!hasPokemonWithEnergy) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      
      let targets: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { min: 1, allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        
  
        let cards: Card[] = [];
        targets.forEach(target => {
          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            target,
            { superType: SuperType.ENERGY },
            { min: 0, max: 100, allowCancel: false }  
          ), selected => {
            cards = cards.concat(selected);
          });
          return state;
        });
        

        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {
            return state;
          }

 

          const damage = cards.length * 60;
          effect.damage = damage;
    
          targets.forEach(target => {
            target.moveCardsTo(cards, player.discard); 
          });
    
          return state;
        });
      
      });
    }
    return state;
  }
}

