import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils,
  GameMessage, ConfirmPrompt, ChooseCardsPrompt, EnergyCard, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class BloodmoonUrsaluna extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 150;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Ground Rule',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this card from your hand onto your bench, you may attach up to 2 Basic Fighting Energy cards from your hand to this Pokémon.'

  }];

  public attacks = [
    {
      name: 'Mad Mud Bite',
      cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS ],
      damage: 100,
      text: 'This attack does 30 more damage for each damage counter on your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'SV6a';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '25';

  public name: string = 'Bloodmoon Ursaluna';

  public fullName: string = 'Bloodmoon Ursaluna SV6a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof PlayPokemonEffect) && effect.pokemonCard === this) {

    
      const player = effect.player;

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
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const hasEnergyInHand = player.hand.cards.some(c => {
            return c instanceof EnergyCard
              && c.energyType === EnergyType.BASIC
              && c.provides.includes(CardType.FIGHTING);
          });
          if (!hasEnergyInHand) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }
    
          const cardList = StateUtils.findCardList(state, this);
          if (cardList === undefined) {
            return state;
          }
          
    
          return store.prompt(state, new ChooseCardsPrompt(
            player.id,
            GameMessage.CHOOSE_CARD_TO_ATTACH,
            player.hand,
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
            { min: 0, max: 2, allowCancel: false }
          ), cards => {
            cards = cards || [];
            if (cards.length > 0) {
              player.hand.moveCardsTo(cards, cardList);
            }
          });
        }

        if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);
      
          effect.damage += opponent.active.damage * 30;
          return state;
        }
        return state;
      });
    }
    return state;
  }
}