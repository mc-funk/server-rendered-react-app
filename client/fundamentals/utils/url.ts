import { FlowRouteParams } from '../ui/types';

declare global {
  interface Window {
    BOUNDED_CONTEXT_CONFIG?: {
      fundamentals?: {
        api: string;
      };
    };
  }
}

const urlBuilder = (path: string): string => {
  let globalUrl = '';
  if (
    window.BOUNDED_CONTEXT_CONFIG &&
    window.BOUNDED_CONTEXT_CONFIG.fundamentals
  ) {
    globalUrl = window.BOUNDED_CONTEXT_CONFIG.fundamentals.api;
  }
  const urlRoot: string =
    process.env.REACT_APP_FLOW_FUNDAMENTALS_API_URL || globalUrl || '';
  return `${urlRoot}${path}`;
};

export const apiUrlBuilder = (slug: string, path: string): string => {
  return urlBuilder(`/api/v1/org/${slug}${path}`);
};

export const link = (path: string, params: FlowRouteParams): string => {
  // v2 is not necessary when embedded in the main app.
  return `/org/${params.org}/r/${params.slug}/${path}/${params.teamId || ''}${
    params.apexUserId ? '/' : ''
  }${params.apexUserId || ''}`;
};
