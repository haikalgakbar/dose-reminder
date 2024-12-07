import { createDailyTransaction } from "@/libs/util";
import {
  createRootRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { CircleCheckBig, Pill, History } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    async function dailyTransaction() {
      createDailyTransaction();
    }
    dailyTransaction();
  }, []);

  return (
    <>
      {currentPath.startsWith("/medicine/") ? null : (
        <nav className="fixed bottom-0 flex w-full gap-2 bg-[#171717]/80 p-4 backdrop-blur-xl backdrop-brightness-50">
          <Link
            to="/"
            className="group flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-[#f5f5f5]"
          >
            <span
              className={`rounded-full px-4 py-1 ${currentPath === "/" ? "bg-[#F5F5F5] text-[#171717]" : "text-[#D4D4D4] group-hover:bg-[#404040]"}`}
            >
              <CircleCheckBig size={20} />
            </span>
            <span>Check-in</span>
          </Link>
          <Link
            to="/medicine"
            className="group flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-[#f5f5f5]"
          >
            <span
              className={`rounded-full px-4 py-1 ${currentPath === "/medicine" ? "bg-[#F5F5F5] text-[#171717]" : "text-[#D4D4D4] group-hover:bg-[#404040]"}`}
            >
              <Pill size={20} />
            </span>
            <span>Medicine</span>
          </Link>
          <Link
            to="/history"
            className="group flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-[#f5f5f5]"
          >
            <span
              className={`rounded-full px-4 py-1 ${currentPath === "/history" ? "bg-[#F5F5F5] text-[#171717]" : "text-[#D4D4D4] group-hover:bg-[#404040]"}`}
            >
              <History size={20} />
            </span>
            <span>History</span>
          </Link>
        </nav>
      )}
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  );
}
