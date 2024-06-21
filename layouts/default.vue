<template>
    <div>
        <header class="header">
            <div class="_container">
                <div class="header__inner">
                    <div class="row">
                        <HeaderLogo/>
                        <TrainerNav :userStatus="userInfo.status" v-if="userInfo.status == 'trainer' || userInfo.status == 'mzo_trainer' || userInfo.status == 'online_trainer'"/>
                        <ClientNav v-if="userInfo.status == 'client' || userInfo.status == 'mzo_client' || userInfo.status == 'online_client'" :userInfo="userInfo"/>
                    </div>
                    <div class="row">
                        <div class="notifications" v-if="userInfo.status == 'trainer' || userInfo.status == 'mzo_trainer' || userInfo.status == 'online_trainer'">
                            <img src="@/assets/img/svg/notification-bell.svg" alt="notification-bell">
                        </div>
                        <HeaderAccount @showSettings="showSettings = true" @showTranslateSelect="showTranslateSelect = true"/>
                    </div>
                </div>
            </div>
        </header>
        <Nuxt class="default-wrapper"/>
        <footer class="footer" :class="{'footer_aditional' : showAdditionalNav}" v-if="userInfo.status != 'moderator'">
            <ClientNav
                v-if="userInfo.status == 'client' || userInfo.status == 'mzo_client' || userInfo.status == 'online_client'" 
                :userInfo="userInfo"
                @additional="toggleAdditional()"
            />
            <TrainerNav :userStatus="userInfo.status" v-if="userInfo.status == 'trainer' || userInfo.status == 'mzo_trainer' || userInfo.status == 'online_trainer'"/>
        </footer>

        <PopupBillet 
            v-if="beforeCompletionPopup && !beforeCompletionPopup.off_popup && showBeforePopup" 
            :htmlContent="beforeCompletionPopup"
            @close="closePopupBillet($event, true)"
        />
        <PopupBillet 
            v-if="afterCompletionPopup && !afterCompletionPopup.off_popup && day_complete && showAfterPopup" 
            :htmlContent="afterCompletionPopup"
            @close="closePopupBillet($event)"
        />

        <!-- <ClientChat 
            v-if="(userInfo.status == 'mzo_client' || userInfo.status == 'online_client') && 
            userInfo.client_trainer && chat_mouned && chat_id" 
            :userInfo="userInfo"
            :chat_id="chat_id"
        /> -->
        <PopupTranslateSelect v-if="showTranslateSelect" @close="showTranslateSelect = false"/>
        <PopupProfileSettings v-if="showSettings" @close="showSettings = false" :userInfo="userInfo"/>
        <PopupFirstLogin v-if="userInfo.is_first_login" @close="userInfo.is_first_login = false" :userInfo="userInfo"/>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

export default {
    data: () => ({
        showMenu: false,
        showSettings: false,
        showTranslateSelect: false,
        firstLogin: false,
        beforeCompletionPopup: null,
        afterCompletionPopup: null,
        day_complete: false,
        showAdditionalNav: false,
        showBeforePopup: true,
        showAfterPopup:true,
        chat_id: null,
        chat_mouned: false,
        notifications: [],
    }),
    // async beforeMount(){
    //     if((this.userInfo.status == 'mzo_client' || this.userInfo.status == 'online_client') && 
    //         this.userInfo.client_trainer){
    //         this.createChatWidget()
    //     }
    // },
    methods: {
        ...mapActions(["logout"]),
        closePopupBillet(e, isBeforePopup=false){
            if(isBeforePopup){
                this.showBeforePopup = false
            } else {
                this.showAfterPopup = false
                this.day_complete = false
            }
        },
        toggleAdditional(){
            this.showAdditionalNav = !this.showAdditionalNav
        },
        // createChatWidget(){
        //     document.umnicoWidgetHash = 'df43e299bec95bd7ffd8cf7be4058fb5';
        //     var x = document.createElement('script');
        //     x.src = 'https://umnico.com/assets/widget-loader.js';
        //     x.type = 'text/javascript';
        //     x.charset = 'UTF-8';
        //     x.async = true;
        //     document.body.appendChild(x);
        // }
    },
    watch: {
        $route() {
            if (this.$cookies.get('w_d') != this.start_day_index){
                this.day_complete = true
                this.$store.commit('client/setStartDayIndex', this.$cookies.get('w_d'))
                this.$store.dispatch('getPopups')
                for (let i in this.htmlPopupContent){
                    if (this.htmlPopupContent[i].before_completion){
                        this.beforeCompletionPopup = this.htmlPopupContent[i]
                    } else {
                        this.afterCompletionPopup = this.htmlPopupContent[i]
                    }
                }
            }
        },
    },
    computed:{
        ...mapState(["userInfo"]),
        ...mapState({
            htmlPopupContent: state => state.client.htmlPopupContent
        }),
        ...mapState({
            start_day_index: state => state.client.start_day_index
        })
    },
    async mounted(){
        await this.$store.dispatch('getPopups')
        for (let i in this.htmlPopupContent){
            if (this.htmlPopupContent[i].before_completion){
                this.beforeCompletionPopup = this.htmlPopupContent[i]
            } else {
                this.afterCompletionPopup = this.htmlPopupContent[i]
            }
        }
        if((this.userInfo.status == 'mzo_client' || this.userInfo.status == 'online_client') && this.userInfo.client_trainer){
            let chats = await this.$axios.$get(`/api/v1/chat/?email=${this.userInfo.email}`, {
                headers: { 'Authorization': `Token ${this.userInfo.token}` }
            })
            if (chats.length == 0){
                const combinedUsers = [this.userInfo.client_trainer.email, this.userInfo.email]
                let params = {
                    messages: [],
                    participants: combinedUsers
                }
                await this.$axios.$post(`/api/v1/chat/create/`, params, {
                    headers: { 'Authorization': `Token ${this.userInfo.token}` }
                }).then(res => {
                    console.log(res.id)
                    this.chat_id = res.id
                    this.chat_mouned = true
                }).catch(e => {
                    console.log(e.response)
                })
            } else {
                this.chat_id = chats[0].id
                this.chat_mouned = true
            }
        }
        if (this.userInfo.status == 'trainer' || this.userInfo.status == 'mzo_trainer' || this.userInfo.status == 'online_trainer'){
            this.notifications = await this.$axios.$get(`/api/v1/user/get-trainer-notifications/?trainer_id=${this.userInfo.id}`, {
                    headers: { 'Authorization': `Token ${this.userInfo.token}` }
                }).catch(e => {
                console.log(e.response)
            })
            console.log(this.notifications)
        }
    },
    components:{
        PopupProfileSettings: () => import(`@/components/popups/PopupProfileSettings.vue`),
        PopupTranslateSelect: () => import(`@/components/popups/PopupTranslateSelect.vue`),
        PopupFirstLogin: () =>import(`@/components/popups/PopupFirstLogin.vue`),
        PopupBillet: () =>import(`@/components/popups/PopupBillet.vue`),
        ClientChat: () =>import(`@/components/ClientChat.vue`),

        TrainerNav: () => import(`@/components/header/trainerNav.vue`),
        ClientNav: () => import(`@/components/header/ClientNav.vue`),
        HeaderAccount: () =>import(`@/components/header/header-account.vue`),
        HeaderLogo: () =>import(`@/components/header/header-logo.vue`),
    }
}
</script>

<style lang="scss">
.header{
    margin-bottom: 22px;
    border-bottom: 1px solid #EBEBEB;
    z-index: 1100;
    width: 100%;
    background: $white;
    &__inner{
        padding: 12px 0;
        padding-bottom: 7px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .nav{
            display: flex;
            align-items: center;
            &.trainer-nav{
                .nuxt-link-active {
                    position: relative;
                    font-weight: bold;
                    color: $blue;
                    &::after{
                        content: '';
                        position: absolute;
                        width: 100%;
                        bottom: -12px;
                        left: 0;
                        border-bottom: 2px solid $blue;
                    }
                }
            }
            &.client-nav{
                .nuxt-link-exact-active {
                    position: relative;
                    font-weight: bold;
                    color: $blue;
                    &::after{
                        content: '';
                        position: absolute;
                        width: 100%;
                        bottom: -12px;
                        left: 0;
                        border-bottom: 2px solid $blue;
                    }
                }
            }
            &__item{
                cursor: pointer;
                font-size: 16px;
                line-height: 16px;
                &:hover{
                    color: $blue;
                }
                &:not(:last-child){
                    margin-right: 25px;
                }
            }
            &__additional{
                display: none;
                position: relative;
                &_active{
                    position: relative;
                    font-weight: bold;
                    color: #55ACFE;
                    &::after{
                        content: '';
                        position: absolute;
                        width: 100%;
                        bottom: -12px;
                        left: 0;
                        border-bottom: 2px solid #55ACFE;
                    }
                }
                .additional-pages{
                    padding: 15px 0;
                    display: inline-block;
                    position: absolute;
                    right: 0;
                    left: 0;
                    top: 18px;
                    width: 100%;
                    min-width: max-content;
                    background: $white;
                    box-shadow: 0px 2px 8px rgba(30, 40, 67, 0.2);
                    border-radius: 8px 0 8px 8px;
                    z-index: 100;
                    .nav__item{
                        margin-right: 0;
                        text-align: center;
                        padding: 0 15px;
                        display: block;
                        font-weight: 500;
                        &:not(:last-child){
                            margin-bottom: 20px;
                        }
                        &::after{
                            border-bottom: none;
                        }
                    }
                }
            }
        }
        .notifications{
            border-right: 1px solid #EBEBEB;;
            margin-right: 15px;
            cursor: pointer;
            width: 32px;
            height: 100%;
            img{
                padding-right: 2px;
                width: 24px;
                height: 24px;
            }
        }
    }
}

.footer{
    display: none;
}

@media (max-width: 992px){
    .header{
        &__inner{
            .nav{
                &__item{
                    &_desktop{
                        display: none;
                    }
                }
                &__additional{
                    display: block;
                }
            }
        }
    }
}

@media (max-width: 768px){
    .header{
        .nav{
            display: none;
        }
    }

    .footer{
        transition: all 0.5s ease;
        display: flex;
        align-items: center;
        height: 60px;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        background: $white;
        z-index: 1100;
        width: 100%;
        border-radius: 15px 0;
        box-shadow: 0px -2px 30px rgba(0, 0, 0, 0.25);
        &_aditional{
            bottom: -60px;
        }
        .nav{
            position: relative;
            width: 100%;
            display: flex;
            justify-content: space-evenly;
            margin-bottom: 0;
            &__item{
                display: flex;
                width: auto;
                justify-content: center;
                font-size: 16px;
                height: 50px;
                padding-top: 27px;
                background-repeat: no-repeat;
                background-size: 25px;
                background-position: bottom 20px center;
                &.nuxt-link-exact-active{
                    color: #55ACFE;
                }
                &_desktop{
                    display: none;
                }
            }
            &__home{
                background-image: url('~/assets/img/svg/home.svg');
            }
            &__notes{
                background-image: url('~/assets/img/svg/note.svg');
            }
            &__photos{
                background-image: url('~/assets/img/svg/photo.svg');
            }
            &__clients{
                background-image: url('~/assets/img/svg/clients.svg');
            }
            &__messages{
                background-image: url('~/assets/img/svg/messages.svg');
            }
            &__additional{
                background-image: url('~/assets/img/svg/additional.svg');
                &_active{
                    position: relative;
                    font-weight: bold;
                    color: #55ACFE;
                }
                &.nav__additional_selected{
                    .additional-pages{
                        width: 100%;
                        height: 100%;
                        bottom: 0;
                    }
                }
                .additional-pages{
                    transition: all 0.7s ease;
                    position: fixed;
                    width: 0;
                    height: 0;
                    left: 0;
                    bottom: -10000px;
                    .nav{
                        &__item{
                            position: absolute !important;
                            left: 0;
                            right: 0;
                            font-size: 10px;
                            margin: auto;
                            background-color: $white;
                            z-index: 1100;
                            width: 80px;
                            height: 80px;
                            bottom: 70px;
                            border-radius: 35%;
                            box-shadow: 0px -2px 30px rgba(0, 0, 0, 0.25);
                            padding-top: 50px;
                            background-repeat: no-repeat;
                            background-size: 35px;
                            background-position: top 15px center;
                            &.nuxt-link-exact-active{
                                background-color: #A7EAFF;
                                color: $text-primary;
                            }
                            &.nuxt-link-exact-active{
                                background-color: #A7EAFF;
                            }
                        }
                        &__statistics{
                            position: absolute;
                            left: -170px;
                            background-image: url('~/assets/img/svg/stats.svg');
                        }
                        &__faq{
                            bottom: 150px;
                            background-image: url('~/assets/img/svg/questionnaire.svg');
                        }
                        &__questionnaire{
                            left: 170px;
                            background-image: url('~/assets/img/svg/faq.svg');
                        }
                    }
                    &__close{
                        border-radius: 100%;
                        width: 50px !important;
                        height: 50px !important;
                        background: $light-gray-two !important;
                        bottom: 80px !important;
                        background-image: url('~/assets/img/svg/close-white.svg') !important;
                        background-repeat: no-repeat !important;
                        background-position: center center !important;
                    }
                }
            }
            &.client-nav{
                .nuxt-link-exact-active {
                    position: relative;
                    font-weight: bold;
                    color: $blue;
                    &::after{
                        content: '';
                        position: absolute;
                        width: 100%;
                        bottom: -12px;
                        left: 0;
                        border-bottom: none;
                    }
                    img{
                        z-index: 2;
                        top: -32px;
                        left: 0;
                        right: 0;
                        margin: auto;
                        position: absolute;
                    }
                    p{
                        display: block;
                        position: absolute;
                        bottom: -5px;
                        // left: -12px;
                        z-index: 3;
                        font-size: 16px;
                    }
                }
            }
        }
    }
}

@media (max-width: 576px){
    .footer{
        .nav{
            &__item{
                font-size: 14px;
            }
        }
    }
}
</style>