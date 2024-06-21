<template>
    <div class="history-height-weight new-client">
        <div class="new-client__title">{{$t('historyYourInfo.heightWeightTitle')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('historyYourInfo.heightWeightError')}}</div>
        <div class="history-height-weight__content">
            <InputFields v-model="localHeight" type="number" default :placeholder="$t('historyYourInfo.heightWeightPlaceholder1')"/>
            <InputFields v-model="localWeight" type="number" default :placeholder="$t('historyYourInfo.heightWeightPlaceholder2')"/>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyYourInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['height', 'weight'],
    data() {
        return{
            localHeight: this.height,
            localWeight: this.weight,
            error: false
        }
    },
    watch: {
        height(newValue){
            this.localHeight = newValue
        },
        weight(newValue){
            this.localWeight = newValue
        }
    },
    methods: {
        callback(e) {
            if(this.localHeight && this.localWeight){
                this.error = false
                let data = {
                    height: parseInt(this.localHeight),
                    weight: parseInt(this.localWeight)
                }
                this.$emit('click', data);
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
.history-height-weight{
    &__content{
        display: flex;
        justify-content: center;
        .input{
            &:not(:last-child){
                margin-right: 20px;
            }
        }
    }
}

@media (max-width: 576px){
        .history-height-weight{
            &__content{
                flex-direction: column;
                .input{
                    margin-bottom: 20px;
                    &:not(:last-child){
                        margin-right: 0;
                    }
                }
            }
        }
}
</style>