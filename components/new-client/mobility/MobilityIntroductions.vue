<template>
    <div class="mobility-introductions new-client">
        <div class="new-client__title">{{$t('mobilityIntroductions.mobilityTitle')}}</div>
        <div class="new-client__subtitle">
           {{$t('mobilityIntroductions.subtitle')}}
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('mobilityIntroductions.startBtn')"/>
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