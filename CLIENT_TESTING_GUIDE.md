# ScopeForm — End-to-End Testing Guide

A simple checklist for testing every feature on **https://scopeform.io** before launch. Work through each section in order.

---

## 1. Landing Page

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 1.1 | Visit homepage | [scopeform.io](https://scopeform.io) | Page loads, no errors, looks correct on desktop and mobile |
| 1.2 | Check footer links | Scroll to bottom | Privacy Policy and Terms of Service links work |
| 1.3 | Cookie consent banner | Open in incognito | Banner appears at bottom. "Accept" dismisses it. "Decline" dismisses it and disables analytics |

---

## 2. Authentication

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 2.1 | Sign up (email) | [scopeform.io/signup](https://scopeform.io/signup) | Create a new account with email + password. Confirmation email arrives |
| 2.2 | Sign up (Google) | [scopeform.io/signup](https://scopeform.io/signup) | Click "Sign in with Google". Account is created, redirected to onboarding |
| 2.3 | Log in (email) | [scopeform.io/login](https://scopeform.io/login) | Log in with existing credentials. Redirected to dashboard |
| 2.4 | Log in (Google) | [scopeform.io/login](https://scopeform.io/login) | Click "Sign in with Google". Redirected to dashboard |
| 2.5 | Protected routes | Try visiting [scopeform.io/overview](https://scopeform.io/overview) while logged out | Redirected to login page |
| 2.6 | Auth redirect | Log in after being redirected from a protected page | Returns to the original page after login |

---

## 3. Onboarding

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 3.1 | Onboarding flow | [scopeform.io/onboarding](https://scopeform.io/onboarding) | After first signup, onboarding page loads. Fill in company details |
| 3.2 | Company setup | Complete onboarding form | Company name, industry, currency, and language are saved |
| 3.3 | Welcome email | Check inbox after onboarding | Welcome email from info@scopeform.io arrives |

---

## 4. Dashboard — Overview

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 4.1 | Overview page | [scopeform.io/overview](https://scopeform.io/overview) | Dashboard loads with stats (leads, forms, etc.) |

---

## 5. Services (Job Types)

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 5.1 | View services | [scopeform.io/services](https://scopeform.io/services) | List of your services/job types |
| 5.2 | Create service | Click "Add Service" | Create a new job type with name, base price, and price range |
| 5.3 | Edit service | Click on an existing service | Update name/pricing and save |
| 5.4 | Delete service | Delete button on a service | Service is removed |

---

## 6. Forms (Estimator Builder)

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 6.1 | View forms | [scopeform.io/forms](https://scopeform.io/forms) | List of your estimator forms |
| 6.2 | Create form | Click "Create Form" | New form created, redirected to form editor |
| 6.3 | Add questions manually | In form editor, add a question | Question appears in the form preview |
| 6.4 | AI suggestions | Click "AI Suggestions" | AI generates relevant questions for your industry/service |
| 6.5 | Drag & drop reorder | Drag questions to reorder | Order updates and saves |
| 6.6 | Add answer options | Add answers to a question | Each answer can have a price modifier |
| 6.7 | Conditional logic | Set up conditional visibility | Questions show/hide based on previous answers |
| 6.8 | Preview form | Use the preview/test mode | Form works as a customer would see it |
| 6.9 | Widget embed code | Check for embed code/snippet | Copy the embed script to use on an external website |

---

## 7. Public Estimator (Customer-Facing)

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 7.1 | View estimator | [scopeform.io/e/anderson-electric](https://scopeform.io/e/anderson-electric) | Public estimator loads with company branding |
| 7.2 | Fill out form | Answer all questions | Price estimate updates as answers are selected |
| 7.3 | Submit lead | Fill in name, email, phone and submit | "Thank you" confirmation shown |
| 7.4 | Lead notification email | Check company email inbox | New lead notification email arrives with customer details and estimate |
| 7.5 | Test on mobile | Open the estimator link on a phone | Form is responsive and usable on mobile |
| 7.6 | Test embedded widget | Embed the script on a test webpage | Widget loads in an iframe on the external site |

---

## 8. Leads (CRM)

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 8.1 | View leads | [scopeform.io/leads](https://scopeform.io/leads) | List of captured leads with names, estimates, and dates |
| 8.2 | Lead detail | Click on a lead | Full lead details: contact info, answers, estimate range |
| 8.3 | Update lead status | Change status (new → contacted → quoted → won/lost) | Status updates and saves |
| 8.4 | Lead after submission | Submit a new public form, then check leads | New lead appears in the list immediately |

---

## 9. Settings

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 9.1 | Company settings | [scopeform.io/settings](https://scopeform.io/settings) | Edit company name, email, notification email, language, currency |
| 9.2 | Save settings | Update a field and save | Changes persist after page reload |
| 9.3 | Notification email | Set a different notification email | Lead emails go to the new notification address |

---

## 10. Billing (Stripe)

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 10.1 | View billing | [scopeform.io/settings](https://scopeform.io/settings) (billing section) | Current plan and subscription status shown |
| 10.2 | Subscribe (monthly) | Click upgrade/subscribe | Redirected to Stripe Checkout. Complete payment with test card `4242 4242 4242 4242` |
| 10.3 | Subscribe (yearly) | Select yearly plan | Stripe Checkout shows yearly price |
| 10.4 | Subscription confirmed email | Check inbox after subscribing | Subscription confirmation email arrives |
| 10.5 | Manage subscription | Click "Manage Billing" | Redirected to Stripe Customer Portal (update card, cancel, etc.) |
| 10.6 | Cancel subscription | Cancel from Stripe Portal | Status updates to "canceled". Cancellation email arrives |

---

## 11. Internationalization (i18n)

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 11.1 | Switch to Swedish | Use language switcher in settings or dashboard | UI labels switch to Swedish |
| 11.2 | Public form in Swedish | Set company language to Swedish, view public estimator | Questions and UI display in Swedish |
| 11.3 | Switch back to English | Change language back | Everything returns to English |

---

## 12. SEO & Legal Pages

| # | Test | Link | Expected Result |
|---|------|------|-----------------|
| 12.1 | Privacy Policy | [scopeform.io/privacy](https://scopeform.io/privacy) | Full privacy policy page loads |
| 12.2 | Terms of Service | [scopeform.io/terms](https://scopeform.io/terms) | Full terms of service page loads |
| 12.3 | robots.txt | [scopeform.io/robots.txt](https://scopeform.io/robots.txt) | Shows robot rules (dashboard routes disallowed) |
| 12.4 | Sitemap | [scopeform.io/sitemap.xml](https://scopeform.io/sitemap.xml) | XML sitemap with public page URLs |
| 12.5 | 404 page | [scopeform.io/nonexistent-page](https://scopeform.io/nonexistent-page) | Custom "Page not found" page with links to home and sign in |

---

## 13. Emails (verify all 5 arrive)

| # | Email | Trigger | Expected Result |
|---|-------|---------|-----------------|
| 13.1 | Welcome | Complete onboarding | Professional welcome email from info@scopeform.io |
| 13.2 | New Lead | Customer submits an estimate form | Lead details, estimate range, and dashboard link |
| 13.3 | Subscription Confirmed | Complete Stripe checkout | Confirmation with plan details |
| 13.4 | Payment Failed | (Simulate in Stripe dashboard) | Alert with link to update payment method |
| 13.5 | Subscription Canceled | Cancel subscription | Confirmation of cancellation |

---

## 14. Security Quick Checks

| # | Test | How | Expected Result |
|---|------|-----|-----------------|
| 14.1 | HTTPS | Visit http://scopeform.io | Automatically redirected to https:// |
| 14.2 | Protected data | Log in as User A, try accessing User B's data | Only own company's data is visible |
| 14.3 | Rate limiting | Rapidly submit the same form 20+ times | After limit, returns "Too many requests" error |

---

## How to Report Issues

If something doesn't work as expected:

1. **Note which test number failed** (e.g., "7.3 — Submit lead")
2. **Screenshot the issue** if possible
3. **Note the browser** you're using (Chrome, Safari, Firefox)
4. **Send to David** with the test number and screenshot

---

*Last updated: March 23, 2026*
