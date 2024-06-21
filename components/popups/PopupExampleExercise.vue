<template>
  <div class="wrapper">
    <div class="pop-up__close-bg" @click="closeWindow()"></div>
    <div class="popup-example-exercise pop-up__content">
        <div class="pop-up__close" @click="closeWindow()">
            <img src="@/assets/img/svg/close.svg" alt="close">
        </div>
        <div class="popup-example-exercise__title pop-up__title">{{$t('exampleExercise.title')}}</div>
        <div class="popup-example-exercise__exercise">
          <div class="exercise-content" v-if="lang=='ru'">
            <div class="exercise-content__selection" v-if="exercise.translations.ru.video">
              <div class="select-item" :class="{'active' : isVideo}" @click="isVideo = true">{{$t('exampleExercise.video')}}</div>
              <div class="select-item" :class="{'active' : !isVideo}" @click="isVideo = false">{{$t('exampleExercise.photo')}}</div>
            </div>
            <div class="exercise-content__video" v-if="isVideo && exercise.translations.ru.video">
              <video
                class="exercise-video"
                ref="video"
                :src="exercise.translations.ru.video"
                preload
                controls
              /> 
            </div>
            <div class="exercise-content__photo" v-if="!isVideo || !exercise.translations.ru.video">
              <img width="330" height="330" :src="exercise.photo1" alt="photo1">
              <img width="330" height="330" :src="exercise.photo2" alt="photo2">
            </div>
            <div class="exercise-content__info">
              <div class="info-header">
                <div class="info-header__title">{{exercise.name}}</div>
                <div class="info-header__controls" v-if="exercise.have_duration">
                  <div class="start exercise-btn" @click="startTimer()" v-if="!isRunning">{{$t('exampleExercise.startBtn')}}</div>
                  <div class="stop exercise-btn" @click="stopTimer()" v-if="isRunning">{{$t('exampleExercise.stopBtn')}}</div>
                  <Timer :time="prettyTime"/>
                  <div class="resrt exercise-btn" @click="resetTimer()">{{$t('exampleExercise.resetBtn')}}</div>
                </div>
                <div class="info-header__repeats-and-sets" v-if="exercise.repeats || exercise.sets">
                  <div class="repeats" v-if="exercise.repeats">{{ exercise.repeats }} {{$t('exampleExercise.repeatsDescription')}}</div>
                  <div class="sets" v-if="exercise.have_sets && exercise.sets">{{$t('exampleExercise.setsDescription')}} {{ exercise.sets }}</div>
                </div>
              </div>
              <div class="exercise-description" v-html="exercise.description"></div>
            </div>
          </div>
          <div class="exercise-content" v-if="lang=='kk'">
            <div class="exercise-content__selection" v-if="exercise.translations.kk.video">
              <div class="select-item" :class="{'active' : isVideo}" @click="isVideo = true">{{$t('exampleExercise.video')}}</div>
              <div class="select-item" :class="{'active' : !isVideo}" @click="isVideo = false">{{$t('exampleExercise.photo')}}</div>
            </div>
            <div class="exercise-content__video" v-if="isVideo && exercise.translations.kk.video">
              <video
                class="exercise-video"
                ref="video"
                :src="exercise.translations.kk.video"
                preload
                controls
              /> 
            </div>
            <div class="exercise-content__photo" v-if="!isVideo || !exercise.translations.kk.video">
              <img width="330" height="330" :src="exercise.photo1" alt="photo1">
              <img width="330" height="330" :src="exercise.photo2" alt="photo2">
            </div>
            <div class="exercise-content__info">
              <div class="info-header">
                <div class="info-header__title">{{exercise.name}}</div>
                <div class="info-header__controls" v-if="exercise.have_duration">
                  <div class="start exercise-btn" @click="startTimer()" v-if="!isRunning">{{$t('exampleExercise.startBtn')}}</div>
                  <div class="stop exercise-btn" @click="stopTimer()" v-if="isRunning">{{$t('exampleExercise.stopBtn')}}</div>
                  <Timer :time="prettyTime"/>
                  <div class="resrt exercise-btn" @click="resetTimer()">{{$t('exampleExercise.resetBtn')}}</div>
                </div>
                <div class="info-header__repeats-and-sets" v-if="exercise.repeats || exercise.sets">
                  <div class="repeats" v-if="exercise.repeats">{{ exercise.repeats }} {{$t('exampleExercise.repeatsDescription')}}</div>
                  <div class="sets" v-if="exercise.have_sets && exercise.sets">{{$t('exampleExercise.setsDescription')}} {{ exercise.sets }}</div>
                </div>
              </div>
              <div class="exercise-description" v-html="exercise.description"></div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/exercise-content.scss'

export default {
    props: {
        exercise: {
            type: Object,
            required: true
        },
        lang: {
            type: String,
            default: 'ru'
        }
    },
    data(){
        return{
            isRunning: false,
            isVideo: true,
            time: this.exercise.duration,
        }
    },
    watch: {
        exercise(newValue){
            this.exercise = newValue
        }
    },
    methods: {
        closeWindow(){
            let active = this.isActive
            this.$emit("close", active);
        },
        startTimer () {
            this.isRunning = true
            if (!this.timer) {
                this.timer = setInterval( () => {
                    if (this.time > 0) {
                        this.time--
                    } else {
                        clearInterval(this.timer)
                        this.resetTimer() 
                    }
                }, 1000 )
            }
        },
        stopTimer () {
            this.isRunning = false
            clearInterval(this.timer)
            this.timer = null
        },
        resetTimer () {
            this.stopTimer()
            this.time = this.exercise.duration
        },
    },
    computed: {
      prettyTime () {
        let time = this.time / 60
        let minutes = parseInt(time)
        let secondes = Math.round((time - minutes) * 60)
        return minutes+":"+secondes
      }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        Timer: () => import(`@/components/Timer.vue`),
    }
}
</script>

<style lang="scss">
.popup-example-exercise{
    max-width: 690px;
    &.pop-up__content{
        width: 80vw;
        height: 80vh;
    }
    &__exercise{
    max-width: 690px;
    width: 100%;
    .exercise-content{
      &__video{
        margin-bottom: 10px;
        height: 100%;
        width: 100%;
        .exercise-video{
          height: 100%;
          width: 100%;
          iframe{
            height: 100%;
          }
        }
      }
    }
  }
}

@media (max-width: 576px){
  &.pop-up__content{
    width: 100vw !important;
  }
}
</style>