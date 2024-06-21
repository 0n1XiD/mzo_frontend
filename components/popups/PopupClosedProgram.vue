<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="closed-week-pop-up">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="closed-week-pop-up__title">Программа закрыта</div>
            <!-- <div class="closed-week-pop-up__title" v-if="isCompletedText">Неделя полностью пройдена</div> -->
            <div class="closed-week-pop-up__subtitle" v-if="!isTrainer">
                Не останавливайтесь на достигнутом! <br>
                После окончания базовой программы МЗО свяжитесь со своим Коучем, чтобы узнать о Продвинутой программе!
            </div>
            <div class="closed-week-pop-up__subtitle" v-if="isTrainer">
                Открыть доступ клиенту?
            </div>
            <div class="closed-week-pop-up__buttons" v-if="isTrainer">
                <div class="button-no" @click="closeWindow()">
                    <btn blueBorder :name="$t('resetWeeks.noBtn')"/>
                </div>
                <div class="button-yes" @click="activateAdvancedWeeks()">
                    <btn blue :name="$t('resetWeeks.yesBtn')"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        closeWindow(){
            this.$emit("close");
        },
        activateAdvancedWeeks(){
            this.$emit("activateAdvancedWeeks");
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`)
    },
    props: {
        isTrainer: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="scss">
.closed-week-pop-up{
    position: relative;
    width: 370px;
    padding: 20px 40px;
    background: $white;
    text-align: -webkit-center;
    border-radius: 15px;
    &__title{
        font-weight: bold;
        margin-bottom: 15px;
        font-size: 24px;
    }
    &__subtitle{
        margin-bottom: 25px;
        font-size: 18px;
    }
    &__buttons{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        button{
            min-width: 35px !important;
            width: 125px !important;
            height: 40px !important;
            .btn{
                width: 125px !important;   
                height: 40px !important;
            }
        }
    }
}
</style>