<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('historyIntroductions.welcome')}}</div>
        <video
            ref="video"
            src="https://mzosanki.space/media/video/client_setup_welcome.mp4"
            preload
            controls
            class="mzo-client-step__video hello-video" 
        />
        <div class="subtitle">
            {{$t('historyIntroductions.subtitle')}}
        </div>
        <div class="navigation">
            <Btn blue :name="$t('historyIntroductions.continueBtn')" @click="goToPage(1)"/>
            <div class="agreement">
                <Checkbox v-if="max_step == 0" v-model="agreement" default name="" :class="{'checkbox_default checkbox_default_error': error}" />
                <Checkbox v-if="max_step > 0" v-model="agreement"  default disabled name="" class="checkbox_default checkbox_default_disabled" />
                <span>{{$t('historyIntroductions.oferta1')}} <a :href="localePath(`https://mzosanki.com/oferta`)" target="_blank">{{$t('historyIntroductions.oferta2')}}</a> {{$t('historyIntroductions.oferta3')}} <a :href="localePath(`https://mzosanki.com/oferta`)" target="_blank">{{$t('historyIntroductions.oferta4')}}</a>{{$t('historyIntroductions.oferta5')}}</span>
            </div>

        </div>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    data: () => ({
        agreement: false,
        error: false,
    }),
    fetch(){
        if (this.max_step > 0){
            this.agreement = true
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
    methods: {
        async goToPage(page){
            if (this.agreement){
                let form_data= {
                    step: page
                }
                if(this.max_step == 0){
                    await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                        headers: { Authorization: `Token ${this.userInfo.token}`}
                    })
                }
                this.$emit('changePage', page)
            } else {
                this.error = true
            }
        }
    },
    components:{
        Btn: () => import('@/components/controls/Btn.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
    }
}
</script>

<style lang="scss">
.hello-video{
    border-radius: 15px;
    width: 100%;
    height: fit-content;
    margin-bottom: 15px;
}
.navigation{
    display: flex;
    align-items: center;
    .agreement{
        margin-left: 35px;
        display: flex;
        .checkbox_default label::before{
            width: 30px;
            height: 30px;
        }
        .checkbox{
            &_default{
                &_disabled{
                    .custom-checkbox{
                        cursor: not-allowed !important;
                        &:checked + label::before {
                            cursor: not-allowed !important;
                        }
                    }
                }
                &_error{
                    .custom-label::before{
                        border: 1px red solid;
                    }
                }
            }
        }
        a{
            text-decoration: underline;
        }
    }
}

@media (max-width: 576px){
    .navigation{
        flex-direction: column-reverse;
        .agreement{
            margin-left: 10%;
            margin-bottom: 15px;
        }
    }
}
</style>