import { APIKey, ReportAPIKey } from '../types/ReportType';
// import {
//     TeamErrorAction,
//     TargetsLoadedErrorAction,
//     LoadReportAction,
//     ContributorErrorAction,
//     ReportErrorAction,
// } from 'state/actions';

export interface DRFResponse<T> {
  count: number;
  next: unknown;
  previous: unknown;
  results: T[];
}

export function isDRFResponse<T>(obj: unknown): obj is DRFResponse<T> {
  if (typeof obj === 'object' && obj !== null) {
    return (
      'count' in obj && 'next' in obj && 'previous' in obj && 'results' in obj
    );
  }
  return false;
}

export interface BaseMetrics {
  period_start_date: string;
}

export interface CodeAggregateMetrics extends BaseMetrics {
  active_days: number;
  commit_count: number;
  total_impact: number;
  total_efficiency: number;
}

export interface ReviewMetrics extends BaseMetrics {
  tbd: number;
}

export interface SubmitMetrics extends BaseMetrics {
  tbd: number;
}

export type AnyMetric = CodeAggregateMetrics & ReviewMetrics & SubmitMetrics;

export interface RawTeam {
  id: number;
  name: string;
  description: string;
  depth: Depth;
  path: string;
  parent_id: number | null;
  visibility: number;
  nested_teams: number;
  unnested_users: number;
  all_users: number;
}

export interface Team extends RawTeam {
  children: Set<number>;
}

export type Period = Record<string, AnyMetric>;

export interface TeamData<T extends BaseMetrics> {
  averages?: T;
  periods?: T[];
}

export interface Target<T extends BaseMetrics> {
  id: number;
  team_id?: number | null;
  apex_user_id?: number | null;
  report_type: ReportAPIKey;
  metric_type: APIKey<T>;
  minimum?: number;
  target?: number;
  maximum?: number | null;
  inherited: boolean;
  target_type_id: number;
}

export interface RawApexUser {
  id: number;
  name: string;
  email: string;
  visibility: boolean;
}

export enum MembershipType {
  CONTRIBUTOR = 'contributor',
  VIEWER = 'viewer',
}

export enum Depth {
  INHERIT = 100,
  AGGREGATE = 200,
  ATOMIC = 300,
}

export interface RawContributor {
  id: number;
  team: RawTeam;
  apex_user: RawApexUser;
  membership_type: MembershipType;
  depth: Depth;
}

export interface ContributorData<T extends BaseMetrics> {
  averages?: T | undefined;
  periods?: T[];
}

export type ErrorMeta = {
  message?: string;
  status?: number;
};

// export type ErrorsAction =
//     | TeamErrorAction
//     | ContributorErrorAction
//     | ReportErrorAction
//     | TargetsLoadedErrorAction
//     | LoadReportAction<BaseMetrics>;
