<template>
  <div class="photos-item" @mouseenter="isManagement = true" @mouseleave="isManagement = false">
    <div class="photos-item__date" v-if="date">{{ date.replaceAll('-', '/') }}</div>
    <img width="240" height="360" :src="photo.image" alt="photos-item">
    <div class="photos-item__management" v-if="isManagement || compare">
        <Checkbox
          v-if="isManagement" 
          v-model="compare"
          @change="addRemoveToComparison($event)"
          class="comparison" 
          default 
          :name="$t('photosItem.compare')" 
        />
        <div v-if="isManagement" class="delete" @click="deletePhoto()">{{$t('photosItem.delete')}}</div>
        <p v-if="compare && !isManagement" class="in-comparison">{{$t('photosItem.inComparison')}}</p>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    isManagement: false,
    compare: false
  }),
  props: {
    photo: {
      type: Object,
      required: true
    },
    date: {
      type: String
    },
  },
  methods: {
    callback(e) {
      this.compare = true
      this.$emit('click', e);
    },
    deletePhoto() {
      this.$emit('delete', this.photo);
    },
    addRemoveToComparison(e){
      let info = {
        compare: this.compare,
        photo: this.photo
      }
      this.$emit('addRemoveToComparison', info);
    }
  },
  components: {
    Checkbox: () => import('@/components/controls/Checkbox.vue'),
  }
}
</script>

<style lang="scss">
.photos-item{
  width: 240px;
  height: 360px;
  position: relative;
  background: $white;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  overflow: hidden;
  img{
    object-fit: fill;
  }
  &__date{
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    color: $blue;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.10);
  }
  &__management{
    justify-content: center;
    display: flex;
    align-items: center;
    position: absolute;
    background: $white;
    opacity: 0.9;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    width: -webkit-fill-available;
    margin: 15px;
    padding: 15px;
    bottom: 0;
    .comparison{
      margin-right: 10px;
      label{
        font-size: 14px;
      }
    }
    .delete{
      cursor: pointer;
      color: $red;
      font-weight: 500;
      font-size: 14px;
    }
    .in-comparison{
      color: $blue;
      font-size: 12px;
    }
  }
}

@media (max-width: 576px){
  .photos-item{
  width: 100%;
  height: initial;
  img{
    width: 100%;
    height: 100%;
  }
  }
}
</style>