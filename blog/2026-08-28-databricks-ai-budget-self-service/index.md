---
title: "AI Governance: Self-Service to a higher AI Budget in Azure Databricks"
authors: [shpendkelmendi]
tags: [azure, databricks,  finops, governance, well-architected-framework, iac, Data-Platform]
description: "Time-limited self-service access to a higher Databricks AI budget."
keywords: [azure databricks, ai governance, budget control, self service, entra id, entitlement management, pim, finops]
image: ./images/cover.png
---

In the [previous post](../2026-08-21-unity-gateway-cost-control-budget-tf/index.md), I explored managing AI budget controls with Terraform. But what happens when someone reaches their usual limit and needs more room to experiment?
So far we got alerted, we interviewed them to understand how they use it and finally increased their limit manually. But how can we scale this solution?

This post explores how to do that without making the exception permanent.

<!-- truncate -->

---

## The scenario

Budgets in Azure Databricks let you monitor monthly spending and trigger emails or block usage when spending exceeds a limit. Since August 2026 (Terraform provider version 1.128.0 or later), they can also be managed as infrastructure as code.
The problem: A default threshold applies to all users in scope. When certain groups need a larger budget, you need overrides for each principal. Every change then requires a pull request, a review, and a Terraform apply. That’s too cumbersome for a short-term experiment. It doesn't scale well.


## Our idea

Define multiple groups in Entra Id. Each group represent a limit they can spend for a temporary time. For example there would be a group for a limit of 300 Dollar. These are created and defined in Terraform so that they are allowed for a higher limit. When they request for a higher limit, they request membership to a group, which would allow them to spend to a new limit.

## Architecture overview

1. An Entra ID security group, such as dbx-budget-boost-500.
2. The group is synchronized with the Databricks account via SCIM or Automatic Identity Management (AIM).
3. A Databricks budget with a default threshold per user and an override for this group.
4. A mechanism for time-limited membership, such as an Access Package from Entitlement Management, PIM for Groups, or custom automation (see Chapter 6).
5. When membership expires, the limit automatically reverts to the default.Die Gruppe wird über SCIM oder Automatic Identity Management mit dem Databricks-Account synchronisiert.

## Set up Budget Overrides

Instead of a single group, each budget tier has its own group. Each group represents a per-user monthly limit that exceeds the default through an override. The table shows examples:

| Budget | Groups | Limit per user and month |
| --- | --- | --- |
| 100 | - (set for all users)|100 USD|
| 200 | dbx-budget-boost-200|200 USD|
| 300 | dbx-budget-boost-300|300 USD|
| 500 | dbx-budget-boost-500|500 USD|


```hcl
locals {
  budget_tiers = [200, 300, 500]
}

resource "azuread_group" "budget_boost" {
  for_each = { for tier in local.budget_tiers : tostring(tier) => tier }

  display_name       = "dbx-budget-boost-${each.key}"
  security_enabled   = true
  assignable_to_role = false
  description        = "Temporary Budget of ${each.value} USD per month"
}
```
Terraform deliberately does not manage the members. They are added through the mechanism described in Chapter 5.

Next, we can use the groups and limits to set the override per group.

```hcl
provider "databricks" {
  alias      = "account"
  host       = "https://accounts.azuredatabricks.net"
  account_id = var.databricks_account_id
}

resource "databricks_budget" "per_user_default" {
  provider     = databricks.account
  display_name = "per-user-monthly-budget"

  alert_configurations {
    time_period        = "MONTH"
    trigger_type       = "CUMULATIVE_SPENDING_EXCEEDED"
    quantity_type      = "LIST_PRICE_DOLLARS_USD"
    quantity_threshold = "100"
    scope_type         = "ALERT_CONFIGURATION_SCOPE_TYPE_PER_USER"

    action_configurations {
      action_type = "BLOCK_USAGE"
    }

    dynamic "principal_overrides" {
      for_each = local.budget_tiers

      content {
        principal_id       = data.databricks_group.budget_boost[tostring(principal_overrides.value)].id
        quantity_threshold = principal_overrides.value
      }
    }
  }
}
```

## Self-Service Options

| Option | Pros | Cons |
| --- | --- | --- |
| PIM for Groups | • Activation with justification, MFA, and optional approval<br/>• Audit trail in PIM<br/>• Good for short-term peaks | • Activation lasts a maximum of 24 hours; work spanning several days requires daily reactivation<br/>• Eligibility must be assigned beforehand; it is not a request<br/>• Requires Entra ID P2 or Governance |
| Logic App or Power Automate | • Any interface, such as a Teams form or Slack command<br/>• Can be extended with analysis and notifications<br/>• No Entra license required | • Self-managed: build, test, monitor, and maintain<br/>• Graph API permissions must be properly restricted<br/>• The service may not be approved in regulated environments |
| Ticket process | • Fits when approvals already happen in ServiceNow or similar<br/>• Easy to trace, including for compliance | • Context switch: users leave their working environment<br/>• Usually slower<br/>• Implementation still requires automation |
| GitHub pull request | • Everything is versioned and reviewable in Git<br/>• No additional platform or Entra license | • Reverting access requires a scheduled pipeline<br/> • Every requester needs access to the repository |
| Omada Identity Cloud | • Dedicated identity governance solution with requests, approvals, provisioning, and reviews<br/>• Connects to Entra through the Graph API; the group is represented as a resource in Omada<br/>• Makes sense if Omada is already in use | • Separate platform and license<br/>• One more component between the request and Entra |


## Conclusion

Combining Databricks budgets with principal overrides and time-limited group membership gives teams a self-service option without requiring a Terraform change for every request or laborious adjustments through the UI. Groups and budgets are defined once in Terraform. Several mechanisms are available for granting membership, depending on the license and operating model.

## Further reading

- [Databricks: Budget configuration for Unity AI Gateway](https://learn.microsoft.com/en-us/azure/databricks/ai-gateway/budgets)
- [Databricks: Create and monitor budgets](https://learn.microsoft.com/en-us/azure/databricks/admin/account-settings/budgets)
