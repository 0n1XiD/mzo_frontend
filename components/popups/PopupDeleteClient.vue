<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="delete-card-pop-up">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="delete-card-pop-up__title">{{$t('deleteClient.title')}}</div>
            <div class="delete-card-pop-up__subtitle">
                {{$t('deleteClient.subtitle')}}
            </div>
            <div class="delete-card-pop-up__buttons">
                <div class="button-no" @click="closeWindow()">
                    <btn blueBorder :name="$t('deleteClient.noBtn')"/>
                </div>
                <div class="button-yes" @click="deleteConfirm()">
                    <btn blue :name="$t('deleteClient.yesBtn')"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/css/popup-delete.scss'
export default {
    methods: {
        deleteConfirm(){
            this.$emit("deleteConfirm");
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