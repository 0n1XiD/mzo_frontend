<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="resend-auth-code-popup">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="resend-auth-code-popup__inner">
                <div class="resend-auth-code-popup__title">{{$t('resendCode.title')}}</div>
                <div class="resend-auth-code-popup__subtitle">
                    {{$t('resendCode.subtitle1')}} {{ firstName }} {{ lastName }} 
                    {{$t('resendCode.subtitle2')}} {{ email }}</div>
                <Btn @click="resendAuth()" blue :name="$t('resendCode.sendBtn')" class="resend-auth-code-popup__button"/>
            </div>
        </div>
    </div>
</template>
  
<script>
  export default {
    props: {
        email: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
      },
    methods: {
        closeWindow(){
            this.$emit("close");
        },
        resendAuth(){
            this.$emit("resend");
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
  }
</script>
  
<style lang="scss">
  .resend-auth-code-popup{
    overflow: visible;
    position: relative;
    background: $white;
    padding: 15px 25px 25px 25px;
    width: 400px;
    max-height: 80vh;
    border-radius: 10px;
    &__inner{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    &__title{
        text-align: center;
        margin-bottom: 20px;
        font-weight: 700;
        font-size: 28px;
        line-height: 32px;
    }
    &__subtitle{
        text-align: center;
        font-weight: 600;
        margin-bottom: 20px;
        font-size: 18px;
    }
}

@media (max-width: 768px){
    .resend-auth-code-popup{
        width: 95vw;
        min-width: 95vw;
        &__inner{
            height: 100%;
        }
    }
}

@media (max-width: 576px){
    .resend-auth-code-popup{
        &__title{
            margin-bottom: 10px;
            font-size: 20px;
        }
        &__subtitle{
            margin-bottom: 15px;
            font-size: 16px;
        }
    }
}
</style>