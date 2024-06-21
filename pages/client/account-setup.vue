<template>
    <div class="account-setup" :class="{'account-setup_full': !showRegNav}">
        <RegNav 
            :current_step="current_step" 
            :max_step="max_step"
            :reg_nav_active="showRegNav"
            @changePage="changeCurrentPage($event)"
        />
        <HistoryGroup
            v-if="current_step >= 0 && current_step <= 3"
            :current_step="current_step" 
            :max_step="max_step" 
            @changePage="changePage($event)"
        />
        <MobilityGroup
            v-if="current_step >= 4 && current_step <= 6"
            :current_step="current_step" 
            :max_step="max_step" 
            @changePage="changePage($event)"
        />
        <PostureGroup
            v-if="current_step >= 7 && current_step <= 9"
            :current_step="current_step" 
            :max_step="max_step" 
            @changePage="changePage($event)"
        />
    </div>
</template>

<script>
import '@/assets/css/account-setup.scss'
export default {
    layout: 'account-setup-layout',
    data: () => ({
        showRegNav: true,
    }),
    async asyncData({ store, $axios, redirect }) {
        if (store.state.userInfo.status != 'mzo_client' && store.state.userInfo.question_complete){
            return redirect('/client')
        }
        let token = store.state.userInfo.token
        let client = store.state.userInfo
        let max_step = store.state.userInfo.question_step
        let current_step = max_step
        let statistic = {}
        if(store.state.client.statistic){
            statistic = store.state.client.statistic
        } else {
            statistic = await $axios.$get(`/api/v1/user/get-client-statistics/?client_id=${client.id}`, {
                headers: { 'Authorization': `Token ${token}` }
            }) 
            store.commit('client/setStatistic', statistic)
        }
        let photos = {}
        if(store.state.client.photos){
            photos = store.state.client.photos
        } else {
            photos = await $axios.$get(`/api/v1/user/get-client-photos/?client_id=${client.id}`, { 
                headers: { Authorization: `Token ${token}` }
            })
            store.commit('client/setPhotos', photos)
        }
        return {client, max_step, current_step, token}
    },
    methods: {
        changeCurrentPage(e){
            this.current_step = e
        },
        changePage(e){
            this.current_step = e
            if (this.max_step < e){
                this.max_step = e
            }
        },
        toggleRegNav(){
            this.showRegNav = !this.showRegNav
        }
    },
    beforeMount() {
        if(window.innerWidth <= 992){
            this.showRegNav = false
        }
    },
    created() {
        this.$nuxt.$on('toggleRegNav', () => this.toggleRegNav())
    },
    components:{
        RegNav: () => import('@/components/reg-nav.vue'),
        HistoryGroup: () => import('@/components/mzo-client-setup/history/HistoryGroup.vue'),
        MobilityGroup: () => import('@/components/mzo-client-setup/mobility/MobilityGroup.vue'),
        PostureGroup: () => import('@/components/mzo-client-setup/posture/PostureGroup.vue'),
    }
}
</script>