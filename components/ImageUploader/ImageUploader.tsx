import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";

import Button from "../buttons/Button";

interface ImageUploaderProps {
  imageUrl?: string;
  onFileChange: (file: File) => void;
  buttonText?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  imageUrl = "/default-avatar.png",
  onFileChange,
  buttonText = "Upload Photo",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string>(imageUrl);

  // Sync previewImage with imageUrl whenever imageUrl changes
  useEffect(() => {
    setPreviewImage(imageUrl);
  }, [imageUrl]);

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreviewImage(imageURL);
      onFileChange(file);
    }
  };

  return (
    <div className='flex flex-col items-center gap-3'>
      <Button
        type='button'
        variant='light'
        onClick={handleImageClick}
        className='shadow-md rounded-lg px-4 py-2 hover:bg-gray-200 transition'>
        {buttonText}
      </Button>

      <div
        className='relative w-16 h-16 rounded-full border-2 border-gray-300 overflow-hidden cursor-pointer hover:opacity-80 transition'
        onClick={handleImageClick}>
        <NextImage
          src={previewImage}
          alt='Profile Picture'
          width={126}
          height={126}
          className='object-cover w-full h-full'
          unoptimized
        />

        <input
          type='file'
          ref={fileInputRef}
          onChange={handleImageChange}
          accept='image/*'
          className='hidden'
        />
      </div>
    </div>
  );
};

export default ImageUploader;
