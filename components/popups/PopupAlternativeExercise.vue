<template>
    <div class="wrapper">
      <div class="pop-up__close-bg" @click="closeWindow()"></div>
      <div class="popup-alternative-exercise pop-up__content">
          <div class="pop-up__close" @click="closeWindow()">
              <img src="@/assets/img/svg/close.svg" alt="close">
          </div>
          <div class="popup-alternative-exercise__title pop-up__title">{{$t('addReplaceExercise.titleReplace')}}</div>
          <div class="popup-alternative-exercise__subtitle" v-if="exercise">{{ exercise.name }}</div>
          <div class="error-text popup-alternative-exercise__error" v-if="error">{{$t('addReplaceExercise.error')}}</div>
          <div class="popup-alternative-exercise__show-example" v-if="exercise" @click="showExample()">{{$t('addReplaceExercise.example')}}</div>
          <div class="popup-alternative-exercise__content">
              <div class="selection-exercise" v-if="!exercise && lang == 'ru'">
                <div 
                    v-for="ex in exercises"
                    :key="ex.id"
                    class="selection-exercise__item"
                    @click="selectExercise(ex)"
                >
                    {{ex.translations.ru.name}}
                </div>
              </div>
              <div class="selection-exercise" v-if="!exercise && lang == 'kk'">
                <div 
                    v-for="ex in exercises"
                    :key="ex.id"
                    class="selection-exercise__item"
                    @click="selectExercise(ex)"
                >
                    {{ex.translations.kk.name}}
                </div>
              </div>
              <div class="edit-params" v-if="exercise">
                  <div class="comment-input" v-if="exercise.have_duration">
                      <InputFields v-model="exercise.duration" type="number" default placeholder=""/>
                      <div class="comment-input__description">{{$t('addReplaceExercise.seconds')}}</div>
                  </div>
                  <div class="comment-input" v-if="exercise.have_sets">
                      <InputFields v-model="exercise.sets" type="number" default placeholder=""/>
                      <div class="comment-input__description">{{$t('addReplaceExercise.sets')}}</div>
                  </div>
                  <div class="comment-input" v-if="!exercise.have_duration">
                      <InputFields v-model="exercise.repeats" type="number" default placeholder=""/>
                      <div class="comment-input__description">{{$t('addReplaceExercise.repeats')}}</div>
                  </div>
              </div>
              <Btn v-if="exercise" @click="changeAnotherExercise()" blueBorder :name="$t('addReplaceExercise.changeExercise')" class="change-btn"/>
              <Btn v-if="exercise" @click="callback()" blue :name="$t('addReplaceExercise.addBtn')"/>
          </div>
      </div>
    </div>
</template>
  
<script>

  export default {
      data: () => ({
          exercise: null,
          search_product: null,
          error: false
      }),
      props: {
          exercises: {
              type: Array,
              required: true
          },
          isActive: {
              type: Boolean,
              required: true
          },
          userID: {
              type: Number,
              required: true
          },
          dayID: {
              type: Number,
              required: true
          },
          dayIndex: {
              type: Number,
              required: true
          },
          token: {
              type: String,
              required: true
          },
        isAdvanced: {
            type: Boolean,
            default: false
        },
        isPeriod: {
            type: Boolean,
            default: false
        },
        lang: {
            type: String,
            default: 'ru'
        }
      },
      methods: {
          selectExercise(exercise){
              this.exercise = exercise
              if(this.exercise){
                  this.error = false
              }
          },
          closeWindow(){
              let active = this.isActive
              this.$emit("close", active);
          },
          showExample(){
              if(this.exercise){
                  this.$emit('showExample', this.exercise);
              }
          },
          changeAnotherExercise(){
            this.exercise = null
          },
          async callback() {
              if(this.exercise){
                  this.error = false
                  let day_data = {
                    sets: this.exercise.sets,
                    repeats: this.exercise.repeats,
                    duration: this.exercise.duration
                  }
                  let params = {
                        day_id: this.dayID,
                        exercise_id: this.exercise.id,
                        repeats: this.exercise.repeats,
                        sets: this.exercise.sets,
                        duration: this.exercise.duration,
                  }
                  let new_exercise = null
                  if(!this.isAdvanced && !this.isPeriod){
                        new_exercise = await this.$axios.$put('/api/v1/user/change-client-day/', params, { 
                            headers: { Authorization: `Token ${this.token}` } 
                        })
                    } 
                    if(this.isAdvanced){
                        new_exercise = await this.$axios.$put('/api/v1/user/change-client-advanced-day/', params, { 
                            headers: { Authorization: `Token ${this.token}` } 
                        })
                    }
                    if(this.isPeriod){
                        new_exercise = await this.$axios.$put('/api/v1/user/change-client-period-day/', params, { 
                            headers: { Authorization: `Token ${this.token}` } 
                        })   
                    }
                  new_exercise.index = this.dayIndex
                  this.$emit('click', new_exercise);
                  this.closeWindow()
              } else {
                  this.error = true
              }
          }
      },
      components: {
          InputFields: () => import('@/components/controls/Input-fields.vue'),
          Btn: () => import('@/components/controls/Btn.vue'),
      }
  }
  </script>
  
<style lang="scss">
  .popup-alternative-exercise{
      height: 50vh;
      &__subtitle{
        margin-top: -10px;
        margin-bottom: 20px;
        font-weight: 600;
      }
      &__content{
        .comment-input{
            display: flex;
            .input{
                width: 80px;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }
            &__description{
                display: flex;
                align-items: center;
                width: 100%;
                border: 1px solid #D9D9D9;
                border-left: none;
                height: 48px;
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                padding: 0 16px;
            }
        }
        .input, .btn{
            width: 100%;
        }
        .input{
            margin-bottom: 15px;
        }
        .change-btn{
            margin-bottom: 10px;
        }
        .selection-exercise{
            &__item{
                cursor: pointer;
                padding: 10px;
                border: 1px solid #DADADA;
                border-radius: 4px;
                &:not(:last-child){
                    margin-bottom: 20px;
                }
                &:hover{
                    color: $white;
                    background: $orange;
                }
            }
        }
      }
      &__error{
          margin-bottom: 20px;
      }
      &__show-example{
          margin-top: -10px;
          cursor: pointer;
          margin-bottom: 10px;
          color: $blue;
          font-size: 16px;
      }
  }
</style>