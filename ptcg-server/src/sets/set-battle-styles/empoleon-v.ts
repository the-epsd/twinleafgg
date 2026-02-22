import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, AttachEnergyPrompt, PlayerType, SlotType, GameError, PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class EmpoleonV extends PokemonCard {

  public tags = [CardTag.POKEMON_V, CardTag.RAPID_STRIKE];

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.WATER;

  public hp: number = 210;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Emperor\'s Eyes',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, your opponent\'s Basic Pokémon in play have no Abilities, except for Pokémon with a Rule Box(Pokémon V, Pokémon- GX, etc.have Rule Boxes).'
  }];

  public attacks = [
    {
      name: 'Swirling Slice',
      cost: [CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 130,
      text: 'Move an Energy from this Pokémon to 1 of your Benched Pokémon.'
    },
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Empoleon V';

  public fullName: string = 'Empoleon V BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY && effect.power.name !== 'Emperor\'s Eyes') {
      const player = effect.player;

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const opponent = StateUtils.getOpponent(state, player);

      // Only proceed if Empoleon V is in the Active spot
      if (owner.active.getPokemonCard() !== this) {
        return state;
      }

      // Only check opponent's Active Pokemon
      if (player === owner || player.active.getPokemonCard() !== effect.card) {
        return state;
      }

      // Check if the opponent's active Pokémon has a rule box
      if (player.active.hasRuleBox() || opponent.active.hasRuleBox()) {
        return state; // Return if the opponent's active Pokémon has a rule box
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
    return state;
  }
}

