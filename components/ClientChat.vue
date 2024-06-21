<template>
    <div class="client-chat">
        <div class="client-chat__sign" :class="{'client-chat__sign_hidden': chatOpen}" @click="toggleChat()"></div>
        <div class="client-chat__chat" :class="{'client-chat__chat_open': chatOpen}">
            <div class="chat-content">
                <div class="chat-header">
                    <div class="chat-header__close" @click="toggleChat()"></div>
                    <div class="chat-header__title">{{$t('clientChat.title')}}</div>
                    <div class="chat-header__trainer">{{$t('clientChat.trainer')}} <span>{{userInfo.client_trainer.first_name}} {{userInfo.client_trainer.last_name}}</span></div>
                </div>
                <div class="chat-body">
                    <ul class="chat-log" ref="chatLog">
                        <li 
                            v-for="message in messages"
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
                <div class="message-input">
                    <textarea 
                        @keyup.enter="addMessage()"
                        @input="getMessageArea($event)" 
                        v-model="message" 
                        class="message-input__field" 
                        :placeholder="$t('clientChat.placeholder')"
                        maxlength='200'
                    ></textarea>
                    <Btn @click="addMessage()" class="send" sendBtn :class="{'send_hidden': !message}"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import WebSocketInstance from '@/plugins/websocket';

export default {
    props: {
        userInfo: {
            type: Object,
            required: true
        },
        chat_id: {
            type: Number,
            required: true
        },
    },
    data() {
        return {
            chatOpen: false,
            message: null,
            messages: [
            ]
        }
    },
    mounted() {
        if(this.$route.query.room){
            this.initialiseChat()
        }
    },
    methods: {
        toggleChat(){
            this.chatOpen = !this.chatOpen
            if (!this.chatOpen){
                WebSocketInstance.disconnect();
            } else {
                this.initialiseChat()
            }
        },
        getMessageArea(e){
            // scrollHeight
        },
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
                    chatId: this.chat_id,
                    current_user: this.userInfo.email
                }
                WebSocketInstance.newChatMessage(messageObject);
                WebSocketInstance.fetchMessages(
                    this.userInfo.email,
                    this.chat_id
                );
                this.message = null
            }
        },
        setMessages(messages) {
            this.messages = messages
        },
        appendMessages(message) {
            this.messages.push(message)
        },
        initialiseChat(){
            this.waitForSocketConnection(() => {
                WebSocketInstance.addCallbacks(
                    this.addMessage.bind(this),
                    this.setMessages.bind(this),
                    this.appendMessages.bind(this)
                );
                WebSocketInstance.fetchMessages(
                    this.userInfo.email,
                    this.chat_id
                );
            });
            WebSocketInstance.connect(this.chat_id, this.userInfo.email)
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
    }
}
</script>

<style lang="scss" scoped>
.client-chat{
    &__sign{
        z-index: 500;
        position: fixed;
        right: 35px;
        bottom: 35px;
        transition: all 0.7s ease;
        cursor: pointer;
        border-radius: 100%;
        width: 60px;
        height: 60px;
        background: #CCDAFF;
        box-shadow: 2px 3px 5px rgba(0, 0, 0, 0.25);
        background-image: url('~/assets/img/svg/client-message.svg');
        background-position: center center;
        background-repeat: no-repeat;
        background-size: 30px;
        &:hover{
            width: 70px;
            height: 70px;
            background-size: 35px;
        }
        &_hidden{
            height: 0px;
            width: 0px;
            opacity: 0;
        }
    }
    &__chat{
        overflow: hidden;
        transition: all 0.7s ease;
        position: fixed;
        right: 30px;
        bottom: 30px;
        height: 0px;
        width: 0px;
        opacity: 0;
        border-radius: 10px;
        background: $white;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.25);
        z-index: 500;
        .chat-content{
            position: relative;
            width: 100%;
            height: 100%;
        }
        &_open{
            height: 400px;
            width: 300px;
            opacity: 1;
        }
        .chat-header{
            height: 20%;
            position: relative;
            padding: 15px;
            background: #f8faff;
            border-bottom: 2px solid $gray;
            &__title{
                font-size: 18px;
                font-weight: 600;
            }
            &__trainer{
                font-size: 14px;
                span{
                    font-size: 14px;
                }
            }
            &__close{
                transition: all 0.5s ease;
                cursor: pointer;
                position: absolute;
                right: 10px;
                top: 10px;
                width: 30px;
                height: 30px;
                background-image: url('~/assets/img/svg/close.svg');
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 25px;
                &:hover{
                    transition: all 0.5s ease;
                    transform: rotate(90deg);
                }
            }
        }
        .chat-body{
            z-index: 1;
            padding: 10px;
            height: 240px;
            overflow: auto;
            .chat-log{
                padding: 0 15px;
                display: grid;
                &__message{
                    position: relative;
                    &:not(:last-child){
                        margin-bottom: 40px;
                    }
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
                        color: white;
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
        .message-input{
            z-index: 2;
            width: 100%;
            position: absolute;
            bottom: 0;
            display: flex;
            align-items: center;
            height: 56px;
            background: #EFEFEF;
            &__field{
                overflow: hidden;
                resize:none;
                font-family: 'Gilroy';
                display: flex;
                align-items: center;
                height: 48px;
                padding: 15px 16px;
                border-radius: 4px;
                font-size: 16px;
                line-height: 19px;
                padding-right: 0;
                width: 85%;
                font-size: 14px;
                background: none;
                border: none;
            }
            &__send{
                cursor: pointer;
                position: absolute;
                right: 0;
                top: 0;
                width: 15%;
                height: 100%;
                background-image: url('~/assets/img/svg/send-message.svg');
                background-position: center center;
                background-repeat: no-repeat;
                background-size: 25px;
            }
        }
    }
}

@media (max-width: 768px){
    .client-chat{
        &__sign{
            right: 20px;
            bottom: 85px;
        }
        &__chat{
            right: 20px;
            bottom: 80px;
        }
    }
}
</style>