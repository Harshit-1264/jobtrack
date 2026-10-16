"use client" //This tells Next.js that the component needs client-side functionality, such as React hooks and keyboard/click interactions.

import {X} from "lucide-react" //This imports the "X" icon from the lucide-react library, which is used for the close button in the modal.
import { useEffect } from "react";

export default function Modal({
    open,
    onClose,
    title,
    children,
} : {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) { // this is a prop. It's how a parent passes information down. open is a true/false value.
    // Closed means render nothing at all — that is how a modal hides.

    useEffect(() => {
        if(!open) return;

        function handleKeyDown(event: KeyboardEvent) {
            if(event.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if(!open) return null;


    // Backdrop: covers the screen, dims the page, and closes on click.
    return (
        <div 
            onClick={onClose}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 md:items-center md:p-6"
        >
            {/* Panel. stopPropagation keeps a click inside from bubbling up
                to the backdrop above, which would close the modal. */}
            <div 
                onClick={(e) => e.stopPropagation()}
                className="w-full rounded-t-2xl bg-white shadow-xl md:max-w-[680px] md:rounded-xl"
            >

                {/* Header row */}
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                        {title}
                    </h2>
                    {/* type="button" so it never submits the form we add later. */}
                    <button 
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900">
                        <X className="h-5 w-5"/>
                    </button>
                </div>
                {/* Anything you put between the opening and closing tags arrives as a prop called children. */}
                <div className="max-h-[70dvh] overflow-y-auto p-5">
                    {children}
                </div>
            </div>
        </div>
    )
}





// "use client";

// import { useEffect, useId } from "react";
// import type { ReactNode, MouseEvent } from "react";
// import { X } from "lucide-react";

// type ModalProps = {
//   open: boolean;
//   onClose: () => void;
//   title: string;
//   children: ReactNode;
// };

// export default function Modal({
//   open,
//   onClose,
//   title,
//   children,
// }: ModalProps) {
//   const titleId = useId();

//   useEffect(() => {
//     if (!open) return;

//     function handleKeyDown(event: KeyboardEvent) {
//       if (event.key === "Escape") {
//         onClose();
//       }
//     }

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [open, onClose]);

//   if (!open) return null;

//   function handlePanelClick(event: MouseEvent<HTMLDivElement>) {
//     event.stopPropagation();
//   }

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 md:items-center md:p-6"
//       onClick={onClose}
//     >
//       <div
//         role="dialog"
//         aria-modal="true"
//         aria-labelledby={titleId}
//         onClick={handlePanelClick}
//         className="w-full rounded-t-2xl bg-white shadow-xl md:max-w-[680px] md:rounded-xl"
//       >
//         <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
//           <h2
//             id={titleId}
//             className="text-lg font-semibold text-gray-900"
//           >
//             {title}
//           </h2>

//           <button
//             type="button"
//             onClick={onClose}
//             aria-label="Close"
//             className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         <div className="max-h-[85dvh] overflow-y-auto p-5">
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }
