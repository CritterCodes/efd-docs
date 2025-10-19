# 🛍️ Shopify Customer Account Integration

## Current Status
The docs app currently has a custom authentication system, but since we use **Shopify Customer Accounts** for our ecosystem, this should be refactored to integrate directly with Shopify.

## Recommended Integration

### 1. Shopify Customer Account API
Instead of custom email verification and user management, use:
- **Shopify Customer Account API** for authentication
- **Shopify Multipass** for single sign-on across ecosystem
- **Shopify Customer API** for user data

### 2. Authentication Flow
```javascript
// Instead of custom credentials, use Shopify OAuth
import { ShopifyProvider } from 'next-auth/providers/shopify'

export const authOptions = {
  providers: [
    ShopifyProvider({
      clientId: process.env.SHOPIFY_CLIENT_ID,
      clientSecret: process.env.SHOPIFY_CLIENT_SECRET,
      shop: process.env.SHOPIFY_STORE_DOMAIN,
    })
  ]
}
```

### 3. Customer Data Sync
```javascript
// Sync user data from Shopify instead of local database
const customer = await shopify.customer.get(customerId)
```

## Benefits of Shopify Integration
- ✅ **Unified customer experience** across shop and docs
- ✅ **No duplicate user management** systems
- ✅ **Shopify handles all email communications**
- ✅ **Single source of truth** for customer data
- ✅ **Built-in security** and compliance features

## Next Steps
1. Remove custom auth system from docs
2. Implement Shopify Customer Account API
3. Set up Multipass for seamless SSO
4. Update user data sources to use Shopify API

---
*Note: Custom email functionality (nodemailer) has been removed since Shopify handles all customer communications.*