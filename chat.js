
class Component {
    constructor(){
        this.element = null;
    }
    render() {
        
    }
}

class SomeClient extends Component {
    constructor(name){
        super();
        this.name = name;
    }
    render() {
        var text = document.createElement('div');
        text.innerHTML = this.name;
        this.element = text;
    }
}

class SomeChat extends Component {
    constructor(){
        super();
        this.clients = [];
    }

    addClient(name){
        this.clients.push(new SomeClient(name));
    }

    render() {
        var wrapper = document.createElement('div');
        this.clients.forEach(client => {
            client.render();
            wrapper.appendChild(client.element);
        })
        this.element = wrapper;
    }
}

// var testChat = new SomeChat();
// testChat.addClient('test1');
// testChat.addClient('test2');
// testChat.render();
// console.log(testChat.element);



class Chat {
    constructor(){
        this.pubsub = new PubSub();
        this.logInButton = null;
        this.idField = null;
        this.arrOfClients = [];///return checking by id of client. delete arrOfId. forEach();
        this.arrOfId = [];
        this.arrOfMessage = [];
        this.clientId = null;
        this.test = new Template();
        this.createHtmlElements();
        this.pubsub.subscribe('send', this, this.addNewMessage);
        this.render();
    }

    createHtmlElements(){
        this.test.createRegHtml();
        this.logInButton = document.getElementById('LogIn_button');
        // setTimeout(this.createHtmlElements(),3000);
    }

    render(){
        this.logInButton.addEventListener('click', ()=> this.takeClientId());
    }

    takeClientId(){
        this.clientId = document.getElementById('LogIn_field');
        let id = this.clientId.value;
        this.checkNewClient(id);
       
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
        
            this.pubsub.fireEvent('show', message);
        }
    }

    addNewClient(id){
        let client = new ClientComponent(this ,this.pubsub, id);
        this.arrOfClients.push(client);
        this.clientId.value = '';
    }

    deleteClient(id){
        this.test.removeButton();
        console.log('delete client method');
        ///    remove buttons from own instance

        //if client click button "leave the chat" del this client fron this.arrOfClient
    }
}

class ClientComponent {
    constructor(chat, pubsub, name){
        // this.id = id;
        this.element = null
        this.chat = chat
        this.pubsub = pubsub;
        this.name = name;
        this.test = new Template();
        this.sendButton = null;
        this.stopButton = null;
        this.textField = null;

        this.createHtmlElements();
        this.pubsub.subscribe('show', this, this.showMessageHistory);
        this.render();
    }
    createHtmlElements(){
        
        this.element = this.test.createClientHtml(this.name);
        
        this.stopButton = this.element.getElementsByClassName("end")[0];

        this.sendButton = this.element.getElementsByClassName("send")[0];
        
        this.textField = this.element.getElementsByClassName("textField")[0];
        // this.textField = document.getElementById();//////////////////last changes here 
    }

    showMessageHistory(data){
        let test = this.test.createHistoryOfMessage(data);
    }
    sendMessage(){
        
        let message = this.textField.value;

        let offsetDate = ()=> {
            let time = new Date();
            let options = {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }
            return time.toLocaleString("ru", options)
        }  
        
        this.pubsub.fireEvent('send', {name : this.name, text : message, date : offsetDate()});
        this.textField.value = '';
        //take text from input window, and send message to class chat
    }
    render(){
        this.sendButton.addEventListener('click', ()=> this.sendMessage())
        this.stopButton.addEventListener('click', ()=>{
            // this.chat.deleteClient(this.name);//client id 
            //delClient from Chat class
        })
        //buttons like "send","leave the chat"
    }

}

class Message {
    constructor(data){
        this.messageData = {
            name : data.name, 
            arrOfData : [{
                name : data.name,
                date : data.date,
                text : data.text
            }]
        };
    }
}

class UserTemplate{
    constructor(){

    }
}


class Template {
    constructor(){
        this.mainConteiner = document.createElement('div');
        this.mainConteiner.id = 'mainConteiner';

        this.regConteiner = document.createElement('div');
        this.regConteiner.class = 'regConteiner';

        this.clientsConteiner = document.createElement('div');
        this.clientsConteiner.class = 'clientsConteiner';
    }

    createRegHtml(){
        let t = _.template(
            '<div class="regConteiner">' + 
                '<input type="text" id="LogIn_field">' +
                '<button id="LogIn_button">LogIn</button>' + 
            '</div>'
        );

        this.regConteiner.innerHTML = t();

        let globalConteiner = document.getElementById('global');
        globalConteiner.appendChild(this.regConteiner);
    }

    createClientHtml(name){
        let t = _.template(
            '<div class="clientsConteiner" id = "<%= name %>" >' + 
               '<div>' + 
                    '<%= name %>' +
                    '<button class="exit">exit</button>' + 
                '</div>' + 
                '<div class="message_box">' + 
                    '<input type="text" class="textField">' +
                    '<button class="send">send</button>' + 
                '</div>' +
            '</div>'
        );
        
        this.clientsConteiner.innerHTML = t({name});
        console.log({name}, name);
        
        this.mainConteiner.appendChild(this.clientsConteiner);///////remove mein conteiner or client conteiner

        let globalConteiner = document.getElementById('global');
        globalConteiner.appendChild(this.mainConteiner);

        return this.clientsConteiner
    }
    
    createHistoryOfMessage(userData){
        let history = document.createElement('div');
        let t = _.template(
            '<ul class="history">' + 
                '<% _.forEach(messageData.arrOfData, function(msg) { %>' + 
                    '<p>' +
                        'user <%= msg.name %> wrote "<%= msg.text %>" at <%= msg.date %>' +
                    '</p> <% }); %>' + 
            '</ul>'
        );

        history.innerHTML = t(userData);
        this.clientsConteiner.appendChild(history)
        this.mainConteiner.appendChild(this.clientsConteiner);

        let globalConteiner = document.getElementById('global');
        globalConteiner.appendChild(this.mainConteiner);
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
        this.subscriptions = [];
    }

    subscribe(event, obj, method) {
        var sub = new Subscription(event, obj, method);
        this.subscriptions.push(sub);
    }

    fireEvent(event, data){
        for (let i = 0; i < this.subscriptions.length; i++) {
            const sub = this.subscriptions[i];
            if (sub.event == event) {
                sub.method.call(sub.obj, data);
            }
        }
    }
}

let test = new Chat();
