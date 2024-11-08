// import { TMedicine } from "@/types/medicine";
// import { useMediaQuery } from "@uidotdev/usehooks";
// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";
// import { Button } from "./ui/button";
// import {
//   Drawer,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "./ui/drawer";
// import { MedicineTransaction } from "@/types/transaction";
// import MedicineCardTriggerHome from "@/components/home/medicine-card-trigger";
// import handleTakeMedicine from "@/libs/medicine";

// export default function MedicineCard({
//   trx,
//   type,
// }: {
//   medicine: TMedicine | MedicineTransaction;
//   type: "home" | "medicine" | "history";
// }) {
//   const [open, setOpen] = useState(false);

//   const isDesktop = useMediaQuery("(min-width: 768px)");

//   if (isDesktop) {
//     return (
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogTrigger asChild>
//           <Button variant="outline">
//             {/* <Plus size={20} /> */}
//             Add medication
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit profile</DialogTitle>
//             <DialogDescription>
//               Make changes to your profile here. Click save when you're done.
//             </DialogDescription>
//           </DialogHeader>
//           {/* <ProfileForm /> */}
//         </DialogContent>
//       </Dialog>
//     );
//   }

//   return (
//     <Drawer open={open} onOpenChange={setOpen}>
//       <DrawerTrigger asChild>
//         <Button
//           variant="ghost"
//           className="flex h-fit w-full cursor-pointer flex-col gap-1 whitespace-pre-line rounded-xl border-b-2 border-[#BBA5A0]/20 bg-white p-4 text-left text-base font-normal text-[#33302E] antialiased transition-all ease-in-out hover:scale-[101%] hover:transform hover:bg-white"
//         >
//           {/* {type === "home" ? (
//             <MedicineCardTriggerHome
//               medicine={medicine as MedicineTransaction}
//             />
//           ) : null} */}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="flex flex-col gap-2 pt-0 text-left">
//           <div className="mx-auto mt-2 h-1 w-12 rounded-full bg-slate-200" />
//           <div className="flex w-full flex-col gap-2">
//             <DrawerTitle>{medicine.name}</DrawerTitle>
//             <DrawerDescription>{medicine.instruction}</DrawerDescription>
//           </div>
//         </DrawerHeader>
//         <div className="flex flex-col gap-2 p-4">
//           <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
//             <p>Dose</p>
//             <p>
//               {medicine.dosage.qty} {medicine.dosage.form}
//             </p>
//           </div>
//           <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
//             {medicine.schedule.category === "takeAsNeeded" ? (
//               <>
//                 <p>Time between doses</p>
//                 <p>{medicine.schedule.details.minTimeBetweenDoses} hours</p>
//               </>
//             ) : (
//               <>
//                 <p>Time</p>
//                 <p>{medicine.schedule.details.times[0]}</p>
//               </>
//             )}
//           </div>
//         </div>
//         <DrawerFooter>
//           <Button
//             variant="default"
//             onClick={() => handleTakeMedicine(medicine)}
//             className="rounded-xl bg-blue-600 hover:bg-blue-700"
//           >
//             Take medicine
//           </Button>
//           <Button
//             variant="ghost"
//             className="rounded-xl"
//             onClick={() => console.log("skip")}
//           >
//             Skip
//           </Button>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }

// // function MedicineCardTrigger() {
// //   return (
// //     <Button
// //           variant="outline"
// //           className="h-fit w-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600"
// //         >
// //           <div className="flex w-full flex-col justify-start p-2 text-start">
// //             <h2 className="font-medium text-slate-700">{medicine.name}</h2>
// //             <p className="line-clamp-2 font-normal">{medicine.instruction}</p>
// //             {/* <p className="text-slate-400">taken 06:00</p> */}
// //           </div>
// //           <div className="flex w-full items-center gap-4 border-t border-t-slate-200 p-2">
// //             <span className="flex items-center gap-1 text-start font-normal">
// //               {medicine.schedule.category === "takeAsNeeded" ? (
// //                 <>
// //                   <Hourglass size={20} />
// //                   {medicine.schedule.details.minTimeBetweenDoses
// //                     ? `every ${medicine.schedule.details.minTimeBetweenDoses} hours`
// //                     : "as needed"}
// //                 </>
// //               ) : (
// //                 <>
// //                   <Clock size={20} />
// //                   {medicine.schedule.details.times[0]}
// //                 </>
// //               )}
// //             </span>
// //             <span className="flex items-center gap-1 font-normal">
// //               <GlassWater size={20} />
// //               {medicine.dosage.qty} {medicine.dosage.form}
// //             </span>
// //           </div>
// //         </Button>
// //   )
// // }

// // {/* <Button
// // variant="outline"
// // className="h-fit w-full cursor-pointer flex-col rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600"
// // >
// // <div className="flex w-full flex-col justify-start p-2 text-start">
// //   <h2 className="font-medium text-slate-700">{medicine.name}</h2>
// //   <p className="line-clamp-2 font-normal">{medicine.instruction}</p>
// //   {/* <p className="text-slate-400">taken 06:00</p> */}
// // </div>
// // <div className="flex w-full items-center gap-4 border-t border-t-slate-200 p-2">
// //   <span className="flex items-center gap-1 text-start font-normal">
// //     {medicine.schedule.category === "takeAsNeeded" ? (
// //       <>
// //         <Hourglass size={20} />
// //         {medicine.schedule.details.minTimeBetweenDoses
// //           ? `every ${medicine.schedule.details.minTimeBetweenDoses} hours`
// //           : "as needed"}
// //       </>
// //     ) : (
// //       <>
// //         <Clock size={20} />
// //         {medicine.schedule.details.times[0]}
// //       </>
// //     )}
// //   </span>
// //   <span className="flex items-center gap-1 font-normal">
// //     <GlassWater size={20} />
// //     {medicine.dosage.qty} {medicine.dosage.form}
// //   </span>
// // </div>
// // </Button> */}
