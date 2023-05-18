public with sharing class toDoController {
    @AuraEnabled(cacheable=true)
    public static List<Task__c> getTasks() {
        return [SELECT Id, Title__c, Due_Date__c, Description__c FROM Task__c ORDER BY CreatedDate DESC];
    }

    @AuraEnabled
    public static void createTask(String title, Date dueDate, String description) {
        Task__c task = new Task__c();
        task.Title__c = title;
        task.Due_Date__c = dueDate;
        task.Description__c = description;
        insert task;
    }

    @AuraEnabled
    public static void deleteTask(String taskId) {
        Task__c task = new Task__c(Id = taskId);
        delete task;
    }


    @AuraEnabled
    public static void updateTask(String taskId, String title, Date dueDate, String description) {
        Task__c task = [SELECT Id, Title__c, Due_Date__c, Description__c FROM Task__c WHERE Id = :taskId];

        task.Title__c = title;
        task.Due_Date__c = dueDate;
        task.Description__c = description;

            try {
            update task;
            System.debug('Task updated successfully: ' + taskId);
            } catch (Exception e) {
            System.debug('Exception occurred while updating task: ' + e.getMessage());
            throw new AuraHandledException('Error updating task.');
            }
            }
}