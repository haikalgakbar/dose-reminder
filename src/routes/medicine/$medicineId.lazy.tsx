import { createLazyFileRoute } from "@tanstack/react-router";
import { getData } from "@/libs/db";
import { TMedicine } from "@/types/medicine";
import { DB_NAME, MEDICINE_STORE } from "@/constant/db";
import { useEffect, useState } from "react";
import { Pencil, Clock3, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Duration from "@/features/medicine/components/duration";

export const Route = createLazyFileRoute("/medicine/$medicineId")({
  component: MedicineDetail,
});

function MedicineDetail() {
  const { medicineId } = Route.useParams();
  const [medicine, setMedicine] = useState<TMedicine | undefined>(undefined);
  console.log("render");

  useEffect(() => {
    async function getMedicines() {
      const medicine = await getData<TMedicine>(
        DB_NAME,
        MEDICINE_STORE,
        medicineId,
      );

      setMedicine(medicine);
    }
    getMedicines();
  }, []);

  if (!medicine) return <p>No medicine found</p>;

  return (
    <>
      <section className="space-y-2 p-4 text-neutral-200">
        <header className="space-y-2">
          <h2 className="text-center text-xl font-medium">{medicine?.name}</h2>
          <p className="line-clamp-1 rounded-xl bg-neutral-800 p-4 text-neutral-300">
            {medicine?.instruction}
          </p>
        </header>
        <div className="flex gap-2">
          <Button className="flex h-fit w-full flex-col gap-2 rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700/50">
            <Pencil className="h-5 w-5 shrink-0" />
            <h3>Edit</h3>
          </Button>
          <Button className="flex h-fit w-full flex-col gap-2 rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700/50">
            <Clock3 className="h-5 w-5 shrink-0" />
            <h3>Suspend</h3>
          </Button>
          <Button className="flex h-fit w-full flex-col gap-2 rounded-xl bg-neutral-800 p-4 hover:bg-neutral-700/50">
            <Trash2 className="h-5 w-5 shrink-0" />
            <h3>Delete</h3>
          </Button>
        </div>
      </section>
      <Duration medicine={medicine} setMedicine={setMedicine} />
      <MedicineDetailSection type="dosage" />
      <MedicineDetailSection type="frequency" />
    </>
  );
}

function MedicineDetailSection({
  type,
}: {
  type: "duration" | "dosage" | "frequency";
}) {
  switch (type) {
    case "duration":
      return (
        <section className="space-y-2 p-4 text-neutral-200">
          <header>
            <h2>Duration</h2>
          </header>
          <div className="rounded-xl bg-neutral-800">
            <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
              <h3>Start</h3>
              <p className="flex items-center gap-2">
                01 Oct{" "}
                <span>
                  <ChevronRight />
                </span>
              </p>
            </article>
            <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
              <h3>Start</h3>
              <p className="flex items-center gap-2">
                01 Oct{" "}
                <span>
                  <ChevronRight />
                </span>
              </p>
            </article>
          </div>
        </section>
      );
    case "dosage":
      return (
        <section className="space-y-2 p-4 text-neutral-200">
          <header>
            <h2>Dosage</h2>
          </header>
          <div className="rounded-xl bg-neutral-800">
            <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
              <h3>Start</h3>
              <p className="flex items-center gap-2">
                01 Oct{" "}
                <span>
                  <ChevronRight />
                </span>
              </p>
            </article>
            <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
              <h3>Start</h3>
              <p className="flex items-center gap-2">
                01 Oct{" "}
                <span>
                  <ChevronRight />
                </span>
              </p>
            </article>
          </div>
        </section>
      );
    case "frequency":
      return (
        <section className="space-y-2 p-4 text-neutral-200">
          <header>
            <h2>Frequency</h2>
          </header>
          <div className="rounded-xl bg-neutral-800">
            <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
              <h3>Start</h3>
              <p className="flex items-center gap-2">
                01 Oct{" "}
                <span>
                  <ChevronRight />
                </span>
              </p>
            </article>
            <article className="flex items-center justify-between border-b border-[#33302E] p-4 last:border-b-0">
              <h3>Start</h3>
              <p className="flex items-center gap-2">
                01 Oct{" "}
                <span>
                  <ChevronRight />
                </span>
              </p>
            </article>
          </div>
        </section>
      );
    default:
      return <></>;
  }
}