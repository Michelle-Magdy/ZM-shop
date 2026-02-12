import "./globals.css";
import CategoriesWrapper from "./providers/CategoriesWrapper";
import { Provider } from "./providers/Providers";
import TopHeader from "@/app/components/TopHeader";
import Menu from "./components/Menu";
import { Toaster } from "react-hot-toast";

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
            <TopHeader />
            <Menu />
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
