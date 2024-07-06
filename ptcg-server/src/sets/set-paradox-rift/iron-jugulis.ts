import { PokemonCard, Stage, CardTag, CardType, StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, GameError, PokemonCardList } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class IronJugulis extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public tags = [CardTag.FUTURE];

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Homing Headbutt',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to 3 of your opponent\'s Pokémon that have any damage counters on them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Baryon Beam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'If this Pokémon has a Future Booster Energy Capsule attached, this attack can be used for [C][C][C].'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '158';

  public name: string = 'Iron Jugulis';

  public fullName: string = 'Iron Jugulis PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const damagedPokemon: PokemonCardList[] = [];


      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          damagedPokemon.push(cardList);
        }

        if (damagedPokemon.length == 0) {
          throw new GameError(GameMessage.CANNOT_USE_ATTACK);
        }

        // Opponent has damaged Pokemon
        if (damagedPokemon.length > 0) {

          state = store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH, SlotType.ACTIVE],
            { min: 1, max: 3, allowCancel: false }
          ), target => {
            if (!target || target.length === 0) {
              return;
            }
            const damageEffect = new PutDamageEffect(effect, 50);
            damageEffect.target = target[0];
            store.reduceEffect(state, damageEffect);
          });
        }
      });
    }

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;


      let isAncientBoosterAttached = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.tool !== undefined) {
          if (cardList.tool.name === 'Ancient Booster Energy Capsule') {
            isAncientBoosterAttached = true;
          }
        }
      });

      if (isAncientBoosterAttached) {
        this.attacks[1].cost = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
      }
    }
    return state;
  }
}