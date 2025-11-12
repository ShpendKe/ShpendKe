---
authors: shpendkelmendi
tags: [azure, azure devops, service connection, workload identity federation, well architected framework]
description: "Step-by-step guide to renewing expired secrets for Azure DevOps service connections and why Workload Identity Federation should be your go-to approach for modern pipeline authentication."
keywords: ["azure devops", "service connection", "app registration", "secret rotation", "secret expiration", "workload identity federation", "azure pipelines", "certificate management", "azure portal", "devops security", "azure authentication", "service principal", "pipeline tasks", "AzureFileCopy", "azure ad", "credential management", "automated deployment", "ci cd security", well architected framework]
---

# Fix expired secrets in Azure DevOps Service Connections

Workload Identity Federation is the recommended approach for Service Connection.
So why would I use the old approach with an app registration where I need to rotate the secret by myself?
Well, there are some pipeline tasks which doesn't support Workload Identity Federation.  
And in this case, you have to use the old approach.  
And today was the day of rotation.  
And a team member tried to renew the secret but didn't know how to do it, because the problem is still not fixed correctly in the UI.

Let's check the steps to fix it.

<!-- truncate -->

## 1. Problem

<img src={require("./appRegWithSecret.png").default} alt="Service Connection with App Registration and Secret"/>

You have created a service connection with app registration (automatic).  
Your secret expired.  
You don't know how to fix it.

## 2. Solutions

### 2.1 Renew secret

1. Go to ADO -> Project Settings
2. Click on Service Connection, which makes trouble
3. Click on "Manage App registration"
4. In Azure Portal -> Manage -> Certificate & secrets
5. Delete your expired secret
6. Create a new secret
7. Go back to ADO
8. Click on the Edit button
9. Change description
10. Click the Save button
11. Click on Edit again
12. Click on Verify
13. It should show Verification succeeded

You may need to repeat steps 8-13 if verification does not succeed the first time.

<img src={require("./RenewSecret.gif").default} alt="Steps to renew secrets for service connection"/>

### 2.2 Use Workload Identity Federation

Verify if there is a newer version of the task that supports Workload Identity Federation.

In our example, it was the task ```AzureFileCopy``` which supports with from version 6 workload identity federation.

### 2.3 Implement yourself

A lot of the tasks can be done by yourself with pure scripts.
Like the task mentioned above ```AzureFileCopy```:
```az storage blob upload -f /path/to/file -c mycontainer -n MyBlob```

The benefit would be that you can use the Ubuntu agent instead of the Windows agent.

## 3. Final thoughts

Recommendations are to use Workload Identity Federation where possible, because it's better not to handle secrets in any place and to forget the rotation. If this is not possible, try to implement it yourself if you feel confident.

If not, you can still go for the hacky way.
