<template>
  <div class="complete-reg">
    <div class="complete-reg__title">{{$t('completeReg.title')}}</div>
    <div class="complete-reg__subtitle">{{$t('completeReg.subtitle')}}</div>
    <div class="complete-reg__content">
      <Loader/>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return{}
  },
  components: {
    Loader: () => import(`@/components/Loader.vue`)
  }
}
</script>

<style lang="scss">
.complete-reg{
  padding-top: 20px;
  &__title{
    margin-bottom: 20px;
    font-weight: 700;
    font-size: 28px;
    text-align: center;
  }
  &__subtitle{
    font-weight: 600;
    font-size: 18px;
    text-align: center;
  }
  &__content{
    height: 20vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

@media (max-width: 768px){
  .complete-reg{
    height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>