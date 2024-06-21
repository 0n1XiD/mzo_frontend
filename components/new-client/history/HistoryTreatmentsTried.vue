<template>
    <div class="history-treatments-tried new-client">
        <div class="new-client__title">{{$t('historyPainInfo.treatmentsTitleShort')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('historyPainInfo.treatmentsError')}}</div>
        <div class="new-client__content history-when-pain__content">
            <Checkbox v-model="treatments.tried" value="chiropractic" default :name="$t('historyPainInfo.treatmentsPlaceholder1')" />
            <Checkbox v-model="treatments.tried" value="physical_therapy" default :name="$t('historyPainInfo.treatmentsPlaceholder2')" />
            <Checkbox v-model="treatments.tried" value="surgery" default :name="$t('historyPainInfo.treatmentsPlaceholder3')" />
            <Checkbox v-model="treatments.tried" value="analgesic" default :name="$t('historyPainInfo.treatmentsPlaceholder4')" />
            <Checkbox v-model="treatments.tried" value="acupuncture" default :name="$t('historyPainInfo.treatmentsPlaceholder5')" />
            <Checkbox v-model="treatments.tried" value="hirudotherapy" default :name="$t('historyPainInfo.treatmentsPlaceholder6')" />
            <Checkbox v-model="treatments.tried" value="kinesiatrics" default :name="$t('historyPainInfo.treatmentsPlaceholder7')" />
            <Checkbox v-model="treatments.tried" value="yoga_pilates" default :name="$t('historyPainInfo.treatmentsPlaceholder8')" />
            <Checkbox v-model="treatments.tried" value="extension" default :name="$t('historyPainInfo.treatmentsPlaceholder9')" />
            <InputFields v-model="treatments.tried_alt" default :placeholder="$t('historyPainInfo.treatmentsPlaceholder10')"/>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyPainInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['get_tried', 'get_tried_alt'],
    data(){
        return{
            treatments: {
                tried: this.get_tried,
                tried_alt: this.get_tried_alt
            },
            error: false,
        }
    },
    watch: {
        get_tried(newValue){
            this.treatments.tried = newValue
        },
        get_tried_alt(newValue){
            this.treatments.tried_alt = newValue
        }
    },
    methods: {
        callback(e){
            if(this.treatments.tried ||this.treatments.tried_alt){
                this.error = false
                this.$emit('click', this.treatments);
            } else {
                this.error = true
            }
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
    }
}
</script>

<style lang="scss">
.history-treatments-tried{
    &__content{
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        grid-gap: 20px;
        .checkbox{
            &:nth-child(3n-2){
                grid-column: 1 / span 3;
            }
            &:nth-child(3n-1){
                grid-column: 4 / span 3;
            }
            &:nth-child(3n-0){
                grid-column: 7 / span 3;
            }
        }
        .input{
            grid-column: 1 / span 8;
        }
    }
}
</style>