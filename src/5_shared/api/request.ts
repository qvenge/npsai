import { API_HOST } from './const';
import mocks from './mock';

type ContentType = 'application/json' | 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';

export interface RequestParams extends Omit<globalThis.RequestInit, 'headers' | 'body'> {
  body?: Dictionary<any> | string;
  query?: Dictionary<string>;
  headers?: Dictionary<string>;
  contentType?: ContentType;
  accessToken?: string;
}

let mockEnabled = false;

/**
 * Sends an HTTP request and returns the response as a JSON object.
 *
 * @template R - The expected response type.
 * @param {string} url - The endpoint URL for the request. If it starts with '/', the host is prepended.
 * @param {RequestParams} [params={}] - Optional parameters for the request.
 * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} [params.method] - The HTTP method to use. Defaults to 'GET'.
 * @param {Dictionary<string>} [params.query] - Query parameters to include in the request URL.
 * @param {Dictionary} [params.body] - The request body data, used for methods other than 'GET'.
 * @param {Dictionary<string>} [params.headers] - Custom headers to include in the request.
 * @param {ContentType} [params.contentType] - The content type of the request body. Defaults to 'application/json'.
 * @returns {R} The response from the server, parsed as JSON.
 */
export async function requestApi(url: string, {
  body,
  query: queryInit,
  accessToken,
  contentType,
  ...params
}: RequestParams = {}): ReturnType<typeof fetch> {
  const query = new URLSearchParams(queryInit);
  const fetchParams: Dictionary<any> = {
    ...params,
    method: params.method ?? (body != null ? 'POST' : 'GET'),
    headers: params.headers ?? {}
  };

  if (accessToken != null) {
    // headers['Authorization'] = `Bearer ${access_token}`;
    fetchParams.headers.cookie = `users_access_token=${accessToken}; Path=/; HttpOnly;`
  }

  if (body != null && fetchParams.method !== 'GET') {
    if (typeof body === 'string' || body instanceof FormData) {
      fetchParams.body = body;
    } else {
      fetchParams.body = JSON.stringify(body);
      fetchParams.headers['content-Type'] = contentType ?? fetchParams.headers['Content-Type'] ?? 'application/json';
    }
  }

  const normalizedUrl = `${url.startsWith('/') ? `${API_HOST}/npsai${url}` : url}${query.toString() ? `?${query.toString()}` : ''}`;

  if (mockEnabled) {
    const parsed = new URL(normalizedUrl);
    const mockName = parsed.pathname.split('/').filter(Boolean).pop();
    if (mockName == null) return new Response('Not found', { status: 404 });
    // @ts-ignore
    const mockData = mocks[mockName];

    if (mockData == null) return new Response('Not found', { status: 404 });

    return new Response(JSON.stringify(mockData), { status: 200 });
  }

  try {
    return fetch(
      normalizedUrl,
      fetchParams
    );
  } catch(err) {
    throw err;
  }
}

export function normalizeQuery(query: Dictionary<any>): Dictionary<string> {
  return Object.entries(query).reduce<Dictionary<string>>((acc, [key, value]) => {
    if (value != null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function get(
  url: string,
  query: RequestParams['query'],
  params?: Omit<RequestParams, 'method' | 'body' | 'query'>
): ReturnType<typeof requestApi> {
  return requestApi(url, {method: 'GET', query, ...params});
}

export function post(
  url: string,
  body: RequestParams['body'],
  params?: Omit<RequestParams, 'method' | 'body'>
): ReturnType<typeof requestApi> {
  return requestApi(url, {method: 'POST', body, ...params});
}