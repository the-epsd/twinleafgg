import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { CardTarget, ChooseCardsPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { ADD_MARKER, CONFIRMATION_PROMPT, HAS_MARKER, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHUFFLE_DECK, SWITCH_ACTIVE_WITH_BENCHED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Torterra extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Grotle';
  public hp: number = 140;
  public cardType: CardType[] = [G];
  public weakness = [{ type: W, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C, C];

  public powers = [{
    name: 'Sunshine Song',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you play Torterra from your hand to evolve 1 of your Pokémon, you may choose as many of your Grass Pokémon in play as you like. For each Grass Pokémon you choose, search your deck for an Evolution card that evolves from that Pokémon and evolve it. Shuffle your deck afterward.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Crash Impact',
    cost: [C, C],
    damage: 60,
    text: 'Torterra does 20 damage to itself. Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon, if any.'
  },
  {
    name: 'Land Shake',
    cost: [G, G, C, C],
    damage: 80,
    text: 'During your opponent\'s next turn, when your opponent puts a Basic Pokémon from his or her hand onto his or her Bench, put 2 damage counters on that Pokémon.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Torterra';
  public fullName: string = 'Torterra SF';

  public readonly LAND_SHAKE_MARKER = 'LAND_SHAKE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sunshine Song
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (!wantToUse) {
          return;
        }
        const player = effect.player;
        const blocked: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (!card.cardType.includes(CardType.GRASS)) {
            blocked.push(target);
          }
        });

        store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 0, max: 8, allowCancel: true, blocked },
        ), targets => {
          const chosen = targets || [];
          const evolveNext = (index: number) => {
            if (index >= chosen.length) {
              SHUFFLE_DECK(store, state, player);
              return;
            }
            const target = chosen[index];
            const baseCard = target.getPokemonCard();
            if (!baseCard || player.deck.cards.length === 0) {
              evolveNext(index + 1);
              return;
            }
            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_EVOLVE,
              player.deck,
              { superType: SuperType.POKEMON, evolvesFrom: baseCard.name },
              { min: 0, max: 1, allowCancel: true },
            ), selected => {
              const cards = selected || [];
              if (cards.length > 0) {
                MOVE_CARDS(store, state, player.deck, target, { cards, sourceCard: this });
                target.clearEffects();
                target.pokemonPlayedTurn = state.turn;
              }
              evolveNext(index + 1);
            });
          };
          evolveNext(0);
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Crash Impact
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 20);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.opponent);
    }

    // Land Shake
    if (WAS_ATTACK_USED(effect, 1, this)) {
      ADD_MARKER(this.LAND_SHAKE_MARKER, effect.opponent, this);
    }

    if (effect instanceof PlayPokemonEffect && HAS_MARKER(this.LAND_SHAKE_MARKER, effect.player, this)) {
      const pokemonCard = effect.pokemonCard;
      if (pokemonCard.stage === Stage.BASIC && effect.player.hand.cards.includes(pokemonCard)) {
        store.reduceEffect(state, new PlaceDamageCountersEffect(
          effect.player,
          effect.target,
          20,
          this,
        ));
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.LAND_SHAKE_MARKER, this);
    return state;
  }
}
