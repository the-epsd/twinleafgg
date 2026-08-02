/**
 * Card catalog — local files from https://github.com/PokemonTCG/pokemon-tcg-data
 * (synced into data/pokemon-tcg-data via `npm run sync-data`).
 */
export {
  DataError,
  TcgDexApiError,
  type TcgDexAbility,
  type TcgDexAttack,
  type TcgDexCard,
  type TcgDexCardResume,
  type TcgDexSerie,
  type TcgDexSerieResume,
  type TcgDexSet,
  type TcgDexSetResume,
  type TcgDexWeakRes,
} from '../data/types';

export {
  cardImageUrl,
  clearLocalCache as clearPwCache,
  getCard,
  getSerie,
  getSet,
  listSeries,
  searchCardsByName,
  setLogoUrl,
} from '../data/localData';

export {
  getActiveSource,
  resetDataSource,
  setActiveSource,
  type DataSource,
} from '../data/compat';
