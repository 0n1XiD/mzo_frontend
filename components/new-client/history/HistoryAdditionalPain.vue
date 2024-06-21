<template>
    <div class="history-additional-pain new-client">
        <div class="new-client__title">{{$t('historyPainInfo.painAdditional')}}</div>
        <div class="new-client__content">
            <textarea maxlength='200' autofocus v-model="additional_pain_info" class="textarea"></textarea>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyPainInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['get_pain_info'],
    data(){
        return{
            additional_pain_info: this.get_pain_info
        }
    },
    watch: {
        get_pain_info(newValue){
            this.additional_pain_info = newValue
        }
    },
    methods: {
        callback(e) {
            this.$emit('click', this.additional_pain_info);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">

</style>