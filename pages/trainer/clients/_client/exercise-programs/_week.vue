<template>
    <div class="trainer-weeks-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients/${client.id}/exercise-programs`)">
                    {{$t('trainerWeek.backLink')}}
                </nuxt-link> 
            </div>
            <div class="trainer-weeks-page__header">
                <div class="title" v-if="!isChangingName">{{ cur_week.name }}</div>
                <img v-if="!isChangingName" @click="isChangingName = true" width="14" height="14" src="@/assets/img/svg/edit.svg" alt="edit" class="edit">
                <InputFields  v-if="isChangingName" v-model="cur_week.name" default placeholder="Email" class="change-title"/>
                <img v-if="isChangingName" @click="isChangingName = false" width="20" height="20" src="@/assets/img/svg/save.svg" alt="save" class="save">
            </div>
            <div class="trainer-weeks-page__instructions page-block">
                <div class="instructions-name page-block__title">{{$t('trainerWeek.addIntsruction')}}</div>
                <textarea 
                    class="textarea" 
                    :placeholder="$t('trainerWeek.placeholder1')"
                    v-model="cur_week.description"
                ></textarea>
            </div>
            <Checkbox
                v-if="trainer.status == 'trainer' || trainer.status == 'mzo_trainer' || !client.rate.auto_week_complete"
                v-model="weekIsOpenForClient"
                @change="!weekIsOpenForClient"
                :value="weekIsOpenForClient"
                class="trainer-weeks-page__open-week" 
                default 
                :name="$t('trainerWeek.openWeek')" 
            />
            <div class="trainer-weeks-page__exercise page-block" v-if="cur_lang == 'ru'">
                <div class="page-block__title">{{$t('trainerWeek.exerciseTitle')}}</div>
                <draggable
                    v-model="exercises"
                    group="exercise" 
                    @start="drag=true" 
                    @end="drag=false"
                    handle=".exercise-item__content_drag-drop"
                >
                    <ExerciseItem 
                        v-for="(exercise, index) in exercises" 
                        :key="exercise.id"
                        :name="exercise.exercise.translations.ru.name"
                        :duration="exercise.duration"
                        :sets="exercise.sets"
                        :repeats="exercise.repeats"
                        :haveDuration="exercise.exercise.have_duration"
                        :haveSets="exercise.exercise.have_sets"
                        @editExercise="editExercises(exercise, index)"
                        @deleteExercise="deleteExercise(exercise, index)"
                        @showExampleExercise="showExampleExercise(exercise.exercise)"
                        @showAlternativeExercise="openAlternativeExercisesPopup(exercise, index)"
                    />
                </draggable>
                <div class="add-new-exercise" @click="openExercisesAddPopup()">{{$t('trainerWeek.addExercise')}}</div>
            </div>
            <div class="trainer-weeks-page__exercise page-block" v-if="cur_lang == 'kk'">
                <div class="page-block__title">{{$t('trainerWeek.exerciseTitle')}}</div>
                <draggable
                    v-model="exercises"
                    group="exercise" 
                    @start="drag=true" 
                    @end="drag=false"
                    handle=".exercise-item__content_drag-drop"
                >
                    <ExerciseItem 
                        v-for="(exercise, index) in exercises" 
                        :key="exercise.id"
                        :name="exercise.exercise.translations.kk.name"
                        :duration="exercise.duration"
                        :sets="exercise.sets"
                        :repeats="exercise.repeats"
                        :haveDuration="exercise.exercise.have_duration"
                        :haveSets="exercise.exercise.have_sets"
                        @editExercise="editExercises(exercise, index)"
                        @deleteExercise="deleteExercise(exercise, index)"
                        @showExampleExercise="showExampleExercise(exercise.exercise)"
                        @showAlternativeExercise="openAlternativeExercisesPopup(exercise, index)"
                    />
                </draggable>
                <div class="add-new-exercise" @click="openExercisesAddPopup()">{{$t('trainerWeek.addExercise')}}</div>
            </div>
            <Btn @click="saveSettings()" blue :name="$t('trainerWeek.saveBtn')" class="trainer-weeks-page__save"/>
        </div>
        <PopupEditExercise 
            v-if="isEdit"
            :isActive="isEdit" 
            :exercise="editExercisesInfo"
            :token="token"
            :lang="cur_lang"
            :isPeriod="isPeriod"
            @close="isEdit = false"
            @click="saveExerciseInfo($event)"
        />
        <PopupAddExercise 
            v-if="isAddExercises" 
            :isActive="isAddExercises" 
            :exercises="all_exercises"
            :userID="client.id"
            :lang="cur_lang"
            :weekID="cur_week.id"
            :token="token"
            :isPeriod="isPeriod"
            @close="isAddExercises = false"
            @click="addExercises($event)"
            @showExample="showExampleExercise($event)"
        />
        <PopupAlternativeExercise 
            v-if="isAlternativeExercises" 
            :isActive="isAddExercises" 
            :exercises="alternative_exercises"
            :userID="client.id"
            :lang="cur_lang"
            :dayID="alternativeDayId"
            :dayIndex="alternativeDayIndex"
            :token="token"
            :isPeriod="isPeriod"
            @close="isAlternativeExercises = false"
            @click="changeExercises($event)"
            @showExample="showExampleExercise($event)"
        />
        <PopupDeleteExercise 
            v-if="isDeleteExercises" 
            :isActive="isDeleteExercises" 
            :exercise="delExercise.id"
            :token="token"
            :isPeriod="isPeriod"
            @close="isDeleteExercises = false"
            @deleteConfirm="deleteExercisesConfirm()"
        />
        <PopupExampleExercise
            v-if="isShowingExample"
            :exercise="example_exercise"
            :lang="cur_lang"
            @close="isShowingExample = false"
        />
    </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
    data: () => ({
      isChangingName: false,
      isEdit: false,
      isAddExercises: false,
      isDeleteExercises: false,
      delExercise: {
        id: null,
        index: null
      },
      editExercisesInfo: {index: 0, id: 0, duration: 0, sets: 0, repeats: 0, haveDuration: true, haveSets: true},
      all_exercises: [],
      alternative_exercises: null,
      alternativeDayId: null,
      alternativeDayIndex: null,
      isShowingExample: false,
      example_exercise: [],
      isAlternativeExercises: false
    }),
    async asyncData({ params, i18n, $axios, store }) {
        let cur_lang = i18n.locale
        let isPeriod = false
        let trainer = store.state.userInfo
        let token = store.state.userInfo.token
        let client = null
        if(store.state.trainer.current_client){
            client = store.state.trainer.current_client
        } else {
            client = await $axios.$get(`/api/v1/user/get-client/?client_id=${params.client}`, {
                headers: { 'Authorization': `Token ${token}` },
            })
            store.commit('trainer/setClientInfo', client)
        }
        let cur_week = []
        let weeks = null
        let exercises = null
        if (client.type != 'pregnant'){
            weeks = await $axios.$get(`/api/v1/user/get-client-weeks/?client_id=${client.id}`, {
                headers: { 'Authorization': `Token ${token}` }
            })
        } else{
            weeks = await $axios.$get(`/api/v1/user/get-client-periods/?client_id=${client.id}`, {
                headers: { 'Authorization': `Token ${token}` }
            })    
            isPeriod = true
        }
        store.commit('trainer/setClientWeeks', weeks)
        cur_week = weeks.find(x=>x.id===parseInt(params.week))
        let weekIsOpenForClient = false
        try{
            weekIsOpenForClient = cur_week.is_available_for_client
        }
        catch{
            if (cur_week == weeks[0]){
                weekIsOpenForClient = true
            }
        }
        if (client.type != 'pregnant'){
            exercises = await $axios.$get(`/api/v1/user/get-client-day/?client_id=${client.id}&week_id=${cur_week.id}`, {
                headers: { 'Authorization': `Token ${token}` }
            })
        } else{
            exercises = await $axios.$get(`/api/v1/user/get-client-period-day/?client_id=${client.id}&week_id=${cur_week.id}`, {
                headers: { 'Authorization': `Token ${token}` }
            }) 
        }
        let old_exercises = exercises
        let old_name = cur_week.name
        let old_description = cur_week.description
        return {client, isPeriod, cur_lang, trainer, token, exercises, cur_week, old_exercises, old_name, old_description, weekIsOpenForClient}
    },
    methods: {
        editExercises(exercise, index){
            this.editExercisesInfo.index = index
            this.editExercisesInfo.id = exercise.id
            this.editExercisesInfo.duration = exercise.duration
            this.editExercisesInfo.sets = exercise.sets
            this.editExercisesInfo.repeats = exercise.repeats
            this.editExercisesInfo.haveDuration = exercise.exercise.have_duration
            this.editExercisesInfo.haveSets = exercise.exercise.have_sets
            this.isEdit = true
        },
        showExampleExercise(exercise){
            this.example_exercise = exercise
            this.isShowingExample = true
        },
        async openExercisesAddPopup(){
            if(this.all_exercises.length == 0){
                this.all_exercises = await this.$axios.$get(`/api/v1/course/exercises`, {
                    headers: { 'Authorization': `Token ${this.token}` }
                })
            }
            this.isAddExercises = true
        },
        async openAlternativeExercisesPopup(exercise, index){
            if(this.all_exercises.length == 0){
                this.all_exercises = await this.$axios.$get(`/api/v1/course/exercises`, {
                    headers: { 'Authorization': `Token ${this.token}` }
                })
            }
            this.alternativeDayId = exercise.id
            this.alternativeDayIndex = index
            this.alternative_exercises = []
            for (let i in exercise.exercise.alternative_exercises){
                this.alternative_exercises.push(this.all_exercises.filter(x=>x.id===exercise.exercise.alternative_exercises[i])[0])
            }
            this.isAlternativeExercises = true
        },
        addExercises(e){
            this.exercises.push(e)
            this.isAddExercises = false
        },
        changeExercises(e){
            this.exercises.splice(e.index, 1, e);
            this.isAlternativeExercises = false
        },
        saveExerciseInfo(e){
            this.exercises[e.index].duration = parseInt(e.duration)
            this.exercises[e.index].sets = parseInt(e.sets)
            this.exercises[e.index].repeats = parseInt(e.repeats)
        },
        async changePosition(){
            for(let i in this.exercises){
                if(this.exercises[i].id != this.old_exercises[i].id){
                    let params = {
                        order_num: i,
                        day_id: this.exercises[i].id
                    }
                    if(this.client.type != 'pregnant'){
                        await this.$axios.$put('/api/v1/user/change-client-day/', params, { 
                            headers: { Authorization: `Token ${this.token}` } 
                        })
                    } else{
                        await this.$axios.$put('/api/v1/user/change-client-period-day/', params, { 
                            headers: { Authorization: `Token ${this.token}` } 
                        })  
                    }
                }
            }
        },
        async changeWeekInfo(){
            if(
                this.cur_week.name != this.old_name || 
                this.cur_week.description != this.old_description ||
                this.weekIsOpenForClient != this.cur_week.is_available_for_client
                ){
                this.cur_week.is_available_for_client = this.weekIsOpenForClient
                let params = {
                    week: JSON.stringify(this.cur_week)
                }
                if(this.client.type != 'pregnant'){
                    await this.$axios.$put('/api/v1/user/update-client-week/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                } else{
                    await this.$axios.$put('/api/v1/user/update-client-period/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    }) 
                }
            }
        },
        saveSettings(){
            this.changePosition()
            this.changeWeekInfo()
            this.$router.go(-1)
        },
        deleteExercise(exercise, index){
            this.delExercise.id = exercise
            this.delExercise.index = index
            this.isDeleteExercises = true
        },
        deleteExercisesConfirm(){
            this.exercises.splice(this.delExercise.index, 1);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        ClientPageNav: () => import('@/components/client-page-nav.vue'),
        ExerciseItem: () => import(`@/components/ExerciseItem.vue`),
        PopupEditExercise: () => import(`@/components/popups/PopupEditExercise.vue`),
        PopupAddExercise: () => import(`@/components/popups/PopupAddExercise.vue`),
        PopupDeleteExercise: () => import(`@/components/popups/PopupDeleteExercise.vue`),
        PopupExampleExercise: () => import(`@/components/popups/PopupExampleExercise.vue`),
        PopupAlternativeExercise: () => import(`@/components/popups/PopupAlternativeExercise.vue`),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
        draggable
    }
}
</script>

<style lang="scss">
.trainer-weeks-page{
    &__header{
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        .title{
            font-weight: 700;
            font-size: 32px;
            line-height: 38px;
        }
        .change-title{
            width: 200px;
        }
        .edit, .save{
            cursor: pointer;
            margin-left: 10px;
        }
    }
    &__instructions{
        .textarea{
            width: 690px;
        }
    }
    &__exercise{
        .add-new-exercise{
            cursor: pointer;
            margin-top: 15px;
            font-weight: 600;
            font-size: 16px;
            line-height: 19px;
            color: #55ACFE;
        }
    }
    &__open-week{
        margin-bottom: 20px;
    }
    &__save{
        width: 300px;
    }
}

@media (max-width: 768px){
    .trainer-weeks-page{
        &__instructions{
            .textarea{
                width: 100%;
            }
        }
    }
}
</style>