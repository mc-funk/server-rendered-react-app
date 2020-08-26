import { BaseMetrics, Depth } from 'state/types';
import { RepoListType, TeamID, RepoData } from 'ui/types/ExternalProps';
import { LoadReportAction } from 'state/actions';
import { ReportAPI } from 'ui/types';
import { Moment } from 'moment';
import { RootState } from 'state/store';

export enum Resolution {
  PERIOD = 'period',
  WEEK = 'week',
}

export interface FilterURLProps<T extends BaseMetrics> {
  api: ReportAPI<T>;
  start: Moment;
  end: Moment;
  teamId?: TeamID;
  repoData: RepoData;
  includeNestedTeams: boolean;
  resolution: Resolution;
  apexUserId?: number;
}

export function filterURLBuilder<T extends BaseMetrics>(
  action: FilterURLProps<T>
) {
  const searchParam = new URLSearchParams();
  const {
    api,
    start,
    end,
    teamId,
    repoData,
    includeNestedTeams,
    resolution,
    apexUserId,
  } = action;

  let depth = Depth.AGGREGATE;

  const dateRange = `[${start.format('YYYY-MM-DD')}:${end.format(
    'YYYY-MM-DD'
  )}]`;
  searchParam.append('date_range', dateRange);

  // If our teamId is a number, *and* NaN (why, JavaScript) -- then we are looking for a specific team
  // In all other cases, we are defaulting to "all teams"
  if (typeof teamId === 'number' && !isNaN(teamId)) {
    searchParam.append('team_id', teamId.toString());
  }

  if (typeof apexUserId === 'number' && !isNaN(apexUserId)) {
    searchParam.append('apex_user_id', apexUserId.toString());
    depth = Depth.ATOMIC;
  }

  // Repo filter
  if (repoData) {
    if (repoData._base !== 'all' && repoData._include !== undefined) {
      // Depending on which repo mode we are in, we will use a different DRF filter
      const repoLookup = {
        [RepoListType.INCLUDE_MODE]: 'repo_id__in',
        [RepoListType.EXCLUDE_MODE]: 'repo_id_not__in',
        [RepoListType.TAG_MODE]: 'repo_tag_id__in',
      };
      const repoValue = repoData._include.slice(1).join(',');
      searchParam.append(repoLookup[repoData._include[0]], repoValue);
    }
  }

  // Include nested teams?
  searchParam.append(
    'include_nested_teams',
    includeNestedTeams ? 'true' : 'false'
  );

  // Atomic or aggregate data?
  searchParam.append(
    depth === Depth.AGGREGATE ? 'aggregate' : 'atomic',
    'true'
  );

  searchParam.append('resolution', resolution);

  // no, api.api is not a typo :)
  return `/${api.api}/aggregate-metrics/?${searchParam}`;
}

export function actionFilterURLBuilder<T extends BaseMetrics>(
  action: LoadReportAction<T>,
  resolution: Resolution
) {
  return filterURLBuilder({ ...action, resolution });
}

export function stateFilterURLBuilder<T extends BaseMetrics>(
  state: RootState<T>,
  api: ReportAPI<T>,
  resolution: Resolution,
  overrides?: Partial<FilterURLProps<T>>
) {
  const {
    filters: { start, end, repoData, includeNestedTeams },
  } = state;
  const retVal = filterURLBuilder({
    start,
    end,
    repoData,
    api,
    includeNestedTeams,
    resolution,
    ...overrides,
  });
  return retVal;
}
