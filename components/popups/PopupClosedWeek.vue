<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="closed-week-pop-up">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="closed-week-pop-up__title" v-if="isDisabledText">{{$t('closedWeek.title')}}</div>
            <!-- <div class="closed-week-pop-up__title" v-if="isCompletedText">Неделя полностью пройдена</div> -->
            <div class="closed-week-pop-up__subtitle" v-if="!isTrainer && !isAdvanced">
                {{$t('closedWeek.subtitle1')}} <br>
                {{$t('closedWeek.subtitle2')}}
            </div>
            <div class="closed-week-pop-up__subtitle" v-if="isTrainer && !isAdvanced">
                {{$t('closedWeek.subtitle3')}}
            </div>
            <div class="closed-week-pop-up__subtitle" v-if="isAdvanced && !isTrainer">
                Следующая неделя откроется автоматически после завершения прошлой
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        isTrainer: {
            type: Boolean,
            default: false
        },
        isDisabledText: {
            type: Boolean,
            default: true
        },
        isCompletedText: {
            type: Boolean,
            default: false
        },
        isAdvanced: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        closeWindow(){
            this.$emit("close");
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`)
    }
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
        margin-bottom: 15px;
        font-size: 18px;
    }
}
</style>