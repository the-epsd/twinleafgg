import { PokemonCard, Stage, CardType, StoreLike, State, PowerType, ChooseCardsPrompt, ConfirmPrompt, GameMessage, ShowCardsPrompt, StateUtils, SuperType, CardTag } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Noctowl extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Hoothoot';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 100;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [ {type: CardType.FIGHTING, value: -30}];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Jewel Hunt',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this card from your hand to evolve one of your Pokémon, if you have any Tera Pokémon in play, you may search your deck for up to 2 Trainer cards, reveal them, and put them into your hand. Shuffle your deck.'
  }];

  public attacks = [
    {
      name: 'Speed Wing',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 60,
      text: ''
    }
  ];
  
  public regulationMark = 'H';

  public set: string = 'SV7';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '77';
  
  public name: string = 'Noctowl';
  
  public fullName: string = 'Noctowl SV7';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.usedJewelHunt = false;
      return state;
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      if (player.deck.cards.length === 0) {
        return state;
      }

      if (player.usedJewelHunt == true) {
        return state;
      }
      
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

          let teraPokemonCount = 0;

          if (player.active?.getPokemonCard()?.tags.includes(CardTag.POKEMON_TERA)) {
            teraPokemonCount++;
          }

          player.bench.forEach(benchSpot => {
            if (benchSpot.getPokemonCard()?.tags.includes(CardTag.POKEMON_TERA)) {
              teraPokemonCount++;
            }
          });

          if (teraPokemonCount >= 1) {
      
            state = store.prompt(state, new ChooseCardsPrompt(
              player.id,
              GameMessage.CHOOSE_CARD_TO_HAND,
              player.deck,
              { superType: SuperType.TRAINER },
              { min: 0, max: 2, allowCancel: false }
            ), selected => {
              const cards = selected || [];
  
              store.prompt(state, [new ShowCardsPrompt(
                opponent.id,
                GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
                cards
              )], () => {
                player.deck.moveCardsTo(cards, player.hand);
                player.usedJewelHunt = true;
              });
              return state;
            });
          }
        }
      });
    }
    return state;
  }
}