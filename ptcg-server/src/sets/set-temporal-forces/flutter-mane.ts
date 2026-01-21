import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { GameError, GameMessage, SlotType, StateUtils } from '../../game';
import { PowerType } from '../../game/store/card/pokemon-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE } from '../../game/store/prefabs/attack-effects';

export class FlutterMane extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public tags = [CardTag.ANCIENT];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Midnight Fluttering',
    powerType: PowerType.ABILITY,
    abilityLock: true,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Active Pokémon has no Abilities, except for Midnight Fluttering.'
  }];

  public attacks = [{
    name: 'Hex Hurl',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Put 2 damage counters on your opponent\'s Benched Pokémon in any way you like.'
  }];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '78';

  public name: string = 'Flutter Mane';

  public fullName: string = 'Flutter Mane TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckPokemonPowersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Only proceed if Flutter Mane is in the Active spot
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }

      // Only filter opponent's Active Pokemon abilities
      const targetOwner = StateUtils.findOwner(state, StateUtils.findCardList(state, effect.target));
      if (targetOwner === owner || StateUtils.findCardList(state, effect.target) !== opponent.active) {
        return state;
      }

      // Filter out all abilities except Midnight Fluttering
      effect.powers = effect.powers.filter(power =>
        power.powerType !== PowerType.ABILITY || power.name === 'Midnight Fluttering'
      );
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Midnight Fluttering') {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      // Only proceed if Flutter Mane is in the Active spot
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }

      // Only check opponent's Active Pokemon
      if (player === owner || player.active.getPokemonCard() !== effect.card) {
        return state;
      }

      // Try reducing ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      PUT_X_DAMAGE_COUNTERS_IN_ANY_WAY_YOU_LIKE(2, store, state, effect, [SlotType.BENCH]);
    }

    return state;
  }
}
