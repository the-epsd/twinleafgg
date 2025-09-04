import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, DRAW_CARDS_AS_FACE_DOWN_PRIZES, SHUFFLE_PRIZES_INTO_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class NaganadelGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = P;
  public hp: number = 210;
  public weakness = [{ type: P }];
  public retreat = [C];
  public evolvesFrom = 'Poipole';

  public attacks = [
    {
      name: 'Beast Raid',
      cost: [C],
      damage: 20,
      damageCalculation: 'x',
      text: 'This attack does 20 damage for each of your Ultra Beasts in play.'
    },
    {
      name: 'Jet Needle',
      cost: [P, C, C],
      damage: 110,
      text: 'This attack\'s damage isn\'t affected by Weakness or Resistance.'
    },
    {
      name: 'Stinger-GX',
      cost: [C, C, C],
      damage: 0,
      gxAttack: true,
      text: 'Both players shuffle their Prize cards into their decks. Then, each player puts the top 3 cards of their deck face down as their Prize cards. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Naganadel-GX';
  public fullName: string = 'Naganadel-GX FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Beast Raid
    if (WAS_ATTACK_USED(effect, 0, this)) {
      let ultraBeastsInPlay = 0;

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard()?.tags.includes(CardTag.ULTRA_BEAST)) {
          ultraBeastsInPlay++;
        }
      });

      effect.damage = 20 * ultraBeastsInPlay;
    }

    // Jet Needle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;
    }

    // Stinger-GX
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      [player, opponent].forEach(player => {
        SHUFFLE_PRIZES_INTO_DECK(store, state, player);
        DRAW_CARDS_AS_FACE_DOWN_PRIZES(player, 3);
      });
    }

    return state;
  }
}