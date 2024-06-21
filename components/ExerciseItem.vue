<template>
  <div class="exercise-item">
    <div class="exercise-item__content">
        <div class="exercise-item__name exercise-item__item">{{ name }} |</div>
        <div class="exercise-item__duration exercise-item__item" v-if="haveDuration">{{ duration }} {{$t('exerciseItem.seconds')}} <span v-if="haveSets">|</span></div>
        <div class="exercise-item__sets exercise-item__item" v-if="haveSets">{{ sets }} {{$t('exerciseItem.sets')}}  <span v-if="!haveDuration">|</span></div>
        <div class="exercise-item__repeats exercise-item__item" v-if="!haveDuration">{{ repeats }} {{$t('exerciseItem.reps')}}</div>
        <img class="exercise-item__content_drag-drop" width="16" height="16" src="@/assets/img/svg/drag-and-drop.svg" alt="edit">
    </div>

    <div class="exercise-item__edit" @click="choiceActive = !choiceActive" @mouseenter="choiceActive = true" @mouseleave="choiceActive = false">
        <img width="16" height="16" src="@/assets/img/svg/edit.svg" alt="edit">
        <div class="choice" v-if="choiceActive">
            <div class="choice__item" @click="editExercise($event)">{{$t('exerciseItem.edit')}}</div>
            <div class="choice__item" @click="showAlternativeExercise($event)">{{$t('exerciseItem.showAlternative')}}</div>
            <div class="choice__item" @click="showExampleExercise($event)">{{$t('exerciseItem.showExample')}}</div>
            <div class="choice__item choice__delete" @click="deleteExercise($event)">{{$t('exerciseItem.delete')}}</div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data: () => ({
        choiceActive: false
    }),
    props: {
        name: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        sets: {
            type: Number,
            required: true
        },
        repeats: {
            type: Number,
            required: true
        },
        haveDuration: {
            type: Boolean,
            default: true
        },
        haveSets: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        editExercise(e){
            this.$emit('editExercise', e);
        },
        deleteExercise(e){
            this.$emit('deleteExercise', e);
        },
        showExampleExercise(e){
            this.$emit('showExampleExercise', e)
        },
        showAlternativeExercise(e){
            this.$emit('showAlternativeExercise', e)
        }
    }
}
</script>

<style lang="scss">
.exercise-item{
    display: flex;
    align-items: center;
    &__content{
        position: relative;
        width: 650px;
        padding: 16px 15px;
        display: flex;
        border: 1px solid #EBEBEB;
        border-radius: 4px;
        &_drag-drop{
            cursor: grab;
            position: absolute;
            content: "";
            width: 10px;
            height: 16px;
            right: 16px;
            top: 0;
            bottom: 0;
            margin: auto;
        }
    }
    &__item{
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        margin-right: 5px;
        span{
            font-weight: 500;
            font-size: 14px;
            line-height: 16px;
            margin-right: 5px;
        }
    }
    &__edit{
        position: relative;
        cursor: pointer;
        height: 56px;
        width: 56px;
        display: flex;
        justify-content: center;
        align-items: center;
        .choice{
            z-index: 10;
            top: 30px;
            right: 25px;
            padding: 10px;
            position: absolute;
            background: white;
            box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
            border-radius: 5px;
            &__item{
                &:not(:last-child){
                    margin-bottom: 5px;
                    border-bottom: 1px solid $gray;
                    padding-bottom: 5px;
                }
                &:hover{
                    color: $blue;
                }
            }
            &__delete{
                &:hover{
                    color: $red;
                }
            }
        }
    }
    &:not(:last-child){
        margin-bottom: 15px;
    }
}

@media (max-width: 768px){
    .exercise-item{
        &__item{
            white-space: break-spaces;
        }
        &__edit{
            margin-left: 15px;
        }
        &__content{
            padding-right: 25px;
            flex-wrap: wrap;
        }
    }
}
</style>