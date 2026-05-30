import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";

// Wrapper component that provides auth context to the router
function RootContent() {

  
  return (
    <>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}

export const Route = createRootRoute({
  component: () => (
    <RootContent />
  ),
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#041521] text-[#d4e4f6]">
      <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Montserrat' }}>
        404
      </h1>
      <p className="text-[#bdc9c8]" style={{ fontFamily: 'Roboto' }}>
        Trang này không tồn tại !
      </p>
    </div>
  ),
});