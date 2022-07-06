var messageApi = Vue.resource('/messagess{/id}');

const NotFound = { template: '<p>Страница не найдена</p>' }
const Home = { template: 'hello.html    ' }
const About = { template: '<p>о нас</p>' }

const routes = {
    '/': Home,
    '/about': About
}

Vue.component('message-form', {
    props:['messages'],
    data: function (){
        return {
            text: ''
        }
    },
    template:
        '<div>' +
            '<input type="text" placeholder="Введите сообщение" v-model="text"/>' +
            '<input type="button" value="Save" @click="save" class="btn btn-primary"/>' +
        '</div>',
    methods: {
        save: function (){
            var message = { text: this.text }
            messageApi.save({}, message).then(result =>
                result.json().then(data => {
                    this.messages.push(data)
                    this.text=''
                })
            )
        }
    }
})

Vue.component('message-row', {
    props: ['message'],
    template: '<div> <i>({{message.id}})</i>{{ message.text }}</div>'
});

Vue.component('messages-list', {
    props: ['messages'],
    template: '<div>' +
        '<message-form :messages="messages"></message-form>' +
        '<message-row v-for="message in messages" :key="message.id" :message="message"/>' +
        '</div>',
    created: function () {
        messageApi.get().then(result =>
            result.json().then(data =>
                data.forEach(message => this.messages.push(message))
            )
        )
    }
});

var app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages"/>',
    data: {
        messages: [ ]
    }
});