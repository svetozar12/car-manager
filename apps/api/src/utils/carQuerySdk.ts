import { builtinModules } from 'module';
import { Envs } from './env';
import { logger } from './logger';

type ParamPrimitive = string | number | boolean;
export type ParamValue = ParamPrimitive | ParamPrimitive[];
export type Params = Record<string, ParamValue | null | undefined>;

export interface BuildOptions {
  /** Add a cache-busting "_" param (timestamp). */
  cacheBust?: boolean;
  /** Override the base API URL if needed. */
  baseUrl?: string;
}

/**
 * Build a CarQuery API URL.
 * @example
 * buildCarQueryUrl("getModels", { make: "kia", year: 2022, sold_in_us: false })
 */
export function buildCarQueryUrl(
  cmd: string,
  params: Params = {},
  options: BuildOptions = {},
): string {
  if (!cmd || typeof cmd !== 'string') {
    throw new TypeError('cmd (string) is required');
  }

  const { cacheBust = true, baseUrl = Envs.CAR_QUERY_API_URL } = options;

  const url = new URL(baseUrl);
  const qs = url.searchParams;

  qs.set('cmd', cmd);

  for (const [key, val] of Object.entries(params)) {
    if (val == null) continue;

    if (Array.isArray(val)) {
      for (const v of val) qs.append(key, normalize(v));
    } else {
      qs.set(key, normalize(val));
    }
  }

  if (cacheBust) qs.set('_', Date.now().toString());

  return url.toString();
}

function normalize(v: ParamPrimitive): string {
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  return String(v);
}

const CmdMethod = {
  GET_MAKES: 'getMakes',
  GET_ALL_MODELS: 'getModels',
  GET_TRIMS: 'getTrims',
  GET_MODEL: 'GetModel',
} as const;

const { GET_MAKES, GET_MODEL, GET_ALL_MODELS, GET_TRIMS } = CmdMethod;

export async function GetMakes() {
  try {
    const url = buildCarQueryUrl(GET_MAKES);

    const response = await fetch(url, { method: 'GET' });
    return response.json();
  } catch (error) {
    logger.error(error);
    return [];
  }
}

export async function GetModels(make: string, year: number) {
  try {
    const url = buildCarQueryUrl(GET_ALL_MODELS, { make, year });

    const response = await fetch(url, { method: 'GET' });
    return response.json();
  } catch (error) {
    logger.error(error);
    return [];
  }
}

export async function GetTrim(make: string, year: number, model: string) {
  try {
    const url = buildCarQueryUrl(GET_TRIMS, {
      make,
      year,
      model,
      full_results: 0,
    });

    const response = await fetch(url, { method: 'GET' });
    return response.json();
  } catch (error) {
    logger.error(error);
    return [];
  }
}

export async function GetModel(model: string) {
  try {
    const url = buildCarQueryUrl(GET_MODEL, {
      model,
    });

    const response = await fetch(url, { method: 'GET' });
    return response.json();
  } catch (error) {
    logger.error(error);
    return [];
  }
}
