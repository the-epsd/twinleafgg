import { Card, CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameError, GameMessage, PlayerType, PokemonCardList, SlotType } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';


export class Yveltal extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 110;

  public weakness = [{ type: CardType.LIGHTNING }];
  
  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [  ];

  public attacks = [
    {
      name: 'Derail',
      cost: [ CardType.DARK ],
      damage: 30,
      text: 'Discard a Special Energy from your opponent\'s Active Pokémon.'
    },
    {
      name: 'Clutch',
      cost: [ CardType.DARK, CardType.DARK ],
      damage: 60,
      text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'TEU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public name: string = 'Yveltal';

  public fullName: string = 'Yveltal TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.attackMarker.addMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }
    
    if (effect instanceof RetreatEffect && effect.player.active.attackMarker.hasMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect &&
      effect.player.active.attackMarker.hasMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      
      const player = effect.player;
      player.active.attackMarker.removeMarker(PokemonCardList.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
      return state;
    }
    
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      
      let hasPokemonWithEnergy = false;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL)) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push(target);
        }
      });
      
      if (hasPokemonWithEnergy) {
      
        let targets: PokemonCardList[] = [];
        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
          PlayerType.TOP_PLAYER,
          [ SlotType.ACTIVE, SlotType.BENCH ],
          { allowCancel: false, blocked }
        ), results => {
          targets = results || [];
          
        });
      
        if (targets.length === 0) {
          return state;
        }
      
        const target = targets[0];
        let cards: Card[] = [];
        store.prompt(state, new ChooseCardsPrompt(
          player.id,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          target,
          { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
          { min: 1, max: 1, allowCancel: true }
        ), selected => {
          cards = selected || [];
          
        });
      
        if (cards.length > 0) {
          // Discard selected special energy card
          target.moveCardsTo(cards, opponent.discard);
        }}
      
      return state;
    }
    return state;
  }
}