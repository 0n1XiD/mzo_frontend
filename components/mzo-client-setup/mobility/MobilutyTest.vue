<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('mobilityTest.title')}}</div>
        <div class="subtitle">{{$t('mobilityTest.subtitle')}} </div>
        <div class="item">
            <div class="item__title">{{$t('mobilityTest.firstTestTitle')}}</div>
            <div class="item__subtitle">{{$t('mobilityTest.firstTestSubtitle')}}</div>
            <div class="new-client__functional-test">
                <img width="250" height="320" src="@/assets/img/questions/test_1.jpg" alt="Функциональный тест #1" class="mobility-test-first__picture">
                <div class="questions">
                    <div class="questions__description">
                        {{$t('mobilityTest.firstTestQuestionDescription')}}
                    </div>
                    <div class="questions__description">{{$t('mobilityTest.firstTestQuestionDescriptionAdditional')}}</div>
                    <RadioButton :checked="test1 == 'stability'" v-model="test1" default :name="$t('mobilityTest.firstTestQuestionItem1')" val="stability" radioName="mobilityTest1"/>
                    <RadioButton :checked="test1 == 'body_falls'" v-model="test1" default :name="$t('mobilityTest.firstTestQuestionItem2')" val="body_falls" radioName="mobilityTest1"/>
                    <RadioButton :checked="test1 == 'no_answer'" v-model="test1" default :name="$t('mobilityTest.firstTestQuestionItem3')" val="no_answer" radioName="mobilityTest1"/>
                </div>
            </div>
            <div class="error-text" v-if="test1Error">{{$t('mobilityTest.firstTestQuestionError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('mobilityTest.secondTestTitle')}}</div>
            <div class="item__subtitle">{{$t('mobilityTest.secondTestSubtitle')}}</div>
            <div class="new-client__functional-test">
                <img width="250" height="320" src="@/assets/img/questions/test_2.jpg" alt="Функциональный тест #2">
                <div class="questions">
                    <div class="questions__description">
                        {{$t('mobilityTest.secondTestQuestionDescription')}}
                    </div>
                    <RadioButton :checked="test2 == 'easier_stand'" v-model="test2" default :name="$t('mobilityTest.secondTestQuestionItem1')" val="easier_stand" radioName="mobilityTest2"/>
                    <RadioButton :checked="test2 == 'harder_stand'" v-model="test2" default :name="$t('mobilityTest.secondTestQuestionItem2')" val="harder_stand" radioName="mobilityTest2"/>
                    <RadioButton :checked="test2 == 'no_answer'" v-model="test2" default :name="$t('mobilityTest.secondTestQuestionItem3')" val="no_answer" radioName="mobilityTest2"/>
                </div>
            </div>
            <div class="error-text" v-if="test2Error">{{$t('mobilityTest.secondTestQuestionError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('mobilityTest.trirdTestTitle')}}</div>
            <div class="item__subtitle">{{$t('mobilityTest.trirdTestSubtitle')}}</div>
            <div class="new-client__functional-test">
                <img width="250" height="320" src="@/assets/img/questions/test_3.jpg" alt="Функциональный тест #3">
                <div class="questions">
                    <div class="questions__description">
                        {{$t('mobilityTest.trirdTestQuestionDescription')}}
                    </div>
                    <RadioButton :checked="test3 == 'left_easier'" v-model="test3" default :name="$t('mobilityTest.trirdTestQuestionItem1')" val="left_easier" radioName="mobilityTest3"/>
                    <RadioButton :checked="test3 == 'equally_easy'" v-model="test3" default :name="$t('mobilityTest.trirdTestQuestionItem2')" val="equally_easy" radioName="mobilityTest3"/>
                    <RadioButton :checked="test3 == 'right_easier'" v-model="test3" default :name="$t('mobilityTest.trirdTestQuestionItem3')" val="right_easier" radioName="mobilityTest3"/>
                    <RadioButton :checked="test3 == 'equally_hard'" v-model="test3" default :name="$t('mobilityTest.trirdTestQuestionItem4')" val="equally_hard" radioName="mobilityTest3"/>
                    <RadioButton :checked="test3 == 'no_answer'" v-model="test3" default :name="$t('mobilityTest.trirdTestQuestionItem5')" val="no_answer" radioName="mobilityTest3"/>
                </div>
            </div>
            <div class="error-text" v-if="test3Error">{{$t('mobilityTest.trirdTestQuestionError')}}</div>
        </div>
        <Btn blue :name="$t('mobilityTest.continueBtn')" @click="goToPage(7)"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    data: () => ({
        test1Error: false,
        test2Error: false,
        test3Error: false,
        test1: null,
        test2: null,
        test3: null
    }),
    computed:{
        ...mapState(["userInfo"]),
    },
    beforeMount(){
        if (this.userInfo.test1){
            this.test1 = this.userInfo.test1
        }
        if (this.userInfo.test2){
            this.test2 = this.userInfo.test2
        }
        if (this.userInfo.test3){
            this.test3 = this.userInfo.test3
        }
    },
    methods: {
        goToPage: async function(page){
            let error = false
            this.test1Error = false
            this.test2Error = false
            this.test3Error = false
            if (!this.test1){
                this.test1Error = true
                error = true
            }
            if (!this.test2){
                this.test2Error = true
                error = true
            }
            if (!this.test3){
                this.test3Error = true
                error = true
            }
            if (!error){
                let form_data= {
                    step: page,
                    test1: this.test1,
                    test2: this.test2,
                    test3: this.test3,
                }
                await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                    headers: { Authorization: `Token ${this.userInfo.token}`}
                }).then(res => {
                    this.$store.commit('setUserInfo', res)
                    this.$emit('changePage', page)
                })
            }
        }
    },
    components:{
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
    }
}
</script>

<style lang="scss" scoped>
</style>