# QuickHire - Job Platform - [Live](https://quickhire-tan.vercel.app/)

QuickHire is a role-based job marketplace built with Next.js, TypeScript, MongoDB, Mongoose, and NextAuth. Recruiters publish jobs, candidates apply with a cover letter and resume, and admins review job listings and applications.

## Features

- Public job and company browsing.
- Candidate registration, login, profile management, job search, filtering, applications, and application tracking.
- Recruiter job creation, editing, deadline management, applicant review, and application status updates.
- Admin job moderation, applicant management, approved-job management, profiles, and expired-job management.
- Credentials authentication and Google OAuth through NextAuth.
- MongoDB persistence with Mongoose.
- Cloudinary image uploads for user avatars and company assets.
- Responsive dashboard layouts with reusable forms, tables, pagination, dialogs, badges, and loading states.

## Technology

- Next.js 16 App Router
- Shadcn UI
- TypeScript
- MongoDB and Mongoose
- NextAuth v5
- TanStack React Query and React Table
- Tailwind CSS 4
- Zod validation
- Cloudinary
- Custom Fonts & Color According to figma design

## User Roles

### Candidate

- Browse approved live jobs and filter by title, category, job type, and deadline.
- Submit a cover letter and resume URL.
- Review application status and job details.
- Withdraw an active application.
- Reapply after an earlier application expires and the recruiter reopens the job with a new deadline.

### Recruiter

- Create and edit owned job listings.
- Set or update job deadlines.
- View applicants for owned jobs.
- Move active applications through the recruiter workflow.
- Review expired applications for tracking.
- Manage recruiter profile information.

Recruiter-created or recruiter-edited jobs require admin approval before becoming live. Updating an expired job sends it back for approval.

### Admin

- Review and approve or reject job listings.
- View and manage jobs across the platform.
- Review applications and applicant information.
- Manage approved and expired jobs.
- Manage the admin profile.

## Job Lifecycle

| Status     | Meaning                                                              |
| ---------- | -------------------------------------------------------------------- |
| `pending`  | Waiting for admin review and unavailable for candidate applications. |
| `approved` | Live and available while its deadline is in the future.              |
| `rejected` | Not approved for publication.                                        |
| `expired`  | The deadline has passed and new applications are blocked.            |

Approved jobs whose deadline is at or before the current time are synchronized to `expired` when jobs or applications are read. A job without a deadline remains live until its status changes.

### Reopening an Expired Job

When a recruiter updates an expired job, the job returns to `pending` and must be approved again by an admin.

After approval:

- The new deadline starts a new application window.
- Candidates can apply during the new window.
- An earlier expired application does not block a new application.
- The earlier application remains in candidate history and is marked expired.
- Recruiter application rows remain visible for tracking, but expired rows are gray, show an expired/rejected marker, and cannot be moved to another status.

## Application Lifecycle

| Status        | Allowed next states       |
| ------------- | ------------------------- |
| `pending`     | `reviewing`, `rejected`   |
| `reviewing`   | `shortlisted`, `rejected` |
| `shortlisted` | `hired`, `rejected`       |
| `rejected`    | None                      |
| `hired`       | None                      |

An application is expired when its job deadline has passed, the job is expired, or its `appliedAt` timestamp is older than the job's latest update/reopen timestamp. This prevents an application from an earlier deadline window being treated as active after reopening.

Expired applications stay visible in candidate history and to recruiters for tracking. They use gray text and an expired marker, cannot be updated by recruiters through the UI or API, and do not prevent a candidate from applying during a later approved deadline window.

## Main Routes

### Public routes

- `/` - Home page.
- `/jobs` - Browse jobs.
- `/jobs/[id]` - View a job.
- `/companies` - Browse companies.
- `/companies/[id]` - View company jobs.
- `/login` - Sign in.
- `/register` - Create an account.

### Dashboard routes

- `/candidate` - Candidate dashboard.
- `/candidate/jobs` - Available jobs.
- `/candidate/applications` - Candidate application history.
- `/candidate/profile` - Candidate profile.
- `/recruiter` - Recruiter dashboard.
- `/recruiter/jobs` - Recruiter jobs.
- `/recruiter/applications` - Applicants for recruiter jobs.
- `/recruiter/expired-jobs` - Recruiter expired jobs.
- `/recruiter/profile` - Recruiter profile.
- `/admin` - Admin dashboard.
- `/admin/jobs` - Job moderation and management.
- `/admin/applications` - Application management.
- `/admin/approved` - Approved jobs.
- `/admin/trash` - Rejected and expired jobs.
- `/admin/profile` - Admin profile.

## API Overview

API route handlers are under `app/api`.

| Area         | Endpoint                        | Purpose                                                     |
| ------------ | ------------------------------- | ----------------------------------------------------------- |
| Auth         | `/api/auth/*`                   | NextAuth credentials and Google authentication.             |
| Users        | `/api/users/*`                  | Registration, profile, and user operations.                 |
| Jobs         | `/api/jobs`                     | Create and list jobs.                                       |
| Jobs         | `/api/jobs/[id]`                | Read, update, or delete a job.                              |
| Jobs         | `/api/jobs/[id]/applicants`     | Recruiter/admin applicant queries for one or more jobs.     |
| Applications | `/api/applications`             | Create applications and retrieve application data.          |
| Applications | `/api/applications/mine`        | Retrieve the signed-in candidate's applications.            |
| Applications | `/api/applications/[id]`        | Retrieve an application and perform application operations. |
| Applications | `/api/applications/[id]/status` | Update recruiter/admin application status.                  |

Protected endpoints verify the authenticated session and role. Recruiters can only manage owned jobs and applications, while candidates can only manage their own applications.

## Validation Rules

- Names must contain at least 3 characters.
- Passwords must contain at least 6 characters and match confirmation.
- Job title, description, company, location, category, and skills are required when creating a job.
- Supported job types are `full-time`, `part-time`, `remote`, and `intern`.
- Cover letters may contain up to 800 characters.
- Resume URLs must be valid URLs.
- Application status changes must follow the defined transition workflow.

## Project Structure

```text
app/                    Next.js routes, layouts, API handlers, and errors
actions/                Server actions
components/             Feature and dashboard UI components
Hooks/                  React Query hooks
lib/                    Authentication, database, Cloudinary, and utilities
modules/                Domain models, validation, services, and controllers
shared/                 Reusable forms, tables, modals, badges, and helpers
public/                 Fonts and image assets
types/                  Shared TypeScript types
utils/                  Response, async error, and schema utilities
```

## Development Commands

```bash
npm run dev       # Start the development server
npm run build     # Create a production build
npm run start     # Start the production server
npm run lint      # Run ESLint
npx tsc --noEmit  # Run the TypeScript type check
```

## Production

1. Configure production values for all required environment variables.
2. Build the application with `npm run build`.
3. Start it with `npm run start`.
4. Update Google OAuth callback settings for the production domain.

## Requirements

- Node.js 20 or newer is recommended.
- npm 10 or newer is recommended.
- A MongoDB database.
- A Cloudinary account if image upload features are used.
- A Google OAuth application if Google login is enabled.

## Installation

1. Clone the repository and enter the project directory.

   ```bash
   git clone <repository-url>
   cd quickhire
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create `.env.local` using the variables below.

4. Start the development server.

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000).
