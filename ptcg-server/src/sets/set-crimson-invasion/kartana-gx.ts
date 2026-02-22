import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, ConfirmPrompt, PlayerType, CardTarget, PokemonCardList, ChoosePokemonPrompt, SlotType, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect, AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { BLOCK_IF_GX_ATTACK_USED, IS_ABILITY_BLOCKED, MOVE_CARDS, TAKE_X_PRIZES, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK } from '../../game/store/prefabs/attack-effects';

export class KartanaGX extends PokemonCard {

  public tags = [CardTag.ULTRA_BEAST, CardTag.POKEMON_GX];

  private wantsToShuffle = false;

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
          c.superType === SuperType.ENERGY &&
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
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
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
              MOVE_CARDS(store, state, target, opponent.discard, { cards, sourceCard: this, sourceEffect: this.powers[0] });
            });
          });
        }
      });
    }

    // Gale Blade - ask during attack, shuffle after
    if (WAS_ATTACK_USED(effect, 0, this)) {
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        this.wantsToShuffle = wantToUse;
      });
    }

    // Gale Blade - shuffle after attack if chosen
    if (effect instanceof AfterAttackEffect && this.wantsToShuffle) {
      this.wantsToShuffle = false;
      return SHUFFLE_THIS_POKEMON_AND_ALL_ATTACHED_CARDS_INTO_YOUR_DECK(store, state, effect);
    }

    // Clean up flag at end of turn
    if (effect instanceof EndTurnEffect) {
      this.wantsToShuffle = false;
    }

    // Blade-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      // set GX attack as used for game
      player.usedGX = true;

      return TAKE_X_PRIZES(store, state, player, 1);
    }

    return state;
  }
}