<template>
  <div class="account-setup-group">
    <MobilityIntroductions v-if="step == 4" :max_step="max_step" @changePage="changePage($event)"/>
    <MobilityQuestion v-if="step == 5" @changePage="changePage($event)"/>
    <MobilutyTest v-if="step == 6" @changePage="changePage($event)"/>
  </div>
</template>

<script>
export default {
    props: {
      current_step: {
        type: Number,
        required: true
      },
      max_step: {
        type: Number,
        required: true
      }
    },
    data () {
      return{
        step: this.current_step,
        local_max_step: this.max_step
      }
    },
    watch: {
      current_step(newValue){
        this.step = newValue
      },
      max_step(newValue){
        this.local_max_step = newValue
      }
    },
    methods: {
      changePage(e){
        this.step = e
        this.local_max_step = e
        this.$emit('changePage', e)
      }
    },
    components: {
        MobilityIntroductions: () => import(`~/components/mzo-client-setup/mobility/MobilityIntroductions.vue`),
        MobilityQuestion: () => import(`~/components/mzo-client-setup/mobility/MobilityQuestion.vue`),
        MobilutyTest: () => import(`~/components/mzo-client-setup/mobility/MobilutyTest.vue`),
    }
}
</script>

<style lang="scss">

</style>