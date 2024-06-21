<template>
  <div class="wrapper">
    <div class="pop-up__close-bg" @click="closeWindow()"></div>
    <div class="popup-add-exercise pop-up__content">
        <div class="pop-up__close" @click="closeWindow()">
            <img src="@/assets/img/svg/close.svg" alt="close">
        </div>
        <div class="popup-add-exercise__title pop-up__title">{{$t('addReplaceExercise.titleAdd')}}</div>
        <div class="error-text popup-add-exercise__error" v-if="error">{{$t('addReplaceExercise.error')}}</div>
        <div class="popup-add-exercise__show-example" v-if="exercise" @click="showExample()">{{$t('addReplaceExercise.example')}}</div>
        <div class="popup-add-exercise__content">
            <div class="search">
                <div class="search__title" @click="blockProductShow = !blockProductShow">
                    <p v-if="!exercise">{{$t('addReplaceExercise.exerciseName')}}</p>
                    <p v-else-if="exercise && lang == 'ru'">{{ exercise.translations.ru.name }}</p>
                    <p v-else-if="exercise && lang == 'kk'">{{ exercise.translations.kk.name }}</p>
                </div>
                <div class="search__content" v-if="blockProductShow" @mouseleave="blockProductShow = false">
                    <div class="exercises-search">
                        <InputFields v-model="search_product" :placeholder="$t('addReplaceExercise.searchPlaceholder')"/>
                        <div class="exercises-search__content" v-if="lang == 'ru'">
                            <div 
                                class="exercise-item"
                                v-for="(exercise, index) in filteredList(exercises)"
                                :key="`exercise-${index}`"
                                @click="getProductActivity(exercise)"
                            >
                                {{ exercise.translations.ru.name }}
                            </div>
                        </div>
                        <div class="exercises-search__content" v-if="lang == 'kk'">
                            <div 
                                class="exercise-item"
                                v-for="(exercise, index) in filteredList(exercises)"
                                :key="`exercise-${index}`"
                                @click="getProductActivity(exercise)"
                            >
                                {{ exercise.translations.kk.name }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="edit-params" v-if="exercise">
                <div class="comment-input" v-if="exercise.have_duration">
                    <InputFields v-model="exercise.duration" type="number" default placeholder=""/>
                    <div class="comment-input__description">{{$t('addReplaceExercise.seconds')}}</div>
                </div>
                <div class="comment-input" v-if="!exercise.have_duration">
                    <InputFields v-model="exercise.sets" type="number" default placeholder=""/>
                    <div class="comment-input__description">{{$t('addReplaceExercise.sets')}}</div>
                </div>
                <div class="comment-input" v-if="!exercise.have_duration">
                    <InputFields v-model="exercise.repeats" type="number" default placeholder=""/>
                    <div class="comment-input__description">{{$t('addReplaceExercise.repeats')}}</div>
                </div>
            </div>
            <Btn @click="callback()" blue :name="$t('addReplaceExercise.addBtn')"/>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data: () => ({
        blockProductShow: false,
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
        weekID: {
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
        filteredList(filterItems){
            return filterItems.filter((elem) => {
                if(!this.search_product) return true;
                else return elem.name.toLowerCase().indexOf(this.search_product.toLowerCase()) > -1;
            })
        },
        getProductActivity(exercise){
            this.exercise = exercise
            this.blockProductShow = false
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
        async callback() {
            if(this.exercise){
                this.error = false
                let params = {
                    week_id: this.weekID,
                    exercise_id: this.exercise.id,
                    repeats: this.exercise.repeats,
                    sets: this.exercise.sets,
                    duration: this.exercise.duration,
                }
                let new_exercise = null
                if(!this.isAdvanced && !this.isPeriod){
                    new_exercise = await this.$axios.$post('/api/v1/user/add-client-day/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                } 
                if(this.isAdvanced) {
                    new_exercise = await this.$axios.$post('/api/v1/user/add-client-advanced-day/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                }
                if(this.isPeriod) {
                    new_exercise = await this.$axios.$post('/api/v1/user/add-client-period-day/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                }
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
.popup-add-exercise{
    height: 50vh;
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
        .search{
            margin-bottom: 15px;
            position: relative;
            width: 100%;
            &__title{
                margin-bottom: -2px;
                cursor: pointer;
                border: 1px solid #EBEBEB;
                border-radius: 4px;
                padding: 12px;
                height: 48px;
                -webkit-appearance: none;
                -moz-appearance: none;
                background: transparent;
                background-image: url("~/assets/img/svg/drop-down-arrow.svg");
                background-repeat: no-repeat;
                background-position: right 15px center;
                background-size: 12px;
                &:hover{
                    border-color: #409aff;
                }
            }
            &__content{
                position: absolute;
                border: 1px solid #EBEBEB;
                border-radius: 0 0 4px 4px;
                box-shadow: 0px 2px 8px rgba(30, 40, 67, 0.1);
                padding: 15px;
                width: 100%;
                max-height: fit-content;
                z-index: 100;
                background: $white;
                .exercises-search{
                    .input{
                        margin-bottom: 15px;
                        width: 100%;
                        height: 40px;
                        font-size: 17px;
                        line-height: 27px;
                        -webkit-appearance: none;
                        -moz-appearance: none;
                        background: transparent;
                        background-image: url("~/assets/img/svg/search.svg");
                        background-repeat: no-repeat;
                        background-position: right 15px center;
                        background-size: 20px;
                    }
                    &__content{
                        overflow: auto;
                        max-height: 170px;
                        margin-bottom: 10px;
                        .exercise-item{
                            cursor: pointer;
                            &:hover{
                                color: #409aff;
                            }
                        }
                    }
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