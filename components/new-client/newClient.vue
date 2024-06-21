<template>
    <div class="wrapper" v-if="isActive">
        <div class="pop-up__close-bg" @click="closeWindow()" v-if="currentStep != 5"></div>
        <div class="pop-up-new-client" :class="{'first_step': currentStep == 1, 'last_step': currentStep == 5}">
            <div class="pop-up__close" @click="closeWindow()"  v-if="currentStep != 5">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="steps">
                <div class="steps__groups" v-if="currentStep != 1 && currentStep != 5">
                    <div class="step-group">
                        <div 
                            @click="changeCurrentStep(2)"
                            class="step-group__circle" 
                            :class="{
                                'current': currentStep == 2, 
                                'complete': maxStep >= 2 && currentStep != 2
                            }"
                        >
                            1
                        </div>
                        <div class="step-group__name">{{$t('newClient.history')}}</div>
                    </div>
                    <div class="step-group__line"></div>
                    <div class="step-group">
                        <div 
                            @click="changeCurrentStep(3)"
                            class="step-group__circle" 
                            :class="{
                                'current': currentStep == 3, 
                                'complete': maxStep >= 3 && currentStep != 3
                            }"
                        >
                            2
                        </div>
                        <div class="step-group__name">{{$t('newClient.mobility')}}</div>
                    </div>
                    <div class="step-group__line"></div>
                    <div class="step-group">
                        <div 
                            @click="changeCurrentStep(4)"
                            class="step-group__circle" 
                            :class="{
                                'current': currentStep == 4, 
                                'complete': maxStep >= 4 && currentStep != 4
                            }"
                        >
                            3
                        </div>
                        <div class="step-group__name">{{$t('newClient.posture')}}</div>
                    </div>
                </div>
                <div class="steps__page">
                    <RegistrationNewClient 
                        v-if="currentStep == 1" 
                        :reg_data="registration_data"
                        @click="completeRegData($event)"
                    />
                    <HistoryGroup 
                        v-if="currentStep == 2" 
                        :historyData="data"
                        :historyStepsComplete="historyStepsComplete.step"
                        @complete="completeQuestions($event, 3)"
                        @changePage="changePage($event, historyStepsComplete)"
                    />
                    <MobilityGroup 
                        v-if="currentStep == 3" 
                        :mobilityData="data"
                        :mobilityStepsComplete="mobilityStepsComplete.step"
                        @complete="completeQuestions($event, 4)"
                        @changePage="changePage($event, mobilityStepsComplete)"
                    />
                    <PostureGroup 
                        v-if="currentStep == 4" 
                        :postureData="data"
                        :postureStepsComplete="postureStepsComplete.step"
                        @complete="completeQuestions($event, 5, true)"
                        @changePage="changePage($event, postureStepsComplete)"
                    />
                    <CompleteReg v-if="currentStep == 5"/>
                </div>
            </div>
        </div>
    </div>    
</template>

<script>

export default {
    data: () => ({
        data: {
            user_type: 'client',
            gender: null,
            birthday: '12 март, 1997',
            height: null,
            weight: null,
            work: null,
            work_alt: '',
            common_feel: 50,
            common_feel_text: '',
            common_energy: 50,
            common_energy_text: '',
            common_sleep: 50,
            common_sleep_text: '',
            pain_places:[
            {
                pain_place: null,
                place_pain_number: 5,
                pain_yy:null,
                pain_mm:null,
                pain_dd:null,
                when_pain: [],
                when_pain_alt: '',
                diagnosis: '',
                is_setup_second_pain: false
            },
            ],
            additional_pain_info: '',
            pain_try_repare:[],
            pain_try_repare_alt:'',

            stay:null,
            sit:null,
            standup:null,
            test1:null,
            test2:null,
            test3:null,

            photos: [
                {id: 1, src: null, top_line_first: 30, top_line_second: 60},
                {id: 2, src: null, top_line_first: 30, top_line_second: 60},
                {id: 3, src: null, top_line_first: 30, top_line_second: 60},
                {id: 4, src: null, top_line_first: 30, top_line_second: 60}
            ],
            posture_side:null,
            posture_back:null,
        },
        registration_data: {
            email: '',
            first_name: '',
            last_name: '',
            phone: '',
            password: '123321'
        },
        maxStep: 1,
        currentStep: 1,
        historyStepsComplete: { step: 1 },
        mobilityStepsComplete: { step: 1 },
        postureStepsComplete: { step: 1 },
    }),
    props: [
        'isActive',
        'token',
        'userInfo'
    ],
    methods: {
        closeWindow(){
            this.$emit("close");
        },
        changeCurrentStep(currentStep){
            if(currentStep <= this.maxStep){
                this.currentStep = currentStep
            }
        },
        completeRegData(e){
            this.registration_data = e
            this.maxStep = 2
            this.changeCurrentStep(2)
        },
        completeQuestions(e, goToPage, isFinish=false){
            this.data = e
            if(this.maxStep < goToPage){
                this.maxStep = goToPage
            }
            this.changeCurrentStep(goToPage)
            if(isFinish){
                this.finishCreatingUser()
            }
        },
        changePage(e, group){
            group.step = e
        },
        async finishCreatingUser(){
            this.registration_data.email.toLowerCase().trim()
            this.registration_data.password.trim()
            let form_data = new FormData()
            let random_password = (Math.random() + 1).toString(36).substring(2);
            this.registration_data.password = random_password
            if(parseInt(new Date().toDateString().split(' ')[3]) - parseInt(this.data.birthday.split(', ')[1]) >= 18){
                this.data.type = 'common'
            } else{
                this.data.type = 'kid'
            }
            for (let [k,v] of Object.entries(this.registration_data)){
                form_data.append(k,JSON.stringify(v))
            }
            if (this.userInfo.status == 'mzo_trainer'){
                this.data.user_type = 'mzo_client'
            }
            for (let [k,v] of Object.entries(this.data)){
                form_data.append(k,JSON.stringify(v))
            }
            await this.$axios.$post('/api/v1/user/registration/', form_data, { 
                headers: { 
                    Authorization: `Token ${this.token}`,
                    "Content-Type": "multipart/form-data"
                } 
            }).then(async res => {
                let active = this.isActive
                await this.$store.commit('trainer/setClientInfo', res.client)
                if(res.first_week_id){
                    try{
                        await this.$router.push(this.localePath(`/trainer/clients/${res.client.id}/exercise-programs/${res.first_week_id}`))
                    } catch {
                        this.$emit("close", active);
                    }
                } else {
                    this.$emit("close", res.client);
                }
            }).catch(e => {
                console.log(e.response)
            })
        },
    },
    components:{
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        Selection: () => import('@/components/controls/Selection.vue'),
        RegistrationNewClient: () => import(`@/components/new-client/RegistrationNewClient.vue`),
        HistoryGroup: () => import(`@/components/new-client/history/HistoryGroup.vue`),
        MobilityGroup: () => import(`@/components/new-client/mobility/MobilityGroup.vue`),
        PostureGroup: () => import(`@/components/new-client/posture/PostureGroup.vue`),
        CompleteReg: () => import(`@/components/new-client/CompleteReg.vue`),
    }
}
</script>

<style lang="scss">
    .pop-up-new-client{
        position: relative;
        background: $white;
        padding: 15px 25px 25px 25px;
        width: 900px;
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 10px;
        &.first_step{
            overflow: visible;
            width: 400px;
        }
        &.last_step{
            width: 400px;
        }
        .steps{
            &__groups{
                margin-bottom: 20px;
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 10%;
                .step-group{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    &__circle{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #f1f4f8;
                        max-width: 30px;
                        max-height: 30px;
                        min-width: 30px;
                        min-height: 30px;
                        border-radius: 100%;
                        margin-bottom: 5px;
                        font-weight: 600;
                        &.current{
                            cursor: pointer;
                            background: $light-blue-gradient;
                            color: $white;
                        }
                        &.complete{
                            cursor: pointer;
                            background: $green;
                            color: $white;
                        }
                    }
                    &__name{
                        font-weight: 600;
                        font-size: 16px;
                    }
                    &__line{
                        margin: 0 20px;
                        width: 100%;
                        height: 1px;
                        background: #dadada;
                    }
                }
            }
            &__pagination{
                margin-top: 50px;
                .step-dots{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }

    @media (max-width: 992px){
        .pop-up-new-client{
            width: 95vw;
        }
    }

    @media (max-width: 768px){
        .pop-up-new-client{
            border-radius: 0;
            width: 100vw;
            height: 100vh;
            min-width: 100vw;
            min-height: 100vh;
        }
    }

    @media (max-width: 576px){
        .pop-up-new-client{
            padding: 10px;
            .steps{
                margin-top: 50px;
                &__groups{
                    padding: 0 10px;
                    .step-group__line{
                        margin: 0 10px;
                    }
                }
            }
        }
    }
</style>