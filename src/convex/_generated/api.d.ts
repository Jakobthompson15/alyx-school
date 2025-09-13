/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as assignments from "../assignments.js";
import type * as auth_emailOtp from "../auth/emailOtp.js";
import type * as auth from "../auth.js";
import type * as grading from "../grading.js";
import type * as grading_internal from "../grading_internal.js";
import type * as http from "../http.js";
import type * as lessonPlans from "../lessonPlans.js";
import type * as lessonPlans_internal from "../lessonPlans_internal.js";
import type * as seedData from "../seedData.js";
import type * as submissions from "../submissions.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  assignments: typeof assignments;
  "auth/emailOtp": typeof auth_emailOtp;
  auth: typeof auth;
  grading: typeof grading;
  grading_internal: typeof grading_internal;
  http: typeof http;
  lessonPlans: typeof lessonPlans;
  lessonPlans_internal: typeof lessonPlans_internal;
  seedData: typeof seedData;
  submissions: typeof submissions;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
