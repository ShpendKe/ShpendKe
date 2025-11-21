targetScope = 'subscription'

@description('Name of the budget')
param budgetName string = 'MonthlyBudget'

@description('Monthly budget amount')
param amount int

@description('Email recipients for alerts')
param emailRecipients array

@description('Start date for the budget (YYYY-MM-DD)')
param startDate string = '${utcNow('yyyy-MM')}-01'

resource subscriptionBudget 'Microsoft.Consumption/budgets@2023-05-01' = {
  name: budgetName
  properties: {
    amount: amount
    category: 'Cost'
    timeGrain: 'Monthly'
    timePeriod: {
      startDate: startDate
    }
    notifications: {
      Forecasted_GreaterThan_90_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 80
        contactEmails: emailRecipients
        thresholdType: 'Forecasted'
      }
      Actual_GreaterThan_80_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 80
        contactEmails: emailRecipients
        thresholdType: 'Actual'
      }
      Actual_GreaterThan_100_Percent: {
        enabled: true
        operator: 'GreaterThan'
        threshold: 100
        contactEmails: emailRecipients
        thresholdType: 'Actual'
      }
    }
  }
}
