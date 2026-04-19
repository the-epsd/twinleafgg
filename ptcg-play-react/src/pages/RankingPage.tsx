import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Rank } from 'ptcg-server';
import type { RankingInfo } from 'ptcg-server';
import { getRankingList } from '../api/rankingApi';
import { useAuth } from '../context/AuthContext';
import { appConfig } from '../env/config';
import { ApiError } from '../api/apiError';

const PANEL_MAX_WIDTH = 800;

function useDebounced<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return debounced;
}

export function RankingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const loggedUserId = user?.userId ?? 0;

  const [ranking, setRanking] = useState<RankingInfo[]>([]);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounced(searchInput, 300);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageSize = appConfig.defaultPageSize;

  const prevDebounced = useRef(debouncedSearch);
  useEffect(() => {
    if (prevDebounced.current !== debouncedSearch) {
      prevDebounced.current = debouncedSearch;
      setPageIndex(0);
    }
  }, [debouncedSearch]);

  const load = useCallback(async (page: number, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getRankingList(page, query);
      setRanking(res.ranking.filter((row) => row.user.rank !== Rank.BANNED));
      setTotal(res.total);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('RANKING_FAILED_LOAD'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load(pageIndex, debouncedSearch);
  }, [pageIndex, debouncedSearch, load]);

  const maxPage = Math.max(0, Math.ceil(total / pageSize) - 1);
  const pageCount = maxPage + 1;
  const rangeStart = total > 0 ? pageIndex * pageSize + 1 : 0;
  const rangeEnd = total > 0 ? Math.min((pageIndex + 1) * pageSize, total) : 0;
  const rangeLabel =
    total > 0 ? t('RANKING_RANGE', { start: rangeStart, end: rangeEnd, total }) : '';

  return (
    <div
      style={{
        width: '100%',
        maxWidth: PANEL_MAX_WIDTH,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <h1>{t('RANKING_TITLE')}</h1>
      <p style={{ margin: '0 0 12px', opacity: 0.75, fontSize: '0.9rem' }}>
        {t('RANKING_INTRO_BLURB', { pageSize })}
      </p>
      <div style={{ marginBottom: 16 }}>
        <input
          type="search"
          placeholder={t('RANKING_SEARCH_PLACEHOLDER')}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>
              {t('RANKING_COL_POSITION')}
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>
              {t('RANKING_COL_POINTS')}
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>
              {t('RANKING_COL_PLAYER')}
            </th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>
              {t('RANKING_COL_ACTIONS')}
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} style={{ padding: 16, color: '#555' }}>
                {t('RANKING_TABLE_LOADING')}
              </td>
            </tr>
          ) : ranking.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: 16, color: '#555' }}>
                {t('RANKING_TABLE_EMPTY')}
              </td>
            </tr>
          ) : (
            ranking.map((row) => (
              <tr
                key={row.user.userId}
                style={{
                  background: row.user.userId === loggedUserId ? '#e8f4ff' : undefined,
                }}
              >
                <td style={{ padding: 8 }}>{row.position}</td>
                <td style={{ padding: 8 }}>{row.user.ranking}</td>
                <td style={{ padding: 8 }}>{row.user.name}</td>
                <td style={{ padding: 8 }}>
                  {row.user.userId !== loggedUserId && (
                    <Link to={`/message/${row.user.userId}`}>{t('RANKING_ACTION_MESSAGE')}</Link>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div
        style={{
          marginTop: 16,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 12px',
          alignItems: 'center',
        }}
      >
        <button type="button" disabled={pageIndex <= 0 || loading} onClick={() => setPageIndex((p) => Math.max(0, p - 1))}>
          {t('RANKING_PREV_PAGE')}
        </button>
        <span>
          {t('RANKING_PAGE_OF', { current: pageIndex + 1, total: pageCount || 1 })}
          {total > 0 ? ` · ${rangeLabel}` : total === 0 && !loading ? ` · ${t('RANKING_ZERO_PLAYERS')}` : ''}
          {loading ? ` · ${t('RANKING_UPDATING')}` : ''}
        </span>
        <button type="button" disabled={pageIndex >= maxPage || loading} onClick={() => setPageIndex((p) => p + 1)}>
          {t('RANKING_NEXT_PAGE')}
        </button>
      </div>
    </div>
  );
}
