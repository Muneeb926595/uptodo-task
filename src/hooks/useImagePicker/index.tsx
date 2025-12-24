import { useCallback, useState } from 'react';
import {
  mediaService,
  PickedImage,
  UploadFn,
} from '../../services/media';

export const useImagePicker = (opts?: { uploader?: UploadFn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickAndUpload = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await mediaService.pickCompressAndUpload({
        uploader: opts?.uploader,
      });
      if (res.local) setImageUri(res.local.uri);
      if (res.uploadedUrl) setImageUri(res.uploadedUrl);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, [opts?.uploader]);

  return {
    pickAndUpload,
    isLoading,
    imageUri,
    setImageUri,
  } as {
    pickAndUpload: () => Promise<{ local?: PickedImage; uploadedUrl?: string }>;
    isLoading: boolean;
    imageUri: string | null;
    setImageUri: (v: string | null) => void;
  };
};

// Usage 1: without uploader
// import useImagePicker from 'src/app/services/media/useImagePicker';

// const { pickAndUpload, isLoading, imageUri } = useImagePicker({ uploader });

// <Button title="Change avatar" onPress={pickAndUpload} />
// {isLoading && <ActivityIndicator />}
// {imageUri && <Image source={{ uri: imageUri }} />}

// Usage 2: with uploader
// uploader: (file) => Promise<string> or Promise<{url: string}>
// const uploader = async (file) => {
//   const fd = mediaService.createImageFormData(file, 'avatar');
//   const { data } = await axiosClient.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
//   return data.url;
// };

// const { uploadedUrl } = await mediaService.pickCompressAndOptionallyUpload({ uploader });
