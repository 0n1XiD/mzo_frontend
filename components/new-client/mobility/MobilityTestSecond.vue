<template>
    <div class="mobility-test-second new-client">
        <div class="new-client__title">{{$t('mobilityTest.secondTestTitle')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('mobilityTest.secondTestQuestionError')}}</div>
        <div class="new-client__functional-test">
            <img width="250" height="320" src="@/assets/img/questions/test_2.jpg" alt="Функциональный тест #2">
            <div class="questions">
                <div class="questions__description">
                    {{$t('mobilityTest.secondTestQuestionDescription')}}
                </div>
                <RadioButton :checked="localAnswer == 'easier_stand'" v-model="localAnswer" default :name="$t('mobilityTest.secondTestQuestionItem1')" val="easier_stand" radioName="mobilityTest2"/>
                <RadioButton :checked="localAnswer == 'harder_stand'" v-model="localAnswer" default :name="$t('mobilityTest.secondTestQuestionItem2')" val="harder_stand" radioName="mobilityTest2"/>
                <RadioButton :checked="localAnswer == 'no_answer'" v-model="localAnswer" default :name="$t('mobilityTest.secondTestQuestionItem3')" val="no_answer" radioName="mobilityTest2"/>
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