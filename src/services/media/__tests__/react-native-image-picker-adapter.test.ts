/**
 * React Native Image Picker Adapter Test Suite
 *
 * Tests the adapter implementation for react-native-image-picker library
 */

import {
  launchImageLibrary,
  Asset,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { Image as CompressImage } from 'react-native-compressor';
import { ReactNativeImagePickerAdapter } from '../react-native-image-picker-adapter';

// Mock dependencies
jest.mock('react-native-image-picker');
jest.mock('react-native-compressor', () => ({
  Image: {
    compress: jest.fn(),
  },
}));

describe('ReactNativeImagePickerAdapter', () => {
  let adapter: ReactNativeImagePickerAdapter;
  let mockLaunchImageLibrary: jest.MockedFunction<typeof launchImageLibrary>;
  let mockCompress: jest.MockedFunction<typeof CompressImage.compress>;

  const mockAsset: Asset = {
    uri: 'file:///path/to/image.jpg',
    fileName: 'image.jpg',
    fileSize: 1024000,
    type: 'image/jpeg',
    width: 1920,
    height: 1080,
  };

  beforeEach(() => {
    adapter = new ReactNativeImagePickerAdapter();
    mockLaunchImageLibrary = launchImageLibrary as jest.MockedFunction<
      typeof launchImageLibrary
    >;
    mockCompress = CompressImage.compress as jest.MockedFunction<
      typeof CompressImage.compress
    >;
    jest.clearAllMocks();
  });

  describe('pickImage', () => {
    it('should pick an image with default options', async () => {
      // Arrange
      mockLaunchImageLibrary.mockResolvedValue({
        assets: [mockAsset],
      });

      // Act
      const result = await adapter.pickImage();

      // Assert
      expect(launchImageLibrary).toHaveBeenCalledWith({
        mediaType: 'photo',
        quality: 0.8,
      });
      expect(result).toEqual(mockAsset);
    });

    it('should pick an image with custom options', async () => {
      // Arrange
      const customOptions: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 1,
      };
      mockLaunchImageLibrary.mockResolvedValue({
        assets: [mockAsset],
      });

      // Act
      const result = await adapter.pickImage(customOptions);

      // Assert
      expect(launchImageLibrary).toHaveBeenCalledWith(customOptions);
      expect(result).toEqual(mockAsset);
    });

    it('should return null when user cancels', async () => {
      // Arrange
      mockLaunchImageLibrary.mockResolvedValue({
        didCancel: true,
      });

      // Act
      const result = await adapter.pickImage();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when no assets selected', async () => {
      // Arrange
      mockLaunchImageLibrary.mockResolvedValue({
        assets: [],
      });

      // Act
      const result = await adapter.pickImage();

      // Assert
      expect(result).toBeNull();
    });

    it('should return null when assets is undefined', async () => {
      // Arrange
      mockLaunchImageLibrary.mockResolvedValue({});

      // Act
      const result = await adapter.pickImage();

      // Assert
      expect(result).toBeNull();
    });

    it('should return first asset from multiple selections', async () => {
      // Arrange
      const secondAsset: Asset = {
        uri: 'file:///path/to/image2.jpg',
        fileName: 'image2.jpg',
      };
      mockLaunchImageLibrary.mockResolvedValue({
        assets: [mockAsset, secondAsset],
      });

      // Act
      const result = await adapter.pickImage();

      // Assert
      expect(result).toEqual(mockAsset);
    });

    it('should handle different media types', async () => {
      // Arrange
      const videoOptions: ImageLibraryOptions = {
        mediaType: 'video',
      };
      mockLaunchImageLibrary.mockResolvedValue({
        assets: [mockAsset],
      });

      // Act
      await adapter.pickImage(videoOptions);

      // Assert
      expect(launchImageLibrary).toHaveBeenCalledWith(videoOptions);
    });
  });

  describe('compressImage', () => {
    it('should compress an image with default options', async () => {
      // Arrange
      const uri = 'file:///path/to/image.jpg';
      const compressedUri = 'file:///path/to/compressed.jpg';
      mockCompress.mockResolvedValue(compressedUri);

      // Act
      const result = await adapter.compressImage(uri);

      // Assert
      expect(CompressImage.compress).toHaveBeenCalledWith(uri, {
        compressionMethod: 'auto',
      });
      expect(result).toBe(compressedUri);
    });

    it('should compress an image with custom options', async () => {
      // Arrange
      const uri = 'file:///path/to/image.jpg';
      const compressedUri = 'file:///path/to/compressed.jpg';
      const customOptions = {
        compressionMethod: 'manual',
        quality: 0.7,
        maxWidth: 1024,
        maxHeight: 1024,
      };
      mockCompress.mockResolvedValue(compressedUri);

      // Act
      const result = await adapter.compressImage(uri, customOptions);

      // Assert
      expect(CompressImage.compress).toHaveBeenCalledWith(uri, customOptions);
      expect(result).toBe(compressedUri);
    });

    it('should return compressed URI', async () => {
      // Arrange
      const uri = 'file:///storage/image.png';
      const compressedUri = 'file:///cache/compressed-image.png';
      mockCompress.mockResolvedValue(compressedUri);

      // Act
      const result = await adapter.compressImage(uri);

      // Assert
      expect(result).toBe(compressedUri);
    });

    it('should handle different compression methods', async () => {
      // Arrange
      const uri = 'file:///path/to/image.jpg';
      mockCompress.mockResolvedValue('compressed-uri');

      // Act
      await adapter.compressImage(uri, { compressionMethod: 'manual' });

      // Assert
      expect(CompressImage.compress).toHaveBeenCalledWith(uri, {
        compressionMethod: 'manual',
      });
    });
  });

  describe('persistImage', () => {
    it('should copy image to destination path', async () => {
      // Arrange
      const tempUri = 'file:///tmp/image.jpg';
      const destPath = '/documents/saved-image.jpg';
      (RNFS.copyFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await adapter.persistImage(tempUri, destPath);

      // Assert
      expect(RNFS.copyFile).toHaveBeenCalledWith('/tmp/image.jpg', destPath);
      expect(result).toBe('file:///documents/saved-image.jpg');
    });

    it('should remove file:// prefix from source URI', async () => {
      // Arrange
      const tempUri = 'file:///cache/temp.png';
      const destPath = '/storage/permanent.png';
      (RNFS.copyFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      await adapter.persistImage(tempUri, destPath);

      // Assert
      expect(RNFS.copyFile).toHaveBeenCalledWith('/cache/temp.png', destPath);
    });

    it('should add file:// prefix to result', async () => {
      // Arrange
      const tempUri = 'file:///tmp/photo.jpg';
      const destPath = '/photos/saved.jpg';
      (RNFS.copyFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await adapter.persistImage(tempUri, destPath);

      // Assert
      expect(result).toBe('file:///photos/saved.jpg');
    });

    it('should handle URIs without file:// prefix', async () => {
      // Arrange
      const tempUri = '/tmp/image.jpg'; // No file:// prefix
      const destPath = '/documents/image.jpg';
      (RNFS.copyFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await adapter.persistImage(tempUri, destPath);

      // Assert
      // Should still work, replace returns original if pattern not found
      expect(RNFS.copyFile).toHaveBeenCalled();
      expect(result).toBe('file:///documents/image.jpg');
    });

    it('should preserve file extension', async () => {
      // Arrange
      const tempUri = 'file:///tmp/photo.png';
      const destPath = '/storage/final.png';
      (RNFS.copyFile as jest.Mock).mockResolvedValue(undefined);

      // Act
      const result = await adapter.persistImage(tempUri, destPath);

      // Assert
      expect(result).toBe('file:///storage/final.png');
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete pick and compress workflow', async () => {
      // Arrange
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 0.9,
      };
      mockLaunchImageLibrary.mockResolvedValue({
        assets: [mockAsset],
      });
      const compressedUri = 'file:///cache/compressed.jpg';
      mockCompress.mockResolvedValue(compressedUri);

      // Act - Pick image
      const pickedImage = await adapter.pickImage(options);
      expect(pickedImage).toEqual(mockAsset);

      // Act - Compress image
      const compressed = await adapter.compressImage(pickedImage!.uri!);
      expect(compressed).toBe(compressedUri);

      // Assert
      expect(launchImageLibrary).toHaveBeenCalledWith(options);
      expect(CompressImage.compress).toHaveBeenCalledWith(mockAsset.uri, {
        compressionMethod: 'auto',
      });
    });

    it('should handle complete pick, compress, and persist workflow', async () => {
      // Arrange
      mockLaunchImageLibrary.mockResolvedValue({
        assets: [mockAsset],
      });
      const compressedUri = 'file:///cache/compressed.jpg';
      mockCompress.mockResolvedValue(compressedUri);
      (RNFS.copyFile as jest.Mock).mockResolvedValue(undefined);
      const destPath = '/documents/final.jpg';

      // Act - Pick
      const picked = await adapter.pickImage();
      expect(picked).toBeTruthy();

      // Act - Compress
      const compressed = await adapter.compressImage(picked!.uri!);
      expect(compressed).toBe(compressedUri);

      // Act - Persist
      const persisted = await adapter.persistImage(compressed, destPath);

      // Assert
      expect(persisted).toBe(`file://${destPath}`);
      expect(RNFS.copyFile).toHaveBeenCalledWith(
        '/cache/compressed.jpg',
        destPath,
      );
    });

    it('should handle user cancellation gracefully', async () => {
      // Arrange
      mockLaunchImageLibrary.mockResolvedValue({
        didCancel: true,
      });

      // Act
      const result = await adapter.pickImage();

      // Assert
      expect(result).toBeNull();
      // Compression should not be called
      expect(CompressImage.compress).not.toHaveBeenCalled();
    });
  });
});
