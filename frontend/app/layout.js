import "./globals.css";
import { Provider } from "./Providers";

export const metadata = {
  title: "Zm Shop",
  description: "Shop as you like",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true} className="bg-background">
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
