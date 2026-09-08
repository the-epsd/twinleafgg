import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { Player } from '../../game/store/state/player';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { StoreLike } from '../../game/store/store-like';
import { Store } from '../../game/store/store';
import { PlayerType, StateUtils } from '../../game';
import {
  AFTER_ATTACK,
  BEFORE_DAMAGE,
  IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES,
  THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN,
  WAS_ATTACK_USED,
} from '../../game/store/prefabs/prefabs';
import {
  blockCannotUseAttacksNextTurn,
} from '../../game/store/prefabs/copy-attack-prefabs';
import {
  clearCopyAttackSessionsForTests,
  cloneAttacks,
  resolveCopyAttackSessions,
  runDelegatedCopiedAttack,
  withTemporaryDelegatedAttacks,
} from '../../game/store/prefabs/copy-attack-delegation';

class DelegationSourceCard extends PokemonCard {
  public markerHit = false;
  public beforeDamageHit = false;
  public afterAttackHit = false;

  public stage = Stage.BASIC;

  public cardType = [CardType.COLORLESS];

  public hp = 60;

  public weakness = [];

  public retreat = [];

  public set = 'TEST';

  public attacks = [{
    name: 'Source Strike',
    cost: [CardType.COLORLESS],
    damage: 30,
    text: 'Sets markers on this via attack / before-damage / after-attack.',
  }];

  public name = 'SourceMon';

  public fullName = 'SourceMon TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.markerHit = true;
    }
    if (BEFORE_DAMAGE(effect, 0, this)) {
      this.beforeDamageHit = true;
    }
    if (AFTER_ATTACK(effect, 0, this)) {
      this.afterAttackHit = true;
    }
    return state;
  }
}

class TurnSkipSourceCard extends PokemonCard {
  public readonly SKIP_MARKER = 'SKIP_MARKER';
  public readonly SKIP_MARKER_2 = 'SKIP_MARKER_2';

  public stage = Stage.BASIC;

  public cardType = [CardType.COLORLESS];

  public hp = 60;

  public weakness = [];

  public retreat = [];

  public set = 'TEST';

  public attacks = [{
    name: 'Extra Turn',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Take another turn after this one.',
  }];

  public name = 'TurnSkipMon';

  public fullName = 'TurnSkipMon TEST';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SKIP_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.SKIP_MARKER, this);
      effect.player.marker.removeMarker(this.SKIP_MARKER_2, this);
      effect.player.usedTurnSkip = false;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SKIP_MARKER, this)) {
      effect.player.marker.addMarker(this.SKIP_MARKER_2, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.marker.addMarker(this.SKIP_MARKER, this);
      effect.player.usedTurnSkip = true;
    }
    return state;
  }
}

class HardenSourceCard extends PokemonCard {
  public readonly HARDEN_MARKER = 'TEST_HARDEN_MARKER';
  public readonly CLEAR_HARDEN_MARKER = 'TEST_CLEAR_HARDEN_MARKER';

  public stage = Stage.BASIC;

  public cardType = [CardType.COLORLESS];

  public hp = 60;

  public weakness = [];

  public retreat = [];

  public set = 'TEST';

  public attacks = [{
    name: 'Harden',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Prevent damage of 60 or less next turn.',
  }];

  public name = 'HardenMon';

  public fullName = 'HardenMon TEST';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.HARDEN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_HARDEN_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.target.cards.includes(this)) {
      if (effect.target.marker.hasMarker(this.HARDEN_MARKER, this) && effect.damage <= 60) {
        effect.preventDefault = true;
        return state;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_HARDEN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_HARDEN_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.HARDEN_MARKER, this);
      });
    }

    return state;
  }
}

class RedBanquetSourceCard extends PokemonCard {
  public stage = Stage.BASIC;

  public cardType = [CardType.COLORLESS];

  public hp = 150;

  public weakness = [];

  public retreat = [];

  public set = 'TEST';

  public attacks = [{
    name: 'Red Banquet',
    cost: [CardType.COLORLESS],
    damage: 120,
    text: 'Take 1 more Prize if KO by this attack.',
  }];

  public name = 'BanquetMon';

  public fullName = 'BanquetMon TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return IF_OPPONENTS_POKEMON_KO_BY_ATTACK_DAMAGE_TAKE_MORE_PRIZES(store, state, effect, this, {
      attackName: 'Red Banquet',
    });
  }
}

class YogaLoopSourceCard extends PokemonCard {
  public stage = Stage.BASIC;

  public cardType = [CardType.COLORLESS];

  public hp = 210;

  public weakness = [];

  public retreat = [];

  public set = 'TEST';

  public attacks = [{
    name: 'Yoga Loop',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Lock this attack next turn; extra turn on KO.',
  }];

  public name = 'YogaMon';

  public fullName = 'YogaMon TEST';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_POKEMON_CANNOT_USE_THIS_ATTACK_NEXT_TURN(effect.player, this.attacks[0]);
      effect.player.usedTurnSkip = true;
    }
    return state;
  }
}

class DelegationCopycatCard extends PokemonCard {
  public markerHit = false;
  public beforeDamageHit = false;
  public afterAttackHit = false;
  public nativeAttackHit = false;
  public nativeBeforeDamageHit = false;
  public nativeAfterAttackHit = false;

  public stage = Stage.BASIC;

  public cardType = [CardType.COLORLESS];

  public hp = 70;

  public weakness = [];

  public retreat = [];

  public set = 'TEST';

  public attacks = [{
    name: 'Copy',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Copies an attack.',
  }];

  public name = 'CopycatMon';

  public fullName = 'CopycatMon TEST';

  public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.nativeAttackHit = true;
    }
    if (BEFORE_DAMAGE(effect, 0, this)) {
      this.nativeBeforeDamageHit = true;
    }
    if (AFTER_ATTACK(effect, 0, this)) {
      this.nativeAfterAttackHit = true;
    }
    return state;
  }
}

function setupDelegationGame(
  copycatCard: PokemonCard,
  sourceCard: PokemonCard,
) {
  const handler = { onStateChange: () => undefined };
  const store = new Store(handler as never);
  const state = new State();
  state.phase = GamePhase.PLAYER_TURN;
  state.turn = 2;
  state.activePlayer = 0;

  const player = new Player();
  player.id = 1;
  player.active = new PokemonCardList();
  player.active.cards = [copycatCard];
  player.bench = [];

  const opponent = new Player();
  opponent.id = 2;
  opponent.active = new PokemonCardList();
  opponent.active.cards = [sourceCard];
  opponent.bench = [];

  state.players = [player, opponent];
  store.state = state;

  return { store, state, player, opponent };
}

describe('copy-attack-delegation', () => {
  beforeEach(() => {
    clearCopyAttackSessionsForTests();
  });

  it('cloneAttacks produces distinct attack object references', () => {
    const source = new DelegationSourceCard();
    const cloned = cloneAttacks(source.attacks);
    expect(cloned[0]).not.toBe(source.attacks[0]);
    expect(cloned[0].name).toBe(source.attacks[0].name);
  });

  it('withTemporaryDelegatedAttacks restores copycat attacks after callback', () => {
    const copycat = new DelegationCopycatCard();
    const source = new DelegationSourceCard();
    const original = copycat.attacks;

    withTemporaryDelegatedAttacks(copycat, source, (cloned) => {
      expect(copycat.attacks).toBe(cloned);
      expect(copycat.attacks[0]).not.toBe(source.attacks[0]);
      return 'ok';
    });

    expect(copycat.attacks).toBe(original);
  });

  it('runDelegatedCopiedAttack binds source logic to the copycat card', () => {
    const copycat = new DelegationCopycatCard();
    const source = new DelegationSourceCard();
    const { store, state, player, opponent } = setupDelegationGame(copycat, source);

    runDelegatedCopiedAttack({
      store,
      state,
      player,
      opponent,
      copycatCard: copycat,
      sourceCard: source,
      selectedAttack: source.attacks[0],
      sourceSlot: player.active,
      skipLog: true,
    });

    expect(copycat.markerHit).toBe(true);
    expect(copycat.beforeDamageHit).toBe(true);
    expect(copycat.afterAttackHit).toBe(true);
    expect(copycat.nativeAttackHit).toBe(false);
    expect(copycat.nativeBeforeDamageHit).toBe(false);
    expect(copycat.nativeAfterAttackHit).toBe(false);
    expect(source.markerHit).toBe(false);
    expect(source.beforeDamageHit).toBe(false);
    expect(source.afterAttackHit).toBe(false);
  });

  it('does not run copycat own-attack handlers when copying source attack 0', () => {
    const copycat = new DelegationCopycatCard();
    const source = new DelegationSourceCard();
    const { store, state, player, opponent } = setupDelegationGame(copycat, source);

    runDelegatedCopiedAttack({
      store,
      state,
      player,
      opponent,
      copycatCard: copycat,
      sourceCard: source,
      selectedAttack: source.attacks[0],
      sourceSlot: player.active,
      skipLog: true,
    });

    expect(copycat.nativeAttackHit).toBe(false);
    expect(copycat.nativeBeforeDamageHit).toBe(false);
    expect(copycat.nativeAfterAttackHit).toBe(false);
    expect(copycat.markerHit).toBe(true);
    expect(copycat.afterAttackHit).toBe(true);
  });

  it('does not double-fire source card when it remains in play', () => {
    const copycat = new DelegationCopycatCard();
    const source = new DelegationSourceCard();
    let sourceSelfHits = 0;

    const baseReduce = DelegationSourceCard.prototype.reduceEffect;
    source.reduceEffect = function (store, state, effect) {
      if (this === source && (
        WAS_ATTACK_USED(effect, 0, this)
        || BEFORE_DAMAGE(effect, 0, this)
        || AFTER_ATTACK(effect, 0, this)
      )) {
        sourceSelfHits++;
      }
      return baseReduce.call(this, store, state, effect);
    };

    const { store, state, player, opponent } = setupDelegationGame(copycat, source);

    runDelegatedCopiedAttack({
      store,
      state,
      player,
      opponent,
      copycatCard: copycat,
      sourceCard: source,
      selectedAttack: source.attacks[0],
      sourceSlot: player.active,
      skipLog: true,
    });

    expect(sourceSelfHits).toBe(0);
    expect(copycat.markerHit).toBe(true);
    expect(copycat.beforeDamageHit).toBe(true);
    expect(copycat.afterAttackHit).toBe(true);
    expect(copycat.nativeAttackHit).toBe(false);
    expect(source.markerHit).toBe(false);
    expect(source.beforeDamageHit).toBe(false);
    expect(source.afterAttackHit).toBe(false);
  });

  it('clears usedTurnSkip after two EndTurns when copying a turn-skip attack', () => {
    const copycat = new DelegationCopycatCard();
    const source = new TurnSkipSourceCard();
    const { store, state, player, opponent } = setupDelegationGame(copycat, source);

    runDelegatedCopiedAttack({
      store,
      state,
      player,
      opponent,
      copycatCard: copycat,
      sourceCard: source,
      selectedAttack: source.attacks[0],
      sourceSlot: player.active,
      skipLog: true,
    });

    expect(player.usedTurnSkip).toBe(true);
    expect(player.marker.hasMarker(source.SKIP_MARKER, copycat)).toBe(true);

    resolveCopyAttackSessions(store, state, new EndTurnEffect(player));
    expect(player.usedTurnSkip).toBe(true);
    expect(player.marker.hasMarker(source.SKIP_MARKER_2, copycat)).toBe(true);

    resolveCopyAttackSessions(store, state, new EndTurnEffect(player));
    expect(player.usedTurnSkip).toBe(false);
    expect(player.marker.hasMarker(source.SKIP_MARKER, copycat)).toBe(false);
    expect(player.marker.hasMarker(source.SKIP_MARKER_2, copycat)).toBe(false);
  });

  it('Harden linger: prevents DealDamage to copycat and clears on opponent EndTurn', () => {
    const copycat = new DelegationCopycatCard();
    const source = new HardenSourceCard();
    const { store, state, player, opponent } = setupDelegationGame(copycat, source);

    runDelegatedCopiedAttack({
      store,
      state,
      player,
      opponent,
      copycatCard: copycat,
      sourceCard: source,
      selectedAttack: source.attacks[0],
      sourceSlot: player.active,
      skipLog: true,
    });

    expect(player.active.marker.hasMarker(source.HARDEN_MARKER, copycat)).toBe(true);
    expect(opponent.marker.hasMarker(source.CLEAR_HARDEN_MARKER, copycat)).toBe(true);

    const oppHit = new AttackEffect(opponent, player, {
      name: 'Hit',
      cost: [],
      damage: 50,
      text: '',
    });
    oppHit.source = opponent.active;
    const dealDamage = new DealDamageEffect(oppHit, 50);
    dealDamage.target = player.active;

    store.reduceEffect(state, dealDamage);
    expect(dealDamage.preventDefault).toBe(true);

    resolveCopyAttackSessions(store, state, new EndTurnEffect(opponent));
    expect(opponent.marker.hasMarker(source.CLEAR_HARDEN_MARKER, copycat)).toBe(false);
    expect(player.active.marker.hasMarker(source.HARDEN_MARKER, copycat)).toBe(false);
  });

  it('Red Banquet: awards extra prize when KO during copied attack', () => {
    const copycat = new DelegationCopycatCard();
    const source = new RedBanquetSourceCard();
    const { store, state, player, opponent } = setupDelegationGame(copycat, source);

    state.phase = GamePhase.ATTACK;
    state.activePlayer = 0;

    runDelegatedCopiedAttack({
      store,
      state,
      player,
      opponent,
      copycatCard: copycat,
      sourceCard: source,
      selectedAttack: source.attacks[0],
      sourceSlot: player.active,
      skipLog: true,
    });

    expect(state.playerLastAttack[player.id].sourceCard).toBe(copycat);
    expect(state.playerLastAttack[player.id].attack.name).toBe('Red Banquet');

    opponent.marker.addMarker(opponent.DAMAGE_DEALT_MARKER, opponent as never);

    const knockOut = new KnockOutEffect(opponent, opponent.active);
    knockOut.prizeCount = 1;
    store.reduceEffect(state, knockOut);

    expect(knockOut.prizeCount).toBe(2);
  });

  it('Yoga Loop: arms attack-name lock and copy chooser blocks it', () => {
    const copycat = new DelegationCopycatCard();
    const source = new YogaLoopSourceCard();
    const { store, state, player, opponent } = setupDelegationGame(copycat, source);

    runDelegatedCopiedAttack({
      store,
      state,
      player,
      opponent,
      copycatCard: copycat,
      sourceCard: source,
      selectedAttack: source.attacks[0],
      sourceSlot: player.active,
      skipLog: true,
    });

    expect(player.usedTurnSkip).toBe(true);
    expect(player.active.cannotUseAttacksNextTurnPending).toContain('Yoga Loop');

    // Simulate EndTurn arming of pending → active lock list
    player.active.cannotUseAttacksNextTurn = [...player.active.cannotUseAttacksNextTurnPending];
    player.active.cannotUseAttacksNextTurnPending = [];

    const blocked = blockCannotUseAttacksNextTurn(player, [source]);
    expect(blocked).toEqual([{ index: 0, attack: 'Yoga Loop' }]);
  });
});
