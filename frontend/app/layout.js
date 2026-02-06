import "./globals.css";
import { Provider } from "./Providers";
import TopHeader from "@/components/home/TopHeader";

export const metadata = {
  title: "Zm Shop",
  description: "Shop as you like",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className="bg-background">
        <Provider>
          <TopHeader />
          <main className="px-3 md:px-6 lg:px-14 mt-1">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </Provider>
      </body>
    </html>
  );
}
