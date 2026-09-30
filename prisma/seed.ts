import 'dotenv/config'
import {prisma} from "../src/lib/prisma";

async function main() {
    // 1. Wipe first, so running this twice doesn't double your rows
    await prisma.application.deleteMany();

    // 2. Insert everything in one query
    const result = await prisma.application.createMany({
        data: [
            {
                companyName: 'Google',
                jobTitle: 'Software Engineer',
                location: 'Bangalore',
                jobType:  'FULLTIME',
                status: 'INTERVIEW',
                applicationDate: new Date('2026-09-12'),
                salary: 1200000,
                jobUrl: 'https://careers.google.com/jobs/12345',
                notes: 'Referred by a friend. Waiting for the  second round.',
            },
            {
                companyName: 'Microsoft',
                jobTitle: 'Frontend Developer',
                location: 'Remote',
                jobType: 'FULLTIME',
                status: 'APPLIED',
                applicationDate: new Date('2026-09-10'),
                salary: 1800000,
                jobUrl: 'https://careers.microsoft.com/jobs/67890',
            },
            {
                companyName: 'Amazon',
                jobTitle: 'SDE',
                location: 'Bangalore',
                jobType: 'FULLTIME',
                status: 'REJECTED',
                applicationDate: new Date('2026-09-08'),
                salary: 1500000,
                notes: 'Rejected after the online assessment.',
            },
            {
                companyName: 'Meta',
                jobTitle: 'Software Engineer',
                location: 'Remote',
                jobType: 'FULLTIME',
                status: 'SHORTLISTED',
                applicationDate: new Date('2026-09-05'),
                salary: 2200000,
                jobUrl: 'https://metacareers.com/jobs/24680',
                notes: 'Recruiter call scheduled.',
            },
            {
                // deliberately sparse — no salary, no url, no notes
                companyName: 'Apple',
                jobTitle: 'iOS Developer',
                location: 'Bangalore',
                jobType: 'PARTTIME',
                status: 'APPLIED',
                applicationDate: new Date('2026-09-01'),
            },
            {
                companyName: 'Netflix',
                jobTitle: 'Backend Developer',
                location: 'Remote',
                jobType: 'CONTRACT',
                status: 'INTERVIEW',
                applicationDate: new Date('2026-08-28'),
                salary: 2500000,
                jobUrl: 'https://jobs.netflix.com/jobs/13579',
                notes: 'System design round next week.',
            },
            {
                companyName: 'Adobe',
                jobTitle: 'Frontend Developer',
                location: 'Pune',
                jobType: 'FULLTIME',
                status: 'OFFER',
                applicationDate: new Date('2026-08-25'),
                salary: 1900000,
                jobUrl: 'https://adobe.com/careers/11223',
                notes: 'Offer received. Deciding by the end of the month.',
            },
            {
                companyName: 'Zomato',
                jobTitle: 'SDE Intern',
                location: 'Gurgaon',
                jobType: 'INTERNSHIP',
                status: 'WITHDRAWN',
                applicationDate: new Date('2026-08-20'),
                salary: 50000,
                notes: 'Withdrew after accepting another interview.',
            },
            {
                companyName: 'Swiggy',
                jobTitle: 'Full Stack Developer',
                location: 'Bangalore',
                jobType: 'FULLTIME',
                status: 'REJECTED',
                applicationDate: new Date('2026-08-15'),
                salary: 1400000,
                jobUrl: 'https://careers.swiggy.com/jobs/44556',
            },
            {
                // also sparse
                companyName: 'Razorpay',
                jobTitle: 'Backend Developer',
                location: 'Remote',
                jobType: 'FREELANCE',
                status: 'APPLIED',
                applicationDate: new Date('2026-08-10'),
            },
        ],
    })

    console.log(`Seeded ${result.count} applications.`)
}

main().catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
})
.finally(async () => {
    await prisma.$disconnect()
})