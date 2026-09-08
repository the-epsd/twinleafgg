import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { ConfirmPrompt, GameMessage, PlayerType, PowerType, SlotType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DamageMap } from '../../../game/store/prompts/move-damage-prompt';
import { PutDamagePrompt } from '../../../game/store/prompts/put-damage-prompt';
import { WAS_ATTACK_USED, JUST_EVOLVED, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class GalarianObstagoon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Galarian Linoone';
  public cardType: CardType[] = [D];
  public hp: number = 160;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public powers = [{
    name: 'Untamed Shout',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, you may put 3 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [
    {
      name: 'Obstruct',
      cost: [D, C],
      damage: 90,
      text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'SSH';
  public setNumber: string = '119';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Galarian Obstagoon';
  public fullName: string = 'Galarian Obstagoon SSH';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Untamed Shout
    // Ref: set-unbroken-bonds/gengar.ts (JUST_EVOLVED + ConfirmPrompt + PutDamagePrompt)
    if (JUST_EVOLVED(effect, this)) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const opponent = StateUtils.getOpponent(state, player);

      store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const maxAllowedDamage: DamageMap[] = [];
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
            maxAllowedDamage.push({ target, damage: 9999 });
          });

          store.prompt(state, new PutDamagePrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            30,
            maxAllowedDamage,
            { allowCancel: false }
          ), targets => {
            const results = targets || [];
            for (const result of results) {
              const target = StateUtils.getTarget(state, player, result.target);
              target.damage += result.damage;
            }
          });
        }
      });
    }

    // Obstruct
    // Ref: set-delta-reign/ariados.ts (Covert Needle)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      PREVENT_DAMAGE(store, state, effect, this, { sourceStage: Stage.BASIC });
    }

    return state;
  }
}
