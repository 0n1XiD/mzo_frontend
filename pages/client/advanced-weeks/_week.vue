<template>
  <div class="client-exercise">
    <div class="_container">
      <div class="main__breadcrumbs">
        <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
        <nuxt-link :to="localePath(`/client/advanced-weeks`)">
            Вернуться назад
        </nuxt-link> 
      </div>
      <div class="main__title">
        <div class="main__title main__title_name">
          {{ cur_week.name }} <span>({{$t('exercise.day')}} {{ cur_week.complete_count + 1}})</span>
        </div>
        <div class="main__title main__title_count" v-if="active_exercises.order_num < exercises.length">
          {{$t('exercise.exercise')}} {{active_exercises.order_num + 1}}/{{exercises.length}}
        </div>
        <div class="main__title main__title_count" v-else-if="active_exercises.order_num = exercises.length">
          {{$t('exercise.exercise')}} {{active_exercises.order_num}}/{{exercises.length}}
        </div>
      </div>
      <div class="client-exercise__trainer-comment" v-if="cur_week.description">
        <div class="page-block__title">{{$t('exercise.comment')}}</div>
        <div class="comment">{{ cur_week.description}}</div>
      </div>
      <div class="client-exercise__exercise" v-if="cur_lang == 'ru'">
          <div class="exercise-content">
            <div class="exercise-content__selection" v-if="active_exercises.exercise.translations.ru.video">
              <div class="select-item" :class="{'active' : isVideo}" @click="isVideo = true">{{$t('exercise.video')}}</div>
              <div class="select-item" :class="{'active' : !isVideo}" @click="isVideo = false">{{$t('exercise.photo')}}</div>
            </div>
            <div class="exercise-content__video" v-if="isVideo && active_exercises.exercise.translations.ru.video">
                <video
                  ref="video"
                  :src="active_exercises.exercise.translations.ru.video"
                  preload="auto"
                  controls
                  class="exercise-video"
                />
            </div>
            <div class="exercise-content__photo" v-if="!isVideo || !active_exercises.exercise.translations.ru.video">
              <img width="330" height="330" :src="active_exercises.exercise.photo1" alt="photo1">
              <img width="330" height="330" :src="active_exercises.exercise.photo2" alt="photo2">
            </div>
            <div class="exercise-content__info">
              <div class="info-header">
                <div class="info-header__title">{{active_exercises.exercise.translations.ru.name}}</div>
                <div class="info-header__controls" v-if="active_exercises.exercise.have_duration">
                  <div class="start exercise-btn" @click="startTimer()" v-if="!isRunning">{{$t('exercise.startBtn')}}</div>
                  <div class="stop exercise-btn" @click="stopTimer()" v-if="isRunning">{{$t('exercise.stopBtn')}}</div>
                  <Timer :time="prettyTime"/>
                  <div class="resrt exercise-btn" @click="resetTimer()">{{$t('exercise.resetBtn')}}</div>
                </div>
                <div class="info-header__repeats-and-sets" v-if="active_exercises.exercise.repeats || active_exercises.exercise.sets">
                  <div class="repeats" v-if="active_exercises.repeats">{{$t('exercise.repeats')}} {{ active_exercises.sets }}</div>
                  <div class="sets" v-if="active_exercises.exercise.have_sets && active_exercises.sets">{{$t('exercise.sets')}} {{ active_exercises.repeats }}</div>
                </div>
              </div>
              <div class="exercise-description" v-html="active_exercises.exercise.translations.ru.description"></div>
            </div>
          </div>
          <div class="client-exercise__exercise client-exercise__exercise_navigation">
            <Btn @click="previousExercise()" v-if="active_exercises.order_num > 0" :disabled='isDisabled' blueBorder :name="$t('exercise.backBth')" class="previous-exercise"/>
            <Btn @click="nextExercise()" :disabled='isDisabled' blue :name="$t('exercise.continueBtn')" v-if="active_exercises.ex_number < exercises.length" class="complete-exercise" :class="{'complete-exercise complete-exercise_stretch': active_exercises.order_num > 0}"/>
            <Btn @click="nextExercise(true)" :disabled='isDisabled' blue :name="$t('exercise.endBtn')" v-if="active_exercises.ex_number == exercises.length" :class="{'complete-exercise complete-exercise_stretch': active_exercises.order_num > 0}"/>
          </div>
      </div>
      <div class="client-exercise__exercise" v-if="cur_lang == 'kk'">
          <div class="exercise-content">
            <div class="exercise-content__selection" v-if="active_exercises.exercise.translations.kk.video">
              <div class="select-item" :class="{'active' : isVideo}" @click="isVideo = true">{{$t('exercise.video')}}</div>
              <div class="select-item" :class="{'active' : !isVideo}" @click="isVideo = false">{{$t('exercise.photo')}}</div>
            </div>
            <div class="exercise-content__video" v-if="isVideo && active_exercises.exercise.translations.kk.video">
                <video
                  ref="video"
                  :src="active_exercises.exercise.translations.kk.video"
                  preload="auto"
                  controls
                  class="exercise-video"
                />
            </div>
            <div class="exercise-content__photo" v-if="!isVideo || !active_exercises.exercise.translations.kk.video">
              <img width="330" height="330" :src="active_exercises.exercise.photo1" alt="photo1">
              <img width="330" height="330" :src="active_exercises.exercise.photo2" alt="photo2">
            </div>
            <div class="exercise-content__info">
              <div class="info-header">
                <div class="info-header__title">{{active_exercises.exercise.translations.kk.name}}</div>
                <div class="info-header__controls" v-if="active_exercises.exercise.have_duration">
                  <div class="start exercise-btn" @click="startTimer()" v-if="!isRunning">{{$t('exercise.startBtn')}}</div>
                  <div class="stop exercise-btn" @click="stopTimer()" v-if="isRunning">{{$t('exercise.stopBtn')}}</div>
                  <Timer :time="prettyTime"/>
                  <div class="resrt exercise-btn" @click="resetTimer()">{{$t('exercise.resetBtn')}}</div>
                </div>
                <div class="info-header__repeats-and-sets" v-if="active_exercises.exercise.repeats || active_exercises.exercise.sets">
                  <div class="repeats" v-if="active_exercises.repeats">{{$t('exercise.repeats')}} {{ active_exercises.sets }}</div>
                  <div class="sets" v-if="active_exercises.exercise.have_sets && active_exercises.sets">{{$t('exercise.sets')}} {{ active_exercises.repeats }}</div>
                </div>
              </div>
              <div class="exercise-description" v-html="active_exercises.exercise.translations.kk.description"></div>
            </div>
          </div>
          <div class="client-exercise__exercise client-exercise__exercise_navigation">
            <Btn @click="previousExercise()" v-if="active_exercises.order_num > 0" :disabled='isDisabled' blueBorder :name="$t('exercise.backBth')" class="previous-exercise"/>
            <Btn @click="nextExercise()" :disabled='isDisabled' blue :name="$t('exercise.continueBtn')" v-if="active_exercises.ex_number < exercises.length" class="complete-exercise" :class="{'complete-exercise complete-exercise_stretch': active_exercises.order_num > 0}"/>
            <Btn @click="nextExercise(true)" :disabled='isDisabled' blue :name="$t('exercise.endBtn')" v-if="active_exercises.ex_number == exercises.length" :class="{'complete-exercise complete-exercise_stretch': active_exercises.order_num > 0}"/>
          </div>
      </div>
    </div>

  </div>
</template>

<script>
import '@/assets/css/exercise-content.scss'

export default {
  data(){
    return{
      isRunning: false,
      isVideo: true,
      showStatistical: false,
      showCompleteDay: false,
      completeTimes: 7,
      isDisabled: false
    }
  },
  async asyncData({ $axios, i18n, params, store, redirect, require }) {
    // TODO: change this
    console.log(i18n.locale)
    let cur_lang = i18n.locale

    let token = store.state.userInfo.token
    let client = store.state.userInfo
    let cur_week = []
    let cur_week_index = -1

    let weeks = []
    let new_weeks = []
    if(!store.state.client.client_advanced_weeks){
      weeks = await $axios.$get(`/api/v1/user/get-client-advanced-weeks/?client_id=${client.id}`, {
        headers: { 'Authorization': `Token ${token}` }
      })
      store.commit('client/setClientAdvancedWeeks', weeks)
      weeks = weeks
    } else {
      weeks = store.state.client.client_advanced_weeks
    }
    cur_week = weeks.find(x=>x.id===parseInt(params.week))
    cur_week_index = store.state.client.client_advanced_weeks.findIndex(x=>x.id===parseInt(params.week))

    console.log(store.state.client.client_advanced_weeks)
    let exercises = []
    let active_exercises = null
    let time = null
    exercises = await $axios.$get(`/api/v1/user/get-client-advanced-day/?client_id=${client.id}&week_id=${params.week}`, {
      headers: { 'Authorization': `Token ${token}` }
    })
    for(let i in exercises){
      if(exercises[i].complete_count != cur_week.complete_count + 1){
        active_exercises = exercises[i]
        active_exercises.ex_number = parseInt(i) + 1
        break
      }
    }
    if (!active_exercises){
      active_exercises = exercises[0]
    }
    console.log(cur_week_index)
      time = active_exercises.duration
    return {client, token, exercises, cur_lang, cur_week, active_exercises, time, weeks, cur_week_index}
  },
  methods: {
    startTimer () {
      this.isRunning = true
      if (!this.timer) {
        this.timer = setInterval( () => {
          if (this.time > 0) {
            this.time--
          } else {
            new Audio(require('@/assets/audio/time_end.m4a')).play()
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
      if (this.cur_week.is_additional){
        this.time = this.active_exercises.exercise.duration
      } else {
        this.time = this.active_exercises.duration
      }
    },
    async previousExercise(){
      let params = {
        day_id: this.exercises[this.active_exercises.order_num - 1].id,
      }
      await this.$axios.$post('/api/v1/user/previous-client-advanced-day/', params, { 
        headers: { Authorization: `Token ${this.token}` } 
      }).catch(e => {
        console.log(e.response)
      })
      let index = this.active_exercises.ex_number - 1
      this.active_exercises = this.exercises[index - 1]
      this.active_exercises.ex_number = index
      if (this.cur_week.is_additional){
        this.time = this.active_exercises.exercise.duration
      } else {
        this.time = this.active_exercises.duration
      }
    },
    async nextExercise(complete=false){
      this.isDisabled = true
      let params = {
        day_id: this.active_exercises.id,
        is_advanced: true,
      }
      if (
        complete
      ) {
        params.week_id = this.cur_week.id
        params.complete = true
      }
      await this.$axios.$post('/api/v1/user/complete-client-day/', params, { 
        headers: { Authorization: `Token ${this.token}` } 
      }).catch(e => console.log(e.response))

      !complete ? this.completeExercise() : this.completeDay()
    },
    completeExercise(){
      let index = this.active_exercises.ex_number
      this.active_exercises = this.exercises[index]
      this.active_exercises.ex_number = index + 1
      if (this.cur_week.is_additional){
        this.time = this.active_exercises.exercise.duration
      } else {
        this.time = this.active_exercises.duration
      }
      setTimeout(() => {
        this.isDisabled = false
      }, 500)
      
    },
    completeDay(){
        this.completeTimes = this.cur_week.complete_count + 1
        console.log(this.completeTimes)
        this.$store.commit('client/setClientAdvancedWeeks', this.$store.state.client.client_advanced_weeks)
        if(this.completeTimes == 7) this.completeWeek()
        window.location.href = this.localePath('/client/advanced-weeks')
    },
    async completeWeek(){
      try{
        let next_week = this.weeks
        if(this.client.status == 'online_client'){
          console.log((parseInt(this.cur_week_index) + 1) % 4)
          console.log(this.client.rate.mouth_open_advanced_week)
          if ((parseInt(this.cur_week_index) + 1) % 4 == 0){
            if (!this.client.rate.mouth_open_advanced_week){
              next_week[this.cur_week_index + 1].is_available_for_trainer = true
              next_week[this.cur_week_index + 1].is_available_for_client = true
            } else if (this.client.rate.mouth_open_advanced_week) {
              next_week[this.cur_week_index + 1].is_available_for_trainer = false
              next_week[this.cur_week_index + 1].is_available_for_client = false
              await this.$axios.$post(`/api/v1/user/set-client-awaiting-month/?client_id=${this.client.id}`, {}, { 
                headers: { Authorization: `Token ${this.token}` } 
              })
            }
          } else{
            next_week[this.cur_week_index + 1].is_available_for_trainer = true
            next_week[this.cur_week_index + 1].is_available_for_client = true
          }
        } else {
          next_week[this.cur_week_index + 1].is_available_for_trainer = true
          next_week[this.cur_week_index + 1].is_available_for_client = true
        }
        console.log(next_week[this.cur_week_index + 1])
        let params = {
          week: JSON.stringify(next_week[this.cur_week_index + 1])
        }
        await this.$axios.$put('/api/v1/user/update-client-advanced-week/', params, { 
          headers: { Authorization: `Token ${this.token}` } 
        })
      } catch(e) {
        console.log(e.response)
      }
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
    StatisticalGroup: () => import(`@/components/statistical-collection/StatisticalGroup.vue`),
    MzoStatisticalGroup: () => import(`@/components/mzo-client-statistical-collection/MzoStatisticalGroup.vue`),
    PopupCompleteDay: () => import(`@/components/popups/PopupCompleteDay.vue`)
  }
}
</script>

<style lang="scss">
.client-exercise{
  .main__title{
    max-width: 690px;
    &_name{
      span{
        font-weight: 600;
        color: #797b7e;
        margin-bottom: 5px;
        margin-left: 3px;
      }
    }
    &_count{
      font-weight: 500;
      font-family: 'Gilroy';
      font-size: 24px;
    }
  }
  &__trainer-comment{
    margin-bottom: 30px;
    width: 690px;
    .comment{
      overflow: auto;
      padding: 10px;
      width: 100%;
      max-height: 150px;
      resize: none;
      font-size: 16px;
      line-height: 21px;
      border: 1px solid #EBEBEB;
      border-radius: 8px;  
      word-wrap: break-word;
    }
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
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    &_navigation{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn{
        &_blue-border{
          padding: 0 20px;
          height: 50px;
          font-size: 18px;
          line-height: 21px;
          font-weight: 500;
        }
      }
    }
  }
}

@media (max-width: 992px){
  .client-exercise{
    width: 100%;
    &__trainer-comment{
      width: 100%;
    }
    &__exercise{
      width: 100%;
    }
  }
}

@media (max-width: 768px){
  .client-exercise{
    margin-bottom: 200px;
    .previous-exercise{
      z-index: 1200;
      display: flex;
      align-items: center;
      height: 50px;
      position: fixed;
      bottom: 80px;
      left: 0;
      right: 0;
      margin: auto;
      width: 90%;
      border-radius: 15px;
      box-shadow: 0px -2px 30px rgba(0, 0, 0, 0.25);
      &:hover{
        opacity: 1;
      }
    }
    .complete-exercise{
      z-index: 1200;
      display: flex;
      align-items: center;
      height: 50px;
      position: fixed;
      bottom: 80px;
      left: 0;
      right: 0;
      margin: auto;
      width: 90%;
      border-radius: 15px;
      box-shadow: 0px -2px 30px rgba(0, 0, 0, 0.25);
      &:hover{
        opacity: 1;
      }
      &_stretch{
        bottom: 140px
      }
    }
  }
}
</style>