import { StoryStorageService } from './storage';

// Production Cloud Run backend endpoint for Lala Story Lab
export const DEFAULT_REMOTE_API_BASE = 'https://ais-dev-xaw4hixb5ftsrppe5i7lsn-233814856956.asia-east1.run.app';

/**
 * Returns the resolved API endpoint URL.
 * When running in Capacitor on Android (where localhost has no backend server),
 * it points automatically to the Cloud Run backend server.
 */
export function getApiUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // 1. If user explicitly configured an API server URL in storage
  const customServer = StoryStorageService.getApiServerUrl();
  if (customServer && customServer.trim().length > 0) {
    return `${customServer.trim().replace(/\/+$/, '')}${cleanPath}`;
  }

  // 2. Detect if running inside Android Capacitor APK or local non-hosted environment
  if (typeof window !== 'undefined') {
    const isCapacitorScheme = window.location.protocol === 'capacitor:' || window.location.protocol === 'file:';
    const isLocalhostWithoutPort = window.location.hostname === 'localhost' && !window.location.port;
    const isNativeCapacitor = Boolean((window as any).Capacitor?.isNativePlatform?.());

    if (isCapacitorScheme || isLocalhostWithoutPort || isNativeCapacitor) {
      return `${DEFAULT_REMOTE_API_BASE}${cleanPath}`;
    }
  }

  // 3. Normal web development or preview
  return cleanPath;
}
