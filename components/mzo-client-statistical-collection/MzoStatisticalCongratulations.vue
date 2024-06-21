<template>
  <div class="statistical-congratulations statistical-collection">
    <div class="statistical-congratulations__icon">
        <img width="80" height="80" src="@/assets/img/svg/congratulations.svg" alt="congratulations">
    </div>
    <div class="statistical-collection__title">{{$t('mzoStatisticalCongratulations.title')}} {{$store.state.userInfo.first_name}}</div>
    <div class="statistical-collection__subtitle">
        {{$t('mzoStatisticalCongratulations.subtitle1')}} {{ completeTimes }} {{$t('mzoStatisticalCongratulations.subtitle2')}}
    </div>
    <div class="statistical-collection__text text-center">
        {{$t('mzoStatisticalCongratulations.description')}}
    </div>
    <Btn @click="callback()" blue :name="$t('mzoStatisticalCongratulations.continueBtn')" class="statistical-collection__button"/>
  </div>
</template>

<script>
import '@/assets/css/statistical-collection.scss'

export default {
    props: {
        completeTimes: {
            type: Number,
            default: 7
        },
        staticInfoData: {
            type: Object,
            required: true
        }
    },
    data () {
        return{
            localStaticInfoData: this.staticInfoData
        }
    },
    watch: {
        staticInfoData(newValue){
            this.localStaticInfoData = newValue
        }
    },
    methods: {
        callback(){
            this.$emit('click', this.localStaticInfoData);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">
</style>