<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('postureIntroductions.title')}}</div>
        <div class="video__inner">
            <video
                ref="video"
                src="https://mzosanki.space/media/video/posture_types_online.mp4"
                preload
                controls
                class="mzo-client-step__video"
            />
        </div>
        <div class="error-text new-client__error" v-if="error">{{$t('postureIntroductions.error')}}</div>
        <div class="new-client__subtitle">
            {{$t('postureIntroductions.subtitle')}}
        </div>
        <div class="new-client__content">
            <div class="new-client__choices">
                <div @click="activeValSide = 'type_1'" class="choices__item" :class="{'choices__item_active': activeValSide == 'type_1'}">
                    <div class="choices__image">
                        <img v-if="userInfo.gender == 'female'" width="110" height="130" src="@/assets/img/questions/type1f.png" alt="type1">
                        <img v-else width="110" height="130" src="@/assets/img/questions/type1.png" alt="type1">
                    </div>
                    <div class="choices__type">{{$t('postureIntroductions.type1')}}</div>
                </div>
                <div @click="activeValSide = 'type_2'" class="choices__item" :class="{'choices__item_active': activeValSide == 'type_2'}">
                    <div class="choices__image">
                        <img v-if="userInfo.gender == 'female'" width="110" height="130" src="@/assets/img/questions/type2f.png" alt="type2">
                        <img v-else width="110" height="130" src="@/assets/img/questions/type2.png" alt="type2">
                    </div>
                    <div class="choices__type">{{$t('postureIntroductions.type2')}}</div>
                </div>
                <div @click="activeValSide = 'type_3'" class="choices__item" :class="{'choices__item_active': activeValSide == 'type_3'}">
                    <div class="choices__image">
                        <img v-if="userInfo.gender == 'female'" width="110" height="130" src="@/assets/img/questions/type3f.png" alt="type3">
                        <img v-else width="110" height="130" src="@/assets/img/questions/type3.png" alt="type3">
                    </div>
                    <div class="choices__type">{{$t('postureIntroductions.type3')}}</div>
                </div>
            </div>
            <div class="error-text" v-if="activeValSideError">{{$t('postureIntroductions.sideError')}}</div>
            <div class="description">
                <div class="description__item">
                    {{$t('postureIntroductions.type1Description')}}
                </div>
                <div class="description__item">
                    {{$t('postureIntroductions.type2Description')}}
                </div>
                <div class="description__item">
                    {{$t('postureIntroductions.type3Description')}}
                </div>
            </div>
            <div class="quiestions">
                <div class="questions__title">
                    {{$t('postureIntroductions.scoliosisTitle')}}
                </div>
                <div class="questions__item">
                    <RadioButton
                        :checked="scoliosis" 
                        v-model="scoliosis" 
                        default
                        :name="$t('postureIntroductions.scoliosisItem1')" 
                        radioName="scoliosis"
                        @input="scoliosis = true"
                    />
                </div>
                <div class="questions__item">
                    <RadioButton 
                        :checked="!scoliosis" 
                        v-model="scoliosis"
                        default 
                        :name="$t('postureIntroductions.scoliosisItem2')"
                        radioName="scoliosis"
                        @input="scoliosis = false"
                    />      
                </div>     
            </div>
            <div class="additional-question">
                <div class="additional-question__content" v-if="!scoliosis">
                    <div class="video__inner">
                        <video
                            ref="video1"
                            src="https://mzosanki.space/media/video/posture_types_front_online.mp4"
                            preload
                            controls
                            class="mzo-client-step__video"
                        />  
                    </div>
                    <div class="description">
                        <div class="description__item">
                            {{$t('postureIntroductions.additionalQuestionDescription1')}}
                        </div>
                        <div class="description__item">
                            {{$t('postureIntroductions.additionalQuestionDescription2')}}
                        </div>
                        <div class="description__item">
                            {{$t('postureIntroductions.additionalQuestionDescription3')}}
                        </div>
                        <div class="description__item">
                            {{$t('postureIntroductions.additionalQuestionDescription4')}}
                        </div>
                        <div class="description__item">
                            {{$t('postureIntroductions.additionalQuestionDescription5')}}
                        </div>
                    </div> 
                    <div class="quiestions">
                        <div class="questions__title">
                            {{$t('postureIntroductions.spreadsTitle')}}
                        </div>
                        <div class="questions__item">
                            <RadioButton 
                                :checked="spreads" 
                                v-model="spreads" 
                                default 
                                :name="$t('postureIntroductions.spreadsItem1')" 
                                radioName="spreads"
                                @input="spreads = true"
                            />
                        </div>
                        <div class="questions__item">
                            <RadioButton 
                                :checked="!spreads" 
                                v-model="spreads" 
                                default 
                                :name="$t('postureIntroductions.spreadsItem2')" 
                                radioName="spreads"
                                @input="spreads = false"
                            />      
                        </div>     
                    </div>
                </div>
            </div>
        </div>
        <Btn blue :name="$t('postureIntroductions.continueBtn')" @click="goToPage(8)"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    data () {
        return{
            error: false,
            scoliosis: true,
            spreads: false,
            activeValSide: null,
            activeValBack: null,
            activeValSideError: false,
        }
    },
    props: {
      max_step: {
        type: Number,
        required: true
      }
    },
    computed:{
        ...mapState(["userInfo"]),
    },
    beforeMount(){
        if(this.userInfo.question_complete){
            if (this.userInfo.posture_side){
                this.activeValSide = this.userInfo.posture_side
            }
            if(this.userInfo.posture_back == 'type_s'){
                this.scoliosis = true
            } else if(this.userInfo.posture_back == 'type_r'){
                this.spreads = true
                this.scoliosis = false
            } else if(this.userInfo.posture_back == 'type_n'){
                this.spreads = false
                this.scoliosis = false
            }
        }
    },
    methods: {
        goToPage: async function(page){
            let error = false
            this.activeValSideError = false
            this.activeValBackError = false
            if (!this.activeValSide){
                this.activeValSideError = true
                error = true
            }
            if (!error){
                if(this.scoliosis){
                    this.activeValBack = "type_s"    
                } else if (!this.scoliosis && this.spreads){
                    this.activeValBack = "type_r"  
                } else if (!this.scoliosis && !this.spreads) {
                    this.activeValBack = "type_n"    
                }
                let form_data= {
                    step: page,
                    posture_side: this.activeValSide,
                    posture_back: this.activeValBack,
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
    }
}
</script>

<style lang="scss" scoped>
.mzo-client-step{
    width: 800px !important;
    .video__inner{
        display: flex;
        justify-content: center;
    }
    &__video{
        margin-bottom: 20px;
        height: 415px;
        width: 100%;
        iframe{
            width: 100%;
            height: 100%;
        }
    }
    .new-client{
        &__content{
            .error-text{
                margin-bottom: 10px;
            }
            .description{
                padding-bottom: 22px;
                margin-bottom: 22px;
                border-bottom: 1px solid #cecccc;
                &__item{
                    &:not(:last-child){
                        margin-bottom: 15px;
                    }
                    font-size: 16px;
                }
            }
            .questions{
                &__title{
                    margin-bottom: 10px;
                    font-size: 16px;    
                }
                &__item{
                    &:not(:last-child){
                        margin-bottom: 6px;
                    }
                }
            }
            .additional-question{
                border-top: 1px solid #cecccc;
                margin-top: 30px;
                &__content{
                    margin-top: 30px;
                    border-bottom: 1px solid #cecccc;
                    padding-bottom: 25px;
                }
            }
        }
        &__choices{
            justify-content: center !important;
        }
    }
}

@media (max-width: 1200px){
    .mzo-client-step{
        width: 650px !important;
        &__video{
            height: 330px;
        }
    }
}

@media (max-width: 992px){
    .mzo-client-step{
        &__video{
            height: 254px;
        }
    }
}

@media (max-width: 576px){
    .mzo-client-step{
        &__video{
            height: 177px;
        }
    }
}
</style>