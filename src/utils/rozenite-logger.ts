/**
 * Rozenite DevTools Logger
 *
 * Centralizes all Rozenite plugin initialization for better organization
 * and easier maintenance. Only active in development mode.
 */

import { useNetworkActivityDevTools } from '@rozenite/network-activity-plugin';
import { useMMKVDevTools } from '@rozenite/mmkv-plugin';
import { useRequireProfilerDevTools } from '@rozenite/require-profiler-plugin';
import { mmkvInstance } from '../services/storage/mmkv-adapter';

/**
 * Initialize all Rozenite DevTools plugins
 *
 * This hook sets up:
 * - Network Activity Monitor: Track HTTP/HTTPS requests
 * - MMKV Storage Inspector: Inspect MMKV storage instances
 * - Require Profiler: Analyze module loading performance
 *
 * @example
 * function App() {
 *   useRozeniteLogger();
 *   // ... rest of your app
 * }
 */
export const useRozeniteLogger = () => {
  // Network Activity: Monitor all network requests
  useNetworkActivityDevTools();

  // MMKV Storage: Inspect MMKV storage instances
  useMMKVDevTools({
    storages: {
      'default-mmkv-storage': mmkvInstance,
    },
  });

  // Require Profiler: Analyze module loading and startup performance
  useRequireProfilerDevTools();
};
