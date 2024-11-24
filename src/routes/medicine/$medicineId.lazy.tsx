import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/medicine/$medicineId")({
  component: MedicineDetail,
});

function MedicineDetail() {
  const { medicineId } = Route.useParams();

  console.log(medicineId);
  return <div>Hello /medicine/$medicineId!</div>;
}
