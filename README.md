# dental-system-core-logic
Patient Management System (Dental Clinic Dashboard)
A robust, modern Patient Management System built with Next.js 14, TypeScript, and Tailwind CSS. This system is specifically designed for dental clinics to track medical history, treatment sessions, and clinical imagery.

newImages (Multipart File Data)

Usage Note
This system utilizes Optimistic UI patterns. When a user deletes an image or updates a record, the UI reflects the change immediately while the server processes the request in the background. If the server fails, the UI reverts to the previous state to ensure data integrity.

🚀 Features
User Meta Management: Edit patient profiles including occupation, age, and contact details.

Medical Records: Dynamic tracking of chronic illnesses and current medications with real-time editing.

Treatment & Session Tracking: Manage multiple treatment plans (e.g., Orthodontics, Endodontics) and log individual session progress.

Clinical Gallery: A professional lightbox-integrated gallery for dental X-rays and clinical photos.

Appointment Scheduling: Integrated date and time picker for managing the next session.

Optimistic UI Updates: Fast interface response times with server-side revalidation using router.refresh().

🏗️ Project Structure
The project is organized into modular React components, each handling a specific part of the patient's record:

1. UserMetaCard.tsx
Handles the patient's primary identity. It displays the patient's name, avatar, profession, and unique patient code. It includes a modal for updating these core details.

2. UserInfoCard.tsx
The "Medical Brain" of the dashboard. It categorizes clinical risks (illnesses) and prescriptions (medicines). It also contains the scheduling logic for upcoming visits.

3. TreatmentsManager.tsx
A complex state-managed component for tracking dental procedures. It allows doctors to add new treatments and append progress notes (sessions) to existing plans.

4. UserImages.tsx
An advanced media gallery using yet-another-react-lightbox.

Plugins included: Zoom, Thumbnails, Fullscreen, and Captions.

Functionality: Supports batch uploading via FormData and instant deletion of medical images.


🛠️ Technology StackTechnologyPurposeNext.jsApp Router & Server ActionsTypeScriptType safety and interface definitionsTailwind CSSResponsive and dark-mode stylingLucide ReactConsistent iconographyMaterial UI (MUI)Component library for File Uploads and TypographyLightboxHigh-performance clinical image viewing


📡 API Integration
All components communicate with a unified PATCH endpoint: PATCH /api/patients/[patientId]

The backend expects a JSON body (or FormData for images) containing one or more of the following fields:

name, age, phone, work (String/Number)

illnesses, Medicines (Array of objects)

nextSessionDate (ISO String)

newImages (Multipart File Data)


)

📝 Usage Note
This system utilizes Optimistic UI patterns. When a user deletes an image or updates a record, the UI reflects the change immediately while the server processes the request in the background. If the server fails, the UI reverts to the previous state to ensure data integrity.



