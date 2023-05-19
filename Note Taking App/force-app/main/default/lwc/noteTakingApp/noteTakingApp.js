import { LightningElement } from 'lwc';

const DEFAULT_NOTE_FORM = {
    Name: "",
    Note_Description__c: ""

}

export default class NoteTakingApp extends LightningElement {
    showModal = false;
    noteRecord = DEFAULT_NOTE_FORM;
    formats = [
        'font',
        'size',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'indent',
        'align',
        'link',
        'clean',
        'table',
        'header',
        'color',
    ];

    createNoteHandler(){
        this.showModal = true;
    }

    changeHandler(event){
        // const name = event.target.name;
        // const value = event.target.value;
        const {name, value} = event.target;
        this.noteRecord = {...this.noteRecord, [name]: value}
    }
}