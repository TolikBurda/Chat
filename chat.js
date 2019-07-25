
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
        // super();
        this.pubsub = new PubSub();
        this.logInButton = null;
        this.idField = null;
        this.element = document.createElement('div');
        this.arrOfClients = [];
        this.arrOfMessage = [];
        this.clientId = null;
        this.template = _.template(
            '<div class="regConteiner">' + 
                '<input type="text" id="LogIn_field">' +
                '<button id="LogIn_button">LogIn</button>' + 
                '<div class="clients" >' +
            '</div>'
        );
        this.pubsub.subscribe('send', this, this.addNewMessage);
        this.render();
    }

    getButton(){
        this.logInButton = document.getElementById('LogIn_button');
    }

    render(){
        this.element.innerHTML = this.template({clients: this.arrOfClients})
        
        this.arrOfClients.forEach(client => {
            this.element.appendChild(client.element)
        });

        document.body.appendChild(this.element);
        this.getButton();
        this.logInButton.addEventListener('click', ()=> this.takeClientId());

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

    addNewClient(id){
        let client = new ClientComponent(this.pubsub, id);
        this.arrOfClients.push(client);
        this.clientId.value = '';
        this.render();
    }

    addNewMessage(data){
        if(data){
            const message = new Message(data);
            this.arrOfMessage.push(message);
        
            this.pubsub.fireEvent('show', message);
        }
    }

    deleteClient(id){
        this.test.removeButton();
        console.log('delete client method');
        ///    remove buttons from own instance

        //if client click button "leave the chat" del this client fron this.arrOfClient
    }
}

class ClientComponent {
    constructor(pubsub, name){
        // super();
        this.element = document.createElement('div');
        this.pubsub = pubsub;
        this.name = name;
        this.history = [];
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
                            '</p> <% }); %>' + 
                    '</div>' +
                '</div>' +
            '</div>'
        );
        this.sendButton = null;
        this.stopButton = null;
        this.textField = null;
        this.pubsub.subscribe('show', this, this.showMessageHistory);
        this.render();
    }

    render(){
        this.element.innerHTML = this.template({name: this.name, history: this.history})

        this.getButtons();
        this.sendButton.addEventListener('click', ()=> this.sendMessage());
        //buttons like "send","leave the chat"
    }

    getButtons(){
        this.stopButton = this.element.getElementsByClassName("exit")[0];

        this.sendButton = this.element.getElementsByClassName("send")[0];
        
        this.textField = this.element.getElementsByClassName("textField")[0];
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
