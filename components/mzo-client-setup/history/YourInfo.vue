<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('historyYourInfo.title')}}</div>
        <div class="subtitle">{{$t('historyYourInfo.subtitle')}}</div>
        <div class="item">
            <div class="item__title">{{$t('historyYourInfo.sexTitle')}}</div>
            <div class="row">
                <div class="gender-item">
                    <img width="90" height="90" src="@/assets/img/svg/men.svg" alt="men" class="gender-item__icon">
                    <RadioButton :checked="gender == 'male'" v-model="gender" default :name="$t('historyYourInfo.sexItem1')" val="male" radioName="gender"/>
                </div>
                <div class="gender-item">
                    <img width="90" height="90" src="@/assets/img/svg/women.svg" alt="women" class="gender-item__icon">
                    <RadioButton :checked="gender == 'female'" v-model="gender" default :name="$t('historyYourInfo.sexItem2')" val="female" radioName="gender"/>
                </div>
            </div>
            <div class="error-text" v-if="genderError">{{$t('historyYourInfo.sexError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('historyYourInfo.birthTitle')}}</div>
            <date-picker
                class="custom-calendar"
                v-model="birthday"
                value-type="format"
                format="DD MMMM, YYYY"
                :disabled-date="disabledDates"
                :inline="true"
                :lang="'ru'"
            ></date-picker>
            <div class="error-text" v-if="birthdayError">{{$t('historyYourInfo.birthError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('historyYourInfo.heightWeightTitle')}}</div>
            <InputFields class="item__field" v-model="height" type="number" default :placeholder="$t('historyYourInfo.heightWeightPlaceholder1')"/>
            <InputFields class="item__field" v-model="weight" type="number" default :placeholder="$t('historyYourInfo.heightWeightPlaceholder2')"/>
            <div class="error-text" v-if="heightWeightError">{{$t('historyYourInfo.heightWeightError')}}</div>
        </div>
        <div class="item">
            <div class="item__title">{{$t('historyYourInfo.workTitle')}}</div>
            <div class="item__subtitle">{{$t('historyYourInfo.workSubtitle')}}</div>
                <div class="new-client__grid">
                    <RadioButton :checked="profession == 'entrepreneur'" v-model="profession" default :name="$t('historyYourInfo.workItem1')" val="entrepreneur" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'housewife'" v-model="profession" default :name="$t('historyYourInfo.workItem2')" val="housewife" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'driver'" v-model="profession" default :name="$t('historyYourInfo.workItem3')" val="driver" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'freelancer'" v-model="profession" default :name="$t('historyYourInfo.workItem4')" val="freelancer" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'student'" v-model="profession" default :name="$t('historyYourInfo.workItem5')" val="student" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'programmer'" v-model="profession" default :name="$t('historyYourInfo.workItem6')" val="programmer" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'office_worker'" v-model="profession" default :name="$t('historyYourInfo.workItem7')" val="office_worker" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'teacher'" v-model="profession" default :name="$t('historyYourInfo.workItem8')" val="teacher" radioName="wherePain"/>
                    <RadioButton :checked="profession == 'retiree'" v-model="profession" default :name="$t('historyYourInfo.workItem9')" val="retiree" radioName="wherePain"/>
                </div>
            <InputFields v-model="profession_alt" default :placeholder="$t('historyYourInfo.workItem10')"/>
            <div class="error-text" v-if="professionError">{{$t('historyYourInfo.workError')}}</div>
        </div>
        <div class="item" v-if="parseInt(new Date().toDateString().split(' ')[3]) - parseInt(this.birthday.split(', ')[1]) >= 18 && gender == 'female'">
            <div class="item__title">Вы беременны?</div>
            <div class="item__subtitle">Мы подберем для вас индивидуальную тренировку для беременных</div>   
            <RadioButton class="pregnancy-radio" v-model="pregnant" :val="true" default :name="'Да'" radioName="pregnant"/>
            <RadioButton class="pregnancy-radio" v-model="pregnant" :val="false" default :name="'Нет'" radioName="pregnant"/>            
        </div>
        <Btn blue :disabled='isDisabled' :name="$t('historyYourInfo.continueBtn')" @click="goToPage(2)"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";
import 'vue2-datepicker/index.css';
import 'vue2-datepicker/locale/ru';

import '@/assets/css/custom-calendar.scss';

export default {
    data: () => ({
        genderError: false,
        isDisabled: false,
        birthdayError: false,
        heightWeightError: false,
        professionError: false,
        birthday: '12 март, 1997',
        gender: null,
        height: null,
        pregnant: false,
        weight: null,
        is_pregnant: null,
        profession: null,
        profession_alt: null
    }),
    computed:{
        ...mapState(["userInfo"]),
    },
    beforeMount(){
        if (this.userInfo.gender){
            this.gender = this.userInfo.gender
        }
        if (this.userInfo.birthday){
            this.birthday = this.userInfo.birthday
        }
        if (this.userInfo.height){
            this.height = this.userInfo.height
        }
        if (this.userInfo.weight){
            this.weight = this.userInfo.weight
        }
        if (this.userInfo.work){
            this.profession = this.userInfo.work
        }
        if (this.userInfo.work_alt){
            this.profession_alt = this.userInfo.work_alt
        }
    },
    methods: {
        disabledDates(date) {
            let newDate = new Date()
            newDate.setDate(newDate.getDate() - 1);
            if (newDate >= date){
                return false
            }
            return true
        },
        goToPage: async function(page){
            let error = false
            this.genderError = false
            this.birthdayError = false
            this.heightWeightError = false
            this.professionError = false
            if (!this.gender){
                this.genderError = true
                error = true
            }
            if (!this.birthday){
                this.birthdayError = true
                error = true
            }
            if (!this.height || !this.weight){
                this.heightWeightError = true
                error = true
            }
            if (!this.profession && !this.profession_alt){
                this.professionError = true
                error = true
            }
            if (!error){
                let type = ''
                if(parseInt(new Date().toDateString().split(' ')[3]) - parseInt(this.birthday.split(', ')[1]) >= 18){
                    if (this.pregnant){
                        type = 'pregnant'
                        this.isDisabled = true
                    } else{
                        type = 'common'
                    }
                } else{
                    type = 'kid'
                }
                let form_data= {
                    step: page,
                    type: type,
                    gender: this.gender,
                    birthday: this.birthday,
                    height: this.height,
                    weight: this.weight,
                    work: this.profession,
                    work_alt: this.profession_alt
                }
                if (!this.pregnant){
                    await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                        headers: { Authorization: `Token ${this.userInfo.token}`}
                    }).then(res => {
                        this.$store.commit('setUserInfo', res)
                        this.$emit('changePage', page)
                    }).catch(e => {
                        console.log(e.response)
                    })
                } else{
                    await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                        headers: { Authorization: `Token ${this.userInfo.token}`}
                    }).then(res => {
                        this.$store.commit('setUserInfo', res)
                    }).catch(e => {
                        console.log(e.response)
                    })
                }
                if (this.pregnant){
                    this.$router.go()
                }
            }
        }
    },
    components:{
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        DatePicker: () => import('vue2-datepicker'),
    }
}
</script>

<style lang="scss" scoped>
.gender-item{
    display: flex;
    align-items: center;
    flex-direction: column;
    &__icon{
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $gray;
        border-radius: 100%;
        width: 90px;
        height: 90px;
    }
    &:first-child{
        margin-right: 100px;
    }
}
.pregnancy-radio{
    margin-bottom: 15px;
}
</style>