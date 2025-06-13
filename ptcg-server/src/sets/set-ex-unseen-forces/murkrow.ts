import { PokemonCard, Stage, CardType, StoreLike, State, PlayerType, ChoosePokemonPrompt, GameMessage, SlotType, TrainerType, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../game/store/prefabs/attack-effects';
import { MOVE_CARD_TO, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Murkrow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Night Song',
    cost: [C],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch. The new Defending Pokémon is now Asleep.'
  },
  {
    name: 'Plunder',
    cost: [C, C],
    damage: 20,
    text: 'Before doing damage, discard all Trainer cards attached to the Defending Pokémon.'
  }];

  public set: string = 'UF';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Murkrow';
  public fullName: string = 'Murkrow UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];

        opponent.switchPokemon(cardList);
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      const activePokemon = opponent.active;
      opponent.active.cards.forEach(card => {
        if (card instanceof TrainerCard) {
          MOVE_CARD_TO(state, card, opponent.discard);
          if (card.trainerType === TrainerType.TOOL) {
            activePokemon.tool = undefined;
          }
        }
      });
    }

    return state;
  }
} 