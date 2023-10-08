import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils,
  GameMessage, ConfirmPrompt, ChooseCardsPrompt, EnergyCard, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class GalarianMoltres extends PokemonCard {

  public regulationMark = 'E';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 120;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Malevolent Charge',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may attach up to 2 D Energy cards from your hand to this Pokémon.'

  }];

  public attacks = [
    {
      name: 'Fiery Wrath',
      cost: [ CardType.DARK, CardType.DARK, CardType.COLORLESS ],
      damage: 20,
      text: 'This attack does 50 more damage for each Prize card your ' +
      'opponent has taken.'
    }
  ];

  public set: string = 'EVS';

  public name: string = 'Galarian Moltres';

  public fullName: string = 'Galarian Moltres EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof PlayPokemonEffect) && effect.pokemonCard === this) {

    
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
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
              && c.provides.includes(CardType.DARK);
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
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Darkness Energy' },
            { min: 0, max: 2, allowCancel: true }
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
    
          const prizesTaken = 6 - opponent.getPrizeLeft();
    
          const damagePerPrize = 50;
    
          effect.damage = this.attacks[0].damage + (prizesTaken * damagePerPrize);
        }
        return state;
      });
    }
    return state;
  }
}
