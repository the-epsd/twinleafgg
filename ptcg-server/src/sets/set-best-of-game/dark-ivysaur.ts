import { PokemonCard, Stage, StoreLike, State, StateUtils, GameMessage, DamageMap, PlayerType, PutDamagePrompt, SlotType, CardTag } from '../../game';
import { PowerType } from '../../game';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { Attack } from '../../game/store/card/pokemon-types';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DarkIvysaur extends PokemonCard {

  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Bulbasaur';
  public tags = [CardTag.DARK];
  public cardType = G;
  public hp = 50;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Vine Pull',
    useWhenInPlay: true,
    powerType: PowerType.POKEBODY,
    text: 'Once during your turn when Dark Ivysaur retreats, choose 1 of your opponent\'s Benched Pokémon and switch it with his or her Active Pokémon.'
  }];

  public attacks: Attack[] = [
    {
      name: 'Fury Strikes',
      cost: [G, G],
      damage: 0,
      text: 'Your opponent puts 3 markers onto his or her Pokémon (divided as he or she chooses). (More than 1 marker can be put on the same Pokémon.) Then, this attack does 10 damage to each Pokémon for each marker on it. Don\'t apply Weakness and Resistance. Remove the markers at the end of the turn.'
    },
  ];

  public set = 'BP';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name = 'Ivysaur';
  public fullName = 'Ivysaur BP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this) && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
    
      if (!hasBench) {
        return state;
      }
    
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
    
        if (cardList) {
            opponent.switchPokemon(cardList);
          }
        }
      );
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + 30 });
      });
    
      const damage = 30;
    
      return store.prompt(state, new PutDamagePrompt(
        effect.opponent.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
        maxAllowedDamage,
        { allowCancel: false, damageMultiple: 10 }
      ), targets => {
        const results = targets || [];
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          const putDamageEffect = new PutDamageEffect(effect, result.damage);
          putDamageEffect.target = target;
          effect.ignoreResistance = true;
          effect.ignoreWeakness = true;
          store.reduceEffect(state, putDamageEffect);
        }
      });
    }
    return state;
  }

}
