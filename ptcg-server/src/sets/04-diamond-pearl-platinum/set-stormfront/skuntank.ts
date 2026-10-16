import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED } from '../../../game/store/prefabs/attack-effects';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Skuntank extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Stunky';
  public hp: number = 100;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Evolutionary Gas',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), when you play Skuntank from your hand to evolve 1 of your Active Pokémon, you may choose 1 of the Defending Pokémon. If that Pokémon tries to attack during your opponent\'s next turn, that attack does nothing.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Poison Claws',
    cost: [C, C],
    damage: 20,
    text: 'The Defending Pokémon is now Poisoned.'
  },
  {
    name: 'Plunder',
    cost: [D, C, C],
    damage: 60,
    text: 'Before doing damage, discard all Trainer cards attached to the Defending Pokémon.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Skuntank';
  public fullName: string = 'Skuntank SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evolutionary Gas
    if (JUST_EVOLVED(effect, this) && effect.target === effect.player.active
      && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      CONFIRMATION_PROMPT(store, state, effect.player, wantToUse => {
        if (!wantToUse) {
          return;
        }
        store.prompt(state, new ChoosePokemonPrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }
          targets[0].cannotAttackNextTurn = true;
        });
      }, GameMessage.WANT_TO_USE_ABILITY);
    }

    // Poison Claws
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_POISIONED(store, state, effect);
    }

    // Plunder
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const activePokemon = opponent.active;
      if (activePokemon.tools.length > 0) {
        MOVE_CARDS(store, state, activePokemon, opponent.discard, { cards: [...activePokemon.tools], sourceCard: this });
      }
      activePokemon.cards.forEach(card => {
        if (card.superType === SuperType.TRAINER) {
          MOVE_CARDS(store, state, activePokemon, opponent.discard, { cards: [card], sourceCard: this });
        }
      });
    }

    return state;
  }
}
