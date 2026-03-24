import "../globals.css";
import CategoriesWrapper from "../providers/CategoriesWrapper";
import { Provider } from "../providers/Providers";
import { Toaster } from "react-hot-toast";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import AuthLoadingOverlay from "../components/AuthLoadingOverlay";
import AppEventListener from "../components/AppEventListener";
import { Sidebar } from "../components/admin/Sidebar";
config.autoAddCss = false;

export const metadata = {
  title: "Zm Shop",
  description: "Shop as you like",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className="bg-background">
        <CategoriesWrapper>
          <Provider>
            <AppEventListener />
            <AuthLoadingOverlay />
            <div className="flex min-h-screen bg-(--color-background)">
              <Sidebar />
              <main className="flex-1 ml-64 p-8 overflow-auto">{children}</main>
              <Toaster position="top-center" />
            </div>
          </Provider>
        </CategoriesWrapper>
      </body>
    </html>
  );
}
