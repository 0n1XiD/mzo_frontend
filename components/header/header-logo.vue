<template>
    <nuxt-link v-if="userInfo.status == 'client' || userInfo.status == 'mzo_client' || userInfo.status == 'online_client'" :to="localePath(`/client`)" tag="div" class="header-logo">
        <img src="@/assets/img/svg/logo_short.svg" alt="logo">
    </nuxt-link>
    <nuxt-link v-else-if="userInfo.status == 'trainer' || userInfo.status == 'mzo_trainer' || userInfo.status == 'online_trainer'" :to="localePath(`/trainer/clients`)" tag="div" class="header-logo">
        <img src="@/assets/img/svg/logo_short.svg" alt="logo">
    </nuxt-link>
    <nuxt-link v-else-if="userInfo.status == 'moderator'" :to="localePath(`/moderator`)" tag="div" class="header-logo">
        <img src="@/assets/img/svg/logo_short.svg" alt="logo">
    </nuxt-link>
    <nuxt-link v-else :to="localePath(`/`)" tag="div" class="header-logo">
        <img src="@/assets/img/svg/logo_short.svg" alt="logo">
    </nuxt-link>
</template>

<script>

import { mapState } from "vuex";

export default {
    computed:{
        ...mapState(["userInfo"]),
    },
}
</script>

<style lang="scss" scoped>

.header-logo{
    cursor: pointer;
    margin-right: 15px;
    width: 80px;
    height: 25px;
    img{
        width: 100%;
        height: 100%;
    }
    &.nuxt-link-active {
        &::after{
            border-bottom: none;
        }
    }
}
</style>