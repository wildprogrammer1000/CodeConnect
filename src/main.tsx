import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/UserContext.tsx";
import { SnackbarProvider } from "./context/SnackbarContext.tsx";
import App from "./App.tsx";
import "./index.css";
import { createTheme, ThemeProvider } from "@mui/material";
import CookieManager from "./CookieManager.tsx";

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 0,
          minHeight: 0,
          padding: 4,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <SnackbarProvider>
        <UserProvider>
          <CookieManager />
          <App />
        </UserProvider>
      </SnackbarProvider>
    </ThemeProvider>
  </BrowserRouter>
);
