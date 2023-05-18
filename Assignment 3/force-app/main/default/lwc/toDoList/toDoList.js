import { LightningElement, wire, track } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import getTasks from '@salesforce/apex/ToDoController.getTasks';
import createTask from '@salesforce/apex/ToDoController.createTask';
import deleteTask from '@salesforce/apex/ToDoController.deleteTask';
import updateTask from '@salesforce/apex/ToDoController.updateTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ToDoList extends LightningElement {
    title = '';
    dueDate = '';
    description = '';
    @track tasks;
    wiredTasksResult;
    @track showModal = false;
    @track editedTitle;
    @track editedDueDate;
    @track editedDescription;


    @wire(getTasks)
    wiredTasks(result) {
        this.wiredTasksResult = result;
        const { data, error } = result;
        if (data) {
            this.tasks = data;
        } else if (error) {
            console.error(error);
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
                return refreshApex(this.wiredTasksResult);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    deleteTask(event) {
        const taskId = event.target.dataset.taskId;
        const confirmation = confirm('Are you sure you want to delete this task?');

        if (confirmation) {
            deleteTask({ taskId: taskId })
                .then(() => {
                    return refreshApex(this.wiredTasksResult);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    editTask(event) {
        this.showModal = true;
        this.editedTaskId = event.target.dataset.taskId;
    }

    // Function to handle the changes in the edit form fields
    handleEditedTitleChange(event) {
        this.editedTitle = event.target.value;
    }

    handleEditedDueDateChange(event) {
        this.editedDueDate = event.target.value;
        console.log(this.editedDueDate);
    }

    handleEditedDescriptionChange(event) {
        this.editedDescription = event.target.value;
    }

    saveTask() {
        // console.log(this.editedTaskId);
        updateTask({ taskId: this.editedTaskId, title: this.editedTitle, dueDate: this.editedDueDate, description: this.editedDescription })
            .then(result => {
                const event = new ShowToastEvent({
                    title: 'Success',
                    message: `Task "${this.title}" was updated.`,
                    variant: 'success'
                })
                this.dispatchEvent(event);
                this.showModal = false;
                return refreshApex(this.wiredTasksResult);
            }).catch(error => {
                console.log(error)
            })
    }

    cancelEdit() {
        this.editedTaskId = '';
        this.editedTitle = '';
        this.editedDueDate = '';
        this.editedDescription = '';

        this.showModal = false;
    }


}
