<template>
    <div class="mobility-stand-up new-client">
        <div class="new-client__title">{{$t('mobilityQuestion.standupTitle')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('mobilityQuestion.standupError')}}</div>
        <div class="new-client__issues">
            <div class="picture">
                <img width="350" height="300" src="@/assets/img/questions/stand_up.jpg" alt="Легко ли вам вставать с пола?">
            </div>
            <div class="questions">
                <RadioButton :checked="localAnswer == 'easy'" v-model="localAnswer" default :name="$t('mobilityQuestion.standupItem1')" val="easy" radioName="mobilityStandUp"/>
                <RadioButton :checked="localAnswer == 'normal'" v-model="localAnswer" default :name="$t('mobilityQuestion.standupItem2')" val="normal" radioName="mobilityStandUp"/>
                <RadioButton :checked="localAnswer == 'difficult'" v-model="localAnswer" default :name="$t('mobilityQuestion.standupItem3')" val="difficult" radioName="mobilityStandUp"/>
                <RadioButton :checked="localAnswer == 'very_difficult'" v-model="localAnswer" default :name="$t('mobilityQuestion.standupItem4')" val="very_difficult" radioName="mobilityStandUp"/>
            </div>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('mobilityQuestion.continueBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'

export default {
    props: ['answer'],
    data () {
        return{
            error: false,
            localAnswer: this.answer
        }
    },
    methods: {
        callback(e) {
            if(this.localAnswer){
                this.error = false
                this.$emit('click', this.localAnswer);
            } else {
                this.error = true
            }
        }
    },
    watch: {
        answer(newValue) {
            this.localAnswer = newValue // Update when the prop changes
        }
    },
    components: {
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue')
    }
}
</script>

<style lang="scss">

</style>