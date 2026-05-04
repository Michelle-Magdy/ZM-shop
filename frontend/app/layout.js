import "./globals.css";
import CategoriesWrapper from "./providers/CategoriesWrapper.jsx";
import { Provider } from "./providers/Providers";
import { Toaster } from "react-hot-toast";
import AuthLoadingOverlay from "./components/AuthLoadingOverlay";
import AppEventListener from "./components/AppEventListener";

export const metadata = {
    title: "Zm Shop",
    description: "Shop as you like",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="bg-background">
                <CategoriesWrapper>
                    <Provider>
                        <AppEventListener />
                        <AuthLoadingOverlay />

                        {children}

                        <Toaster position="top-center" />
                        <div id="modal-root" className="relative z-9999" />
                    </Provider>
                </CategoriesWrapper>
            </body>
        </html>
    );
}