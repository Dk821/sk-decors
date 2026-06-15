# Add Real-Time Availability Calendar & Admin Dashboard

This implementation plan outlines the architectural approach to adding a comprehensive Booking/Availability system and an Admin Dashboard backed by Firebase, while perfectly preserving the existing public website's design and functionality.

## User Review Required

> [!WARNING]
> **Firebase Configuration Required**
> I cannot automatically generate a Firebase project for you. To implement this, you will need to create a Firebase project (with Authentication, Firestore, and Storage enabled) and provide the configuration object.

## Open Questions

> [!IMPORTANT]
> 1. **Firebase Config**: Please provide your Firebase project's `firebaseConfig` object so I can integrate it into the `src/firebase/config.js` file.
> 2. **Admin User**: Do you want me to write a one-time script to create your first Admin user, or will you manually add a user in the Firebase Authentication console?

## Proposed Changes

We will introduce `react-router-dom` to handle the `/admin` routing while keeping the public single-page structure intact on the root `/` path.

### Dependencies
- **Firebase**: `firebase` (Auth, Firestore, Storage)
- **Routing**: `react-router-dom`
- **Calendar**: `@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`
- **UI/UX**: `react-hot-toast` (for notifications)

---

### App Level & Routing

#### [MODIFY] `src/App.jsx`
- Wrap the application in a Router (`BrowserRouter` or `HashRouter`).
- Create two main route branches:
  1. `/` -> Public SPA (Existing `App` structure + new `AvailabilityCalendar`).
  2. `/admin/*` -> Admin Dashboard layout and routes.

#### [MODIFY] `src/main.jsx`
- Add a Toast provider (`Toaster` from `react-hot-toast`) for global notifications.

---

### Firebase Integration

#### [NEW] `src/firebase/config.js`
- Initialize Firebase App using your provided credentials.
- Export `auth`, `db`, and `storage` instances.

#### [NEW] `src/services/enquiryService.js`
- Functions to submit enquiries to the `enquiries` Firestore collection.

#### [NEW] `src/services/bookingService.js`
- CRUD operations for the `bookings` collection (admin only).
- Listener to fetch live availability for the public calendar.

#### [NEW] `src/services/galleryService.js`
- Functions to upload images to Firebase Storage and save metadata to Firestore.

#### [NEW] `src/services/settingsService.js`
- Functions to fetch and update dynamic site settings (Business Name, Phones, etc.).

---

### Public Website Additions

#### [NEW] `src/components/AvailabilityCalendar.jsx`
- Render a `FullCalendar` instance showing dates as Green (Available), Red (Booked), or Yellow (Tentative).
- Integrate a modal/form for users to submit an enquiry when clicking on a date.

#### [MODIFY] `src/App.jsx` (Public view)
- Inject the `AvailabilityCalendar` section right before the `Contact` section.

---

### Admin Dashboard (`/admin`)

#### [NEW] `src/admin/AdminLayout.jsx`
- Sidebar navigation and header.
- Wrapper that checks Firebase Auth state and redirects to `/admin/login` if not authenticated.

#### [NEW] `src/admin/Login.jsx`
- Email/Password login form using Firebase Auth.

#### [NEW] `src/admin/Dashboard.jsx`
- Statistics overview (Total Bookings, Enquiries, etc.) fetched from Firestore.

#### [NEW] `src/admin/CalendarManager.jsx`
- Admin view of FullCalendar.
- Ability to click dates and change status, add customer details, and save to Firestore.

#### [NEW] `src/admin/BookingManager.jsx`
- Data table to view, search, and manage all bookings/enquiries.

#### [NEW] `src/admin/GalleryManager.jsx`
- Interface to upload images, assign categories, and delete existing gallery items.

#### [NEW] `src/admin/Settings.jsx`
- Form to update global contact and business settings.

---

## Verification Plan

### Automated Tests
- Test the application build to ensure `vite build` passes successfully with the new dependencies.

### Manual Verification
1. **Public Site**: Ensure the landing page still looks exactly the same, with the addition of the new Calendar section.
2. **Booking Flow**: Simulate a user clicking an available date and submitting an enquiry. Verify data appears in Firestore.
3. **Authentication**: Attempt to access `/admin` while logged out, expecting a redirect to `/admin/login`.
4. **Admin Features**: Log in, add a booking on the admin calendar, and verify it instantly changes to Red/Yellow on the public calendar. Update a gallery image and verify it shows on the public site.
