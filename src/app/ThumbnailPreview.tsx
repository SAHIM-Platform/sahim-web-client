import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";

interface ThumbnailPreviewProps {
  isImageLoading: boolean;
  isImageValid: boolean;
  thumbnailUrl: string;
  clearThumbnail: () => void;
}

function ThumbnailPreview({ isImageLoading, isImageValid, thumbnailUrl, clearThumbnail }: ThumbnailPreviewProps) {
  return (
    <div className="mt-2 relative">
      {isImageLoading ? (
        <div className="h-40 w-full flex items-center justify-center border rounded-lg bg-gray-50">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      ) : isImageValid ? (
        <div className="relative group w-full aspect-[6/4] rounded-lg overflow-hidden">
          <Image
            src={thumbnailUrl}
            alt='Discussion thumbnail'
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={clearThumbnail}
            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="h-40 w-full flex items-center justify-center border rounded-lg bg-gray-50 text-gray-500">
          <div className="flex flex-col items-center gap-1">
            <ImageIcon className="w-6 h-6" />
            <span className="text-sm">لم يتم العثور على الصورة</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ThumbnailPreview;