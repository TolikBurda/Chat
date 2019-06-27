
class Chat {
    constructor(){
        this.pubsub = new PubSub();
        // this.wind = new ClientComponent(this, this.pubsub);
        this.logInButton = null;
        this.idField = null;
        // this.div = document.createElement('div');
        this.test = new createHtmlElements(this);
        this.createHtmlElements();
        this.arrOfClients = [];
        this.arrOfMessage = [];
        this.addZeroClient();
        this.pubsub.subscribe('send', this, this.addNewMessage);
        this.render();

    }
    addZeroClient(){
        let client = new ClientComponent(this ,this.pubsub, 'test');
        this.arrOfClients.push(client);
    }
    createHtmlElements(){
        this.logInButton = this.test.createButton('start', 'logIn');
        this.idField = this.test.createTextField('id', '');
        this.test.testMethod(this.idField)
        // let arrOfHtmlElements = [];
        
        // let div = document.createElement('div');

        // let logIn = document.createElement('input');
        // logIn.type = 'button';
        // logIn.id = 'logIn';
        // logIn.value = 'logIn';
        // this.logInButton = logIn;

        // let entryField = document.createElement('input');
        // entryField.type = 'input';
        // entryField.id = 'id';
        // let defaultName = 'enter your name here'
        // entryField.value = defaultName;
        // entryField.onfocus = ()=>{
        //     if (entryField.value == defaultName){
        //         entryField.value=''
        //     }
        // }
        // entryField.onblur = ()=>{
        //     if (entryField.value == '') {
        //         entryField.value = defaultName
        //     }
        // }
        // this.idField = entryField;
      
        // arrOfHtmlElements.push(logIn);
        // arrOfHtmlElements.push(entryField);

        // for(let n = 0; n < arrOfHtmlElements.length; n++){
        //     div.appendChild(arrOfHtmlElements[n])
        // }
        // document.body.appendChild(div);
    }

    render(){
        this.logInButton.addEventListener('click', ()=> this.takeClientId());
    }
    takeClientId(){
        console.log('1');
        
        let takeClientId = document.getElementById('id');
        let id = takeClientId.value;
        this.checkNewClient(id);
        takeClientId.value = '';
    }
    checkNewClient(id){
        console.log('cheking');

        for(let i = 0; i < this.arrOfClients.length; i++){
            let client = this.arrOfClients[i];
            if(id == client.name){
                console.error('error'); 
            }else{
                this.addNewClient(id);
            }
        }
        console.log(id, this.arrOfClients);
        

    }
    addNewClient(id){
        let client = new ClientComponent(this ,this.pubsub, id);
        this.arrOfClients.push(client);
    }
    addNewMessage(text){
        if(text){
            const message = new Message(text, 10)
            this.arrOfMessage.push(message);
            console.log(this.addNewMessage.length);
        }
        
    }
    deleteClient(id){
        console.log('delete client method');
        
        this.arrOfClients.splice(id)
        //if client click button "leave the chat" del this client fron this.arrOfClient
    }
}

class createHtmlElements {
    constructor(chat){
       // this.chat = chat;
        this.button = null;
        this.textField = null;
        this.arrOfHtmlElements = [];
        this.div = document.createElement('div');
    }
    createButton(id, value){
        this.div = document.createElement('div');
        let buttonName = document.createElement('input');
        buttonName.type = 'button';
        buttonName.id = id;
        buttonName.value = value;
        this.button = buttonName;
        
        
        this.div.appendChild(buttonName)
        document.body.appendChild(this.div);
        return this.button;
    }

    createTextField(id, value){
        this.div = document.createElement('div');
        let field = document.createElement('input');
        field.type = 'text';
        field.id = id;
        field.value = value;
        this.textField = field;     
        
        this.div.appendChild(field)
        document.body.appendChild(this.div);
        return this.textField;
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

// class Client {
//     constructor(chat, pubsub, name){
//         // this.pubsub = pubsub;
//         this.name = name;
//         this.window = new ClientComponent(chat, pubsub, this);
//         //this.online = true;
//     }
// }

class ClientComponent {
    constructor(chat, pubsub, name){
        this.chat = chat
        this.pubsub = pubsub;
        this.name = name;
        // this.client = client;
        this.sendButton = null;
        this.stopButton = null;
        this.textField = null;
        this.createHtmlElements();
        this.render();
    }
    createHtmlElements(){
        let arrOfHtmlElements = [];
        
        let div = document.createElement('div');

        let sendMessage = document.createElement('input');
        sendMessage.type = 'button';
        sendMessage.id = 'send';
        sendMessage.value = 'send';
        this.sendButton = sendMessage;

        let endChat = document.createElement('input');
        endChat.type = 'button';
        endChat.id = 'end';
        endChat.value = 'leave the chat';
        this.stopButton = endChat;

        let entryField = document.createElement('input');
        entryField.type = 'text';
        entryField.id = 'txt';
        entryField.value = '';
        this.textField = entryField;     
        
        arrOfHtmlElements.push(sendMessage);
        arrOfHtmlElements.push(endChat);
        arrOfHtmlElements.push(entryField);

        for(let n = 0; n < arrOfHtmlElements.length; n++){
            div.appendChild(arrOfHtmlElements[n])
        }
        document.body.appendChild(div);
    }
    showMessageHistory(){
        //arrOfMessage from class Chat//
    }
    sendMessage(){
        // console.log('button is pressed');
        let takeMessage = document.getElementById('txt');
        
        takeMessage.value;
        console.log(takeMessage.value);
        
        this.pubsub.fireEvent('send', takeMessage.value);
        
        takeMessage.value = '';
        console.log('user ' + this.name, 'text a' + takeMessage.value);
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
    constructor(text, date){
        this.data = {
            date : date,
            text : text
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
