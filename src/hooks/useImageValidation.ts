import { useEffect, useState } from 'react';

export function useImageValidation(imageUrl: string, delay = 500) {
  const [isImageValid, setIsImageValid] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      if (!imageUrl) {
        setIsImageValid(false);
        return;
      }

      setIsImageLoading(true);
      try {
        const img = new Image();
        img.src = imageUrl;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        setIsImageValid(true);
      } catch {
        setIsImageValid(false);
      } finally {
        setIsImageLoading(false);
      }
    };

    const timeoutId = setTimeout(checkImage, delay);
    return () => clearTimeout(timeoutId);
  }, [imageUrl, delay]);

  return { isImageValid, isImageLoading };
}
