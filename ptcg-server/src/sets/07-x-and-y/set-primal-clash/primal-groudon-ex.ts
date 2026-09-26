import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DISCARD_A_STADIUM_CARD_IN_PLAY, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { MEGA_EVOLUTION_END_TURN } from '../../../game/store/prefabs/tool-prefabs';
import { BLOCK_TRAINER_TARGET, IS_TRAINER_TARGET } from '../../../game/store/prefabs/prefabs';

export class PrimalGroudonEx extends PokemonCard {
  protected _tags = [CardTag.POKEMON_EX, CardTag.MEGA, CardTag.PRIMAL];
  public stage: Stage = Stage.MEGA;
  public evolvesFrom = 'Groudon-EX';
  public cardType: CardType[] = [F];
  public hp: number = 240;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public powers = [
    {
      name: 'Ω Barrier',
      powerType: PowerType.ANCIENT_TRAIT,
      text: 'Whenever your opponent plays a Trainer card (excluding Pokémon Tools and Stadium cards), prevent all effects of that card done to this Pokémon.',
    },
  ];

  public attacks = [
    {
      name: 'Gaia Volcano',
      cost: [F, F, F, C],
      damage: 100,
      damageCalculation: '+',
      text: 'If there is any Stadium card in play, this attack does 100 more damage. Discard that Stadium card.',
    },
  ];

  public set: string = 'PRC';
  public name: string = 'Primal Groudon-EX';
  public fullName: string = 'Primal Groudon-EX PRC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    MEGA_EVOLUTION_END_TURN(store, state, effect, this);

    // Ω Barrier
    if (IS_TRAINER_TARGET(effect, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // finding if the owner of the card is playing the trainer or if the opponent is
      let isGroudonOnOpposingSide = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          isGroudonOnOpposingSide = true;
        }
      });
      if (!isGroudonOnOpposingSide) {
        return state;
      }

      BLOCK_TRAINER_TARGET(effect);
    }

    // Gaia Volcano
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (StateUtils.getStadiumCard(state) === undefined) {
        return state;
      }
      effect.damage += 100;
      DISCARD_A_STADIUM_CARD_IN_PLAY(state);
    }

    return state;
  }
}
