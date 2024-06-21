<template>
    <div class="history-pain new-client">
        <div class="new-client__title">{{$t('historyPainInfo.painPlaceShort')}}</div>
        <div class="new-client__subtitle">{{$t('historyPainInfo.painChoiceTitle')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('historyPainInfo.painPlaceError')}}</div>
        <div class="history-pain__content new-client__condition">
            <div class="new-client__grid">
                <RadioButton
                    v-for="item in pain_places_options"
                    :key="item.id"
                    default
                    :checked="pain_place == item.value"
                    :name="item.label"
                    :val="item.value"
                    v-model="pain_place"
                    radioName="pain"
                />
            </div>
            <div class="row">
                <div class="new-client__subtitle">{{$t('historyPainInfo.painNumberTitle')}}</div>
                <Selection 
                    default
                    :defaultName="`${painPower.default}`"
                    :object="painPower"
                />
            </div>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('historyPainInfo.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'
export default {
    props: ['get_place', 'get_power'],
    data: function(){
        return{
            pain_places_options: [
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem1'),value:1,id:1},
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem2'),value:2,id:2},
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem3'),value:3,id:3},
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem4'),value:4,id:4},
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem5'),value:5,id:5},
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem6'),value:6,id:6},
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem7'),value:7,id:7},
            {label:this.$nuxt.$t('historyPainInfo.painPlaceItem8'),value:8,id:8},
        ],
            pain_place: this.get_place,
            painPower: {
                items: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                default: this.get_power,
            },
            error: false,
        }
    },
    watch: {
        get_place(newValue){
            this.pain_place = newValue
        },
        get_power(newValue){
            this.painPower.default = newValue
        }
    },
    methods: {
        callback(e){
            if(this.pain_place){
                this.error = false
                let pain_data = {
                    place: this.pain_place,
                    power: this.painPower.default
                }
                this.$emit('click', pain_data);
            } else {
                this.error = true
            }
        }
    },
    components: {
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        Selection: () => import('@/components/controls/Selection.vue'),
    }
}
</script>

<style lang="scss">
.history-pain{
    &__content{
        .row{
            .subtitle{
                margin-bottom: 0;
            }
        }
        .selection{
            margin-left: 30px;
            &__preview{
                width: 100px;
            }
            &__expand{
                width: 100px;
            }
        }
    }
}
</style>