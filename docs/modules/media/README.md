# Media Service

Centralized media management using the adapter pattern for image picking, compression, and uploading.

## Usage

```typescript
import { mediaService, PickedImage } from '@/modules/services/media';

// Pick an image
const asset = await mediaService.pickImage({
  mediaType: 'photo',
  quality: 0.8,
});

// Compress an image
const compressedUri = await mediaService.compressImage(uri, {
  compressionMethod: 'auto',
});

// Pick and compress (high-level helper)
const pickedImage = await mediaService.pickAndCompress({
  pickerOptions: { mediaType: 'photo', quality: 0.8 },
  compressOptions: { compressionMethod: 'auto' },
});

// Pick, compress, and upload
const result = await mediaService.pickCompressAndUpload({
  uploader: async (file: PickedImage) => {
    const formData = mediaService.createImageFormData(file, 'avatar');
    const response = await axios.post('/upload', formData);
    return response.data.url;
  },
});

// Format image object for FormData
const formatted = mediaService.formatCompressedImageObject(uri);
// { uri: 'file://...', name: 'image.jpg', type: 'image/jpg' }

// Create FormData for upload
const formData = mediaService.createImageFormData(pickedImage, 'avatar');

// Persist temporary image to permanent storage
const permanentUri = await mediaService.persistImage(tempUri);
```

## Common Patterns

### Pattern 1: Pick and Display

```typescript
const { pickAndUpload, isLoading, imageUri } = useImagePicker();

<Button onPress={pickAndUpload} title="Pick Image" />;
{
  isLoading && <ActivityIndicator />;
}
{
  imageUri && <Image source={{ uri: imageUri }} />;
}
```

### Pattern 2: Pick and Upload to Server

```typescript
const uploader = async (file: PickedImage) => {
  const formData = mediaService.createImageFormData(file, 'avatar');
  const { data } = await axios.post('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
};

const { imageUri } = useImagePicker({ uploader });
```

### Pattern 3: Pick and Save Locally

```typescript
const persistImageOnPhoneStorage = async (imageObj: PickedImage) => {
  const persistedUri = await mediaService.persistImage(imageObj.uri);
  return persistedUri;
};

const { imageUri } = useImagePicker({
  uploader: persistImageOnPhoneStorage,
});
```

## Implementation Details

### MediaAdapter Interface

Defines the contract for media operations:

```typescript
interface MediaAdapter {
  pickImage(options?: ImageLibraryOptions): Promise<Asset | null>;
  compressImage(uri: string, options?: any): Promise<string>;
  persistImage(tempUri: string, destPath: string): Promise<string>;
}
```

## Future Enhancements

- Add Expo Image Picker adapter for Expo apps
- Add Web File API adapter for web platform
- Add video picking and compression support
- Add image cropping integration
- Add batch image upload support
- Add progress callbacks for uploads
- Add retry logic for failed uploads
- Add cloud storage adapters (S3, Cloudinary, etc.)
