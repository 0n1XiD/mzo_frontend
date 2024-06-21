<template>
    <div class="client-nav nav">
        <nuxt-link :to="localePath(`/client`)" class="nav__item nav__home">{{$t('clientNav.home')}}</nuxt-link>
        <nuxt-link :to="localePath(`/client/notes`)" class="nav__item nav__notes">{{$t('clientNav.notes')}}</nuxt-link>
        <nuxt-link :to="localePath(`/client/photos`)" class="nav__item nav__photos">{{$t('clientNav.photos')}}</nuxt-link>
        <nuxt-link :to="localePath(`/client/statistics`)" class="nav__item nav__item_desktop nav__statistics">{{$t('clientNav.statistic')}}</nuxt-link>
        <nuxt-link :to="localePath(`/client/questionnaire`)" class="nav__item nav__item_desktop nav__questionnaire">{{$t('clientNav.questionnaire')}}</nuxt-link>
        <nuxt-link v-if="userInfo.status == 'mzo_client' || userInfo.status == 'online_client'" :to="localePath(`/client/faq`)" class="nav__item nav__item_desktop nav__faq">{{$t('clientNav.faq')}}</nuxt-link>
        <div 
            class="nav__item nav__additional"
            :class="{'nav__additional_active': additional_client_nav_acticve, 'nav__additional_selected': isShowAdditional}"
            @mouseenter="showAdditional()"
            @mouseleave="hideAdditional()"
        >
           {{$t('clientNav.additional')}}
            <div class="additional-pages" v-if="isShowAdditional">
                <nuxt-link :to="localePath(`/client/statistics`)" class="nav__item nav__statistics">{{$t('clientNav.statistic')}}</nuxt-link>
                <nuxt-link :to="localePath(`/client/questionnaire`)" class="nav__item nav__questionnaire">{{$t('clientNav.questionnaire')}}</nuxt-link>
                <nuxt-link v-if="userInfo.status == 'mzo_client' || userInfo.status == 'online_client'" :to="localePath(`/client/faq`)" class="nav__item nav__item_desktop nav__faq">{{$t('clientNav.faq')}}</nuxt-link>
                <nuxt-link v-if="userInfo.status == 'mzo_client' || userInfo.status == 'online_client'" :to="localePath(`/client/faq`)" class="nav__item nav__faq">{{$t('clientNav.help')}}</nuxt-link>
                <div class="additional-pages__close nav__item" @click="hideAdditional()"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
        additional_client_nav_acticve: false,
        isShowAdditional: false,
    }),
    props: {
        userInfo: {
            type: Object,
            required: true
        }
    },
    mounted() {
        this.checkRoute()
    },
    watch: {
        $route() {
            this.checkRoute()
        },
    },
    methods:{
        checkRoute(){
            if (this.$route.name == 'client-questionnaire' || this.$route.name == 'client-faq' || this.$route.name == 'client-statistics'){
                this.additional_client_nav_acticve = true
            } else {
                this.additional_client_nav_acticve = false
            }
        },
        showAdditional(){
            this.isShowAdditional = true
            this.$emit('additional', this.isShowAdditional)
        },
        hideAdditional(){
            this.isShowAdditional = false
            this.$emit('additional', this.isShowAdditional)
        }
    }
}
</script>