<template>
    <div class="history-diagnosis new-client">
        <div class="new-client__title">{{$t('historyDiagnosis.title')}}</div>
        <div class="new-client__subtitle">{{$t('historyDiagnosis.subtitle')}}</div>
        <textarea maxlength='200' autofocus v-model="diagnosis" class="textarea"></textarea>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyDiagnosis.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['get_diagnosis'],
    data(){
        return{
            diagnosis: this.get_diagnosis
        }
    },
    watch: {
        get_diagnosis(newValue){
            this.diagnosis = newValue
        }
    },
    methods: {
        callback: function(e) {
            this.$emit('click', this.diagnosis);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">

</style>