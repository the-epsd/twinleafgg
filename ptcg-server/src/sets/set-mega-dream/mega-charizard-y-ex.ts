import { CardTag, CardType, DiscardEnergyPrompt, EnergyCard, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaCharizardYex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Charmeleon';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 360;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Plosion Y',
    cost: [R, R, C],
    damage: 0,
    text: 'Discard 3 Energy from this Pokemon. This attack does 280 damage to 1 of your opponent\'s Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  }];

  public regulationMark: string = 'I';
  public set: string = 'MC';
  public setNumber: string = '85';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Charizard Y ex';
  public fullName: string = 'Mega Charizard Y ex MC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check how many energy cards are attached to this Pokemon
      const energyCount = player.active.cards.filter(card =>
        card instanceof EnergyCard
      ).length;

      if (energyCount < 3) {
        // Not enough energy, can't use attack
        return state;
      }

      // Discard exactly 3 energy from this Pokemon only
      return store.prompt(state, new DiscardEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE], // Only from active Pokemon (this Pokemon)
        { superType: SuperType.ENERGY },
        { min: 3, max: 3, allowCancel: false }
      ), transfers => {
        if (transfers === null || transfers.length !== 3) {
          return;
        }

        // Discard the selected energy cards
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          source.moveCardTo(transfer.card, player.discard);
        }

        // Check if opponent has any Pokemon
        const hasPokemon = opponent.active.cards.length > 0 ||
          opponent.bench.some(b => b.cards.length > 0);

        if (!hasPokemon) {
          return state;
        }

        // Prompt to choose 1 opponent Pokemon (active or bench)
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          DAMAGE_OPPONENT_POKEMON(store, state, effect, 280, targets);
        });
      });
    }
    return state;
  }
}