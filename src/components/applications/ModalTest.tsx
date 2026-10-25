"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import ApplicationForm from "./ApplicationForm";

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

            <Modal 
                open={isOpen} 
                onClose={() => setIsOpen(false)}
                title="Add Application"
            >
                {/* <p>This form will go here.</p> this becomes children */}
                <ApplicationForm onCancel = {() => setIsOpen(false)} />
            </Modal>
        </>
    )
}