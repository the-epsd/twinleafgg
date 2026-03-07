import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Omastar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Omanyte';
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Ancient Fang',
    powerType: PowerType.POKEBODY,
    text: 'As long as you have Kabuto, Kabutops, or Kabutops ex in play, Omastar\'s attacks do 20 more damage to the Defending Pokémon (before applying Weakness and Resistance).',
  }];

  public attacks = [{
    name: 'Drag Off',
    cost: [W, C],
    damage: 10,
    text: 'Before doing damage, you may choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
  },
  {
    name: 'Hydro Splash',
    cost: [W, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'LM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Omastar';
  public fullName: string = 'Omastar LM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;

      let isKabuInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Kabuto' || card.name === 'Kabutops' || card.name === 'Kabutops ex') {
          isKabuInPlay = true;
        }
      });

      if (!isKabuInPlay) {
        return state;
      }

      if (effect.source.getPokemonCard() === this) {
        effect.damage += 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const bench = opponent.bench.filter(bench => bench.cards.length > 0);

      if (bench.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];
            opponent.switchPokemon(cardList);
          });
        }
      }, GameMessage.WANT_TO_SWITCH_POKEMON);
    }

    return state;
  }
}
