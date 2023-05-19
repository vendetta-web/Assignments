import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountDataController.getAccounts';
import createTask from '@salesforce/apex/AccountDataController.createTask';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

const columns = [
    { label: 'Title', fieldName: 'Title__c' },
    { label: 'Due Date', fieldName: 'Due_Date__c' },
    { label: 'Description', fieldName: 'Description__c' },
    {
        type: "button", label: 'Edit', initialWidth: 100, typeAttributes: {
            label: 'Edit',
            name: 'Edit',
            title: 'Edit',
            disabled: false,
            value: 'edit',
            iconPosition: 'left',
            iconName:'utility:edit',
            variant:'Brand'
        }
    },
    {
        type: "button", label: 'Delete', initialWidth: 110, typeAttributes: {
            label: 'Delete',
            name: 'Delete',
            title: 'Delete',
            disabled: false,
            value: 'delete',
            iconPosition: 'left',
            iconName:'utility:delete',
            variant:'destructive'
        }
    }
];

export default class ButtonsInLWC extends NavigationMixin(LightningElement) {
    @track data;
    @track wireResult;
    @track error;
    columns = columns;

    @wire(getAccounts)
    wiredAccounts(result) {
        this.wireResult = result;
        if (result.data) {
            this.data = result.data;
        } else if (result.error) {
            this.error = result.error;
        }
    }

    
    handleTitleChange(event) {
        this.title = event.target.value;
    }

    handleDueDateChange(event) {
        this.dueDate = event.target.value;
    }

    handleDescriptionChange(event) {
        this.description = event.target.value;
    }

    addTask() {
        createTask({ title: this.title, dueDate: this.dueDate, description: this.description })
            .then(() => {
                this.title = '';
                this.dueDate = '';
                this.description = '';
                return refreshApex(this.wireResult);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    callRowAction(event) {
        const recId = event.detail.row.Id;
        const actionName = event.detail.action.name;
        if (actionName === 'Edit') {
            this.handleAction(recId, 'edit');
            
        } else if (actionName === 'Delete') {
            this.handleDeleteRow(recId);
            eval("$A.get('e.force:refreshView').fire();");
        } else if (actionName === 'View') {
            this.handleAction(recId, 'view');
        }
    }

    handleAction(recordId, mode) {
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recordId,
                objectApiName: 'ToDoList__c',
                actionName: mode
            }
        })
    }

    handleDeleteRow(recordIdToDelete) {
        deleteRecord(recordIdToDelete)
            .then(result => {
                this.showToast('Success!!', 'Record deleted successfully!!', 'success', 'dismissable');
                return refreshApex(this.wireResult);
            }).catch(error => {
                this.error = error;
            });
    }

    showToast(title, message, variant, mode) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(evt);
    }
}  