
class Chat {
    constructor(){
        this.pubsub = new PubSub();
        // this.wind = new ClientComponent(this, this.pubsub);
        this.logInButton = null;
        this.idField = null;
        this.message = null;
        this.test = new createHtmlElements(this);
        this.createHtmlElements();
        this.arrOfClients = [];
        this.arrOfMessage = [];
        this.addZeroClient();
        this.pubsub.subscribe('send', this, this.addNewMessage);
        this.render();

    }
    addZeroClient(){
        const client = new ClientComponent(this ,this.pubsub, 'test');
        this.arrOfClients.push(client);
    }
    createHtmlElements(){
        this.logInButton = this.test.createButton('start', 'logIn');
        this.idField = this.test.createTextField('id', '');
        this.test.testMethod(this.idField)
        
        // this.message = this.test.createChatField(this.arrOfMessage);

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
    addNewMessage(data){
        if(data){
            const message = new Message(data)///////////////////////////////////////
            this.arrOfMessage.push(message);
            for(let i = 0; i < this.arrOfClients.length; i++){
                let client = this.arrOfClients[i];
                client.showMessageHistory()
            }
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
        this.messageP = null;
        this.arrOfHtmlElements = [];
        this.div = document.createElement('div');
        //this.p = document.createElement('p');
    }
    createButton(id, value){
        // this.div = document.createElement('div');
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
        // this.div = document.createElement('div');
        let field = document.createElement('input');
        field.type = 'text';
        field.id = id;
        field.value = value;
        this.textField = field;     
        
        this.div.appendChild(field)
        document.body.appendChild(this.div);
        return this.textField;
    }
    createChatField(value){
        this.div = document.createElement('p');
        let mess = document.createElement('input');
        mess.value = value;
        mess.id = 'mess';
        mess.disabled = 'disabled';
        this.messageP = mess;

        this.div.appendChild(mess)
        document.body.appendChild(this.div);
        return this.messageP;

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
        this.chat = chat
        this.pubsub = pubsub;
        this.name = name;
        this.test = new createHtmlElements();
        // this.client = client;
        this.sendButton = null;
        this.stopButton = null;
        this.textField = null;
        this.createHtmlElements();
        this.render();
    }
    createHtmlElements(){
        this.stopButton = this.test.createButton('end', 'leave the chat');

        this.sendButton = this.test.createButton('send', 'send');

        this.idField = this.test.createTextField('txt', '');
    }
    showMessageHistory(){
        for(let i = 0; i < this.chat.arrOfMessage.length; i++){
            let message = this.chat.arrOfMessage[i];
            console.log(message.data);
            this.test.createChatField('name: ' + message.data.name);
            this.test.createChatField('time: ' + message.data.date);
            this.test.createChatField('mes: ' + message.data.text)
        }
        //arrOfMessage from class Chat//
    }
    sendMessage(){
        let takeMessage = document.getElementById('txt');
        let textMessage = takeMessage.value;
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
        
        takeMessage.value = '';
        console.log('user ' + this.name, 'text :' + takeMessage.value);
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
        this.data = {
            date : data.date,
            text : data.text
        };
        console.log(this.data);
        
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







// let options = {
//     // year: 'numeric',
//     // month: 'numeric',
//     // day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric'
// }


// class Client {
//     constructor(chat, pubsub, name){
//         // this.pubsub = pubsub;
//         this.name = name;
//         this.window = new ClientComponent(chat, pubsub, this);
//         //this.online = true;
//     }
// }