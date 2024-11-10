import { createDailyTransaction } from "@/libs/util";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { CircleCheckBig, Pill, History } from "lucide-react";
import { useEffect } from "react";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  useEffect(() => {
    async function test() {
      createDailyTransaction();
    }
    test();
  }, []);

  return (
    <>
      <nav className="fixed bottom-0 flex w-full gap-2 bg-[#171717]/80 p-4 backdrop-blur-xl backdrop-brightness-50">
        <Link
          to="/"
          className="flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-[#f5f5f5]"
        >
          <span className="rounded-full bg-[#F5F5F5] px-4 py-1 text-[#171717]">
            <CircleCheckBig size={20} />
          </span>
          <span>Check-in</span>
        </Link>
        <Link
          to="/medicine"
          className="group flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-[#f5f5f5]"
        >
          <span className="rounded-full px-4 py-1 text-[#D4D4D4] group-hover:bg-[#404040]">
            <Pill size={20} />
          </span>
          <span>Medicine</span>
        </Link>
        <Link
          to="/history"
          className="group flex w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl text-[#f5f5f5]"
        >
          <span className="rounded-full px-4 py-1 text-[#D4D4D4] group-hover:bg-[#404040]">
            <History size={20} />
          </span>
          <span>History</span>
        </Link>
      </nav>
      <Outlet />
      {/* <TanStackRouterDevtools /> */}
    </>
  );
}
