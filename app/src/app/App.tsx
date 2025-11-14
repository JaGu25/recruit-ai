import { AppRouter } from "@/app/router";
import { ErrorDialogProvider } from "@/app/providers/error-dialog-context";

function App() {
  return (
    <ErrorDialogProvider>
      <AppRouter />
    </ErrorDialogProvider>
  );
}

export default App;
