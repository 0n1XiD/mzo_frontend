<template>
    <div class="history-energy new-client">
        <div class="new-client__title">{{$t('historyYourCondition.energyTitle')}}</div>
        <div class="new-client__condition">
            <div class="row">
                <div class="new-client__subtitle">{{$t('historyYourCondition.energySubtitle')}}</div>
                <Selection 
                    default
                    :defaultName="`${energyCondition.default}%`"
                    :object="energyCondition"
                />
            </div>
            <textarea 
                maxlength='200'
                class="textarea" 
                :placeholder="$t('historyYourCondition.energyPlaceholder')"
                v-model="energyCondition.textarea"
            ></textarea>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyYourCondition.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['get_condition', 'get_condition_alt'],
    data(){
        return {
            energyCondition: {
                items: [
                    0, 5, 10, 15, 20, 25, 
                    30, 35, 40, 45, 50, 55, 
                    60, 65, 70, 75, 80, 85, 
                    90, 95, 100
                ],
                default: this.get_condition,
                textarea: this.get_condition_alt
            },
        }
    },
    watch: {
        get_condition(newValue){
            this.energyCondition.default = newValue
        },
        get_condition_alt(newValue){
            this.energyCondition.textarea = newValue
        }
    },
    methods: {
        callback(e) {
            this.$emit('click', this.energyCondition);
        }
    },
    components: {
        Selection: () => import('@/components/controls/Selection.vue'),
        Btn: () => import('@/components/controls/Btn.vue')
    }
}
</script>

<style lang="scss">

</style>