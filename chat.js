
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
        this.test.createClientHtml(this.name);
        
        this.stopButton = document.getElementById('end');

        this.sendButton = document.getElementById('send');
        
        // this.textField = document.getElementById();//////////////////last changes here 
    }

    showMessageHistory(data){
        let test = this.test.createHistoryOfMessage(data);
    }
    sendMessage(){
        let textMessage = document.getElementById(this.name);
        let message = textMessage.value;

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
        textMessage.value = '';
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

class Template {
    constructor(){
        this.mainConteiner = document.createElement('div');
        this.mainConteiner.id = 'mainConteiner';
        // document.body.appendChild(this.mainConteiner);

        this.regConteiner = document.createElement('div');
        this.regConteiner.class = 'regConteiner';
        // this.mainConteiner.appendChild(this.regConteiner);

        this.clientsConteiner = document.createElement('div');
        this.clientsConteiner.class = 'clientsConteiner';
        // this.mainConteiner.appendChild(this.clientsConteiner);
    }

    createRegHtml(){
        let t = _.template(
            '<div class="regConteiner">' + 
                '<input type="text" id="LogIn_field">' +
                '<button id="LogIn_button">LogIn</button>' + 
            '</div>'
        );

        this.regConteiner.innerHTML = t();
        // this.mainConteiner.appendChild(this.regConteiner);

        let glo = document.getElementById('Global');//////////////////
        glo.appendChild(this.regConteiner);
        // document.body.appendChild(this.mainConteiner);
        // document.body.innerHTML += t()//////////make the conteiner and add this shit to conteiner
    }

    createClientHtml(name){
        let t = _.template(
            '<div class="clientsConteiner" id = "this_one" >' + 
               '<div id="end">' + 
                    '<%= name %>' +
                    '<button id="exit">exit</button>' + 
                '</div>' + 
                '<div class="message_box">' + 
                    '<input type="text" id=<%= name %>>' +
                    '<button id="send">send</button>' + 
                '</div>' +
            '</div>'
        );
        
        this.clientsConteiner.innerHTML = t({name});
        console.log({name}, name);
        
        this.mainConteiner.appendChild(this.clientsConteiner);

        let glo = document.getElementById('Global');/////////////////
        glo.appendChild(this.mainConteiner);
        // document.body.appendChild(this.mainConteiner);
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

        let glo = document.getElementById('Global');/////////////////////
        glo.appendChild(this.mainConteiner);
        // document.body.appendChild(this.mainConteiner);
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
