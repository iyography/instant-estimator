# Instant Estimator - Testing Guide

A comprehensive step-by-step guide to test all features of the platform.

---

## Prerequisites

### 1. Environment Variables

Ensure your `.env.local` file has all required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OpenAI (for AI suggestions)
OPENAI_API_KEY=your-openai-key

# Resend (for email notifications)
RESEND_API_KEY=your-resend-key

# Stripe (for billing)
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
STRIPE_PRICE_ID_MONTHLY=your-monthly-price-id
STRIPE_PRICE_ID_YEARLY=your-yearly-price-id

# PostHog (for analytics)
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Testing Checklist

### Phase 1: Landing Page & Authentication

#### 1.1 Landing Page (`/`)

- [ ] Visit `http://localhost:3000`
- [ ] Verify the hero section displays in English by default
- [ ] Test the language switcher in the navbar:
  - [ ] Click dropdown and select "Svenska"
  - [ ] Verify all text changes to Swedish
  - [ ] Switch back to English
- [ ] Click "Scroll down" button - verify smooth scroll to features section
- [ ] Test navigation links:
  - [ ] "Features" scrolls to features section
  - [ ] "How it Works" scrolls to that section
  - [ ] "Sign In" navigates to `/login`
  - [ ] "Get Started Free" navigates to `/signup`
- [ ] Test responsive design (resize browser or use DevTools mobile view)

#### 1.2 Sign Up (`/signup`)

- [ ] Visit `http://localhost:3000/signup`
- [ ] Test form validation:
  - [ ] Try submitting empty form
  - [ ] Try invalid email format
  - [ ] Try password less than 6 characters
- [ ] Create a new account with valid credentials
- [ ] Verify redirect to `/onboarding` after signup
- [ ] Check email for verification link (if email confirmation is enabled)

#### 1.3 Login (`/login`)

- [ ] Visit `http://localhost:3000/login`
- [ ] Test with invalid credentials - verify error message
- [ ] Test with valid credentials - verify redirect to dashboard
- [ ] Test "Sign up" link navigates to signup page

---

### Phase 2: Onboarding Flow

#### 2.1 Step 1: Company Information (`/onboarding`)

- [ ] Verify progress indicator shows step 1 of 4
- [ ] Test form validation:
  - [ ] Company Name is required
  - [ ] Industry selection works
- [ ] Fill in company details:
  - Company Name: "Test Electric Co"
  - Industry: "Electrician"
  - Email: your email
  - Phone: optional
- [ ] Click "Next" - verify navigation to step 2

#### 2.2 Step 2: Language & Currency

- [ ] Verify progress indicator shows step 2 of 4
- [ ] Test language dropdown (English/Svenska)
- [ ] Test currency dropdown (USD/EUR/SEK)
- [ ] Select preferred options
- [ ] Click "Back" - verify returns to step 1
- [ ] Click "Next" - verify navigation to step 3

#### 2.3 Step 3: Job Type Selection

- [ ] Verify progress indicator shows step 3 of 4
- [ ] Verify suggested job types appear for selected industry
- [ ] Test selecting a suggested job type (click to highlight)
- [ ] Test custom job type input (clears selection)
- [ ] Enter a base price
- [ ] Click "Create with AI" button
- [ ] Wait for AI to generate questions (may take 10-30 seconds)
- [ ] Verify navigation to step 4

#### 2.4 Step 4: Completion

- [ ] Verify success message displays
- [ ] Verify public link is shown
- [ ] Test "Copy code" button for embed code
- [ ] Click external link icon to open public estimator
- [ ] Click "Go to dashboard" - verify redirect to `/overview`

---

### Phase 3: Dashboard Pages

#### 3.1 Overview Page (`/overview`)

- [ ] Verify welcome message shows company name
- [ ] Verify stats cards display:
  - [ ] Total Leads
  - [ ] New Leads
  - [ ] Conversion Rate
  - [ ] Estimated Revenue
- [ ] Verify "Recent Leads" section (empty or with leads)
- [ ] Test "Quick Actions" buttons:
  - [ ] "Create new estimator" → `/forms/new`
  - [ ] "Manage forms" → `/forms`
  - [ ] "View all leads" → `/leads`
- [ ] Test embed code copy button
- [ ] Verify all text is in selected language (English default)

#### 3.2 Sidebar Navigation

- [ ] Test all navigation links:
  - [ ] "Overview" → `/overview`
  - [ ] "Forms" → `/forms`
  - [ ] "Leads" → `/leads`
  - [ ] "Settings" → `/settings`
- [ ] Test "Log out" button - verify redirect to login
- [ ] Test mobile menu (resize browser to mobile width):
  - [ ] Hamburger menu appears
  - [ ] Menu opens/closes on click
  - [ ] Navigation works from mobile menu

#### 3.3 Forms Page (`/forms`)

- [ ] Verify forms list displays
- [ ] If forms exist:
  - [ ] Click a form to edit
  - [ ] Verify form builder loads
- [ ] Test "Create new form" button
- [ ] In form builder:
  - [ ] Add a question manually
  - [ ] Test "Get AI Suggestions" button
  - [ ] Add answer options with price modifiers
  - [ ] Save the form

#### 3.4 Leads Page (`/leads`)

- [ ] Verify page title shows "Leads"
- [ ] Test view toggle (Kanban/List):
  - [ ] Click grid icon for Kanban view
  - [ ] Click list icon for List view
- [ ] Test search functionality:
  - [ ] Enter a name or email
  - [ ] Verify filtering works
- [ ] Test status filter dropdown
- [ ] Test job type filter dropdown
- [ ] Test "Export CSV" button

##### Kanban View Testing:
- [ ] Verify 5 columns: New, Contacted, Quoted, Won, Lost
- [ ] If leads exist:
  - [ ] Drag a lead card to different column
  - [ ] Verify status updates
  - [ ] Click a lead card to view details
- [ ] Verify 30-lead cap per column (if applicable)
- [ ] Verify overflow message shows "+X more in list view"

##### List View Testing:
- [ ] Verify table headers: Customer, Job Type, Value, Estimate, Status, Date
- [ ] Verify lead value badges display (Low/Medium/High)
- [ ] Click a row to view lead details
- [ ] Verify sorting by date (newest first)

#### 3.5 Lead Detail Page (`/leads/[leadId]`)

- [ ] Click any lead to open detail page
- [ ] Verify customer information displays:
  - [ ] Name
  - [ ] Email
  - [ ] Phone
  - [ ] Address
- [ ] Verify estimate range displays
- [ ] Verify lead value badge shows
- [ ] Test status change dropdown
- [ ] Verify answers/selections display
- [ ] Test "Back to leads" navigation

#### 3.6 Settings Page (`/settings`)

- [ ] Verify page loads with company data

##### Billing Card:
- [ ] Verify subscription status badge
- [ ] Test billing period toggle (Monthly/Yearly)
- [ ] Verify Free plan features list
- [ ] Verify Pro plan features list
- [ ] Test "Upgrade to Pro" button (redirects to Stripe)
- [ ] If subscribed: Test "Manage Subscription" button

##### Company Profile:
- [ ] Verify fields are pre-filled
- [ ] Edit company name
- [ ] Change industry
- [ ] Update email/phone/website

##### Language & Currency:
- [ ] Change default language
- [ ] Change default currency

##### Estimator Settings:
- [ ] Adjust price range low percentage
- [ ] Adjust price range high percentage
- [ ] Change widget primary color

##### Notifications:
- [ ] Set notification email (or leave blank for default)

##### Embed Code:
- [ ] Copy public link
- [ ] Copy JavaScript embed code
- [ ] Add allowed domains (optional)

##### Save:
- [ ] Click "Save settings"
- [ ] Verify success message
- [ ] Refresh page - verify changes persisted

---

### Phase 4: Public Estimator Widget

#### 4.1 Standalone Estimator (`/e/[companySlug]`)

- [ ] Visit `http://localhost:3000/e/your-company-slug`
- [ ] Verify company branding/colors apply
- [ ] Test the estimator flow:

##### Step 1: Service Selection
- [ ] Verify job types display
- [ ] Select a job type
- [ ] Click "Next"

##### Step 2-N: Questions
- [ ] Answer each question
- [ ] Test "Back" button
- [ ] Verify progress indicator updates
- [ ] Complete all questions

##### Price Estimate Display
- [ ] Verify price RANGE shows (low - high)
- [ ] Verify disclaimer text displays
- [ ] Proceed to contact form

##### Contact Form
- [ ] Test validation:
  - [ ] Name required
  - [ ] Email required (valid format)
  - [ ] Phone required
- [ ] Fill in contact details
- [ ] Submit form

##### Confirmation
- [ ] Verify "Thank you" message
- [ ] Verify price estimate shows again

#### 4.2 Verify Lead Creation

- [ ] Return to dashboard `/leads`
- [ ] Verify new lead appears in Kanban "New" column
- [ ] Verify lead has correct:
  - [ ] Customer name
  - [ ] Email
  - [ ] Phone
  - [ ] Estimated price range
  - [ ] Lead value tier

#### 4.3 Email Notification (if Resend configured)

- [ ] Check notification email inbox
- [ ] Verify email received with:
  - [ ] Lead details
  - [ ] Price estimate
  - [ ] Lead value tier
  - [ ] Link to dashboard

---

### Phase 5: Billing Flow (Stripe)

#### 5.1 Checkout Flow

- [ ] Go to Settings page
- [ ] Click "Upgrade to Pro"
- [ ] Verify redirect to Stripe Checkout
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete checkout
- [ ] Verify redirect back to Settings with success

#### 5.2 Verify Subscription Active

- [ ] Refresh Settings page
- [ ] Verify status badge shows "Active"
- [ ] Verify "Manage Subscription" button appears

#### 5.3 Customer Portal

- [ ] Click "Manage Subscription" or "Open Customer Portal"
- [ ] Verify Stripe Customer Portal opens
- [ ] Test viewing invoices
- [ ] Test updating payment method
- [ ] Test canceling subscription (optional)

---

### Phase 6: Language Switching

#### 6.1 Dashboard Language

- [ ] Go to any dashboard page
- [ ] Open language switcher in navbar
- [ ] Switch to Swedish
- [ ] Verify all UI text changes:
  - [ ] Navigation items
  - [ ] Page titles
  - [ ] Button labels
  - [ ] Form labels
  - [ ] Status labels
- [ ] Switch back to English
- [ ] Refresh page - verify language persists

#### 6.2 Public Estimator Language

- [ ] Visit public estimator `/e/[slug]`
- [ ] Verify language matches company default
- [ ] Complete flow - verify all text in correct language

---

### Phase 7: Edge Cases & Error Handling

#### 7.1 Authentication

- [ ] Try accessing `/overview` without login - verify redirect to login
- [ ] Try accessing `/settings` without login - verify redirect
- [ ] Test session expiry (if applicable)

#### 7.2 Invalid Routes

- [ ] Visit `/e/invalid-slug` - verify error handling
- [ ] Visit `/leads/invalid-id` - verify error handling
- [ ] Visit non-existent route - verify 404 page

#### 7.3 Form Validation

- [ ] Try submitting estimator without required fields
- [ ] Try submitting with invalid email format
- [ ] Verify error messages display correctly

#### 7.4 API Error Handling

- [ ] Disconnect internet and try actions
- [ ] Verify graceful error messages

---

### Phase 8: Analytics Verification (PostHog)

If PostHog is configured:

- [ ] Login to PostHog dashboard
- [ ] Verify events are being captured:
  - [ ] `user_signed_up`
  - [ ] `user_signed_in`
  - [ ] `onboarding_completed`
  - [ ] `form_created`
  - [ ] `lead_received`
  - [ ] `lead_status_changed`
  - [ ] `estimator_started`
  - [ ] `estimator_completed`
  - [ ] `checkout_started`
- [ ] Verify user identification works
- [ ] Check session recordings (if enabled)

---

## Quick Test Checklist

For rapid testing, focus on this critical path:

1. [ ] Landing page loads in English
2. [ ] Sign up works
3. [ ] Onboarding completes with AI job type
4. [ ] Dashboard overview shows stats
5. [ ] Public estimator works end-to-end
6. [ ] Lead appears in Kanban board
7. [ ] Lead can be dragged between columns
8. [ ] Settings page saves changes
9. [ ] Language switch works
10. [ ] Billing upgrade redirects to Stripe

---

## Troubleshooting

### Common Issues

**Supabase connection failed:**
- Verify `NEXT_PUBLIC_SUPABASE_URL` and keys are correct
- Check Supabase project is running

**AI suggestions not working:**
- Verify `OPENAI_API_KEY` is set and valid
- Check API quota/billing

**Email not sending:**
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for logs
- Verify sender domain is configured

**Stripe checkout not working:**
- Verify all Stripe env vars are set
- Check Stripe dashboard for errors
- Ensure price IDs exist in your Stripe account

**PostHog not tracking:**
- Verify `NEXT_PUBLIC_POSTHOG_KEY` is set
- Check browser console for errors
- Verify PostHog project is active

---

## Test Data Cleanup

To reset test data:

1. Go to Supabase dashboard
2. Delete test records from:
   - `leads` table
   - `companies` table (careful - cascades)
   - `auth.users` table

Or use SQL:
```sql
-- Delete all leads for a company
DELETE FROM leads WHERE company_id = 'your-company-id';

-- Delete test company (cascades to job_types, questions, etc.)
DELETE FROM companies WHERE id = 'your-company-id';
```

---

## Notes

- All times are in the user's local timezone
- Prices are stored in smallest currency unit (cents/ore)
- Lead values: Low (<$500), Medium ($500-$2000), High (>$2000) for USD
- Kanban shows max 30 leads per column
