import { PokemonCard, CardTag, Stage, CardType, State, StateUtils, GameError, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, Effect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class BuzzwoleGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 190;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Jet Punch',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Knuckle Impact',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: 160,
      text: 'This Pokémon can\'t attack during your next turn.'
    },
    {
      name: 'Absorption-GX',
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING],
      damage: 0,
      gxAttack: true,
      text: 'This attack does 40 damage for each of your remaining Prize cards. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'CIN';

  public name: string = 'Buzzwole-GX';

  public fullName: string = 'Buzzwole-GX CIN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  // for preventing the pokemon from attacking on the next turn
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // removing the markers for preventing the pokemon from attacking
    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    // Jet Punch
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    // Knuckle Impact
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    // Absorption GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      effect.damage = 40 * player.getPrizeLeft();

      return state;
    }

    return state;
  }
}