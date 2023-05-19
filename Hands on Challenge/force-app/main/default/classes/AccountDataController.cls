public with sharing class AccountDataController {
    @AuraEnabled(Cacheable = true)
    public static List<ToDoList__c> getAccounts(){
      return [SELECT Id, Title__c, Due_Date__c, Description__c FROM ToDoList__c ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static void createTask(String title, Date dueDate, String description) {
      ToDoList__c ToDoList = new ToDoList__c();
      ToDoList.Title__c = title;
      ToDoList.Due_Date__c = dueDate;
      ToDoList.Description__c = description;
        insert ToDoList;
    }
}