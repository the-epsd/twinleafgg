import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, GameMessage, Card, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class TeamRocketsTyranitar extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Team Rocket\'s Pupitar';
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Sand Stream',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is in the Active Spot, put 2 damage counter on each of your opponent\'s Basic Pokémon during Pokémon Checkup.'
  }];

  public attacks = [
    {
      name: 'Breakthrough Tackle',
      cost: [F, C, C, C],
      damage: 180,
      text: 'Discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'SV10';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Team Rocket\'s Tyranitar';
  public fullName: string = 'Team Rocket\'s Tyranitar SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sand Stream
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) { return state; }
      if (player.active.getPokemonCard() !== this) { return state; }

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.stage === Stage.BASIC) {
          cardList.damage += 20;
        }
      });

      return state;
    }

    // Breakthrough Tackle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      let card: Card;
      return store.prompt(state, new ChooseCardsPrompt(
        effect.player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        card = selected[0];
        return store.reduceEffect(state, new DiscardCardsEffect(effect, [card]));
      });
    }

    return state;
  }
}
