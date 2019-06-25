
class Chat {
    constructor(){
        this.pubsub = new PubSub();
        // this.wind = new ClientComponent(this, this.pubsub);
        this.logInButton = null;
        this.idField = null;
        this.createHtmlElements();
        this.arrOfClients = [];
        this.arrOfMessage = [];
        this.pubsub.subscribe('send', this, this.addNewMessage);
        this.render();
    }
    createHtmlElements(){
        let arrOfHtmlElements = [];
        
        let div = document.createElement('div');

        let logIn = document.createElement('input');
        logIn.type = 'button';
        logIn.id = 'logIn';
        logIn.value = 'logIn';
        this.logInButton = logIn;

        let entryField = document.createElement('input');
        entryField.type = 'text';
        entryField.id = 'id';
        entryField.value = '';
        this.idField = entryField;
    
        
        arrOfHtmlElements.push(logIn);
        arrOfHtmlElements.push(entryField);

        for(let n = 0; n < arrOfHtmlElements.length; n++){
            div.appendChild(arrOfHtmlElements[n])
        }
        document.body.appendChild(div);
    }
    render(){
        this.logInButton.addEventListener('click', ()=> this.checkNewClient());
    }
    checkNewClient(){
        console.log('1');
        
        // let takeClientId = document.getElementById('id');
        // let id = takeClientId.value

    }
    addNewClient(id){
        let client = new Client(this ,this.pubsub, id);
        this.arrOfClients.push(client);
    }
    addNewMessage(data){
        let message = data;
        this.arrOfMessage.push(message);
        console.log(this.addNewMessage.length);
        
    }
    deleteClient(){
 
        //if client click button "leave the chat" del this client fron this.arrOfClient
    }

}

class Client {
    constructor(chat, pubsub, name){
        // this.pubsub = pubsub;
        this.name = name;
        this.window = new ClientComponent(chat, pubsub);
        //this.online = true;
    }


}

class ClientComponent {
    constructor(chat, pubsub){
        this.chat = chat
        this.pubsub = pubsub;
        // this.canvas = null;
        this.sendButton = null;
        this.stopButton = null;
        this.textField = null;
        this.createHtmlElements();
        // this.ctx = this.canvas.getContext('2d');
        this.fieldWidth = 400;
        this.fieldHeight = 400;
        this.cellSize = 20;
        this.render();
        // this.canvas.width = (this.fieldWidth);
        // this.canvas.height = (this.fieldHeight); 
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
        
        this.pubsub.fireEvent('send', takeMessage.value)
        
        takeMessage.value = '';
        console.log(takeMessage.value);
        //take text from input window, and send message to class chat
    }
    render(){
        this.sendButton.addEventListener('click', ()=> this.sendMessage())
        this.stopButton.addEventListener('click', ()=>{
            this.chat.deleteClient();//client id 
            //delClient from Chat class
        })
        //buttons like "send","leave the chat"
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
            //console.log(this.subscriptions);
            if (sub.event == event) {
                //console.log(sub.obj, data, sub.method);
                sub.method.call(sub.obj, data)
                
            }
        }
    }
}
let test = new Chat();

class Message{
    constructor(text){

    }
}
class HtmlElements{
    constructor(){
        this.pubsub.fireEvent('shot', {data})
        this.pubsub.subscribe('shot', this, this.createShells)
    }
}



