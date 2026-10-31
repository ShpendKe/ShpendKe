---
title: Controlling Databricks Costs on Azure
authors: [shpendkelmendi]
tags: [azure, databricks, cost management, finops, optimization, well-architected-framework, iac, Data-Platform]
description: "Comparing Azure Cost Management, Databricks dashboards, SQL alerts, and Budget Control. How we combined them to control Databricks costs on Azure without surprises."
keywords: [azure databricks, cost control, finops, budget control, system tables, well architected, well architected framework]
image: ./images/cover.png
---

# Controlling Databricks Costs on Azure

No one likes surprises on the bill. Whether it is at a restaurant with your date or in a company setting, an unexpectedly high invoice can quickly put us in unnecessary trouble. Explaining to leadership why costs suddenly went up can be okay when it was a conscious decision, but not when something was simply overlooked.
That is exactly one of the biggest challenges for our Data Platform Engineering team: cloud and Databricks offer huge opportunities, but costs can rise sharply if you do not pay close attention. What is often missing is the clarity and early steering mechanisms needed to identify the main cost drivers and react in time. Our goal is to enable data teams to unlock the full potential of the platform without unpleasant end-of-month surprises. For us, success means no unexpected costs and cost awareness across all users. After evaluating multiple options, we chose a solution that gives us this freedom without giving up control.

:::tip TL;DR

There’s no silver bullet. We combined following components to achieve transparency, responsiveness, and control:

* Databricks dashboards for visibility into cost drivers → **what costs**
* Databricks SQL alerts for proactive notifications when spend deviates → **when to act**
* Budget Control for per-user and per-user-group governance → **enforce limits**

:::

<!-- truncate -->

---

## One Data Platform, but Without the "Spicy Bill"

Our data platform is built around Databricks as a central part of the architecture. Databricks is where we build experiments and MVPs, then move them into production. For experimentation, we use sandbox workspaces to speed up delivery. Now AI workloads are adding another layer.
What we are currently missing:

1. Transparency: We can see total cost, but not what drives it most. Without that, we cannot make targeted decisions to reduce spend.
2. Proactive instead of reactive: Dashboards are useful, but we want early notifications so we can act in time.
3. Cost awareness for users: People should understand cost, but that does not work when they cannot easily view it or receive notifications. It is like giving your kids a credit card and saying, "Use it, but not too much." Practical measures to build awareness include regular cost reports for all users and post-mortems on incurred costs. This is not about blame, it is about learning how to keep costs under control.

---

## Cost Structure

Before choosing a cost control, we need to understand what we pay for. A good starting point is the Databricks Unit, or **DBU**. It is a unit used to measure Databricks compute usage, not a fixed amount of CPU or memory.

The number of DBUs tells us how much compute was billed. The price depends on the billing SKU, which reflects the compute type and workload. For example, Jobs Compute and All-Purpose Compute can have different prices per DBU. Region and contract terms also affect the price.

**DBU cost = DBUs consumed × price per DBU**

For classic compute, the number and type of cluster nodes and how long they run affect DBU usage. The driver counts too. Features such as Photon can also change the DBU rate.

For example, imagine a classic cluster with one driver and two workers. Each node uses 2 DBUs per hour, and all three run for 30 minutes. The cluster uses **3 nodes × 2 DBUs per hour × 0.5 hours = 3 DBUs**. At an example price of $0.30 per DBU, the Databricks charge is $0.90. These numbers are illustrative, not a price quote. If autoscaling changes the number of nodes, usage also changes over time.

This example shows why job runtime is not the whole story. A classic cluster can continue to incur charges while it is running, even if no job is using it. A cluster left running after an experiment can therefore add to the bill without producing more results.

DBUs are not always the entire bill:

* **Classic compute:** Azure charges for the cluster's virtual machines separately from the DBU charge. Disks, storage, and networking can add further costs.
* **Serverless compute:** The underlying compute infrastructure is included in the serverless price, so there is no separate VM charge for that compute. Other costs, such as storage and networking, can still apply.

To understand a cost increase, we need more than the DBU total. The [billable usage system table](https://learn.microsoft.com/en-us/azure/databricks/admin/system-tables/billing), `system.billing.usage`, records usage, SKUs, and available metadata such as jobs, compute resources, identities, and tags. The available details depend on the workload. We use this data to find cost drivers and build the dashboards and alerts described below. For Azure infrastructure costs, we also need Azure cost data.

For more background, see [Azure Databricks pricing](https://azure.microsoft.com/en-us/pricing/details/databricks/) and [LakeSentry's explanation of DBUs](https://lakesentry.io/blog/databricks-dbu-explained/).

---

## Alternatives We Considered

### 1. Azure Cost Management only

Azure Cost Management lets you monitor spend with dashboards, alerts, and budgets. But there are three key drawbacks: first, data is often delayed by 8 to 24 hours, making fast responses harder. Second, the information is quite coarse, usually limited to total cost by subscription, resource group, or service. A detailed breakdown by Databricks jobs, workloads, or users is not available. That can be enough for initial FinOps, but not for targeted optimization or root-cause analysis. Third, not all relevant costs are visible. If resources are spread across multiple subscriptions, you do not see all key costs in a single view.

What we can see:

* Azure infrastructure costs for our data platform (including VMs, storage accounts, ...)
* Azure Databricks cost (consumed DBUs)

What we cannot see:

* What cost sits behind DBUs (serverless vs. classic compute, AI, which jobs, which data products, which user caused which cost, ...)
* Cost from other providers in a multi-cloud setup
* A complete view of all relevant costs (for example across multiple subscriptions)
* No proactive response by itself; someone still needs to monitor dashboards regularly

### 2. Databricks Dashboard

As an account admin, you can import a ready-made dashboard to analyze spending in Databricks. Overall, this is well designed and allows us to break down costs by workspace, user, and other dimensions. The data is based on System Tables (`system.billing.usage`), which are refreshed hourly.

Pros:

* Quick to set up, with deep insights into cost drivers
* Dashboards are GA and can be provisioned with Terraform
* Extendable with Azure cost data (and other cloud providers in multi-cloud scenarios)
* Users can review their own costs, which builds cost awareness

Cons:

* ClickOps by default, manual configuration through the UI instead of Infrastructure as Code (though the dashboard can be exported as JSON and re-provisioned via IaC)
* No proactive response by itself; someone still needs to monitor dashboards regularly

### 3. Databricks SQL Alert

Another option is using Databricks SQL Alerts. Here as well, we rely on System Tables to calculate cost. You can choose whether to alert on total spend or segment by workspace (for example, sandbox vs. production), environment, or user. The main risk is receiving too many alerts. Once that happens, recipients start ignoring them, causing more harm than good. That is why alert volume and threshold design are critical and need regular review. Our approach: an initial threshold value based on historical data, and as soon as a team member flags an alert as not actionable or noisy, it will be adjusted (frequency, recipients, or threshold value) or removed entirely. This keeps alert fatigue at bay and preserves only meaningful notifications.

Timing matters too: being notified at 90 percent of a limit in week one leaves little room to act. Right now, unlike Azure Budgets, there is no straightforward way to define one total budget and precise multi-threshold notifications in one place. The workaround is to create multiple alerts with different thresholds. Email messages are often not very helpful. The upside is that this approach is generally available and can be configured with Terraform.

Pros:

* Enables proactive reaction
* Flexible segmentation (overall, by workspace, by environment, or by user/user group)
* Generally available and with Terraform support

Cons:

* High risk of alert fatigue if thresholds and frequency are not tuned well
* No single native total-budget workflow with multi-threshold notifications like Azure Budgets; multiple alerts are needed as a workaround
* Email notifications are often too generic and not actionable enough


### 4. Databricks budget control

Finally, we looked at Databricks' newest cost-governance feature: Budget Control (Public Preview). Budget Control currently has limited Terraform support. It can create basic controls that group costs by workspace or tags and trigger an alert when a threshold is reached. But if you want grouping by user or user group, Terraform support is missing. Another useful feature is spend blocking. Unfortunately, this is currently available only for Genie. I hope Databricks expands this. If you still want to use these capabilities, you need ClickOps, meaning manual setup in the UI. There, you can define budgets per user or user group and, if needed, set a shared-user threshold. To determine thresholds, we reviewed historical cost and defined an initial value. ClickOps is not my preferred approach, but it can be a temporary alternative until IaC is ready. The important part is to record this as technical debt and be ready to migrate as soon as IaC support catches up.

Pros:

* Proactive alerting on budgets, with built-in visualization that supports user cost awareness
* Budgets per user or user group (UI only)

Cons:

* Still in Public Preview with reduced functionality
* Limited Terraform support
* Directly notifying individual users is not supported; instead, a predefined email group is notified
* Spend blocking is available only for Genie
* Limited flexibility (workspace and tags only)

## Our Decision

We did not choose a single solution. Instead, we combined multiple approaches to capture each one’s strengths: dashboards for visibility, alerts for proactive management, and budget controls for governance and steering. This gives us a solid balance between transparency, responsiveness, and control without losing flexibility.

Our solution is not yet finished. We still need to adjust, remove, and add new alerts, dashboards, or controls. But by combining the three approaches, we achieved a good balance to enable our users without blocking them.

### Visibility: Dashboards with Azure Cost Data

To complete the dashboards, we import Azure infrastructure cost data daily into a dedicated storage account. Databricks can access this data so we can include it in our dashboards. The data is not up to date hourly, but it is acceptable for our use case. Each sprint (2-3 weeks), we review cost together and define actions for optimization or deeper investigation.

### Proactive Alerts: Databricks SQL Alerts

To react proactively, we use Databricks SQL alerts. They trigger when yesterday’s cost is above the median of the last 30 days, configured for sandbox vs. production and by environment. When an alert triggers, we inspect dashboard details to check whether features are being used inefficiently and whether action is required. If an alert fires too often, we tune it using the review process described in the SQL Alert section. Finding the right balance is not trivial and requires continuous iteration.

### Governance: Budget Control per User and Group

To be informed about user-specific cost overruns, we deliberately use Budget Control. Databricks SQL alerts only indicate that some user exceeded a threshold, not exactly which user. Budget Control supports this, but only via manual UI setup currently. We accept this limitation as technical debt until Terraform support is available.

Manual reaction alone is not enough, though. We want spending to stop once a user exceeds a defined threshold. After that, we review the case with the user and can override the limit individually, for example from $100 to $300. Since maintenance overhead grows quickly with the number of users, it makes sense to define thresholds not only per user but also per user group. In practice, this lets us assign different budgets to different roles: data engineers might have a monthly threshold of $500, data analysts $300, and beta testers a higher, flexible limit. These limits are agreed with the team based on responsibility and need, and can be adjusted as needed. When a group threshold is reached, the platform team is notified by email, and additional spend is blocked until clarification is provided. 

:::info Genie becomes billable

Databricks Genie becomes billable after July 31 (originally July 7, then postponed by Databricks). That makes per-user budget controls and spend blocking, currently supported only for Genie, immediately relevant: AI-assisted queries can quietly add a new cost stream per user.

:::

To return to the restaurant: we still order freely from the menu, but we see the prices, the waiter warns us before we overdo it, and nobody gets a spicy bill at the end of the evening.

## Further Reading

**Databricks:**

- [Billable usage system tables](https://learn.microsoft.com/en-us/azure/databricks/admin/system-tables/billing): schema and details of `system.billing.usage`, the foundation for dashboards and SQL alerts
- [Budgets & budget policies](https://learn.microsoft.com/en-us/azure/databricks/admin/account-settings/budgets): how to set up Budget Control and budget policies
- [Monitor account usage](https://learn.microsoft.com/en-us/azure/databricks/admin/account-settings/usage): account-level usage monitoring, including the ready-made usage dashboard
- [Manage and monitor usage](https://learn.microsoft.com/en-us/azure/databricks/admin/usage/): overview of usage management options for admins
- [Cost optimization best practices](https://learn.microsoft.com/en-us/azure/databricks/lakehouse-architecture/cost-optimization/best-practices): the Lakehouse Well-Architected cost optimization pillar

**Microsoft:**

- [Azure Well-Architected Framework – Cost Optimization](https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/): design principles for cost-aware architectures
- [Azure Cost Management best practices](https://learn.microsoft.com/en-us/azure/cost-management-billing/costs/cost-mgt-best-practices): practical guidance for monitoring and optimizing Azure spend
- [FinOps on Azure](https://learn.microsoft.com/en-us/cloud-computing/finops/overview): introduction to the FinOps framework and how to apply it on Azure

## Next in This Series

This post covered the *what* and *why*. The follow-up posts walk through the concrete implementations in detail:

- [Part 2: Building the Cost Dashboard](../2026-08-01-azure-databricks-cost-control-dashboard/index.md): System Table queries, Terraform provisioning, and importing Azure infrastructure costs
- [Part 3: Proactive Alerts with SQL Alerts](../2026-08-08-azure-databricks-cost-control-alerts/index.md): the median-based alert logic, segmentation, and fighting alert fatigue
- [Part 4: Budget Control & Spend Blocking](../2026-08-15-azure-databricks-cost-control-budget/index.md): role-based budgets, the override process, and ClickOps as managed technical debt

If you are facing similar challenges, let me know how you are handling them and what worked well, and what did not.
