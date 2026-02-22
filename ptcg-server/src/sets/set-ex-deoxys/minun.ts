import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, PowerType, StateUtils, PokemonCardList, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { BLOCK_IF_DISCARD_EMPTY, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Minun extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Sniff Out',
    cost: [C],
    damage: 0,
    text: 'Put any 1 card from your discard pile into your hand.'
  },
  {
    name: 'Negative Spark',
    cost: [L],
    damage: 0,
    text: 'Does 20 damage to each of your opponent\'s Pokémon that has any Poké- Bodies. Don\'t apply Weakness and Resistance.'
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Minun';
  public fullName: string = 'Minun DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      BLOCK_IF_DISCARD_EMPTY(player);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        MOVE_CARDS(store, state, player.discard, player.hand, { cards: cards, sourceCard: this, sourceEffect: this.attacks[0] });
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const pokemonWithPokeBodies: PokemonCardList[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList.getPokemonCard()) {
          const powersEffect = new CheckPokemonPowersEffect(opponent, card);
          state = store.reduceEffect(state, powersEffect);
          if (powersEffect.powers.some(power => power.powerType === PowerType.POKEBODY)) {
            pokemonWithPokeBodies.push(cardList);
          }
        }
      });

      effect.ignoreWeakness = true;
      effect.ignoreResistance = true;

      pokemonWithPokeBodies.forEach(target => {
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }

    return state;
  }
}