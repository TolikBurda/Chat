

class Chat {
    constructor(){
        this.pubsub = new PubSub();
        this.logInButton = null;
        this.closeAppButton = null;
        this.idField = null;
        this.element = document.createElement('div');
        this.arrOfClients = [];
        this.arrOfMessage = [];
        this.clientId = null;
        this.template = _.template(
            '<div class="regConteiner">' + 
                '<input type="text" id="LogIn_field">' +
                '<button id="LogIn_button">LogIn</button>' +
                '<button id="close_application">Close application</button>' + 
                '<div class="clients" >' +
            '</div>'
        );
        this.pubsub.subscribe('send', this, this.addNewMessage);
        this.pubsub.subscribe('delClient', this, this.delClient);
        this.pubsub.subscribe('delMessage', this, this.delMessage);
        if(localStorage['clients']){
            this.load();
        }else{ 
            this.render();
        }
 
        // const clients = this.load();
        // for(let client of clients){
        //     this.addNewClient(client.name, client.regTime, client.history);
        // }
    }

    getButton(){
        this.logInButton = document.getElementById('LogIn_button');
        this.closeAppButton = document.getElementById('close_application');
    }
    
    save(){
        const clients = this.arrOfClients.map(client => { 
            return {
                name: client.name,
                regTime: client.regTime,
                history: client.history
            }      
        });
        
        localStorage.setItem('clients', JSON.stringify(clients));

    }
    load(){
        let storage = ()=>{
            const clients = JSON.parse(localStorage.getItem('clients'))
            console.log(clients + '!!!!');
            return clients
        }
        

        const clients = storage();
        for(let client of clients){
            this.addNewClient(client.name, client.regTime, client.history);
        }
        
    }

    render(){
        this.element.innerHTML = this.template({clients: this.arrOfClients})
        
        this.arrOfClients.forEach(client => {
            this.element.appendChild(client.element)
        });

        document.body.appendChild(this.element);
        this.getButton();
        this.logInButton.addEventListener('click', ()=> this.takeClientId());
        this.closeAppButton.addEventListener('click', ()=> this.closeApp());


        this.save();
        console.log('&');
    }

    takeClientId(){
        this.clientId = document.getElementById('LogIn_field');
        let id = this.clientId.value;
        this.checkNewClient(id);
    }

    checkNewClient(id){
        if(this.arrOfClients.find(client => client.name === id)){
            console.error('this user already been registered');
        }else{
            this.addNewClient(id);
        }
    }

    addNewClient(id, regTime, history){
        let client = new ClientComponent(this.pubsub, id, regTime, history);
        this.arrOfClients.push(client);
        this.render();

        if(this.clientId){
            this.clientId.value = '';
        }
        
    }

    addNewMessage(data){
        if(data){
            const message = new Message(data);
            this.arrOfMessage.push(message);
        
            this.pubsub.fireEvent('show', message);
            this.render();
        }
    }

    delMessage(data){
        let messageToDel = this.arrOfMessage.findIndex(messages => messages.name === data.name);
        console.log(messageToDel);
        
    }
    delClient(data){
        let clientToDel = this.arrOfClients.findIndex(clients => clients.name === data.name);
        
        this.arrOfClients.splice(clientToDel, 1);
    
        this.render();
    }

    closeApp(){
        this.arrOfClients = [];
        this.arrOfMessage = [];
        localStorage.clear();
        this.render()
    }
}


class ClientComponent {
    constructor(pubsub, name, regTime, history){
        this.element = document.createElement('div');
        this.pubsub = pubsub;
        this.name = name;
        this.regTime = regTime || this.getDate();
        this.history = history || [];
        this.template = _.template(
            '<div class="clientsConteiner">' + 
               '<div>' + 
                    '<%= name %>' +
                    '<button class="exit">exit</button>' + 
                '</div>' + 
                '<div class="message_box">' + 
                    '<input type="text" class="textField">' +
                    '<button class="send">send</button>' + 
                    '<div class="history">' + 
                        '<% _.forEach(history, function(msg) { %>' + 
                            '<p>' +
                                'user <%= msg.name %> wrote "<%= msg.text %>" at <%= msg.date %>' +
                                '<button class="del">del</button>' +
                            '</p> <% }); %>' + 
                    '</div>' +
                '</div>' +
            '</div>'
        );
        this.sendButton = null;
        this.stopButton = null;
        this.textField = null;
        this.delMessageButton = null;
        this.pubsub.subscribe('show', this, this.showMessageHistory);
        this.render();
    }

    render(){
        this.element.innerHTML = this.template({name: this.name, history: this.history})

        this.getButtons();
        this.textField.addEventListener('keypress', (e)=> {
            if(e.keyCode == 13){
                this.sendMessage()
            }    
        });
        this.sendButton.addEventListener('click', ()=> this.sendMessage());
        this.stopButton.addEventListener('click', ()=> this.removeClient());
    }

    getButtons(){
        this.stopButton = this.element.getElementsByClassName("exit")[0];

        this.sendButton = this.element.getElementsByClassName("send")[0];
        
        this.textField = this.element.getElementsByClassName("textField")[0];

        // this.delMessageButton = this.element.getElementsByClassName("del")[0];   
    }

    showMessageHistory(data){
        this.history.push(data);
        this.render(); 
    }

    getDate(){
        let offsetDate = ()=> {
            let time = new Date();
            let options = {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric'
            }
            return time.toLocaleString("ru", options)
        }
        return offsetDate();
    }

    sendMessage(){
        let message = this.textField.value;

        this.pubsub.fireEvent('send', {name : this.name, text : message, date : this.getDate()});
        this.textField.value = '';
    }
    removeMessage(){
        this.pubsub.fireEvent('delMessage', {name : this.name})
    }
    removeClient(){
        this.pubsub.fireEvent('delClient', {name : this.name})
    }
}

class Message {
    constructor(data){
        this.name = data.name;
        this.text = data.text;
        this.date = data.date;
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
