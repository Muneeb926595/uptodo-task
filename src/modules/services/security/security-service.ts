/**
 * Security Service
 * Detects jailbreak/root and provides device security status
 */

import JailMonkey from 'jail-monkey';
import { Platform } from 'react-native';

export interface SecurityStatus {
  isJailbroken: boolean;
  canMockLocation: boolean;
  isDebuggedMode: boolean;
  isOnExternalStorage: boolean;
  trustFall: boolean;
}

class SecurityService {
  /**
   * Check if device is jailbroken (iOS) or rooted (Android)
   */
  isJailbroken(): boolean {
    return JailMonkey.isJailBroken();
  }

  /**
   * Check if app can mock location (Android only)
   */
  canMockLocation(): boolean {
    return Platform.OS === 'android' ? JailMonkey.canMockLocation() : false;
  }

  /**
   * Check if app is running in debug mode
   */
  async isDebuggedMode(): Promise<boolean> {
    return await JailMonkey.isDebuggedMode();
  }

  /**
   * Check if app is installed on external storage (Android only)
   */
  isOnExternalStorage(): boolean {
    return Platform.OS === 'android' ? JailMonkey.isOnExternalStorage() : false;
  }

  /**
   * Comprehensive security check (detects all potential issues)
   */
  trustFall(): boolean {
    return JailMonkey.trustFall();
  }

  /**
   * Get complete security status
   */
  async getSecurityStatus(): Promise<SecurityStatus> {
    const isDebuggedMode = await this.isDebuggedMode();

    return {
      isJailbroken: this.isJailbroken(),
      canMockLocation: this.canMockLocation(),
      isDebuggedMode,
      isOnExternalStorage: this.isOnExternalStorage(),
      trustFall: this.trustFall(),
    };
  }

  /**
   * Check if device is secure for sensitive operations
   * Returns true if device passes security checks
   */
  isDeviceSecure(): boolean {
    return !this.isJailbroken();
  }

  /**
   * Get security warning message
   */
  getSecurityWarning(): string | null {
    if (this.isJailbroken()) {
      const deviceType = Platform.OS === 'ios' ? 'jailbroken' : 'rooted';
      return `This device appears to be ${deviceType}. Using UpTodo on compromised devices may pose security risks to your data.`;
    }
    return null;
  }
}

// Export class for testing
export { SecurityService };

// Create and export singleton instance
export const securityService = new SecurityService();
