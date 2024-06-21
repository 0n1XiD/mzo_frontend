<template>
    <div class="chat-page">
        <div class="_container">
            <div class="chat">
                <div class="all-clients" :class="{'all-clients_open': !chatOppened, 'all-clients_hide': chatOppened}">
                    <div class="all-clients__search">
                        <InputFields
                            searchInput 
                            v-model="search"
                            :placeholder="$t('trainerChat.searchPlaceholder')"
                            class="search"
                        />
                    </div>
                    <div class="all-clients__messages">
                        <div class="chat__small-title">{{$t('trainerChat.title')}}</div>
                        <div
                            class="all-clients__message-item"
                            :class="{'all-clients__message-item_active': index == chat_active_index}"
                            v-for="(chat, index) in chats"
                            :key="`chat-${chat.id}`"
                            @click="openChat(chat.id, index)"
                        >
                            <div class="client-icon">
                                {{chat.chat_user.first_name.charAt(0)}}
                            </div>
                            <div class="row">
                                <div class="date-name-row">
                                    <div class="name"> {{ chat.chat_user.first_name }} {{ chat.chat_user.last_name }}</div>
                                    <div class="time" v-if="chat.last_message.timestamp">
                                        {{  new Date(chat.last_message.timestamp).toLocaleTimeString('ru-RU', {
                                                hour: '2-digit', 
                                                minute: '2-digit',
                                            }) 
                                        }}
                                    </div>
                                </div>
                                <div class="date-name-row">
                                    <div class="message-content" v-if="chat.last_message.content">{{ chat.last_message.content.substring(0, 28) }}<span v-if="chat.last_message.content.length > 28">...</span></div>
                                    <div class="message-content" v-else>{{$t('trainerChat.messageContent')}}</div>
                                    <div class="new-messages-count" v-if="chat.new_messages_count">{{chat.new_messages_count}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="chat-body">
                    <div class="chat-body__info">
                        <div class="col" v-if="chatOppened">
                            <div class="disconnect" @click="disconnect()">
                                <img src="@/assets/img/svg/back_white.svg" alt="back_white">
                            </div>
                            <div class="client">
                                <div class="client-icon">
                                    {{current_chat.first_name.charAt(0)}}
                                </div>
                                <div class="name">{{ current_chat.first_name }} {{ current_chat.last_name }}</div>
                            </div>
                        </div>
                        <div class="search" v-if="chatOppened">
                            <img width="20" height="20" src="@/assets/img/svg/search_white.svg" alt="search_white">
                        </div>
                    </div>
                    <div class="chat-body__board">
                        <ul class="chat-log" ref="chatLog">
                            <li 
                                v-for="message in current_chat.messages"
                                :key="`message-${message.id}`"
                                class="chat-log__message"
                                :class="{'sent': message.author === userInfo.email, 'replies': message.author != userInfo.email}"
                            >
                                <div class="message-content">
                                    {{ message.content }}
                                </div>
                                <div class="message-time">
                                    {{  new Date(message.timestamp).toLocaleTimeString('ru-RU', {
                                            hour: '2-digit', 
                                            minute: '2-digit',
                                        }) 
                                    }}
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="chat-body__panel">
                        <img class="smiles img-icon" src="@/assets/img/svg/smile_white.svg" alt="smile_white">
                        <img class="add-file img-icon" src="@/assets/img/svg/add_file_white.svg" alt="add_file_white">
                        <InputFields
                            @keyup.enter="addMessage()"
                            @input="ie($event)"
                            darkInput 
                            v-model="message"
                            :placeholder="$t('trainerChat.placeholder')"
                            class="message"
                        />
                        <Btn @click="addMessage()" class="send" sendBtn :class="{'send_hidden': !message}"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import WebSocketInstance from '@/plugins/websocket';

export default {
    data: () => ({
        search: null,
        message: null,
        current_chat: {
            id: 1,
            first_name: 'Алиса', 
            last_name: 'Купер',
            messages: [],
        },
        chatOppened: false,
        chat_active_index: null
    }),
    async asyncData({ $axios, store, error, route }){
        try{
            let userInfo = store.state.userInfo
            let token = store.state.userInfo.token
            let startCount = 0
            let endCount = 10
            let countStep = 10
            let chats = await $axios.$get(`/api/v1/chat/?email=${userInfo.email}`, {
                headers: { 'Authorization': `Token ${token}` }
            })
            console.log(chats)
            let current_chat_id = route.query.room
            return { userInfo, chats, current_chat_id, token, startCount, endCount, countStep }
        } catch (e) {
            error({ statusCode: 404, message: 'Страница не найдена' })
        }
    },
    mounted() {
        this.initialiseChat()
        if(this.$route.query.room){
            const active_chat = this.chats.filter(chat => chat.id == this.$route.query.room);
            const find_active_chat_index = (element) => element == active_chat[0];
            this.current_chat.id = active_chat[0].chat_user.id
            this.current_chat.first_name = active_chat[0].chat_user.first_name 
            this.current_chat.last_name = active_chat[0].chat_user.last_name 
            this.chat_active_index = this.chats.findIndex(find_active_chat_index)
            this.chatOppened = true
        }
    },
    watch: {
        '$route.query'() {
            if(this.$route.query.room){
                if (this.current_chat_id != this.$route.query.room){
                    WebSocketInstance.disconnect();
                    this.waitForSocketConnection(() => {
                        WebSocketInstance.fetchMessages(
                            this.userInfo.email,
                            this.$route.query.room
                        );
                    });
                    WebSocketInstance.connect(this.$route.query.room, this.userInfo.email)
                }
                this.current_chat_id = this.$route.query.room
            }
        }
    },
    methods: {
        waitForSocketConnection(callback){
            const component = this;
            setTimeout(function(){
                if(WebSocketInstance.state() === 1) {
                    callback();
                    return;
                } else {
                    component.waitForSocketConnection(callback);
                }
            }, 100);
        },
        addMessage() {
            if(this.message){
                const messageObject = {
                    from: this.userInfo.email,
                    content: this.message,
                    chatId: this.$route.query.room,
                    current_user: this.userInfo.email
                }
                WebSocketInstance.newChatMessage(messageObject);
                WebSocketInstance.fetchMessages(
                    this.userInfo.email,
                    this.$route.query.room
                );
                this.message = null
            }
        },
        setMessages(messages) {
            this.current_chat.messages = messages
            setTimeout(() => {
                this.scrollToBottom()
            }, 100);
        },
        appendMessages(message) {
            if(message.id != this.current_chat.messages[this.current_chat.messages.length - 1].id){
                this.current_chat.messages.push(message)
            }
        },
        initialiseChat(){
            this.waitForSocketConnection(() => {
                WebSocketInstance.addCallbacks(
                    this.addMessage.bind(this),
                    this.setMessages.bind(this),
                    this.appendMessages.bind(this)
                );
                if(this.$route.query.room){
                    WebSocketInstance.fetchMessages(
                        this.userInfo.email,
                        this.$route.query.room
                    );
                }
            });
            if(this.$route.query.room){
                WebSocketInstance.connect(this.$route.query.room, this.userInfo.email)
            }
        },
        disconnect(){
            WebSocketInstance.disconnect();
            this.chatOppened = false
            this.current_chat.messages = []
        },
        scrollToBottom() {
            this.$refs.chatLog.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
        },
        openChat(id, index){
            this.$router.push(this.localePath(`?room=${id}`))
            this.chatOppened = true
            this.current_chat.id = this.chats[index].chat_user.id
            this.current_chat.first_name = this.chats[index].chat_user.first_name 
            this.current_chat.last_name = this.chats[index].chat_user.last_name 
            this.chat_active_index = index
        },
        ie(e){
            // console.log(e)
        }
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`),
        InputFields: () => import(`@/components/controls/Input-fields.vue`),
    }
}
</script>

<style lang="scss" scoped>
.chat{
    position: relative;
    overflow: hidden;
    padding-bottom: 0;
    display: flex;
    height: 88vh;
    border: 1px solid #4e4f54;
    border-radius: 15px;
    background: #1c1d22;
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
    color: white;
    &__small-title{
        margin-left: 15px;
        margin-right: 15px;
        margin-bottom: 10px;
    }
    .client-icon{
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 24px;
        font-weight: 600;
        margin-right: 10px;
        color: $blue;
        min-width: 45px;
        max-width: 45px;
        height: 45px;
        border-radius: 100%;
        background: $gray;
    }
}

.all-clients{
    overflow-y: scroll;
    height: 100%;
    width: 270px;
    min-width: 270px;
    border-right: 2px solid #4e4f54;
    background: #1c1d22;
    z-index: 10;
    &::-webkit-scrollbar {
        display: none;
    }
    &__search{
        padding: 15px 15px 0 15px;
        margin-bottom: 15px;
    }
    &__message-item{
        overflow: hidden;
        display: flex;
        cursor: pointer;
        padding: 15px 15px 15px 15px;
        color: white;
        .row{
            width: 100%;
        }
        .date-name-row{
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
        .name{
            font-size: 14px;
        }
        .time{
            font-size: 14px;
        }
        .message-content, span, .new-messages-count{
            font-size: 12px;
            white-space: nowrap;
        }
        .new-messages-count{
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: dodgerblue;
            border-radius: 100%;
        }
        &_active{
            background: #141416;
        }
        &:hover{
            background: rgba(20, 20, 22, 0.7);
        }
        &:last-child{
            margin-bottom: 15px;
        }
    }
}

.chat-body{
    height: 100%;
    width: 100%;
    &__info{
        height: 55px;
        min-height: 55px;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 2px solid #4e4f54;
        .col{
            display: flex;
            align-items: center;
        }
        .disconnect{
            display: none;
            width: 55px;
            height: 55px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-right: 5px;
            margin-left: -20px;
        }
        .client{
            display: flex;
            align-items: center;
            .name{
                font-size: 16px;
            }
        }
        .search{
            cursor: pointer;
        }
    }
    &__board{
        overflow-y: scroll;
        &::-webkit-scrollbar {
            display: none;
        }
        background-color: #141416;
        padding-top: 20px;
        height: calc(100% - 110px);
        overflow: auto;
        .chat-log{
            padding: 0 50px;
            display: grid;
            &__message{
                position: relative;
                margin-bottom: 40px;
                .message-content{
                    padding: 5px 10px;
                    font-size: 14px;
                    border-radius: 5px;
                }
                .message-time{
                    position: absolute;
                    bottom: -22px;
                    font-size: 12px;
                    color: #5e5d63;
                }
            }
            .replies{
                float: left;
                .message-content{
                    float: left;
                    background-color: #352f37;
                    max-width: 80%;
                    &::before {
                        content: "";
                        position: absolute;
                        width: 0;
                        height: 0;
                        top: 5px;
                        left: -20px;
                        border-right: 24px solid #352f37;
                        border-bottom: 20px solid transparent;
                        margin: -5px 0px 0 0px;
                        border-radius: 5px 0px 5px 0px;
                    }
                }
                .message-time{
                    left: 0;
                }
            }
            .sent{
                float: right;
                .message-content{
                    float: right;
                    background-color: #e8cbfc;
                    color: $text-primary;
                    &::after {
                        content: "";
                        position: absolute;
                        width: 0;
                        height: 0;
                        top: 5px;
                        right: -20px;
                        border-left: 24px solid #e8cbfc;
                        border-bottom: 20px solid transparent;
                        margin: -5px 0px 0 0px;
                        border-radius: 0px 5px 5px 5px;
                    }
                }
                .message-time{
                    right: 0;
                }
            }
        }
    }
    &__panel{
        position: relative;
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 55px;
        min-height: 55px;
        width: 100%;
        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);
        border-top: 2px solid #4e4f54;
        .img-icon{
            cursor: pointer;
            width: 24px;
            height: 24px;
            margin-right: 10px;
        }
        .send{
            transition: all 0.3s ease-in;
            z-index: 10;
            position: absolute;
            right: 20px;
            top: 0;
            bottom: 0;
            margin-top: auto;
            margin-bottom: auto;
            opacity: 1;
            &_hidden{
                opacity: 0;
            }
        }
        .message{
            padding-right: 50px;
        }
    }
    .client-icon{
        min-width: 35px;
        max-width: 35px;
        height: 35px;
        font-size: 18px;
    }
}

@media (max-width: 768px){
    .chat{
        height: 80vh;
    }
    .all-clients{
        &_open{
            transition: .3 ease-in;
            position: absolute;
            opacity: 1;
            width: 100%;
        }
        &_hide{
            opacity: 0;
            width: 0;
            margin-left: -270px;
        }
    }
    .chat-body{
        &__info{
            .disconnect{
                display: flex;
            }
        }
        &__board{
            .chat-log{
                padding: 0 25px;
            }
        }
    }
}
</style>