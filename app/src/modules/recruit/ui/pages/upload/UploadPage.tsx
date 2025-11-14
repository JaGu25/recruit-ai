import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/modules/shared/ui/card";
import { Button } from "@/modules/shared/ui/button";
import { X, FileText } from "lucide-react";
import { truncateName } from "@/modules/shared/utils/truncate-name";
import { useErrorDialog } from "@/app/providers/error-dialog-context";
import { UploadCandidatesUseCase } from "@/modules/recruit/application/use-cases/upload-candidates.usecase";
import { toast } from "sonner";

type FilePreview = {
  id: string;
  name: string;
  file: File;
};

const UploadPage = () => {
  const { showError } = useErrorDialog();
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      file,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
  });

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      showError("Please select at least one resume before uploading.");
      return;
    }

    setIsUploading(true);
    const useCase = new UploadCandidatesUseCase();

    try {
      await useCase.execute(files.map((f) => f.file));
      setFiles([]);
      toast.success("Resumes uploaded successfully.");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Unable to upload resumes. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-background text-foreground p-8 space-y-8 flex justify-center items-center h-full">
      <section className="max-w-4xl mx-auto w-full flex flex-col gap-6">
        <Card
          {...getRootProps()}
          className={`relative border-dashed border-2 transition cursor-pointer overflow-hidden h-72 flex items-center justify-center ${
            isDragActive ? "bg-muted/60" : "hover:bg-muted/40"
          }`}
        >
          <input {...getInputProps()} />

          {files.length > 0 && (
            <div className="absolute top-4 left-4 flex flex-wrap gap-3 z-10">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="relative w-40 h-20 bg-muted border border-border rounded-md flex flex-col items-center justify-center p-2 shadow-sm"
                >
                  <FileText className="w-6 h-6 text-primary mb-1" />
                  <p
                    className="text-xs text-center text-muted-foreground truncate max-w-36"
                    title={file.name}
                  >
                    {truncateName(file.name)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(file.id);
                    }}
                    className="absolute -top-2 -right-2 bg-gray-200 text-destructive-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm"
                  >
                    <X className="w-3 h-3 cursor-pointer" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <CardHeader className="flex flex-col items-center justify-center text-center pointer-events-none select-none px-4 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 mb-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 16l4-4m0 0l4 4m-4-4v12m8-8h4a2 2 0 002-2V7a2 2 0 00-2-2h-3m-4 0H7a2 2 0 00-2 2v5a2 2 0 002 2h3"
              />
            </svg>
            <CardTitle className="text-lg font-semibold">
              Drag & Drop CVs here
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground mt-1">
              or click to select files (PDF only)
            </CardDescription>
          </CardHeader>
        </Card>

        {files.length > 0 && (
          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              className="mt-2"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload All"}
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default UploadPage;
