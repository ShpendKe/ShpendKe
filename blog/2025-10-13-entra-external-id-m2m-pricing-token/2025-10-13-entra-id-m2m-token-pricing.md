---
authors: shpendkelmendi
tags: [entra external id, azure, announcement, well architected framework]
---

# Microsoft Just Put a Price Tag on Your M2M Tokens for Entra External ID

Microsoft just announced pricing for Microsoft Entra External ID M2M Authentication.  
Starting **November 1, 2025**, every **access token** issued via the **Client Credentials Flow** will cost **$0.001**.

The feature isn’t going away — it’s simply entering its “production maturity” phase.  
It’s time to pay more or less.

<!-- truncate -->

<img src={require("./announcement_pricing_token.png").default} alt="Mail with announcement" />

## 🔍 Quick Refresher: What’s M2M?

Machine-to-Machine (M2M) authentication enables **applications to communicate securely** without human interaction.

- The app authenticates using its **client ID** and **secret or certificate**.  
- **Entra External ID** issues a **short-lived access token** (usually 1 hour).  
- The app presents the token to access another service or API.  

That’s the **OAuth 2.0 Client Credentials Flow**.

**Common examples:**

- A nightly sync job calling an internal API.  
- A backend service interacting with Microsoft Graph.  
- A microservice calling another internal API.

## 💸 The Math: Small Cost, Big Scale

At first glance, $0.001 per token sounds trivial.  
Let’s test that assumption.

### 🧩 Example 1: Low-frequency app

A job runs once nightly and eight times during the day:

- **9 tokens/day × 30 days = 270 tokens/month**  
- **270 × $0.001 = $0.27/month**

### 🔁 Example 2: High-frequency microservice

Negligible, right?  
But scale it up with multiple services, environments (dev/stage/prod), or poor implementation — and it adds up.

### The "Bad API Client" Pattern

```csharp
public class BadApiClient
{
    private readonly HttpClient _httpClient = new HttpClient();
    private readonly string _scope = "https://graph.microsoft.com/.default";
    private readonly string _tenantId = "<tenant_id>";
    private readonly string _clientId = "<client_id>";
    private readonly string _clientSecret = "<client_secret>";

    public async Task<HttpResponseMessage> GetUserAsync(string userId)
    {
        // ❌ Fetches a new token for every request
        var credential = new ClientSecretCredential(_tenantId, _clientId, _clientSecret);
        var token = await credential.GetTokenAsync(new TokenRequestContext(new[] { _scope }));

        var request = new HttpRequestMessage(HttpMethod.Get, $"https://graph.microsoft.com/v1.0/users/{userId}");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token.Token);

        return await _httpClient.SendAsync(request);
    }
}
```

Every call requests a new token.
If this runs at 10 requests/sec, that’s 36'000 tokens/hour -> *$864/day*
Design for efficiency — or pay for inefficiency.  

## 🧭 Well-Architected Lens: How to Respond

The **Azure Well-Architected Framework** provides some help.  
Let's focus on cost optimization and security:

### 💰 Cost Optimization

- **Audit your applications**: Identify all app registrations using the Client Credentials Flow. Check for app registrations with client secrets or certificates in entra external id.  
- **Cache tokens**: Reuse tokens for their valid lifetime — never fetch on every request. [Use a distributed cache in distributed systems](https://learn.microsoft.com/en-us/entra/msal/dotnet/acquiring-tokens/web-apps-apis/client-credential-flows#avoid-requesting-new-tokens-on-each-machine-of-a-distributed-service).  
- **Measure usage**: Check **Sign-Ins Logs -> Service Principals sign-ins** to track token issuance volume.  
- **Set alerts**: Add cost anomaly detection to catch unexpected spikes early.  
- **Simulate costs**: Multiply your average token count by $0.001 to predict your future budget impact.

### 🔐 Security

- **Balance token lifetime vs. security**: Don’t make tokens live forever, but don’t make them expire every 5 minutes either.  
- **Rotate secrets and certificates** frequently — automation is your friend.  
- **Prefer Managed Identities**: They remove secrets entirely and provide least-privilege access by design.  

## ✅ Final notes

This isn’t bad news — it’s a maturity signal.
For small workloads, the cost is noise.
For large-scale systems, it’s a wake-up call to build well-architected and consider best practice.  


