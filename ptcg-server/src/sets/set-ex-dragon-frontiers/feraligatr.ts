import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { AFTER_ATTACK, IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Feraligatr extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Croconaw';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C, C];

  public powers = [{
    name: 'Battle Aura',
    powerType: PowerType.POKEBODY,
    text: 'Each of your Pokémon that has δ on its card does 10 more damage to the Defending Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Drag Off',
    cost: [C, C],
    damage: 20,
    text: 'Before doing damage, you may choose 1 of your opponent\'s Benched Pokémon and switch it with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.'
  },
  {
    name: 'Sharp Fang',
    cost: [L, L, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Feraligatr';
  public fullName: string = 'Feraligatr DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
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
        opponent.switchPokemon(cardList);

        const afterDamage = new DealDamageEffect(effect as AttackEffect, 20);
        afterDamage.target = opponent.active;
        store.reduceEffect(state, afterDamage);
      });
    }

    if (effect instanceof DealDamageEffect && StateUtils.isPokemonInPlay(effect.player, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, effect.player);
      const source = effect.source.getPokemonCard() as PokemonCard;

      if (state.phase === GamePhase.ATTACK &&
        source.tags.includes(CardTag.DELTA_SPECIES) &&
        effect.target === opponent.active && effect.damage > 0 && !IS_POKEBODY_BLOCKED(store, state, player, this)
      ) {
        effect.damage += 10;
      }
    }
    return state;
  }
}
