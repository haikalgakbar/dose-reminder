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
      <div className="before:from-bg-slate-100/70 fixed bottom-0 flex h-6 w-full items-center justify-center bg-white/70 bg-gradient-to-t from-white/70 to-transparent backdrop-blur-3xl before:fixed before:h-6 before:w-full before:-translate-y-full before:bg-gradient-to-t before:backdrop-blur-3xl before:content-['']">
        <nav className="m-2 flex w-fit -translate-y-6 gap-2 rounded-2xl border border-slate-100 bg-[#F8F4F2] p-1 text-[#AA9C87] shadow-[0px_8px_16px_0px_rgba(40,37,35,0.2)] backdrop-blur-3xl">
          <Link
            to="/"
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl [&.active]:bg-white/70 [&.active]:text-[#F96C00]"
          >
            <CircleCheckBig size={20} />
          </Link>
          <Link
            to="/medicine"
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl [&.active]:bg-white/70 [&.active]:text-[#F96C00]"
          >
            <Pill size={20} />
          </Link>
          <Link
            to="/history"
            className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl [&.active]:bg-white/70 [&.active]:text-[#F96C00]"
          >
            <History size={20} />
          </Link>
        </nav>
      </div>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  );
}
