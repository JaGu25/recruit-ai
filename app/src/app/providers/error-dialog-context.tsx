import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/modules/shared/ui/dialog";

const DEFAULT_ERROR_TITLE = "Something went wrong";

export type ErrorDialogState = {
  title: string;
  message: string;
};

export type ErrorDialogContextValue = {
  showError: (message: string, title?: string) => void;
  hideError: () => void;
};

const ErrorDialogContext = createContext<ErrorDialogContextValue | undefined>(undefined);

export const ErrorDialogProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<ErrorDialogState | null>(null);

  const hideError = useCallback(() => setError(null), []);

  const showError = useCallback((message: string, title?: string) => {
    setError({
      title: title ?? DEFAULT_ERROR_TITLE,
      message,
    });
  }, []);

  const value = useMemo<ErrorDialogContextValue>(
    () => ({ showError, hideError }),
    [showError, hideError]
  );

  return (
    <ErrorDialogContext.Provider value={value}>
      {children}
      <Dialog open={Boolean(error)} onOpenChange={(open) => !open && hideError()} >
        <DialogContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <DialogTitle>{error?.title}</DialogTitle>
              <DialogDescription>{error?.message}</DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </ErrorDialogContext.Provider>
  );
};

export const useErrorDialog = () => {
  const context = useContext(ErrorDialogContext);
  if (!context) {
    throw new Error("useErrorDialog must be used within an ErrorDialogProvider");
  }
  return context;
};
