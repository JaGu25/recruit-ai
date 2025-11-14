type FullLoadingScreenProps = {
  message?: string;
};

export const FullLoadingScreen = ({ message = "Loading..." }: FullLoadingScreenProps) => (
  <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
    <div className="space-y-2 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent mx-auto" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  </div>
);
