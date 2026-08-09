import { PokemonCard, Stage, CardType, CardTag, SuperType, StoreLike, State, StateUtils, TrainerCard, EnergyCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { BLOCK_IF_GX_ATTACK_USED, DRAW_CARDS_UNTIL_CARDS_IN_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_ANY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class GengarMimikyuGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public cardType: CardType = P;
  public hp: number = 240;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Poltergeist',
    cost: [P, P],
    damage: 50,
    damageCalculation: 'x',
    text: 'Your opponent reveals their hand. This attack does 50 damage for each Trainer card you find there.'
  },
  {
    name: 'Horror House-GX',
    cost: [P],
    damage: 0,
    gxAttack: true,
    text: 'Your opponent can\'t play any cards from their hand during their next turn. If this Pokémon has at least 1 extra [P] Energy attached to it (in addition to this attack\'s cost), each player draws cards until they have 7 cards in their hand. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'TEU';
  public name: string = 'Gengar & Mimikyu-GX';
  public fullName: string = 'Gengar & Mimikyu-GX TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const trainerCount = opponent.hand.cards.filter(card => card instanceof TrainerCard).length;
      effect.damage = 50 * trainerCount;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      OPPONENT_CANNOT_PLAY_ANY_CARDS(store, state, effect, this);

      const extraEnergy = player.active.cards.filter(card =>
        card.superType === SuperType.ENERGY && (card as EnergyCard).provides.includes(CardType.PSYCHIC)
      ).length > 1;

      if (extraEnergy) {
        const opponent = StateUtils.getOpponent(state, player);
        [player, opponent].forEach(p => {
          DRAW_CARDS_UNTIL_CARDS_IN_HAND(p, 7);
        });
      }
    }

    return state;
  }
}
