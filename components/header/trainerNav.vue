<template>
    <div class="trainer-nav nav">
        <nuxt-link :to="localePath(`/trainer/clients`)" class="nav__item nav__clients">{{$t('trainerNav.clients')}}</nuxt-link>
        <nuxt-link v-if="userStatus != 'trainer'" :to="localePath(`/trainer/chat`)" class="nav__item nav__messages">{{$t('trainerNav.clientsMessages')}}</nuxt-link>
    </div>
</template>

<script>
export default {
    data: () => ({
        choiceActive: false
    }),
    props: {
        userStatus: {
            type: String,
            default: 'trainer'
        },
    },
}
</script>