<template>
    <div class="mobility-test-third new-client">
        <div class="new-client__title">{{$t('mobilityTest.trirdTestTitle')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('mobilityTest.trirdTestQuestionError')}}</div>
        <div class="new-client__functional-test">
            <img width="250" height="320" src="@/assets/img/questions/test_3.jpg" alt="Функциональный тест #3">
            <div class="questions">
                <div class="questions__description">
                    {{$t('mobilityTest.trirdTestQuestionDescription')}}
                </div>
                <RadioButton :checked="localAnswer == 'left_easier'" v-model="localAnswer" default :name="$t('mobilityTest.trirdTestQuestionItem1')" val="left_easier" radioName="mobilityTest3"/>
                    <RadioButton :checked="localAnswer == 'equally_easy'" v-model="localAnswer" default :name="$t('mobilityTest.trirdTestQuestionItem2')" val="equally_easy" radioName="mobilityTest3"/>
                    <RadioButton :checked="localAnswer == 'right_easier'" v-model="localAnswer" default :name="$t('mobilityTest.trirdTestQuestionItem3')" val="right_easier" radioName="mobilityTest3"/>
                    <RadioButton :checked="localAnswer == 'equally_hard'" v-model="localAnswer" default :name="$t('mobilityTest.trirdTestQuestionItem4')" val="equally_hard" radioName="mobilityTest3"/>
                    <RadioButton :checked="localAnswer == 'no_answer'" v-model="localAnswer" default :name="$t('mobilityTest.trirdTestQuestionItem5')" val="no_answer" radioName="mobilityTest3"/>
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