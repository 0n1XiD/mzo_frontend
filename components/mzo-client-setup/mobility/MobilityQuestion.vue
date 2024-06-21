<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('mobilityQuestion.title')}}</div>
        <div class="subtitle">{{$t('mobilityQuestion.subtitle')}} </div>
        <div class="item">
            <div class="item__title">{{$t('mobilityQuestion.stayTitle')}}</div>
            <div class="item__subtitle">{{$t('mobilityQuestion.staySubtitle')}}</div>
            <div class="new-client__issues">
                <div class="picture">
                    <img width="350" height="300" src="@/assets/img/questions/stand.jpg" alt="Легко ли вам стоять?">
                </div>
                <div class="questions">
                    <RadioButton :checked="stay == 'easy'" v-model="stay" default :name="$t('mobilityQuestion.stayItem1')" val="easy" radioName="mobilityStand"/>
                    <RadioButton :checked="stay == 'normal'" v-model="stay" default :name="$t('mobilityQuestion.stayItem2')" val="normal" radioName="mobilityStand"/>
                    <RadioButton :checked="stay == 'difficult'" v-model="stay" default :name="$t('mobilityQuestion.stayItem3')" val="difficult" radioName="mobilityStand"/>
                    <RadioButton :checked="stay == 'very_difficult'" v-model="stay" default :name="$t('mobilityQuestion.stayItem4')" val="very_difficult" radioName="mobilityStand"/>
                </div>
            </div>
            <div class="error-text" v-if="standError">{{$t('mobilityQuestion.stayError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('mobilityQuestion.sitTitle')}}</div>
            <div class="item__subtitle">{{$t('mobilityQuestion.sitSubtitle')}}</div>
            <div class="new-client__issues">
                <div class="picture">
                    <img width="350" height="300" src="@/assets/img/questions/sit.jpg" alt="Легко ли вам сидеть?">
                </div>
                <div class="questions">
                    <RadioButton :checked="sit == 'easy'" v-model="sit" default :name="$t('mobilityQuestion.sitItem1')" val="easy" radioName="mobilitySit"/>
                    <RadioButton :checked="sit == 'normal'" v-model="sit" default :name="$t('mobilityQuestion.sitItem2')" val="normal" radioName="mobilitySit"/>
                    <RadioButton :checked="sit == 'difficult'" v-model="sit" default :name="$t('mobilityQuestion.sitItem3')" val="difficult" radioName="mobilitySit"/>
                    <RadioButton :checked="sit == 'very_difficult'" v-model="sit" default :name="$t('mobilityQuestion.sitItem4')" val="very_difficult" radioName="mobilitySit"/>
                </div>
            </div>
            <div class="error-text" v-if="sitError">{{$t('mobilityQuestion.sitError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('mobilityQuestion.standupTitle')}}</div>
            <div class="item__subtitle">{{$t('mobilityQuestion.standupSubtitle')}}</div>
            <div class="new-client__issues">
                <div class="picture">
                    <img width="350" height="300" src="@/assets/img/questions/stand_up.jpg" alt="Легко ли вам вставать с пола?">
                </div>
                <div class="questions">
                    <RadioButton :checked="standup == 'easy'" v-model="standup" default :name="$t('mobilityQuestion.standupItem1')" val="easy" radioName="mobilityStandUp"/>
                    <RadioButton :checked="standup == 'normal'" v-model="standup" default :name="$t('mobilityQuestion.standupItem2')" val="normal" radioName="mobilityStandUp"/>
                    <RadioButton :checked="standup == 'difficult'" v-model="standup" default :name="$t('mobilityQuestion.standupItem3')" val="difficult" radioName="mobilityStandUp"/>
                    <RadioButton :checked="standup == 'very_difficult'" v-model="standup" default :name="$t('mobilityQuestion.standupItem4')" val="very_difficult" radioName="mobilityStandUp"/>
                </div>
            </div>
            <div class="error-text" v-if="standupError">{{$t('mobilityQuestion.standupError')}}</div>
        </div>
        <Btn blue :name="$t('mobilityQuestion.continueBtn')" @click="goToPage(6)"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    data: () => ({
        standError: false,
        sitError: false,
        standupError: false,
        stay: null,
        sit: null,
        standup: null
    }),
    computed:{
        ...mapState(["userInfo"]),
    },
    beforeMount(){
        if (this.userInfo.stay){
            this.stay = this.userInfo.stay
        }
        if (this.userInfo.sit){
            this.sit = this.userInfo.sit
        }
        if (this.userInfo.standup){
            this.standup = this.userInfo.standup
        }
    },
    methods: {
        goToPage: async function(page){
            let error = false
            this.standError = false
            this.sitError = false
            this.standupError = false
            if (!this.stay){
                this.standError = true
                error = true
            }
            if (!this.sit){
                this.sitError = true
                error = true
            }
            if (!this.standup){
                this.standupError = true
                error = true
            }
            if (!error){
                let form_data= {
                    step: page,
                    stay: this.stay,
                    sit: this.sit,
                    standup: this.standup,
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