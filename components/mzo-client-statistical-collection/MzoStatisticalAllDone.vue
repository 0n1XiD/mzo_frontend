<template>
  <div class="statistical-all-done statistical-collection">
    <div class="statistical-all-done__icon">
        <img width="100" height="100" src="@/assets/img/svg/all-done.svg" alt="all-done">
    </div>
    <div class="statistical-collection__title">{{$t('mzoStatisticalAllDone.title')}}</div>
    <div class="statistical-collection__subtitle">
        {{$t('mzoStatisticalAllDone.subtitle1')}} <br>
        {{$t('mzoStatisticalAllDone.subtitle2')}}
    </div>
    <Btn @click="callback($event)" blue :name="$t('mzoStatisticalAllDone.continueBtn')" class="statistical-collection__button"/>
  </div>
</template>

<script>
import '@/assets/css/statistical-collection.scss'

export default {
    methods: {
        callback(e){
            this.$emit('complete');
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">
.statistical-all-done{
    &__icon{
        margin-bottom: 20px;
    }
}

@media (max-width: 576px){
    .statistical-all-done{
        &__icon{
            margin-bottom: 10px;
        }
    }
}
</style>