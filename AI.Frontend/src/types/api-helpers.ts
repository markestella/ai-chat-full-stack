import type { operations } from './api-types-generated';

/**
 * Extracts the response type for a successful API call (HTTP 200)
 * 
 * @template Path API endpoint path
 * @template Method HTTP method
 */
export type ApiResponse<
  Path extends keyof operations,
  Method extends keyof operations[Path]
> = operations[Path][Method] extends {
  responses: { 200: { content: { 'application/json': infer T } } }
}
  ? T
  : never;

/**
 * Extracts the request body type for an API call
 * 
 * @template Path API endpoint path
 * @template Method HTTP method
 */
export type ApiRequestBody<
  Path extends keyof operations,
  Method extends keyof operations[Path]
> = operations[Path][Method] extends {
  requestBody?: { content: { 'application/json': infer T } }
}
  ? T
  : never;

export type {
  components,
  operations,
  paths,
} from './api-types-generated';
