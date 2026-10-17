import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { CardTarget, DamageMap, GameError, GameMessage, MoveDamagePrompt, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';
import { CheckHpEffect } from '../../../game/store/effects/check-effects';
import { ABILITY_USED, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class UnownZ extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  protected _tags = [CardTag.UNOWN];
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'ZERO',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if Unown Z is on your Bench and you have no cards in your deck, you may discard all cards attached to Unown Z and put Unown Z on top of your deck.',
  }];

  public attacks = [{
    name: 'Hidden Power',
    cost: [P, C],
    damage: 0,
    text: 'Remove as many damage counters as you like from each Unown you have in play. Put that many damage counters on the Defending Pokémon.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Unown [Z]';
  public fullName: string = 'Unown [Z] SW';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);

    // ZERO
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const benchIndex = player.bench.findIndex(slot => slot.getPokemonCard() === this);
      if (benchIndex === -1) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.deck.cards.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      const target = player.bench[benchIndex];
      const tools = [...target.tools];
      for (const tool of tools) {
        MOVE_CARDS(store, state, target, player.discard, { cards: [tool], sourceCard: this });
      }
      const pokemons = target.getPokemons();
      const attachments = target.cards.filter(c => !pokemons.includes(c as PokemonCard));
      if (attachments.length > 0) {
        MOVE_CARDS(store, state, target, player.discard, { cards: attachments, sourceCard: this });
      }
      MOVE_CARDS(store, state, target, player.deck, { cards: pokemons, sourceCard: this, toTop: true });
      target.clearEffects();
      return state;
    }

    // Hidden Power
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const blockedFrom: CardTarget[] = [];
      let maxCounters = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (!card.name.includes('Unown') || cardList.damage === 0) {
          blockedFrom.push(target);
        } else {
          maxCounters += Math.floor(cardList.damage / 10);
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (_cardList, _card, target) => {
        blockedFrom.push(target);
      });

      if (maxCounters === 0) {
        return state;
      }

      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, _card, target) => {
        blockedTo.push(target);
      });
      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length > 0) {
          blockedTo.push({ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index });
        }
      });

      const maxAllowedDamage: DamageMap[] = [];
      const checkHp = new CheckHpEffect(opponent, opponent.active);
      store.reduceEffect(state, checkHp);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, _card, target) => {
        if (cardList === opponent.active) {
          maxAllowedDamage.push({ target, damage: checkHp.hp });
        }
      });

      return store.prompt(state, new MoveDamagePrompt(
        player.id,
        GameMessage.MOVE_DAMAGE,
        PlayerType.ANY,
        [SlotType.ACTIVE, SlotType.BENCH],
        maxAllowedDamage,
        {
          min: 0,
          max: maxCounters,
          allowCancel: true,
          blockedFrom,
          blockedTo,
          singleDestinationTarget: true,
        }
      ), transfers => {
        if (!transfers || transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          if (source.damage >= 10) {
            source.damage -= 10;
            const putCounters = new PutCountersEffect(effect, 10);
            putCounters.target = opponent.active;
            store.reduceEffect(state, putCounters);
          }
        }
      });
    }

    return state;
  }
}
