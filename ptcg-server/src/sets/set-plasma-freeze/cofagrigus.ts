import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, GameMessage, PlayerType, SlotType, StateUtils, DamageMap, PutDamagePrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class Cofagrigus extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Yamask';
  public cardType: CardType = P;
  public tags: string[] = [CardTag.TEAM_PLASMA];
  public hp: number = 100;
  public weakness = [{ type: D }];
  public retreat = [C, C];

  public powers = [{
    name: 'Six Feet Under',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack) you may Knock Out this Pokémon. If you do, put 3 damage counters on your opponent\'s Pokémon in any way you like.'
  }];

  public attacks = [
    {
      name: 'Slap of Misfortune',
      cost: [P, P, C],
      damage: 70,
      text: 'NOT CURRENTLY WORKING: Whenever your opponent flips a coin during his or her next turn, treat it as tails.'
    }
  ];

  public set: string = 'PLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';
  public name: string = 'Cofagrigus';
  public fullName: string = 'Cofagrigus PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maxAllowedDamage: DamageMap[] = [];
      let damageLeft = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        const checkHpEffect = new CheckHpEffect(opponent, cardList);
        store.reduceEffect(state, checkHpEffect);
        damageLeft += checkHpEffect.hp - cardList.damage;
        maxAllowedDamage.push({ target, damage: checkHpEffect.hp });
      });

      const damage = Math.min(30, damageLeft);

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
        maxAllowedDamage,
        { allowCancel: false }
      ), targets => {
        const results = targets || [];

        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          target.damage += result.damage;
        }

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.damage += 999;
          }
        });
      });
    }
    return state;
  }
}