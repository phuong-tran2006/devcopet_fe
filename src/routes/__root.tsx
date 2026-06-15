// @ts-nocheck
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { ThemeProvider } from "../contexts/ThemeContext";
import "../index.css";

// Wrapper component that provides auth context to the router
function RootContent() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen w-full bg-surface">
        <Header />
        <div className="flex-1 flex flex-col w-full relative pt-[80px]">
          <Outlet />
        </div>
        <Footer />
        <TanStackRouterDevtools />
      </div>
    </ThemeProvider>
  );
}

export const Route = createRootRoute({
  component: () => <RootContent />,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#041521] text-[#d4e4f6]">
      <h1
        className="text-4xl font-bold mb-4"
        style={{ fontFamily: "Montserrat" }}
      >
        404
      </h1>
      <p className="text-[#bdc9c8]" style={{ fontFamily: "Roboto" }}>
        Trang này không tồn tại !
      </p>
    </div>
  ),
});
