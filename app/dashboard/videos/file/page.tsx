"use client";
import FileUploader from "@/app/_app-components/fileUploader";

export default function UploadPage() {
  const handleFileUpload = (fileUrl: string) => {
    console.log("Uploaded File URL:", fileUrl);
  };

  return (
    <div>
      <h2 className='text-lg font-semibold mb-2'>Upload a Video</h2>
      <FileUploader onUploadSuccess={handleFileUpload} />
    </div>
  );
}
