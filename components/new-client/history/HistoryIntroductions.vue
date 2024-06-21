<template>
    <div class="history-introductions new-client">
        <div class="new-client__title">{{$t('historyIntroductions.historyTitle')}}</div>
        <div class="new-client__subtitle">
            {{$t('historyIntroductions.subtitle')}}
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyIntroductions.startBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'

export default {
    methods: {
        callback: function(e) {
            this.$emit('click', e);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue')
    }
}
</script>

<style lang="scss">

</style>