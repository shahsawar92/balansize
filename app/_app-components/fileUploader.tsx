"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFileChunkMutation } from "@/redux/api/uploads-api";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

interface FileUploaderProps {
  onUploadSuccess?: (fileUrl: string, message: boolean) => void;
}

const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [uploadFileChunk] = useUploadFileChunkMutation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string>("");
  const [isUploaded, setIsUploaded] = useState(false);

  const handleUpload = async (file: File) => {
    const id = uuidv4();
    setUploadId(id);
    setCurrentFile(file);
    setUploadProgress(0);
    setIsUploaded(false); // Reset upload state

    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    let uploadedCount = 0;

    for (let index = 0; index < chunkCount; index++) {
      const chunk = file.slice(index * CHUNK_SIZE, (index + 1) * CHUNK_SIZE);

      const formData = new FormData();
      formData.append("file", chunk);
      formData.append("dzchunkindex", index.toString());
      formData.append("dztotalchunks", chunkCount.toString());
      formData.append("dzuuid", id);

      try {
        const response = await uploadFileChunk(formData).unwrap();
        if (!response.success) throw new Error("Chunk upload failed");

        uploadedCount++;
        setUploadProgress(Math.round((uploadedCount / chunkCount) * 100));

        if (uploadedCount === chunkCount && response.fileUrl) {
          setUploadProgress(100);
          toast.success("Video uploaded successfully!");
          onUploadSuccess?.(response.fileUrl, true);
          setIsUploaded(true); // Mark upload as successful
          return;
        }
      } catch (error) {
        console.error(`Chunk ${index} failed:`, error);
        toast.error("Upload failed. Please try again.");
        resetUpload();
        return;
      }
    }
  };

  const resetUpload = () => {
    setUploadProgress(0);
    setCurrentFile(null);
    setUploadId("");
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (files) => files[0] && handleUpload(files[0]),
    accept: { "video/*": [] },
    disabled: !!currentFile,
  });

  return (
    <div className='border border-dashed border-gray-400 rounded-lg p-4 text-center bg-white shadow-md transition-all'>
      {/* Drag & Drop Area */}
      <div
        {...getRootProps()}
        className='cursor-pointer p-4 hover:bg-gray-100 transition-colors rounded-md'>
        <input {...getInputProps()} />
        <p className='text-gray-600 text-sm'>
          {currentFile
            ? "Uploading..."
            : "Drag & drop a video file or click to upload"}
        </p>
      </div>

      {currentFile && (
        <div className='mt-3 text-left text-sm text-gray-700'>
          <p>
            <strong>File:</strong> {currentFile.name}
          </p>
          <p>
            <strong>Size:</strong>{" "}
            {(currentFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p>
            <strong>Type:</strong> {currentFile.type}
          </p>

          <div className='mt-2'>
            <p className='text-blue-500'>
              {uploadProgress === 100
                ? "Uploaded"
                : `Uploading... ${uploadProgress}%`}
            </p>
            <progress
              value={uploadProgress}
              max='100'
              className='w-full h-2 rounded-md'
            />
          </div>
        </div>
      )}

      {/* Success Message & Additional Inputs */}
      {isUploaded && (
        <div className='mt-4 p-4 border rounded bg-green-100 text-green-700'>
          ✅ Video uploaded successfully! You can now add more details.
        </div>
      )}
    </div>
  );
};

export default FileUploader;
