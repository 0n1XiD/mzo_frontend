<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="delete-card-pop-up">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="delete-card-pop-up__title">{{$t('resetWeeks.title')}}</div>
            <div class="delete-card-pop-up__subtitle">
                {{$t('resetWeeks.subtitle')}}
            </div>
            <div class="delete-card-pop-up__buttons">
                <div class="button-no" @click="closeWindow()">
                    <btn blueBorder :name="$t('resetWeeks.noBtn')"/>
                </div>
                <div class="button-yes" @click="resetWeeksConfirm()">
                    <btn blue :name="$t('resetWeeks.yesBtn')"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/css/popup-delete.scss'
export default {
    methods: {
        resetWeeksConfirm(){
            this.$emit("resetWeeksConfirm");
        },
        closeWindow(){
            this.$emit("close");
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`)
    }
}
</script>