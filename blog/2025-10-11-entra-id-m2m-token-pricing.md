---
title: Microsoft Just Put a Price Tag on Your M2M Tokens
authors: shpendkelmendi
tags: [entra external id, azure, announcement]
---
# Microsoft Just Put a Price Tag on Your M2M Tokens

Microsoft sent out an email with the subject: *“New pricing for Microsoft Entra External ID M2M Authentication.”*

**Translation:** Starting **November 1, 2025**, the access tokens your apps use in the **Client Credentials Flow** are no longer free.  
They’ll cost **$0.001 per token**.  

The feature isn’t going away. It’s just moving out of the “free preview” honeymoon phase and into the “welcome to the real world” phase.

<!-- truncate -->
---

## Quick Refresher: What’s M2M?

Machine-to-Machine (M2M) auth is what you use when one app talks to another—without a human.

- App signs in with its own credentials (client ID + secret or cert)  
- Azure AD issues an access token  
- App presents the token to get access to some resource  

That’s it. Simple.

**Examples:**
- A nightly job hitting your API  
- A script provisioning users  
- A server app calling Microsoft Graph  

---

## The Math

At **$0.001 per token**, the price sounds tiny. Until you do the math.

- **Low-frequency app**  
  A nightly sync + 8 daytime runs = **270 tokens/month**  
  Cost: **$0.27**

- **High-frequency service**  
  10 token requests/second = ~**26M tokens/month**  
  Cost: **$25,920**

The cost is proportional to your token habits.  
Abuse the flow, pay the price.

---

## What You Should Do Right Now

Don’t wait for November 2025 to be surprised.

1. **Audit your apps** – Find every app using Client Credentials Flow. Kill the zombies.  
2. **Measure usage** – Use Azure Monitor + sign-in logs. Know how many tokens you’re burning.  
3. **Cache tokens** – If you’re requesting a new token for every call, you’re doing it wrong.  
4. **Check token lifetime** – Default ~60 mins. Longer = fewer requests (cheaper), shorter = more secure. Balance it.  
5. **Revisit your architecture** – M2M isn’t always the right answer. If you need user context, use OBO.  
6. **Budget accordingly** – Set up cost alerts. Don’t let accounting be the first to notice.  

---

## Bottom Line

This isn’t bad news. It’s just Microsoft turning on the meter.  

- For small apps: you’ll barely notice.  
- For high-scale services: this is a wake-up call.  

**Pro tip:** Do the math now. Optimize before November 2025.  
Bad code gets expensive fast.
