import "./globals.css";
import CategoriesWrapper from "./providers/CategoriesWrapper";
import { Provider } from "./providers/Providers";
import TopHeader from "@/app/components/home/TopHeader";

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
            <main className="px-3 m-0 md:px-6 lg:px-14">
              <div className="container mx-auto">{children}</div>
            </main>
          </Provider>
        </CategoriesWrapper>
      </body>
    </html>
  );
}
