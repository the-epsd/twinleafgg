import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType, BoardEffect } from '../../game/store/card/card-types';
import {
  StoreLike, State,
  PlayerType, SlotType, GameMessage, ShuffleDeckPrompt, PowerType, ChooseCardsPrompt, GameError, AttachEnergyPrompt, StateUtils, CardTarget
} from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

function* useTrinityNova(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  const blocked: CardTarget[] = [];
  player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
    if (!cardList.vPokemon()) {
      blocked.push(target);
    }
  });

  yield store.prompt(state, new AttachEnergyPrompt(
    player.id,
    GameMessage.ATTACH_ENERGY_TO_BENCH,
    player.deck,
    PlayerType.BOTTOM_PLAYER,
    [SlotType.BENCH, SlotType.ACTIVE],
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { allowCancel: false, min: 0, max: 3, blockedTo: blocked }
  ), transfers => {
    transfers = transfers || [];
    for (const transfer of transfers) {
      const target = StateUtils.getTarget(state, player, transfer.to);
      player.deck.moveCardTo(transfer.card, target);
      next();
    }
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);

  });
}


export class ArceusVSTAR extends PokemonCard {

  public tags = [CardTag.POKEMON_VSTAR];

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Arceus V';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 280;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Trinity Nova',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 200,
      text: 'Search your deck for up to 3 basic energies and attach ' +
        'them to your Pokémon V in any way you like. Then, shuffle ' +
        'your deck.'
    }
  ];

  public powers = [{
    name: 'Starbirth',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may search your deck for up to ' +
      '2 cards and put them into your hand. Then, shuffle your ' +
      'deck. (You can\'t use more than 1 VSTAR Power in a game.)'

  }];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Arceus VSTAR';

  public fullName: string = 'Arceus VSTAR BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.usedVSTAR) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 1, max: 2, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        return state;
      });
    }

    //     if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
    //       const player = effect.player;
    //       state = store.prompt(state, new AttachEnergyPrompt(
    //         player.id,
    //         GameMessage.ATTACH_ENERGY_TO_BENCH,
    //         player.deck,
    //         PlayerType.BOTTOM_PLAYER,

    //         [ SlotType.BENCH, SlotType.ACTIVE ],
    //         { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    //         { allowCancel: true, min: 0, max: 3 },

    //       ), transfers => {
    //         transfers = transfers || [ ];
    //         // cancelled by user
    //         if (transfers.length === 0) {
    //           return state;
    //         }
    //         for (const transfer of transfers) {

    //           const target = StateUtils.getTarget(state, player, transfer.to);

    //           if (!target.cards[0].tags.includes(CardTag.POKEMON_V) ||
    //           !target.cards[0].tags.includes(CardTag.POKEMON_VSTAR) ||
    //           !target.cards[0].tags.includes(CardTag.POKEMON_VMAX)) {
    //             throw new GameError(GameMessage.INVALID_TARGET);
    //           }

    //           if (target.cards[0].tags.includes(CardTag.POKEMON_V) || 
    //               target.cards[0].tags.includes(CardTag.POKEMON_VSTAR) ||
    //               target.cards[0].tags.includes(CardTag.POKEMON_VMAX)) {

    //             player.deck.moveCardTo(transfer.card, target); 
    //           }

    //         }

    //         state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    //           player.deck.applyOrder(order);
    //         });
    //       });
    //     }

    //     return state;
    //   }
    // }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useTrinityNova(() => generator.next(), store, state, effect);
      return generator.next().value;
    }
    return state;
  }
}