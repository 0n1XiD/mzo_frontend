<template>
    <div class="header-account" @click="showMenu = !showMenu"> 
        <div class="header-account__name" v-if="userInfo.first_name != ''">{{ userInfo.first_name }} {{ userInfo.last_name}}</div>
        <div class="header-account__name" v-else>{{ userInfo.email }}</div>
        <div class="arrow">
            <img src="@/assets/img/svg/small-arrow.svg" alt="small-arrow" >
        </div>
        <div class="header-account__menu" v-if="showMenu" @mouseleave="showMenu = false">
            <div class="settings menu-item" @click="showSettings()">
                <img class="menu-item__img" src="@/assets/img/svg/profile-settings.svg" alt="profile-settings">
                {{$t('headerAccount.settings')}}
            </div>
            <nuxt-link
            class="settings menu-item"
            :to="switchLocalePath(availableLocales[0].code)">
                <img class="menu-item__img" src="@/assets/img/svg/language.svg" alt="profile-settings">
                {{$t('headerAccount.language')}}
            </nuxt-link> 
            <div class="logout menu-item" @click="logout">
                <img class="menu-item__img" src="@/assets/img/svg/logout.svg" alt="logout">
                {{$t('headerAccount.exit')}}
            </div>
        </div>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

export default {
    data: () => ({
        showMenu: false,
    }),
    methods: {
        ...mapActions(["logout"]),
        showSettings(){
            this.$emit('showSettings')
        },
        showTranslateSelect(){
            this.$emit('showTranslateSelect')
        }
    },
    computed:{
        ...mapState(["userInfo"]),
        availableLocales () {
            return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
        }
    },
}
</script>

<style lang="scss" scoped>

.header-account{
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    &__name{
        margin-right: 7px;
        font-size: 16px;
        line-height: 16px;
    }
    .arrow{
        padding-top: 2px;
        width: 10px;
        height: 10px;
        img{
            width: 100%;
            height: 100%;
        }
    }
    &__menu{
        position: absolute;
        right: 0;
        top: 20px;
        width: fit-content;
        min-width: 120px;
        background: $white;
        box-shadow: 0px 2px 8px rgba(30, 40, 67, 0.1);
        border-radius: 8px 0 8px 8px;
        z-index: 100;
        .menu-item{
            padding: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            font-size: 14px;
            line-height: 16px;
            &__img{
                margin-right: 10px;
                width: 20px;
                height: 20px;
            }
            &:hover{
                color: $blue;
                background: #f0f0f0;
            }
        }
    }
}
</style>