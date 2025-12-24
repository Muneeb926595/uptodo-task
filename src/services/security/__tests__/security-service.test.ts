/**
 * Security Service Test Suite
 * Tests jailbreak/root detection and security status checks
 */

import { Platform } from 'react-native';
import { SecurityService } from '../security-service';

// Mock jail-monkey
jest.mock('jail-monkey', () => ({
  isJailBroken: jest.fn(),
  canMockLocation: jest.fn(),
  isDebuggedMode: jest.fn(),
  isOnExternalStorage: jest.fn(),
  trustFall: jest.fn(),
}));

import JailMonkey from 'jail-monkey';

describe('SecurityService', () => {
  let securityService: SecurityService;
  const mockJailMonkey = JailMonkey as jest.Mocked<typeof JailMonkey>;

  beforeEach(() => {
    securityService = new SecurityService();
    jest.clearAllMocks();
  });

  describe('isJailbroken', () => {
    it('should return true when device is jailbroken', () => {
      mockJailMonkey.isJailBroken.mockReturnValue(true);

      const result = securityService.isJailbroken();

      expect(result).toBe(true);
      expect(mockJailMonkey.isJailBroken).toHaveBeenCalled();
    });

    it('should return false when device is not jailbroken', () => {
      mockJailMonkey.isJailBroken.mockReturnValue(false);

      const result = securityService.isJailbroken();

      expect(result).toBe(false);
    });
  });

  describe('canMockLocation', () => {
    it('should return true on Android when location can be mocked', () => {
      Platform.OS = 'android';
      mockJailMonkey.canMockLocation.mockReturnValue(true);

      const result = securityService.canMockLocation();

      expect(result).toBe(true);
      expect(mockJailMonkey.canMockLocation).toHaveBeenCalled();
    });

    it('should return false on Android when location cannot be mocked', () => {
      Platform.OS = 'android';
      mockJailMonkey.canMockLocation.mockReturnValue(false);

      const result = securityService.canMockLocation();

      expect(result).toBe(false);
    });

    it('should return false on iOS regardless of mock location capability', () => {
      Platform.OS = 'ios';
      mockJailMonkey.canMockLocation.mockReturnValue(true);

      const result = securityService.canMockLocation();

      expect(result).toBe(false);
      expect(mockJailMonkey.canMockLocation).not.toHaveBeenCalled();
    });
  });

  describe('isDebuggedMode', () => {
    it('should return true when app is in debug mode', async () => {
      mockJailMonkey.isDebuggedMode.mockResolvedValue(true);

      const result = await securityService.isDebuggedMode();

      expect(result).toBe(true);
      expect(mockJailMonkey.isDebuggedMode).toHaveBeenCalled();
    });

    it('should return false when app is not in debug mode', async () => {
      mockJailMonkey.isDebuggedMode.mockResolvedValue(false);

      const result = await securityService.isDebuggedMode();

      expect(result).toBe(false);
    });
  });

  describe('isOnExternalStorage', () => {
    it('should return true on Android when app is on external storage', () => {
      Platform.OS = 'android';
      mockJailMonkey.isOnExternalStorage.mockReturnValue(true);

      const result = securityService.isOnExternalStorage();

      expect(result).toBe(true);
      expect(mockJailMonkey.isOnExternalStorage).toHaveBeenCalled();
    });

    it('should return false on Android when app is on internal storage', () => {
      Platform.OS = 'android';
      mockJailMonkey.isOnExternalStorage.mockReturnValue(false);

      const result = securityService.isOnExternalStorage();

      expect(result).toBe(false);
    });

    it('should return false on iOS regardless of storage type', () => {
      Platform.OS = 'ios';
      mockJailMonkey.isOnExternalStorage.mockReturnValue(true);

      const result = securityService.isOnExternalStorage();

      expect(result).toBe(false);
      expect(mockJailMonkey.isOnExternalStorage).not.toHaveBeenCalled();
    });
  });

  describe('trustFall', () => {
    it('should return true when comprehensive check detects security issues', () => {
      mockJailMonkey.trustFall.mockReturnValue(true);

      const result = securityService.trustFall();

      expect(result).toBe(true);
      expect(mockJailMonkey.trustFall).toHaveBeenCalled();
    });

    it('should return false when comprehensive check passes', () => {
      mockJailMonkey.trustFall.mockReturnValue(false);

      const result = securityService.trustFall();

      expect(result).toBe(false);
    });
  });

  describe('getSecurityStatus', () => {
    it('should return complete security status with all checks', async () => {
      Platform.OS = 'android';
      mockJailMonkey.isJailBroken.mockReturnValue(true);
      mockJailMonkey.canMockLocation.mockReturnValue(true);
      mockJailMonkey.isDebuggedMode.mockResolvedValue(false);
      mockJailMonkey.isOnExternalStorage.mockReturnValue(true);
      mockJailMonkey.trustFall.mockReturnValue(true);

      const result = await securityService.getSecurityStatus();

      expect(result).toEqual({
        isJailbroken: true,
        canMockLocation: true,
        isDebuggedMode: false,
        isOnExternalStorage: true,
        trustFall: true,
      });
    });

    it('should return all false for secure device', async () => {
      Platform.OS = 'android';
      mockJailMonkey.isJailBroken.mockReturnValue(false);
      mockJailMonkey.canMockLocation.mockReturnValue(false);
      mockJailMonkey.isDebuggedMode.mockResolvedValue(false);
      mockJailMonkey.isOnExternalStorage.mockReturnValue(false);
      mockJailMonkey.trustFall.mockReturnValue(false);

      const result = await securityService.getSecurityStatus();

      expect(result).toEqual({
        isJailbroken: false,
        canMockLocation: false,
        isDebuggedMode: false,
        isOnExternalStorage: false,
        trustFall: false,
      });
    });

    it('should handle iOS-specific status correctly', async () => {
      Platform.OS = 'ios';
      mockJailMonkey.isJailBroken.mockReturnValue(true);
      mockJailMonkey.isDebuggedMode.mockResolvedValue(true);
      mockJailMonkey.trustFall.mockReturnValue(true);

      const result = await securityService.getSecurityStatus();

      expect(result.isJailbroken).toBe(true);
      expect(result.isDebuggedMode).toBe(true);
      expect(result.canMockLocation).toBe(false); // iOS always false
      expect(result.isOnExternalStorage).toBe(false); // iOS always false
    });
  });

  describe('isDeviceSecure', () => {
    it('should return true when device is not jailbroken', () => {
      mockJailMonkey.isJailBroken.mockReturnValue(false);

      const result = securityService.isDeviceSecure();

      expect(result).toBe(true);
    });

    it('should return false when device is jailbroken', () => {
      mockJailMonkey.isJailBroken.mockReturnValue(true);

      const result = securityService.isDeviceSecure();

      expect(result).toBe(false);
    });
  });

  describe('getSecurityWarning', () => {
    it('should return jailbreak warning on iOS when device is jailbroken', () => {
      Platform.OS = 'ios';
      mockJailMonkey.isJailBroken.mockReturnValue(true);

      const result = securityService.getSecurityWarning();

      expect(result).toContain('jailbroken');
      expect(result).toContain('security risks');
    });

    it('should return root warning on Android when device is rooted', () => {
      Platform.OS = 'android';
      mockJailMonkey.isJailBroken.mockReturnValue(true);

      const result = securityService.getSecurityWarning();

      expect(result).toContain('rooted');
      expect(result).toContain('security risks');
    });

    it('should return null when device is secure', () => {
      mockJailMonkey.isJailBroken.mockReturnValue(false);

      const result = securityService.getSecurityWarning();

      expect(result).toBeNull();
    });
  });

  describe('integration scenarios', () => {
    it('should detect rooted Android device with all security issues', async () => {
      Platform.OS = 'android';
      mockJailMonkey.isJailBroken.mockReturnValue(true);
      mockJailMonkey.canMockLocation.mockReturnValue(true);
      mockJailMonkey.isDebuggedMode.mockResolvedValue(true);
      mockJailMonkey.isOnExternalStorage.mockReturnValue(true);
      mockJailMonkey.trustFall.mockReturnValue(true);

      const status = await securityService.getSecurityStatus();
      const isSecure = securityService.isDeviceSecure();
      const warning = securityService.getSecurityWarning();

      expect(status.isJailbroken).toBe(true);
      expect(status.canMockLocation).toBe(true);
      expect(status.isDebuggedMode).toBe(true);
      expect(status.isOnExternalStorage).toBe(true);
      expect(status.trustFall).toBe(true);
      expect(isSecure).toBe(false);
      expect(warning).toContain('rooted');
    });

    it('should detect jailbroken iOS device', async () => {
      Platform.OS = 'ios';
      mockJailMonkey.isJailBroken.mockReturnValue(true);
      mockJailMonkey.isDebuggedMode.mockResolvedValue(false);
      mockJailMonkey.trustFall.mockReturnValue(true);

      const status = await securityService.getSecurityStatus();
      const isSecure = securityService.isDeviceSecure();
      const warning = securityService.getSecurityWarning();

      expect(status.isJailbroken).toBe(true);
      expect(status.canMockLocation).toBe(false);
      expect(status.isOnExternalStorage).toBe(false);
      expect(isSecure).toBe(false);
      expect(warning).toContain('jailbroken');
    });

    it('should pass all checks for secure device', async () => {
      Platform.OS = 'android';
      mockJailMonkey.isJailBroken.mockReturnValue(false);
      mockJailMonkey.canMockLocation.mockReturnValue(false);
      mockJailMonkey.isDebuggedMode.mockResolvedValue(false);
      mockJailMonkey.isOnExternalStorage.mockReturnValue(false);
      mockJailMonkey.trustFall.mockReturnValue(false);

      const status = await securityService.getSecurityStatus();
      const isSecure = securityService.isDeviceSecure();
      const warning = securityService.getSecurityWarning();

      expect(Object.values(status).every(v => v === false)).toBe(true);
      expect(isSecure).toBe(true);
      expect(warning).toBeNull();
    });
  });
});
