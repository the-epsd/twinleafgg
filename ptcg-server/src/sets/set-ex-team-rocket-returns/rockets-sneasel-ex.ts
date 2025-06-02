import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';

export class RocketsSneaselex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.ROCKETS];
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public resistance = [{ type: P, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Drag Off',
      cost: [D],
      damage: 10,
      text: 'Before doing damage, you may switch 1 of your opponent\'s Benched Pokémon with the Defending Pokémon. If you do, this attack does 10 damage to the new Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
    },
    {
      name: 'Dark Ring',
      cost: [D, D, C],
      damage: 30,
      damageCalculation: '+',
      text: 'Does 30 damage plus 10 more damage for each of your [D] Pokémon in play.'
    }
  ];

  public set: string = 'TRR';
  public name: string = 'Rocket\'s Seasel ex';
  public fullName: string = 'Rocket\'s Seasel ex TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '103';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Drag Off
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

    // Rock Smash
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      let darksInPlay = 0;

      const activeType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, activeType);
      if (activeType.cardTypes.includes(CardType.DARK)) {
        darksInPlay++;
      }

      player.bench.forEach(benchSpot => {
        if (benchSpot.cards.length > 0) {
          const benchedType = new CheckPokemonTypeEffect(benchSpot);
          store.reduceEffect(state, benchedType);
          if (benchedType.cardTypes.includes(CardType.DARK)) {
            darksInPlay++;
          }
        }
      });
      effect.damage += 10 * darksInPlay;
    }

    return state;
  }

}
