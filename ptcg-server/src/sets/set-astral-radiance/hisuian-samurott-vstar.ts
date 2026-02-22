import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, GameError } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageCountersEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class HisuianSamurottVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public cardType: CardType = CardType.DARK;

  public hp: number = 270;

  public evolvesFrom = 'Hisuian Samurott V';

  public tags = [CardTag.POKEMON_VSTAR];

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Moon Cleave Star',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'During your turn, you may put 4 damage counters on 1 of your opponent\'s Pokémon. (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public attacks = [
    {
      name: 'Merciless Blade',
      cost: [CardType.DARK, CardType.DARK],
      damage: 110,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon already has any damage counters on it, this attack does 110 more damage.'
    }
  ];

  public set: string = 'ASR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '102';

  public name: string = 'Hisuian Samurott VSTAR';

  public fullName: string = 'Hisuian Samurott VSTAR ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Moon Cleave Star: VSTAR power - put 4 damage counters on 1 of opponent's Pokemon
    // Ref: set-brilliant-stars/arceus-vstar.ts (VSTAR power pattern)
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        if (targets.length === 0) {
          return;
        }
        // Use PutDamageCountersEffect so damage prevention abilities can intercept
        const powerEffect = new PowerEffect(player, this.powers[0], this, targets[0]);
        const putDamage = new PutDamageCountersEffect(powerEffect, 40);
        store.reduceEffect(state, putDamage);
      });
    }

    // Merciless Blade: 110 + 110 if opponent's active already has damage counters
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.active.damage > 0) {
        effect.damage += 110;
      }
    }

    return state;
  }
}
