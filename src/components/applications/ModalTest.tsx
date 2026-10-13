"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

export default function ModalTest() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-semibold"
            >
                Open Test Modal
            </button>

            <Modal open={isOpen} onClose={() => setIsOpen(false)}/>
        </>
    )
}