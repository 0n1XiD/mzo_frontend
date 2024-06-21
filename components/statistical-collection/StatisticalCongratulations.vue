<template>
  <div class="statistical-congratulations statistical-collection">
    <div class="statistical-congratulations__icon">
        <img width="80" height="80" src="@/assets/img/svg/congratulations.svg" alt="congratulations">
    </div>
    <div class="statistical-collection__title">{{$t('statisticalCongratulations.title')}} {{$store.state.userInfo.first_name}}</div>
    <div class="statistical-collection__subtitle">
        {{$t('statisticalCongratulations.subtitle1')}} {{ completeTimes }} 
        <span v-if="completeTimes >= 5">{{$t('statisticalCongratulations.subtitle2')}}</span>
        <span v-else>{{$t('statisticalCongratulations.subtitle3')}}</span>
    </div>
    <div class="statistical-collection__text text-center">
        {{$t('statisticalCongratulations.description1')}} <br>
        {{$t('statisticalCongratulations.description2')}}
    </div>
    <Btn @click="callback($event)" blue :name="$t('statisticalCongratulations.continueBtn')" class="statistical-collection__button"/>
  </div>
</template>

<script>
import '@/assets/css/statistical-collection.scss'

export default {
    props: {
        completeTimes: {
            type: Number,
            default: 7
        }
    },
    methods: {
        callback(e){
            this.$emit('click', e);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">
</style>