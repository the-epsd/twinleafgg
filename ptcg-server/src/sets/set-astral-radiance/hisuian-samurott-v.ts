import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, SlotType, CardTarget, ChoosePokemonPrompt, GameMessage, PokemonCardList, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class HisuianSamurottV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DARK;

  public hp: number = 220;

  public tags = [CardTag.POKEMON_V];

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Basket Crash',
      cost: [CardType.DARK],
      damage: 0,
      text: 'Discard up to 2 Pokémon Tools from your opponent\'s Pokémon.'
    },
    {
      name: 'Shadow Slash',
      cost: [CardType.DARK, CardType.DARK, CardType.DARK],
      damage: 180,
      text: 'Discard an Energy from this Pokémon.'
    }
  ];

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '101';

  public name: string = 'Hisuian Samurott V';

  public fullName: string = 'Hisuian Samurott V ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemonsWithTool = 0;
      const blocked: CardTarget[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.tool !== undefined) {
          pokemonsWithTool += 1;
        } else {
          blocked.push(target);
        }
      });

      if (pokemonsWithTool === 0) {
        return state;
      }

      const max = Math.min(2, pokemonsWithTool);
      let targets: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DISCARD_CARDS,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: max, allowCancel: false, blocked }
      ), results => {
        targets = results || [];

        if (targets.length === 0) {
          return state;
        }

        targets.forEach(target => {
          const owner = StateUtils.findOwner(state, target);
          if (target.tool !== undefined) {
            target.moveCardTo(target.tool, owner.discard);
            target.tool = undefined;
          }
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }

}
