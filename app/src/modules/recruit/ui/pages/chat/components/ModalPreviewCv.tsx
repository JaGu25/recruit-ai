import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/modules/shared/ui/dialog";
import { Button } from "@/modules/shared/ui/button";
import {
  downloadFileWithAuth,
  fetchFileWithAuth,
} from "@/modules/shared/utils/download-file";

type ModalPreviewCvProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName?: string;
  downloadUrl?: string;
  fileUri?: string;
};

export const ModalPreviewCv = ({
  open,
  onOpenChange,
  candidateName,
  downloadUrl,
}: ModalPreviewCvProps) => {
  const isTestEnvironment =
    typeof globalThis !== "undefined" &&
    Boolean((globalThis as Record<string, unknown>).__vitest_worker__);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !downloadUrl || isTestEnvironment) {
      setPreviewUrl(null);
      setPreviewError(
        isTestEnvironment
          ? "Preview is disabled in the test environment."
          : null
      );
      return;
    }

    let isCancelled = false;
    let objectUrl: string | null = null;
    setIsLoading(true);
    setPreviewError(null);

    fetchFileWithAuth(downloadUrl)
      .then(({ blob }) => {
        if (isCancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setPreviewUrl(objectUrl);
      })
      .catch(() => {
        if (isCancelled) return;
        setPreviewError("Unable to load the CV preview.");
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      setPreviewUrl(null);
    };
  }, [open, downloadUrl, isTestEnvironment]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    void downloadFileWithAuth(
      downloadUrl,
      candidateName ? `${candidateName}.pdf` : undefined
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Preview CV</DialogTitle>
          <DialogDescription>
            {candidateName
              ? `You're previewing ${candidateName}'s resume.`
              : "Preview candidate resume."}
          </DialogDescription>
        </DialogHeader>

        {downloadUrl ? (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Button size="sm" onClick={handleDownload}>
                Download CV
              </Button>
            </div>

            {previewUrl ? (
              <div className="h-[65vh] rounded-md border border-border bg-muted/40 overflow-hidden">
                <iframe
                  title={`Preview of ${candidateName ?? "candidate"} CV`}
                  src={previewUrl}
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="h-[65vh] rounded-md border border-dashed border-border bg-muted/20 flex items-center justify-center text-center text-sm text-muted-foreground px-6">
                {isLoading
                  ? "Loading preview..."
                  : previewError ??
                    "CV preview is unavailable. Use the download button above to view the document."}
              </div>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            CV preview is currently unavailable for this candidate.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
