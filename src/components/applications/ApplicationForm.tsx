"use client";

import { useState } from "react";
import TextField from "@/components/ui/TextField";
import SelectField from "@/components/ui/SelectField";

import {jobTypeLabels, statusLabels} from "@/lib/labels";

// All nine field values live HERE, not inside TextField/SelectField.
// Those components only draw what they are given. Keeping the values in one
// place is what makes it possible to send them all to the API in one go later.
export default function ApplicationForm(){
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");

    const [jobType, setJobType] = useState("");   // empty = nothing picked yet
    const [status, setStatus] = useState("APPLIED");        // matches the Prisma default

    return (
        <div className="space-y-4">
            {/* using TextField component here */}
            <TextField 
                id="companyName"
                label="Company Name"
                value={companyName}
                onChange={setCompanyName}
                placeholder="e.g. Google"
            />

            <TextField 
                id="jobTitle"
                label="Job Title"
                value={jobTitle}
                onChange={setJobTitle}
                placeholder="e.g. Software Engineer"
            />

            <TextField 
                id="location"
                label="Location"
                value={location}
                onChange={setLocation}
                placeholder="e.g. San Francisco, CA"
            />

            {/* labels.ts is an object: { FULLTIME: "Full Time", ... }
                SelectField wants an array: [{ value, label }, ...]
                Object.entries() gives [key, value] pairs; .map() reshapes them.
                Built from labels.ts every render, so it can never fall out of
                sync with the Prisma enum. */}
            <SelectField 
                id="jobType"
                label ="Job Type"
                value={jobType}
                onChange={setJobType}
                placeholder="Select a job type"
                options={Object.entries(jobTypeLabels).map(
                    ([value, label]) => ({ value, label })
                )}
            />

            {/* No placeholder: status always has a value, so there is no
                "nothing picked yet" row to show. */}
            <SelectField 
                id="status"
                label ="Status"
                value={status}
                onChange={setStatus}
                options={Object.entries(statusLabels).map(
                    ([value, label]) => ({ value, label })
                )}
            />
        </div>
    )
}