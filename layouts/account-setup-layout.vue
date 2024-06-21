<template>
    <div>
        <header class="header">
            <div class="row">
                <div class="show-sidebar" @click="$nuxt.$emit('toggleRegNav')"></div>
                <HeaderLogo/>
            </div>
            <HeaderAccount @showSettings="showSettings = true"/>
        </header>
        <Nuxt class="default-wrapper"/>

        <PopupBillet 
            v-if="beforeCompletionPopup && !beforeCompletionPopup.off_popup" 
            :htmlContent="beforeCompletionPopup"
            @close="closePopupBillet($event)"
        />

        <!-- <ClientChat 
            v-if="(userInfo.status == 'mzo_client' || userInfo.status == 'online_client') && 
            userInfo.client_trainer && chat_mouned && chat_id" 
            :userInfo="userInfo"
            :chat_id="chat_id"
        /> -->
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
        firstLogin: false,
        beforeCompletionPopup: null,
        afterCompletionPopup: null,
        day_complete: false,
        showAdditionalNav: false,
        chat_id: null,
        chat_mouned: false,
    }),
    methods: {
        ...mapActions(["logout"]),
        closePopupBillet(e){
            this.day_complete = false
        },
        toggleAdditional(e){
            this.showAdditionalNav = e
        }
    },
    watch: {
        $route() {
            if (this.$cookies.get('w_d') != this.start_day_index){
                this.day_complete = true
                this.$store.commit('client/setStartDayIndex', this.$cookies.get('w_d'))
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
        }),
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
    },
    components:{
        PopupProfileSettings: () => import(`@/components/popups/PopupProfileSettings.vue`),
        PopupFirstLogin: () =>import(`@/components/popups/PopupFirstLogin.vue`),
        PopupBillet: () =>import(`@/components/popups/PopupBillet.vue`),
        ClientChat: () =>import(`@/components/ClientChat.vue`),

        ClientNav: () => import(`@/components/header/ClientNav.vue`),
        HeaderAccount: () =>import(`@/components/header/header-account.vue`),
        HeaderLogo: () =>import(`@/components/header/header-logo.vue`),
    }
}
</script>

<style lang="scss" scoped>
.header{
    position: fixed;
    top: 0;
    left: 0;
    padding: 12px 30px 12px 25px;
    padding-bottom: 7px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    border-bottom: 1px solid #EBEBEB;
    z-index: 1100;
    width: 100%;
    background: $white;
}
.show-sidebar{
    margin-right: 12px;
    min-width: 20px;
    padding: 0;
    width: 20px;
    height: 20px;
    background-color: transparent;
    background-image: url("~/assets/img/svg/burger-menu.svg");
    background-repeat: no-repeat;
    background-size: 24px 24px;
    background-position: center center;
}
</style>