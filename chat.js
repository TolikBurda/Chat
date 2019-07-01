
class Chat {
    constructor(){
        this.pubsub = new PubSub();
        this.logInButton = null;
        this.idField = null;
        this.message = null;
        this.arrOfClients = [];
        this.arrOfId = [];
        this.arrOfMessage = [];
        this.test = new createHtmlElements(this);
        this.createHtmlElements();
        this.pubsub.subscribe('send', this, this.addNewMessage);
        this.render();
    }

    createHtmlElements(){
        this.logInButton = this.test.createButton('start', 'logIn');
        this.idField = this.test.createTextField('id', '');
        this.test.testMethod(this.idField);
    }

    render(){
        this.logInButton.addEventListener('click', ()=> this.takeClientId());
    }

    takeClientId(){
        let clientId = document.getElementById('id');
        let id = clientId.value;
        console.log(id);
        this.checkNewClient(id);
        clientId.value = '';
    }

    checkNewClient(id){
        if(this.arrOfId.indexOf(id) == -1){
            this.arrOfId.push(id);
            this.addNewClient(id);
        }
    }
    
    addNewMessage(data){
        if(data){
            const message = new Message(data);
            this.arrOfMessage.push(message);
            this.pubsub.fireEvent('show', data);
        }
    }

    addNewClient(id){
        let client = new ClientComponent(this ,this.pubsub, id);
        this.arrOfClients.push(client);
    }

    deleteClient(id){
        this.test.removeButton();
        console.log('delete client method');
        //if client click button "leave the chat" del this client fron this.arrOfClient
    }
}

class createHtmlElements {
    constructor(){
        this.button = null;
        this.textField = null;
        this.messageP = null;
        this.arrOfHtmlElements = [];
        this.div = null; //document.createElement('div');
        this.p = document.createElement('p');
    }
    createButton(id, value){
        this.div = document.createElement('div');
        let buttonName = document.createElement('input');
        buttonName.type = 'button';
        buttonName.id = id;
        buttonName.value = value;
        this.button = buttonName;
        
        this.div.appendChild(buttonName);
        document.body.appendChild(this.div);
        return this.button;
    }

    createTextField(id, value){
        // this.div = document.createElement('div');
        let field = document.createElement('input');
        field.type = 'text';
        field.id = id;
        field.value = value;
        this.textField = field;     
        
        this.div.appendChild(field);
        document.body.appendChild(this.div);
        return this.textField;
    }
    createChatField(value){
        this.div = document.createElement('div');
        this.div.innerHTML = value;
        
        document.body.appendChild(this.div);
        return this.messageP;
    }

    removeButton(){
        // parentElem.removeChild(elem);
        this.div.removeChild(this.button);
    }

    testMethod(button){
        let entryField = button;
        let defaultName = 'enter your name here';
        entryField.value = defaultName;
        entryField.onfocus = ()=>{
            if (entryField.value == defaultName){
                entryField.value = '';
            }
        }
        entryField.onblur = ()=>{
            if (entryField.value == '') {
                entryField.value = defaultName;
            }
        }   
        return entryField     
    }
    
}


class ClientComponent {
    constructor(chat, pubsub, name){
        // this.id = id;
        this.chat = chat
        this.pubsub = pubsub;
        this.name = name;
        this.test = new createHtmlElements();
        this.sendButton = null;
        this.stopButton = null;
        this.textField = null;
        this.messageText = null;
        this.createHtmlElements();
        this.render();

        this.pubsub.subscribe('show', this, this.showMessageHistory);
    }
    createHtmlElements(){
        this.stopButton = this.test.createButton('end', 'leave the chat');

        this.sendButton = this.test.createButton('send', 'send');

        this.idField = this.test.createTextField('txt', '');
    }
    showMessageHistory(data){
        this.test.createChatField(data.date);
        this.test.createChatField(data.name +': ' + data.text);
    }
    sendMessage(){
        this.messageText = document.getElementById('txt');
        let textMessage = this.messageText.value;
        console.log(textMessage);

        let offsetDate = ()=> {
            let time = new Date();
            let options = {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }
            return time.toLocaleString("ru", options)
        }  
        
        this.pubsub.fireEvent('send', {name : this.name, text : textMessage, date : offsetDate()});
        
        this.messageText.value = '';
        console.log('user ' + this.name, 'text :' + this.messageText.value);
        //take text from input window, and send message to class chat
    }
    render(){
        this.sendButton.addEventListener('click', ()=> this.sendMessage())
        this.stopButton.addEventListener('click', ()=>{
            this.chat.deleteClient(this.name);//client id 
            //delClient from Chat class
        })
        //buttons like "send","leave the chat"
    }

}
class Message {
    constructor(data){
        this.messageData = {
            name : data.name,
            date : data.date,
            text : data.text
        };
    }
}

class Subscription {
    constructor(event, obj, method){
        this.event = event;
        this.obj = obj;
        this.method = method;
    }
}
class PubSub {
    constructor() {
        this.subscriptions = []
    }

    subscribe(event, obj, method) {
        var sub = new Subscription(event, obj, method);
        this.subscriptions.push(sub)
    }

    fireEvent(event, data){
        for (let i = 0; i < this.subscriptions.length; i++) {
            const sub = this.subscriptions[i];
            if (sub.event == event) {
                sub.method.call(sub.obj, data)
            }
        }
    }
}

let test = new Chat();
