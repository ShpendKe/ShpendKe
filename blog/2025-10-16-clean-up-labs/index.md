---
authors: shpendkelmendi
tags: [labs, mct, azure, clean up, cost, learning]
keywords: [labs, mct, azure, clean up, cost, learning]
---

# How to clean up Azure resources after you finished your labs

<img src={require("./thumbnail.png").default} alt="How to clean up Azure resources after you finished your labs" />

You just finished your Azure lab. You spun up VMs, storage accounts, databases, maybe even a Kubernetes cluster. You learned a lot. But now… your subscription is cluttered, ticking costs, and slowly turning into a monster.  

Cleaning up isn’t fun—I know this from household chores, where you need to do the same :D—but neither is an unexpected bill. Let’s fix that.

<!-- truncate -->

## Prerequisites

Before you start cleaning, make sure you have **Azure CLI installed** – [Install Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)  

## The problem

Lab resources tend to pile up because we don’t think about cleanup until it’s too late. Each VM, storage account, or database costs money until it’s gone. Deleting them manually? Painful.

## How to clean up easily

- Use a dedicated resource group for labs – one group, one delete command. Done.
- Automate – scripts save time and prevent mistakes.

### Your Azure CLI script for clean up

```powershell
try {
    $account = az account show --output json | ConvertFrom-Json
    Write-Host "You are logged in as $($account.user.name) in subscription $($account.name)" -ForegroundColor Cyan
} catch {
    Write-Host "You are not logged in. Please log in first..." -ForegroundColor Yellow
    az login
}

$resourceGroups = az group list --output json | ConvertFrom-Json

if ($resourceGroups.Count -eq 0) {
    Write-Host "No resource groups found in this subscription." -ForegroundColor Yellow
    exit
}

Write-Host "Found $($resourceGroups.Count) resource group(s):" -ForegroundColor Cyan
$resourceGroups | ForEach-Object { Write-Host " - $($_.name)" }

Write-Host ""
$mode = Read-Host "Do you want to delete (A)ll resource groups or confirm (O)ne-by-one? [A/O]"

if ($mode -match '^[Aa]') {
    $confirmAll = Read-Host "Are you sure you want to delete ALL resource groups in this subscription? Type 'YES' to confirm"
    if ($confirmAll -eq "YES") {
        foreach ($rg in $resourceGroups) {
            Write-Host "Deleting resource group '$($rg.name)'..." -ForegroundColor Red
            az group delete --name $rg.name --yes --no-wait
        }
        Write-Host "All resource groups are being deleted (asynchronous operation)." -ForegroundColor Green
    } else {
        Write-Host "Operation cancelled." -ForegroundColor Yellow
    }
}
elseif ($mode -match '^[Oo]') {
    foreach ($rg in $resourceGroups) {
        $confirm = Read-Host "Delete resource group '$($rg.name)'? [y/N]"
        if ($confirm -match '^[Yy]') {
            Write-Host "Deleting '$($rg.name)'..." -ForegroundColor Red
            az group delete --name $rg.name --yes --no-wait
        } else {
            Write-Host "Skipped '$($rg.name)'." -ForegroundColor DarkGray
        }
    }
    Write-Host "Deletion process finished (asynchronous operations may still be running)." -ForegroundColor Green
}
else {
    Write-Host "Invalid selection. Exiting." -ForegroundColor Yellow
}

```

### Final notes

- Be careful! This deletes resources permanently. Only run on lab/test subscriptions.
- Pro Tip: Setup alerts for budget
