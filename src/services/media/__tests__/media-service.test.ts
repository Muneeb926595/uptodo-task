/**
 * Media Service Test Suite
 *
 * Tests media operations (pick, compress, upload)
 */

import { Platform } from 'react-native';
import { Asset, ImageLibraryOptions } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { MediaService, PickedImage } from '../media-service';
import { MediaAdapter } from '../media-adapter';

// Mock dependencies
jest.mock('react-native-fs');

describe('MediaService', () => {
  let mediaService: MediaService;
  let mockAdapter: jest.Mocked<MediaAdapter>;

  const mockAsset: Asset = {
    uri: 'file:///path/to/image.jpg',
    fileName: 'image.jpg',
    fileSize: 1024,
    type: 'image/jpeg',
    width: 1920,
    height: 1080,
  };

  const mockCompressedUri = 'file:///path/to/compressed.jpg';

  beforeEach(() => {
    // Create mock adapter
    mockAdapter = {
      pickImage: jest.fn(),
      compressImage: jest.fn(),
      persistImage: jest.fn(),
    };

    mediaService = new MediaService(mockAdapter);
    jest.clearAllMocks();
  });

  describe('pickImage', () => {
    it('should pick an image using adapter', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(mockAsset);
      const options: ImageLibraryOptions = {
        mediaType: 'photo',
        quality: 1,
      };

      // Act
      const result = await mediaService.pickImage(options);

      // Assert
      expect(mockAdapter.pickImage).toHaveBeenCalledWith(options);
      expect(result).toEqual(mockAsset);
    });

    it('should return null if no image picked', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(null);

      // Act
      const result = await mediaService.pickImage();

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('compressImage', () => {
    it('should compress an image using adapter', async () => {
      // Arrange
      const uri = 'file:///path/to/image.jpg';
      const options = { quality: 0.8 };
      mockAdapter.compressImage.mockResolvedValue(mockCompressedUri);

      // Act
      const result = await mediaService.compressImage(uri, options);

      // Assert
      expect(mockAdapter.compressImage).toHaveBeenCalledWith(uri, options);
      expect(result).toBe(mockCompressedUri);
    });
  });

  describe('formatCompressedImageObject', () => {
    it('should format image object for iOS', () => {
      // Arrange
      Platform.OS = 'ios';
      const uri = 'file:///path/to/image.jpg';

      // Act
      const result = mediaService.formatCompressedImageObject(uri);

      // Assert
      expect(result).toEqual({
        uri,
        name: 'image.jpg',
        type: 'jpg',
      });
    });

    it('should format image object for Android', () => {
      // Arrange
      Platform.OS = 'android';
      const uri = 'file:///path/to/photo.png';

      // Act
      const result = mediaService.formatCompressedImageObject(uri);

      // Assert
      expect(result).toEqual({
        uri,
        name: 'photo.png',
        type: 'image/png',
      });
    });

    it('should handle uri without extension', () => {
      // Arrange
      const uri = 'file:///path/to/image';

      // Act
      const result = mediaService.formatCompressedImageObject(uri);

      // Assert
      expect(result.name).toBe('image');
      expect(result.type).toBeDefined();
    });
  });

  describe('createImageFormData', () => {
    it('should create FormData with default field name', () => {
      // Arrange
      const file: PickedImage = {
        uri: 'file:///path/to/image.jpg',
        name: 'image.jpg',
        type: 'image/jpeg',
      };

      // Act
      const formData = mediaService.createImageFormData(file);

      // Assert
      expect(formData).toBeInstanceOf(FormData);
      // Note: FormData doesn't expose entries in test environment easily
      // The actual validation happens in integration tests
    });

    it('should create FormData with custom field name', () => {
      // Arrange
      const file: PickedImage = {
        uri: 'file:///path/to/photo.png',
        name: 'photo.png',
        type: 'image/png',
      };

      // Act
      const formData = mediaService.createImageFormData(file, 'photo');

      // Assert
      expect(formData).toBeInstanceOf(FormData);
    });
  });

  describe('pickAndCompress', () => {
    it('should pick and compress an image', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(mockAsset);
      mockAdapter.compressImage.mockResolvedValue(mockCompressedUri);
      const options = {
        pickerOptions: { mediaType: 'photo' as const },
        compressOptions: { quality: 0.8 },
      };

      // Act
      const result = await mediaService.pickAndCompress(options);

      // Assert
      expect(mockAdapter.pickImage).toHaveBeenCalledWith(options.pickerOptions);
      expect(mockAdapter.compressImage).toHaveBeenCalledWith(
        mockAsset.uri,
        options.compressOptions,
      );
      expect(result).toEqual({
        uri: mockCompressedUri,
        name: 'compressed.jpg',
        type: expect.any(String),
      });
    });

    it('should return null if no image picked', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(null);

      // Act
      const result = await mediaService.pickAndCompress();

      // Assert
      expect(result).toBeNull();
      expect(mockAdapter.compressImage).not.toHaveBeenCalled();
    });

    it('should return null if asset has no uri', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue({ uri: undefined } as Asset);

      // Act
      const result = await mediaService.pickAndCompress();

      // Assert
      expect(result).toBeNull();
      expect(mockAdapter.compressImage).not.toHaveBeenCalled();
    });
  });

  describe('pickCompressAndUpload', () => {
    it('should pick, compress, and upload image', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(mockAsset);
      mockAdapter.compressImage.mockResolvedValue(mockCompressedUri);
      const mockUploader = jest
        .fn()
        .mockResolvedValue('https://cdn.example.com/image.jpg');
      const options = {
        uploader: mockUploader,
        pickerOptions: { mediaType: 'photo' as const },
        compressOptions: { quality: 0.8 },
      };

      // Act
      const result = await mediaService.pickCompressAndUpload(options);

      // Assert
      expect(mockAdapter.pickImage).toHaveBeenCalledWith(options.pickerOptions);
      expect(mockAdapter.compressImage).toHaveBeenCalledWith(
        mockAsset.uri,
        options.compressOptions,
      );
      expect(mockUploader).toHaveBeenCalledWith({
        uri: mockCompressedUri,
        name: 'compressed.jpg',
        type: expect.any(String),
      });
      expect(result.uploadedUrl).toBe('https://cdn.example.com/image.jpg');
      expect(result.local).toBeDefined();
    });

    it('should handle uploader returning object with url', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(mockAsset);
      mockAdapter.compressImage.mockResolvedValue(mockCompressedUri);
      const mockUploader = jest
        .fn()
        .mockResolvedValue({ url: 'https://cdn.example.com/image.jpg' });

      // Act
      const result = await mediaService.pickCompressAndUpload({
        uploader: mockUploader,
      });

      // Assert
      expect(result.uploadedUrl).toBe('https://cdn.example.com/image.jpg');
    });

    it('should return local file if no uploader provided', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(mockAsset);
      mockAdapter.compressImage.mockResolvedValue(mockCompressedUri);

      // Act
      const result = await mediaService.pickCompressAndUpload({});

      // Assert
      expect(result.local).toBeDefined();
      expect(result.uploadedUrl).toBeUndefined();
    });

    it('should return empty object if no image picked', async () => {
      // Arrange
      mockAdapter.pickImage.mockResolvedValue(null);

      // Act
      const result = await mediaService.pickCompressAndUpload({});

      // Assert
      expect(result).toEqual({});
      expect(mockAdapter.compressImage).not.toHaveBeenCalled();
    });
  });

  describe('persistImage', () => {
    it('should persist image to documents directory', async () => {
      // Arrange
      const tempUri = 'file:///tmp/image.jpg';
      const expectedDestPath = `${RNFS.DocumentDirectoryPath}/image.jpg`;
      mockAdapter.persistImage.mockResolvedValue(expectedDestPath);

      // Act
      const result = await mediaService.persistImage(tempUri);

      // Assert
      expect(mockAdapter.persistImage).toHaveBeenCalledWith(
        tempUri,
        expectedDestPath,
      );
      expect(result).toBe(expectedDestPath);
    });

    it('should handle temp uri with complex path', async () => {
      // Arrange
      const tempUri = 'file:///tmp/cache/subfolder/photo.png';
      const expectedDestPath = `${RNFS.DocumentDirectoryPath}/photo.png`;
      mockAdapter.persistImage.mockResolvedValue(expectedDestPath);

      // Act
      await mediaService.persistImage(tempUri);

      // Assert
      expect(mockAdapter.persistImage).toHaveBeenCalledWith(
        tempUri,
        expectedDestPath,
      );
    });
  });
});
