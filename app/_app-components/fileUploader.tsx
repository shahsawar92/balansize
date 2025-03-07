"use client";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useUploadFileChunkMutation } from "@/redux/api/uploads-api";
import { v4 as uuidv4 } from "uuid"; // Add this package

interface FileUploaderProps {
  onUploadSuccess?: (fileUrl: string) => void;
}

const CHUNK_SIZE = 1 * 1024 * 1024; // 5MB

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [uploadFileChunk] = useUploadFileChunkMutation();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string>("");

  const handleUpload = async (file: File) => {
    const id = uuidv4(); // Unique upload session ID
    setUploadId(id);
    setCurrentFile(file);

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
        if( uploadedCount === chunkCount) {
          setUploadProgress(100);
        }
       
      } catch (error) {
        console.error(`Chunk ${index} failed:`, error);
        return;
      }
    }

    // Finalize upload
    try {
      const mergeFormData = new FormData();
      mergeFormData.append("fileName", file.name);
      mergeFormData.append("uploadId", id);

      const response = await uploadFileChunk(mergeFormData).unwrap();
      if (response.fileUrl) {
        onUploadSuccess?.(response.fileUrl);
        resetUpload();
      }
    } catch (error) {
      console.error("Merge failed:", error);
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
    <div className='border border-dashed border-gray-400 rounded-lg p-4 text-center'>
      <div {...getRootProps()} className='cursor-pointer p-4'>
        <input {...getInputProps()} />
        <p className='text-gray-600'>
          {currentFile ? "Uploading..." : "Drag & drop video file"}
        </p>
      </div>

      {currentFile && (
        <div className='mt-3'>
          <p className='text-blue-500'>
            {uploadProgress === 100
              ? "Finalizing..."
              : `Uploading... ${uploadProgress}%`}
          </p>
          <progress value={uploadProgress} max='100' className='w-full' />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
