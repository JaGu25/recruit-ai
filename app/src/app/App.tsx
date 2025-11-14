import { AppRouter } from "@/app/router";
import { ErrorDialogProvider } from "@/app/providers/error-dialog-context";
import { Toaster } from "sonner";

function App() {
  return (
    <ErrorDialogProvider>
      <AppRouter />
      <Toaster richColors position="top-right" />
    </ErrorDialogProvider>
  );
}

export default App;
