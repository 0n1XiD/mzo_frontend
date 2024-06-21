<template>
    <div class="history-diagnosis new-client">
        <div class="new-client__title">{{$t('historyPainInfo.painAddShort')}}</div>
        <div class="new-client__buttons">
            <Btn @click="haveMorePain(true)" blue :name="$t('historyPainInfo.painAddShortAnswer1')"/>
            <Btn @click="haveMorePain(false)" blue :name="$t('historyPainInfo.painAddShortAnswer2')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    methods: {
        haveMorePain(e){
            this.$emit('click', e);
        },
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">

</style>