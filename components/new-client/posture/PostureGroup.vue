<template>
  <div class="posture-group">
    <PostureIntroductions v-if="postureGroup.step == 1" @click="postureGroup.step = 2"/>
    <PosturePhotos :data_photos="postureData.photos" v-if="postureGroup.step == 2" @click="getPhotos($event)"/>
    <PostureSide :gender="postureData.gender" :active_side="postureData.posture_side" v-if="postureGroup.step == 3" @click="getSidePosture($event)"/>
    <PostureBack :gender="postureData.gender" :active_back="postureData.posture_back" v-if="postureGroup.step == 4" @click="getBackPosture($event)"/>

    <div class="steps__pagination">
      <div class="step-dots">
          <div @click="goToStep(step)" class="dot" :class="{'dot_active': step == postureGroup.step, 'dot_complete': step <= postureGroup.step_complete}" v-for="step in postureGroup.step_count" :key="`postureGroup-${step}`"></div>
      </div>
    </div>

    <CropImage 
      v-if="isCrop"
      :isActive="isCrop" 
      :photo="cropPhoto" 
      @close="isCrop = false" 
      @save="photos[$event.index].src = $event.photo"
    />
  </div>
</template>

<script>
export default {
  props: {
    postureData: {
      type: Object,
      required: true
    },
    postureStepsComplete: {
      type: Number,
    }
  },
  data () {
    return{
      postureGroup: {
        isActive: false,
        isComplete: false,
        step: 1,
        step_complete: this.postureStepsComplete,
        step_count: 4
      },
      isCrop: false,
      cropPhoto: {}
    }
  },
  watch: {
    postureStepsComplete(newValue) {
      this.postureGroup.step_complete = newValue
    },
  },
  methods: {
    getPhotos(e) {
      this.postureData.photos = e
      this.postureGroup.step = 3
      this.postureGroup.step_complete = 3
      this.$emit('changePage', this.postureGroup.step_complete);
    },
    getSidePosture(e) {
      this.postureData.posture_side = e
      this.postureGroup.step = 4
      this.postureGroup.step_complete = 4
      this.$emit('changePage', this.postureGroup.step_complete);
    },
    getBackPosture(e) {
      this.postureData.posture_back = e
      this.$emit('complete', this.postureData);
    },
    goToStep(step){
      if(this.postureGroup.step_complete >= step){
        this.postureGroup.step = step
      }
    },
  },
  components: {
    PostureIntroductions: () => import(`~/components/new-client/posture/PostureIntroductions.vue`),
    PosturePhotos: () => import(`~/components/new-client/posture/PosturePhotos.vue`),
    PostureSide: () => import(`~/components/new-client/posture/PostureSide.vue`),
    PostureBack: () => import(`~/components/new-client/posture/PostureBack.vue`),

    CropImage: () => import(`~/components/CropImage.vue`),
  }
}
</script>

<style lang="scss">

</style>