import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, GameMessage, ConfirmPrompt, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GET_PLAYER_BENCH_SLOTS, IS_ABILITY_BLOCKED, SHUFFLE_DECK, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';

export class Ninjask extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Nincada';
  public cardType: CardType = G;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Cast-off Shell',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon, you may search your deck for Shedinja and put it onto your Bench. Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Night Slash',
      cost: [G, C],
      damage: 60,
      text: 'You may switch this Pokemon with 1 of your Benched Pokemon.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '11';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ninjask';
  public fullName: string = 'Ninjask DRX';

  public usedNightSlash = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Cast-off Shell - When evolving, search for Shedinja
    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      const slots = GET_PLAYER_BENCH_SLOTS(player);
      if (slots.length === 0) {
        return state;
      }

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const blocked: number[] = [];
          player.deck.cards.forEach((card, index) => {
            if (!(card instanceof PokemonCard) || card.name !== 'Shedinja') {
              blocked.push(index);
            }
          });

          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
            player.deck,
            { superType: SuperType.POKEMON },
            { min: 0, max: 1, allowCancel: false, blocked }
          ), selected => {
            const cards = selected || [];
            if (cards.length > 0) {
              const benchSlots = GET_PLAYER_BENCH_SLOTS(player);
              if (benchSlots.length > 0) {
                player.deck.moveCardTo(cards[0], benchSlots[0]);
                benchSlots[0].pokemonPlayedTurn = state.turn;
              }
            }
            SHUFFLE_DECK(store, state, player);
          });
        }
      });
    }

    // Attack: Night Slash - Optional switch after damage
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedNightSlash = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedNightSlash) {
      this.usedNightSlash = false;
      const player = effect.player;

      if (player.bench.some((b: PokemonCardList) => b.cards.length > 0)) {
        return store.prompt(state, new ConfirmPrompt(
          player.id,
          GameMessage.WANT_TO_SWITCH_POKEMON,
        ), wantToSwitch => {
          if (wantToSwitch) {
            SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
          }
        });
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedNightSlash = false;
    }

    return state;
  }
}
