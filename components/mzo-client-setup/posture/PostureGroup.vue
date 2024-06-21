<template>
  <div class="posture-group">
    <PostureIntroductions v-if="step == 7" :max_step="max_step" @changePage="changePage($event)"/>
    <PosturePhotos v-if="step == 8" @changePage="changePage($event)"/>
    <PostureFinal v-if="step == 9" @changePage="changePage($event)"/>

    <!-- <PostureSide :gender="postureData.gender" :active_side="postureData.posture_side" v-if="postureGroup.step == 3" @click="getSidePosture($event)"/>
    <PostureBack :gender="postureData.gender" :active_back="postureData.posture_back" v-if="postureGroup.step == 4" @click="getBackPosture($event)"/> -->
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
      local_max_step: this.max_step,
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
    },
  },
  components: {
    PostureIntroductions: () => import(`~/components/mzo-client-setup/posture/PostureIntroductions.vue`),
    PosturePhotos: () => import(`~/components/mzo-client-setup/posture/PosturePhotos.vue`),
    PostureFinal: () => import(`~/components/mzo-client-setup/posture/PostureFinal.vue`),
  }
}
</script>

<style lang="scss">

</style>