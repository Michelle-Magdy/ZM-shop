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
            <Sidebar />
            <main className="px-3 m-0 md:px-6 lg:px-14">
              <div className="container mx-auto">{children}</div>
              <Toaster position="top-center" />
            </main>
          </Provider>
        </CategoriesWrapper>
      </body>
    </html>
  );
}
