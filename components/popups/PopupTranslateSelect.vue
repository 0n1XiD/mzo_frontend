<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="delete-card-pop-up">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="delete-card-pop-up__title">{{$t('languageChange.title')}}</div>
            <nuxt-link
            v-for="locale in availableLocales"
            :key="locale.code"
            :to="switchLocalePath(locale.code)">{{ locale.name }}</nuxt-link>
        </div>
    </div>
</template>

<script>
import '@/assets/css/popup-delete.scss'
export default {
    methods: {
        closeWindow(){
            this.$emit("close");
        },
    },
    computed: {
        availableLocales () {
            return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
        }
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`),
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
    }
}
</script>