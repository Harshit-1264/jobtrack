"use client";

import { useState } from "react";
import TextField from "@/components/ui/TextField";
import SelectField from "@/components/ui/SelectField";

import {jobTypeLabels, statusLabels} from "@/lib/labels";
import TextAreaField from "@/components/ui/TextAreaField";

// Gives today's date as "2026-10-18". That exact shape is the only thing
// an <input type="date"> accepts.
// We read the local clock instead of toISOString(), which uses UTC and would
// show yesterday's date between midnight and 5:30am in India.
function todayISO() {
    const d = new Date();

    const yyyy = d.getFullYear();
    // getMonth() starts at 0, so October is 9. Always add 1.
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    // getDate() = day of the month (18). getDay() = day of the week (0-6).
    const dd = String(d.getDate()).padStart(2, "0");

    // padStart(2, "0") turns "5" into "05", because the format needs 2 digits.
    return `${yyyy}-${mm}-${dd}`;
}

// All nine field values live HERE, not inside TextField/SelectField.
// Those components only draw what they are given. Keeping the values in one
// place is what makes it possible to send them all to the API in one go later.
export default function ApplicationForm(){
    const [companyName, setCompanyName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [location, setLocation] = useState("");

    const [jobType, setJobType] = useState("");   // empty = nothing picked yet
    const [status, setStatus] = useState("APPLIED");        // matches the Prisma default

    // Starts on today, since you usually log an application the day you apply.
    const [applicationDate, setApplicationDate] = useState(todayISO());
    // These three can be left empty — they are optional in schema.prisma.
    // Note: even type="number" gives us a STRING, so we convert before saving.
    const [salary, setSalary] = useState("");
    const [jobUrl, setJobUrl] = useState("");
    const [notes, setNotes] = useState("");

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

            {/* type="date" gives the browser's own calendar picker.
                Its value is always a string like "2026-10-18". */}
            <TextField 
                id="applicationDate"
                label="Application Date"
                value={applicationDate}
                onChange={setApplicationDate}
                type="date"
            />

            {/* type="number" shows the number keypad on phones. */}
            <TextField 
                id="salary"
                label="Salary (optional)"
                value={salary}
                onChange={setSalary}
                placeholder="e.g. 1200000"
                type="number"
            />

            <TextField 
                id="jobUrl"
                label="Job URL (optional)"
                value={jobUrl}
                onChange={setJobUrl}
                placeholder="e.g. https://company.com/jobs/123"
                type="url"
            />

            {/* Notes can be a paragraph, so a textarea instead of an input. */}
            <TextAreaField 
                id="notes"
                label="Notes (optional)"
                value={notes}
                onChange={setNotes}
                placeholder="Additional information about the application..."
                rows={4}
            />
        </div>
    )
}