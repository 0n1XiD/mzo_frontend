<template>
    <div class="history-pain-time new-client">
        <div class="new-client__title">{{$t('historyPainInfo.painTimeShort')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('historyPainInfo.painTimeError')}}</div>
        <div class="new-client__content history-pain-time__content">
            <InputFields v-model="pain_data.years" type="number" default :placeholder="$t('historyPainInfo.painTimePlaceholder1')"/>
            <InputFields v-model="pain_data.months" type="number" default :placeholder="$t('historyPainInfo.painTimePlaceholder2')"/>
            <InputFields v-model="pain_data.days" type="number" default :placeholder="$t('historyPainInfo.painTimePlaceholder3')"/>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyPainInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props:['get_years', 'get_months', 'get_days'],
    data(){
        return{
            pain_data: {
                years: this.get_years,
                months: this.get_months,
                days: this.get_days,
            },
            error: false
        }
    },
    watch: {
        get_years(newValue){
            this.pain_data.years = newValue
        },
        get_months(newValue){
            this.pain_data.months = newValue
        },
        get_days(newValue){
            this.pain_data.days = newValue
        },
    },
    methods: {
        callback(e) {
            if(this.pain_data.years || this.pain_data.months || this.pain_data.days){
                if (!this.pain_data.years){
                    this.pain_data.years = 0
                } else {
                    this.pain_data.years = parseInt( this.pain_data.years)
                }
                if (!this.pain_data.months){
                    this.pain_data.months = 0
                } else {
                    this.pain_data.months = parseInt( this.pain_data.months)
                }
                if (!this.pain_data.days){
                    this.pain_data.days = 0
                } else {
                    this.pain_data.days = parseInt( this.pain_data.days)
                }
                this.error = false
                this.$emit('click', this.pain_data);
            } else {
                this.error = true
            }
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
    }
}
</script>

<style lang="scss">
.history-pain-time{
    &__content{
        display: flex;
        align-items: center;
        justify-content: center;
        .input{
            width: 150px;
            &:not(:last-child){
                margin-right: 30px;
            }
        }
    }
}

@media (max-width: 768px){
    .history-pain-time{
        &__content{
            flex-direction: column;
            .input{
                width: 100%;
                &:not(:last-child){
                    margin-bottom: 20px;
                    margin-right: 0;
                }
            }
        }
        .btn{
            width: 100%;
        }
    }
}
</style>