<template>
    <div class="questionnaire-page">
        <div class="_container">
            <div class="questionnaire-page__content">
                <div class="main__title">{{$t('questionnaireBlock.title')}}</div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.birthdayTitle')}}: {{ new Date(client.birthday).toLocaleDateString('ru-RU') }}</div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.heightWeightTitle')}}</div>
                    <div class="questionnaire-item__row">
                        <div class="questionnaire-item__field flex-field">
                            {{$t('questionnaireBlock.heightWeightItem1')}} {{client.height}}
                        </div>
                        <div class="questionnaire-item__field flex-field">
                            {{$t('questionnaireBlock.heightWeightItem2')}} {{client.weight}}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.workTitle')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(work, index) in works"
                            :key="`work-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': work.enName == client.work}"
                        >
                            {{ work.name }}
                        </div>
                    </div>
                    <div class="questionnaire-item__subtitle" v-if="client.work_alt != null && client.work_alt != ''">{{$t('questionnaireBlock.workItem10')}}</div>
                    <div class="questionnaire-item__field questionnaire-item__field_text flex-field" v-if="client.work_alt != null && client.work_alt != ''">
                        {{client.work_alt}}
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.conditionTitle')}}</div>  
                    <div class="questionnaire-item__subtitle">{{$t('questionnaireBlock.conditionItem1')}} {{ statistic.condition[0].common_feel}}%</div>
                    <div class="questionnaire-item__field questionnaire-item__field_text" v-if="statistic.condition[0].common_feel_text">
                        {{ statistic.condition[0].common_feel_text}}
                    </div>
                    <div class="questionnaire-item__subtitle">{{$t('questionnaireBlock.conditionItem2')}} {{ statistic.condition[0].common_energy}}%</div>
                    <div class="questionnaire-item__field questionnaire-item__field_text" v-if="statistic.condition[0].common_energy_text">
                        {{ statistic.condition[0].common_energy_text}}
                    </div>
                    <div class="questionnaire-item__subtitle">{{$t('questionnaireBlock.conditionItem3')}} {{ statistic.condition[0].common_sleep}}%</div>
                    <div class="questionnaire-item__field questionnaire-item__field_text" v-if="statistic.condition[0].common_sleep_text">
                        {{ statistic.condition[0].common_sleep_text}}
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.painPlaceTitle')}} {{pain_place}}</div>  
                    <div class="questionnaire-item__subtitle">{{$t('questionnaireBlock.whenPainTitle')}}</div>
                    <div class="questionnaire-item">
                        <div
                            v-for="(pain, index) in when_pain"
                            :key="`pain-${index}`"
                            class="questionnaire-item__selected"
                            :class="{'questionnaire-item__selected_active': CheckCompatibilityWhenPain(pain.enName)}"
                        >
                            {{ pain.name }}
                        </div>
                    </div>
                    <div class="questionnaire-item__subtitle" v-if="statistic.pain[0].when_pain_alt">{{$t('questionnaireBlock.whenPainItem7')}}</div>
                    <div class="questionnaire-item__field questionnaire-item__field_text flex-field" v-if="statistic.pain[0].when_pain_alt">
                        {{statistic.pain[0].when_pain_alt}}
                    </div>
                    <div class="questionnaire-item__subtitle" v-if="statistic.pain[0].diagnosis">{{$t('questionnaireBlock.diagnosisTitle')}}</div>
                    <div class="questionnaire-item__field questionnaire-item__field_text flex-field" v-if="statistic.pain[0].diagnosis">
                        {{statistic.pain[0].diagnosis}}
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.painTryTitle')}}</div>
                    <div class="questionnaire-item">
                        <div
                            v-for="(pain, index) in pain_try_repare"
                            :key="`pain-${index}`"
                            class="questionnaire-item__selected"
                            :class="{'questionnaire-item__selected_active': CheckCompatibilityPain(pain.enName)}"
                        >
                            {{ pain.name }}
                        </div>
                    </div>
                    <div class="questionnaire-item__subtitle" v-if="client.pain_try_repare_alt">{{$t('questionnaireBlock.painTryItem10')}}</div>
                    <div class="questionnaire-item__field questionnaire-item__field_text flex-field" v-if="client.pain_try_repare_alt">
                        {{client.pain_try_repare_alt}}
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.question1')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(complexity, index) in complexities"
                            :key="`complexity-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': complexity.enName == client.stay}"
                        >
                            {{ complexity.name }}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.question2')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(complexity, index) in complexities"
                            :key="`complexity-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': complexity.enName == client.sit}"
                        >
                            {{ complexity.name }}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.question3')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(complexity, index) in complexities"
                            :key="`complexity-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': complexity.enName == client.standup}"
                        >
                            {{ complexity.name }}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.firstTest')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(test, index) in firstTest"
                            :key="`test1-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': test.enName == client.test1}"
                        >
                            {{ test.name }}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.secondTest')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(test, index) in secondTest"
                            :key="`test2-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': test.enName == client.test2}"
                        >
                            {{ test.name }}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.thirdTest')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(test, index) in thirdTest"
                            :key="`test3-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': test.enName == client.test3}"
                        >
                            {{ test.name }}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.postureTypeSide')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(posture, index) in postureSide"
                            :key="`postureSide-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': posture.enName == client.posture_side}"
                        >
                            {{ posture.name }}
                        </div>
                    </div>
                </div>
                <div class="questionnaire-item">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.postureTypeBack')}}</div>
                    <div class="questionnaire-item__grid">
                        <div
                            v-for="(posture, index) in postureBack"
                            :key="`postureBack-${index}`"
                            class="questionnaire-item__field"
                            :class="{'questionnaire-item__field_active': posture.enName == client.posture_back}"
                        >
                            {{ posture.name }}
                        </div>
                    </div>
                </div>
                <!-- <div class="questionnaire-item" v-if="notes.length != 0">
                    <div class="questionnaire-item__title">{{$t('questionnaireBlock.notesTitle')}}</div>  
                    <div 
                        class="questionnaire-item__notes"
                        v-for="note in notes"
                        :key="`note-${note.id}`"
                    >
                        <div class="note">
                            <div class="note__title">
                                {{$t('questionnaireBlock.week')}} {{note.created_week}}, {{$t('questionnaireBlock.day')}} {{note.created_day}}
                            </div>
                            <div class="questionnaire-item__field questionnaire-item__field_text">
                                {{note.text}}
                            </div>
                        </div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
        data: function(){
        return {
            pain_place: '',
            works: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.workItem1'), enName: 'entrepreneur'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.workItem2'), enName: 'housewife'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.workItem3'), enName: 'driver'},
                {id: 4, name: this.$nuxt.$t('questionnaireBlock.workItem4'), enName: 'freelancer'},
                {id: 5, name: this.$nuxt.$t('questionnaireBlock.workItem5'), enName: 'student'},
                {id: 6, name: this.$nuxt.$t('questionnaireBlock.workItem6'), enName: 'programmer'},
                {id: 7, name: this.$nuxt.$t('questionnaireBlock.workItem7'), enName: 'office_worker'},
                {id: 8, name: this.$nuxt.$t('questionnaireBlock.workItem8'), enName: 'teacher'},
                {id: 9, name: this.$nuxt.$t('questionnaireBlock.workItem9'), enName: 'retiree'},
            ],
            pain_try_repare: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.painTryItem1'), enName: 'chiropractic'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.painTryItem2'), enName: 'physical_therapy'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.painTryItem3'), enName: 'surgery'},
                {id: 4, name: this.$nuxt.$t('questionnaireBlock.painTryItem4'), enName: 'analgesic'},
                {id: 5, name: this.$nuxt.$t('questionnaireBlock.painTryItem5'), enName: 'acupuncture'},
                {id: 6, name: this.$nuxt.$t('questionnaireBlock.painTryItem6'), enName: 'hirudotherapy'},
                {id: 7, name: this.$nuxt.$t('questionnaireBlock.painTryItem7'), enName: 'kinesiatrics'},
                {id: 8, name: this.$nuxt.$t('questionnaireBlock.painTryItem8'), enName: 'yoga_pilates'},
                {id: 9, name: this.$nuxt.$t('questionnaireBlock.painTryItem9'), enName: 'extension'},
            ],
            when_pain: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.whenPainItem1'), enName: 'after_waking_up'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.whenPainItem2'), enName: 'end_of_the_day'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.whenPainItem3'), enName: 'after_working_out'},
                {id: 4, name: this.$nuxt.$t('questionnaireBlock.whenPainItem4'), enName: 'after_long_sitting'},
                {id: 5, name: this.$nuxt.$t('questionnaireBlock.whenPainItem5'), enName: 'after_lifting_weights'},
                {id: 6, name: this.$nuxt.$t('questionnaireBlock.whenPainItem6'), enName: 'always'},
            ],
            complexities: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.complexitiesItem1'), enName: 'easy'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.complexitiesItem2'), enName: 'normal'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.complexitiesItem3'), enName: 'difficult'},
                {id: 4, name: this.$nuxt.$t('questionnaireBlock.complexitiesItem4'), enName: 'very_difficult'},
            ],
            firstTest: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.firstTestItem1'), enName: 'stability'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.firstTestItem2'), enName: 'body_falls'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.firstTestItem3'), enName: 'no_answer'},
            ],
            secondTest: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.secondTestItem1'), enName: 'easier_stand'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.secondTestItem2'), enName: 'harder_stand'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.secondTestItem3'), enName: 'no_answer'},
            ],
            thirdTest: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.thirdTestItem1'), enName: 'left_easier'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.thirdTestItem2'), enName: 'equally_easy'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.thirdTestItem3'), enName: 'right_easier'},
                {id: 4, name: this.$nuxt.$t('questionnaireBlock.thirdTestItem4'), enName: 'equally_hard'},
                {id: 5, name: this.$nuxt.$t('questionnaireBlock.thirdTestItem5'), enName: 'no_answer'},
            ],
            postureSide: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.postureTypeSideType1'), enName: 'type_1'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.postureTypeSideType2'), enName: 'type_2'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.postureTypeSideType3'), enName: 'type_3'},
            ],
            postureBack: [
                {id: 1, name: this.$nuxt.$t('questionnaireBlock.postureTypeBackType1'), enName: 'type_r'},
                {id: 2, name: this.$nuxt.$t('questionnaireBlock.postureTypeBackType2'), enName: 'type_n'},
                {id: 3, name: this.$nuxt.$t('questionnaireBlock.postureTypeBackType3'), enName: 'type_s'},
            ],
        }},
        async fetch(){
            let pain_place_all =[
                {id: 1, name: this.$nuxt.$t('historyPainInfo.painPlaceItem1')},
                {id: 2, name: this.$nuxt.$t('historyPainInfo.painPlaceItem2')},
                {id: 3, name: this.$nuxt.$t('historyPainInfo.painPlaceItem3')},
                {id: 4, name: this.$nuxt.$t('historyPainInfo.painPlaceItem4')},
                {id: 5, name: this.$nuxt.$t('historyPainInfo.painPlaceItem5')},
                {id: 6, name: this.$nuxt.$t('historyPainInfo.painPlaceItem6')},
                {id: 7, name: this.$nuxt.$t('historyPainInfo.painPlaceItem7')},
                {id: 8, name: this.$nuxt.$t('historyPainInfo.painPlaceItem8')},
            ]
            for (let i in pain_place_all){
                if(parseInt(this.statistic.pain[0].place) == parseInt(pain_place_all[i].id)){
                    this.pain_place = pain_place_all[i].name
                }
            }
            if(this.client.birthday.split(' ')[1] == 'январь,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-01-${this.client.birthday.split(' ')[0]}` 
            }
            else if(this.client.birthday.split(' ')[1] == 'февраль,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-02-${this.client.birthday.split(' ')[0]}`   
            }
            else if(this.client.birthday.split(' ')[1] == 'март,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-03-${this.client.birthday.split(' ')[0]}`
            } 
            else if(this.client.birthday.split(' ')[1] == 'апрель,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-04-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'май,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-05-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'июнь,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-06-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'июль,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-07-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'август,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-08-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'сентябрь,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-09-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'октябрь,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-10-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'ноябрь,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-11-${this.client.birthday.split(' ')[0]}`
            }
            else if(this.client.birthday.split(' ')[1] == 'декабрь,'){
                this.client.birthday = `${this.client.birthday.split(' ')[2]}-12-${this.client.birthday.split(' ')[0]}`
            }
        },
        props: [
            'client',
            'statistic',
            'notes'
        ],
        methods: {
            CheckCompatibilityPain(pain){
                for(let [_, client_pain] of this.client.pain_try_repare.entries()){
                    if(client_pain == pain){
                        return true
                    }
                }
            },
            CheckCompatibilityWhenPain(pain){
                for(let [_, client_pain] of this.statistic.pain[0].when_pain.entries()){
                    if(client_pain == pain){
                        return true
                    }
                }
            }
        },
}
</script>

<style lang="scss">
.questionnaire-page{
    overflow: hidden;
    &__content{
        .questionnaire-item{
            &:not(:last-child){
                margin-bottom: 25px;
            }
            &__title{
                color: #66508d;
                font-size: 16px;
                margin-bottom: 10px;
            }
            &__subtitle{
                margin-top: 8px;
                color: $light-gray;
                font-size: 14px;
                margin-bottom: 10px;
            }
            &__row{
                display: flex;
                align-items: center;
            }
            &__grid{
                margin-bottom: 20px;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-gap: 20px;
            }
            &__field{
                position: relative;
                padding: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: #e1e1e1;
                color: #8459cf;
                border-radius: 5px;
                min-width: 290px;
                width: fit-content;
                &.flex-field{
                    &:not(:last-child){
                        margin-right: 15px;
                    }
                }
                &_active{
                    border: 2px solid #00a651;
                    &::after{
                        position: absolute;
                        content: '';
                        right: -10px;
                        top: -10px;
                        width: 20px;
                        height: 20px;
                        border-radius: 100%;
                        background-color: #00a651;
                        background-image: url(~/assets/img/svg/checkmark-white.svg);
                        background-position: center center;
                        background-size: 14px;
                        background-repeat: no-repeat;
                    }
                }
                &_text{
                    background: none;
                    border: 2px solid #e8e8e8;
                }
            }
            &__selected{
                position: relative;
                margin-left: 30px;
                color: #698a9b;
                &:not(:last-child){
                    margin-bottom: 10px;
                }
                &::before{
                    position: absolute;
                    content: '';
                    left: -30px;
                    width: 20px;
                    height: 20px;
                    border-radius: 3px;
                    border: 1px solid #698a9b;
                }
                &_active{
                    &::before{
                        background-color: #00a651;
                        background-image: url(~/assets/img/svg/checkmark-white.svg);
                        background-position: center center;
                        background-size: 14px;
                        background-repeat: no-repeat;
                        border: none;
                    }
                }
            }
            &__notes{
                margin-bottom: 15px;
                .note{
                    &:not(:last-child){
                        margin-bottom: 10px;
                    }
                    &__title{
                        margin-top: 8px;
                        color: $light-gray;
                        font-size: 16px;
                        margin-bottom: 10px;
                    }
                }   
            }
        }
    }
}

@media (max-width: 992px){
    .questionnaire-page{
        &__content{
            .questionnaire-item{
                &__grid{
                    grid-template-columns: repeat(2, 1fr);
                }
            }
        }
    }
}

@media (max-width: 768px){
    .questionnaire-page{
        &__content{
            .questionnaire-item{
                &__field{
                    font-size: 14px;
                    min-width: 240px;
                }
            }
        }
    }
}


@media (max-width: 577px){
    .questionnaire-page{
        &__content{
            .questionnaire-item{
                &__grid{
                    grid-template-columns: repeat(1, 1fr);
                }
                &__field{
                    min-width: 100%;
                    &.flex-field{
                        &:not(:last-child){
                            margin-right: 0;
                            margin-bottom: 15px;
                        }
                    }
                }
                &__row{
                    display: flex;
                    flex-direction: column;
                }
            }
        }
    }
}
</style>