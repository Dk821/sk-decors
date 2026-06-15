# Task Checklist: Availability Calendar & Admin Dashboard

- [x] Install required dependencies (`react-router-dom`, `firebase`, `@fullcalendar/react`, `@fullcalendar/daygrid`, `@fullcalendar/interaction`, `react-hot-toast`, `date-fns`, `clsx`, `tailwind-merge` - useful for ShadCN-like cards)
- [x] Create `.env.example` for Firebase credentials
- [x] Setup `src/firebase/config.js`
- [x] Create `src/services/` (bookingService, enquiryService, galleryService, settingsService)
- [x] Refactor `App.jsx` to include `react-router-dom`
- [x] Build `src/components/AvailabilityCalendar.jsx` and `BookingForm.jsx`
- [x] Inject Calendar into Public view in `App.jsx`
- [x] Create `src/admin/Login.jsx`
- [x] Create `src/admin/AdminLayout.jsx` with sidebar and Auth protection
- [x] Build `src/admin/Dashboard.jsx` (Stats)
- [x] Build `src/admin/CalendarManager.jsx`
- [x] Build `src/admin/BookingManager.jsx`
- [x] Build `src/admin/GalleryManager.jsx`
- [x] Build `src/admin/Settings.jsx`
- [x] Refactor Public components to use `settingsService` (optional but requested)
- [x] Refactor Gallery component to use `galleryService` (optional but requested)
