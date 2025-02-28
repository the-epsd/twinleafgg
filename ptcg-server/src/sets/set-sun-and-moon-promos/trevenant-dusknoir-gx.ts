import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameError, GameMessage, PlayerType, ShowCardsPrompt, ShuffleDeckPrompt, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class TrevenantDusknoirGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TAG_TEAM];
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Night Watch',
      cost: [P, P, P],
      damage: 150,
      text: 'Choose 2 random cards from your opponent\'s hand. Your opponent reveals those cards and shuffles them into their deck.'
    },
    {
      name: 'Pale Moon-GX',
      cost: [P, C],
      damage: 0,
      text: 'At the end of your opponent\'s next turn, the Defending Pokemon will be Knocked Out. If this Pokemon has at least 1 extra [P] Energy attached to it (in addition to this attack\'s cost), discard all Energy from your opponent\'s Active Pokemon. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set: string = 'SMP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '217';
  public name: string = 'Trevenant & Dusknoir-GX';
  public fullName: string = 'Trevenant & Dusknoir-GX SMP';

  public readonly PALE_MOON_MARKER = 'PALE_MOON_MARKER';
  public readonly PALE_MOON_ACTIVATION_MARKER = 'PALE_MOON_ACTIVATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Night Watch
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0){
        return state;
      }
      const cardsToShuffle = Math.min(2, opponent.hand.cards.length);

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: cardsToShuffle, max: cardsToShuffle, isSecret: true }
      ), cards => {
        cards = cards || [];
        
        store.prompt(state, new ShowCardsPrompt(
          player.id,
          GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
          cards
        ), () => []);

        opponent.hand.moveCardsTo(cards, opponent.deck);

        return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
          opponent.deck.applyOrder(order);
        });
      });
    }

    // Pale Moon-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.usedGX){
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      opponent.active.marker.addMarker(this.PALE_MOON_MARKER, this);
      opponent.marker.addMarker(this.PALE_MOON_ACTIVATION_MARKER, this);

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [P, P, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) { return state; }  
      
      // if we have the energies, discard the energies
      const opponentEnergy = new CheckProvidedEnergyEffect(opponent, opponent.active);
      state = store.reduceEffect(state, opponentEnergy);

      const oppCards: Card[] = [];
      opponentEnergy.energyMap.forEach(em => {
        oppCards.push(em.card);
      });

      const discardEnergy = new DiscardCardsEffect(effect, oppCards);
      discardEnergy.target = opponent.active;
      store.reduceEffect(state, discardEnergy);
    }

    // hitman times
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.PALE_MOON_ACTIVATION_MARKER, this)){
      // kill em.
      if (effect.player.active.marker.hasMarker(this.PALE_MOON_MARKER, this)){
        effect.player.active.damage += 999;
      }
      // wipe the evidence
      effect.player.marker.removeMarker(this.PALE_MOON_ACTIVATION_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PALE_MOON_MARKER, this);
      });
    }

    return state;
  }
}
