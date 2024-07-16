import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, SlotType, StateUtils } from '../../game';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class TingLuex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 240;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Cursed Land',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Pokémon in play that have any damage counters on them have no Abilities, except for Pokémon ex.'
  }];

  public attacks = [{
    name: 'Land Scoop',
    cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
    damage: 150,
    text: 'Put 2 damage counters on 1 of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'PAL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '127';

  public name: string = 'Ting-Lu ex';

  public fullName: string = 'Ting-Lu ex PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Ting-Lu ex is not active Pokemon
      if (player.active.getPokemonCard() !== this
        && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);

        // Block abilities for non-Pokémon-ex that have damage
        if (!effect.card.tags.includes(CardTag.POKEMON_ex) && cardList.damage > 0) {
          // Try reducing ability
          try {
            const stub = new PowerEffect(player, {
              name: 'test',
              powerType: PowerType.ABILITY,
              text: ''
            }, this);
            store.reduceEffect(state, stub);
          } catch {
            if (!effect.power.exemptFromAbilityLock) {
              throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
            }
            return state;
          }
          return state;
        }
      }
    }



    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }
    return state;
  }
}