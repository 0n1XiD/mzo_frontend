<template>
  <div class="mobility-group">
    <MobilityIntroductions v-if="mobilityGroup.step == 1" @click="mobilityGroup.step = 2"/>
    <MobilityStand :answer="mobilityData.stay" v-if="mobilityGroup.step == 2" @click="getStand($event)"/>
    <MobilitySit :answer="mobilityData.sit" v-if="mobilityGroup.step == 3" @click="getSit($event)"/>
    <MobilityStandUp :answer="mobilityData.standup" v-if="mobilityGroup.step == 4" @click="getStandup($event)"/>
    <MobilityTestFirst :answer="mobilityData.test1" v-if="mobilityGroup.step == 5" @click="getTestFirst($event)"/>
    <MobilityTestSecond :answer="mobilityData.test2" v-if="mobilityGroup.step == 6" @click="getTestSecond($event)"/>
    <MobilityTestThird :answer="mobilityData.test3" v-if="mobilityGroup.step == 7" @click="getTestThird($event)"/>

    <div class="steps__pagination">
      <div class="step-dots">
          <div @click="goToStep(step)" class="dot" :class="{'dot_active': step == mobilityGroup.step, 'dot_complete': step <= mobilityGroup.step_complete}" v-for="step in mobilityGroup.step_count" :key="`mobilityGroup-${step}`"></div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
    props: {
      mobilityData: {
        type: Object,
        required: true
      },
      mobilityStepsComplete: {
        type: Number,
      }
    },
    data () {
      return{
        mobilityGroup: {
          step: 1,
          step_complete: this.mobilityStepsComplete,
          step_count: 7
        },
      }
    },
    watch: {
      mobilityStepsComplete(newValue) {
        this.mobilityGroup.step_complete = newValue
      },
    },
    methods: {
      getStand(e) {
        this.mobilityData.stay = e
        this.mobilityGroup.step = 3
        this.mobilityGroup.step_complete = 3
        this.$emit('changePage', this.mobilityGroup.step_complete);
      },
      getSit(e) {
        this.mobilityData.sit = e
        this.mobilityGroup.step = 4
        this.mobilityGroup.step_complete = 4
        this.$emit('changePage', this.mobilityGroup.step_complete);
      },
      getStandup(e) {
        this.mobilityData.standup = e
        this.mobilityGroup.step = 5
        this.mobilityGroup.step_complete = 5
        this.$emit('changePage', this.mobilityGroup.step_complete);
      },
      getTestFirst(e) {
        this.mobilityData.test1 = e
        this.mobilityGroup.step = 6
        this.mobilityGroup.step_complete = 6
        this.$emit('changePage', this.mobilityGroup.step_complete);
      },
      getTestSecond(e) {
        this.mobilityData.test2 = e
        this.mobilityGroup.step = 7
        this.mobilityGroup.step_complete = 7
        this.$emit('changePage', this.mobilityGroup.step_complete);
      },
      getTestThird(e) {
        this.mobilityData.test3 = e
        this.$emit('complete', this.mobilityData);
      },
      goToStep(step){
        if(this.mobilityGroup.step_complete >= step){
          this.mobilityGroup.step = step
        }
      },
    },
    components: {
        MobilityIntroductions: () => import(`~/components/new-client/mobility/MobilityIntroductions.vue`),
        MobilityStand: () => import(`~/components/new-client/mobility/MobilityStand.vue`),
        MobilitySit: () => import(`~/components/new-client/mobility/MobilitySit.vue`),
        MobilityStandUp: () => import(`~/components/new-client/mobility/MobilityStandUp.vue`),
        MobilityTestFirst: () => import(`~/components/new-client/mobility/MobilityTestFirst.vue`),
        MobilityTestSecond: () => import(`~/components/new-client/mobility/MobilityTestSecond.vue`),
        MobilityTestThird: () => import(`~/components/new-client/mobility/MobilityTestThird.vue`),
    }
}
</script>

<style lang="scss">

</style>