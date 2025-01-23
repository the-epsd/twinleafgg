import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameMessage } from '../../game/game-message';
import { PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayerType } from '../../game';
import { CoinFlipPrompt } from '../../game';
import { Card } from '../../game/store/card/card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import {AttachEnergyEffect} from '../../game/store/effects/play-card-effects';

export class Eevee extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Energy Evolution',
    powerType: PowerType.ABILITY,
    text: 'When you attach a basic Energy card from your hand to this Pokémon during your turn, you may search your deck for a card that evolves from this Pokémon that is the same type as that Energy card and put it onto this Pokémon to evolve it. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Quick Draw',
    cost: [ CardType.COLORLESS ],
    damage: 0,
    text: 'Flip a coin. If heads, draw a card.'
  }];

  public set: string = 'SUM';

  public setNumber = '101';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Eevee';

  public fullName: string = 'Eevee SUM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Evolution (which is a mess but hey it works)
    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)){
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      let eeveeloutionType = CardType.COLORLESS;

      switch (effect.energyCard.name){
        case 'Water Energy': eeveeloutionType = CardType.WATER; break; // Vaporeon + Glaceon
        case 'Fire Energy': eeveeloutionType = CardType.FIRE; break; // Flareon
        case 'Lightning Energy': eeveeloutionType = CardType.LIGHTNING; break; // Jolteon
        case 'Grass Energy': eeveeloutionType = CardType.GRASS; break; // Leafeon
        case 'Psychic Energy': eeveeloutionType = CardType.PSYCHIC; break; // Espeon + Sylveon (Post-SSH)
        case 'Darkness Energy': eeveeloutionType = CardType.DARK; break; // Umbreon
        case 'Fairy Energy': eeveeloutionType = CardType.FAIRY; break; // Sylveon (Pre-SSH)
        default: eeveeloutionType = CardType.COLORLESS; break; // just here to make sure nothing breaks
      }

      if (player.deck.cards.length === 0) {
        return state;
      }
      if (eeveeloutionType === CardType.COLORLESS){
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.getPokemonCard() === this) {
          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_EVOLVE,
            player.deck,
            { superType: SuperType.POKEMON, stage: Stage.STAGE_1, evolvesFrom: 'Eevee', cardType: eeveeloutionType},
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];
            if (cards){
              player.deck.moveCardsTo(cards, cardList);
              cardList.clearEffects();
              cardList.pokemonPlayedTurn = state.turn; 
            }
          });
        }
      });
    }

    // quick draw
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]){
      const player = effect.player;
  
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          player.deck.moveTo(player.hand, 1);
        }
      });
    }

    return state;
  }

}
