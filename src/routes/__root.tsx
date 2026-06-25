// @ts-nocheck
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Header from "../components/layout/Header";
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
        <TanStackRouterDevtools />
        {/* Global Brightness Overlay */}
        <div
          id="brightness-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "black",
            pointerEvents: "none",
            zIndex: 999999,
            opacity: "var(--brightness-opacity, 0)",
            transition: "opacity 0.15s ease",
          }}
        />
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
