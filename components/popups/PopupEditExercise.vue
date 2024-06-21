<template>
  <div class="wrapper">
    <div class="pop-up__close-bg" @click="closeWindow()"></div>
    <div class="popup-edit-exercise pop-up__content">
        <div class="pop-up__close" @click="closeWindow()">
            <img src="@/assets/img/svg/close.svg" alt="close">
        </div>
        <div class="popup-edit-exercise__title pop-up__title">{{$t('editExersice.title')}}</div>
        <div class="popup-edit-exercise__content">
            <!-- <InputFields v-model="exercise.name" default placeholder="Название"/> -->
            <div class="comment-input" v-if="exercise.haveDuration">
                <InputFields v-model="exercise.duration" type="number" default placeholder=""/>
                <div class="comment-input__description">{{$t('editExersice.seconds')}}</div>
            </div>
            <div class="comment-input" v-if="exercise.haveSets">
                <InputFields v-model="exercise.sets" type="number" default placeholder=""/>
                <div class="comment-input__description">{{$t('editExersice.sets')}}</div>
            </div>
            <div class="comment-input" v-if="!exercise.haveDuration">
                <InputFields v-model="exercise.repeats" type="number" default placeholder=""/>
                <div class="comment-input__description">{{$t('editExersice.repeats')}}</div>
            </div>
            <Btn @click="callback()" blue :name="$t('editExersice.continueBtn')"/>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    props: {
        exercise: {
            type: Object,
            required: true
        },
        isActive: {
            type: Boolean,
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
        isPeriod:{
            type: Boolean,
            default: false
        },
        lang: {
            type: String,
            default: 'ru'
        }
    },
    methods: {
        closeWindow(){
            let active = this.isActive
            this.$emit("close", active);
        },
        async callback() {
            try {
                let params = {
                    day_id: this.exercise.id,
                    repeats: this.exercise.repeats,
                    sets: this.exercise.sets,
                    duration: this.exercise.duration,
                }
                if (!this.isAdvanced && !this.isPeriod){
                    await this.$axios.$put('/api/v1/user/change-client-day/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                } 
                if (this.isAdvanced) {
                    await this.$axios.$put('/api/v1/user/change-client-advanced-day/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })
                }
                if (this.isPeriod){
                    await this.$axios.$put('/api/v1/user/change-client-period-day/', params, { 
                        headers: { Authorization: `Token ${this.token}` } 
                    })    
                }
                this.closeWindow()
                this.$emit("editConfirm");
            } catch { return "Sumthing went wrong" }
            let new_exercise = this.exercise
            this.$emit('click', new_exercise);
            this.closeWindow()
        }
    },
    components: {
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">
.popup-edit-exercise{
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
        }
}

</style>