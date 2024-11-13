// import { reactToPost } from "@/actions/react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { Reaction, ReactionType } from "@/type";
// import supabase from "@/lib/supabaseClient";
// import {
//   AngryIcon,
//   Cat,
//   HeartIcon,
//   LaughIcon,
//   SmilePlus,
//   ThumbsUpIcon,
// } from "lucide-react";
// import { useRouter } from "next/router";
// import { ReactNode, useState } from "react";

// const PoopIcon = ({
//   className,
//   onClick,
// }: {
//   className?: string;
//   onClick?: () => void;
// }) => {
//   return (
//     <svg
//       onClick={onClick}
//       xmlns='http://www.w3.org/2000/svg'
//       width='24'
//       height='24'
//       viewBox='4 -2 32 32'
//       preserveAspectRatio='xMidYMid meet'
//       className={className}
//     >
//       <g
//         transform='translate(0,32) scale(0.12,-0.12)'
//         fill='currentColor'
//         stroke='none'
//       >
//         <path
//           d='M130 240 c-11 -11 -20 -26 -20 -33 0 -7 -10 -17 -22 -22 -13 -6 -25
//               -19 -27 -29 -2 -11 -9 -26 -17 -34 -20 -19 -17 -50 5 -62 11 -5 62 -10 115
//               -10 73 0 98 4 110 16 20 19 20 38 2 56 -8 8 -15 23 -18 33 -2 11 -12 24 -24
//               30 -30 15 -54 41 -54 59 0 22 -26 20 -50 -4z m60 -59 c0 -6 9 -11 19 -11 26 0
//               36 -17 21 -35 -9 -11 -6 -14 12 -17 15 -2 23 -10 23 -23 0 -19 -7 -20 -105
//               -20 -98 0 -105 1 -105 20 0 13 8 21 23 23 18 3 21 6 12 17 -15 18 -5 35 21 35
//               13 0 19 7 19 23 0 39 20 50 41 22 11 -13 19 -28 19 -34z'
//         />
//         <path
//           d='M110 140 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
//               -10 -4 -10 -10z'
//         />
//         <path
//           d='M190 140 c0 -5 5 -10 10 -10 6 0 10 5 10 10 0 6 -4 10 -10 10 -5 0
//               -10 -4 -10 -10z'
//         />
//         <path d='M148 108 c9 -9 15 -9 24 0 9 9 7 12 -12 12 -19 0 -21 -3 -12 -12z' />
//       </g>
//     </svg>
//   );
// };

// export const REACTIONS: { [reactionType: string]: ReactNode } = {
//   like: <ThumbsUpIcon className='cursor-pointer h-6 w-6 text-gray-500' />,
//   rage: <AngryIcon className='cursor-pointer h-6 w-6 text-gray-500' />,
//   poop: <PoopIcon className='cursor-pointer h-6 w-6 text-gray-500' />,
//   laugh: <LaughIcon className='cursor-pointer h-6 w-6 text-gray-500' />,
//   meow: <Cat className='cursor-pointer h-6 w-6 text-gray-500' />,
//   heart: <HeartIcon className='cursor-pointer h-6 w-6 text-gray-500' />,
// };

// const ReactionButton = ({
//   postId,
//   userReaction,
//   onReact,
// }: {
//   postId: string;
//   userReaction?: Reaction;
//   onReact: (reactionType: ReactionType) => void;
// }) => {
//   const [open, setOpen] = useState<boolean>(false);
//   const onClick = (reactionType: ReactionType) => {
//     return async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (!user) {
//         const router = useRouter();
//         router.push("/login");
//         return false;
//       }

//       onReact(reactionType);
//       setOpen(false);
//       // console.log("optimistically updated");
//       await reactToPost(user.id as string, postId, reactionType);
//       // console.log("database updated");
//       return;
//     };
//   };
//   return (
//     <Popover open={open} onOpenChange={(open) => setOpen(open)}>
//       <PopoverTrigger asChild>
//         <div
//           className={cn(
//             "rounded-full",
//             userReaction &&
//               "bg-gray-100 shadow-[inset_-12px_-8px_40px_#46464620]"
//           )}
//         >
//           {userReaction ? (
//             REACTIONS[userReaction.reaction_type]
//           ) : (
//             <SmilePlus className='text-gray-500 cursor-pointer w-6 h-6' />
//           )}
//         </div>
//       </PopoverTrigger>
//       <PopoverContent
//         className='px-4 py-2 rounded-full w-fit'
//         sideOffset={12}
//         side='right'
//       >
//         <div className='flex gap-2 items-center'>
//           {Object.keys(REACTIONS).map((reactionType) => {
//             return (
//               <div
//                 key={`${postId}-reaction-${reactionType}`}
//                 onClick={onClick(reactionType as ReactionType)}
//                 className={cn(
//                   "rounded-full p-1",
//                   (userReaction?.reaction_type as string) === reactionType &&
//                     "bg-gray-100 shadow-[inset_-12px_-8px_40px_#46464620]"
//                 )}
//               >
//                 {REACTIONS[reactionType]}
//               </div>
//             );
//           })}
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// export default ReactionButton;
