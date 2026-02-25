# ScopeForm - Claude Code Memory

## Production URL
**ALWAYS use this link:** https://scopeform.io/

**Public demo link for clients:** https://scopeform.io/e/anderson-electric

NEVER send preview/deployment-specific URLs (like `scopeform-xxxxx.vercel.app`). Always use the production domain above.

## Deployment
- Deploy with `vercel --prod` from the project directory
- All changes must be deployed to https://scopeform.io/

## Client
- Oliver Poysti is the client for this project

## Stripe Configuration
- Webhook endpoint: `https://scopeform.io/api/billing/webhook`
- Required env vars: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_ID_MONTHLY, STRIPE_PRICE_ID_YEARLY
