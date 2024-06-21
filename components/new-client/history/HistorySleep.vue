<template>
    <div class="history-sleep new-client">
        <div class="new-client__title">{{$t('historyYourCondition.sleepTitle')}}</div>
        <div class="new-client__condition">
            <div class="row">
                <div class="new-client__subtitle">{{$t('historyYourCondition.sleepSubtitle')}}</div>
                <Selection 
                    default
                    :defaultName="`${sleepCondition.default}%`"
                    :object="sleepCondition"
                />
            </div>
            <textarea 
                maxlength='200'
                class="textarea" 
                :placeholder="$t('historyYourCondition.sleepPlaceholder')"
                v-model="sleepCondition.textarea"
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
        return{
            sleepCondition: {
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
            this.sleepCondition.default = newValue
        },
        get_condition_alt(newValue){
            this.sleepCondition.textarea = newValue
        }
    },
    methods: {
        callback: function(e) {
            this.$emit('click', this.sleepCondition);
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