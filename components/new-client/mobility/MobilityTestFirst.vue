<template>
    <div class="mobility-test-first new-client">
        <div class="new-client__title">{{$t('mobilityTest.firstTestTitle')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('mobilityTest.firstTestQuestionError')}}</div>
        <div class="new-client__functional-test">
            <img width="250" height="320" src="@/assets/img/questions/test_1.jpg" alt="Функциональный тест #1" class="mobility-test-first__picture">
            <div class="questions">
                <div class="questions__description">
                    {{$t('mobilityTest.firstTestQuestionDescription')}}
                </div>
                <div class="questions__description">{{$t('mobilityTest.firstTestQuestionDescriptionAdditional')}}</div>
                <RadioButton :checked="localAnswer == 'stability'" v-model="localAnswer" default :name="$t('mobilityTest.firstTestQuestionItem1')" val="stability" radioName="mobilityTest1"/>
                <RadioButton :checked="localAnswer == 'body_falls'" v-model="localAnswer" default :name="$t('mobilityTest.firstTestQuestionItem2')" val="body_falls" radioName="mobilityTest1"/>
                <RadioButton :checked="localAnswer == 'no_answer'" v-model="localAnswer" default :name="$t('mobilityTest.firstTestQuestionItem3')" val="no_answer" radioName="mobilityTest1"/>
            </div>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('mobilityTest.continueBtn')"/>
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