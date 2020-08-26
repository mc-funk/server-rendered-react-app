import { Moment } from 'moment';

export interface ShowOptions {
  trend: boolean;
  average: boolean;
  targets: boolean;
  thisWeek: boolean;
  benchmarks: boolean;
}

export enum RepoListType {
  TAG_MODE = 'TA',
  INCLUDE_MODE = 'IR',
  EXCLUDE_MODE = 'ER',
}

export type RepoDataList = [RepoListType, ...Array<number>];

export interface RepoData {
  _base: 'none' | 'all' | 'some';
  _include?: RepoDataList;
}

export type TeamID = number | 'all' | null | undefined;

export interface ExternalProps {
  start: Moment;
  end: Moment;
  teamId?: TeamID;
  repoIds?: number[];
  includeNestedTeams: boolean;
  showOptions: ShowOptions;
  repoData: RepoData;
}
