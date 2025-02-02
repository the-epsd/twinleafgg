import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, GameError, EnergyCard, ConfirmPrompt, ShuffleDeckPrompt, ChoosePrizePrompt, PlayerType, CardTarget, PokemonCardList, ChoosePokemonPrompt, SlotType, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class KartanaGX extends PokemonCard {

  public tags = [CardTag.ULTRA_BEAST, CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.METAL;

  public hp: number = 170;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Slice Off',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may discard a Special Energy from 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Gale Blade',
      cost: [CardType.METAL, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'You may shuffle this Pokemon and all cards attached to it into your deck.'
    },

    {
      name: 'Blade-GX',
      cost: [CardType.METAL],
      damage: 0,
      gxAttack: true,
      text: 'Take a prize card. (You can\'t use more than 1 GX attack in a game.)'
    },


  ];

  public set: string = 'CIN';

  public setNumber: string = '70';

  public cardImage: string = 'assets/cardback.png';

  public name: string = 'Kartana-GX';

  public fullName: string = 'Kartana-GX CIN';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Slice Off
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasPokemonWithEnergy = false;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c =>
          c instanceof EnergyCard &&
          c.energyType === EnergyType.SPECIAL)) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push(target);
        }
      });

      if (!hasPokemonWithEnergy) {
        return state;
      }

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
          let targets: PokemonCardList[] = [];
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false, blocked }
          ), results => {
            targets = results || [];

            const target = targets[0];
            let cards: Card[] = [];
            return store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              target,
              { superType: SuperType.ENERGY, energyType: EnergyType.SPECIAL },
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              cards = selected;
              target.moveCardsTo(cards, opponent.discard);
            });
          });
        }
      });
    }

    // Gale Blade
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          player.active.moveTo(player.deck);
          player.active.clearEffects();

          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        }
      });
    }

    // Blade-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.usedGX === true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      return store.prompt(state, new ChoosePrizePrompt(
        player.id,
        GameMessage.CHOOSE_PRIZE_CARD,
        { count: 1, allowCancel: false }
      ), prizes => {
        prizes[0].moveTo(player.hand);
      });
    }

    return state;
  }
}