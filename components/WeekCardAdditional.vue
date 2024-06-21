<template>
    <div>
        <div
            :class="{'disabled': disabled}" 
            class="week-card"
            @click="weekClosedClick()"
        >
            <div class="week-card__name">Продвинутая программа</div>
        </div>
        
        <PopupClosedProgram
            v-if="popupClosedActive"
            :isTrainer="isTrainer"
            @close="popupClosedActive = false"
            @activateAdvancedWeeks="activateAdvancedWeeks"
        />
    </div>
</template>

<script>
export default {
    data: () => ({
       popupClosedActive: false, 
    }),
    props: {
        disabled: {
            type: Boolean
        },
        isTrainer: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        weekClosedClick(){
            if(this.disabled){
                this.popupClosedActive = true
            } else {
                this.$emit("advancedWeeksRedirect")
            }
        },
        activateAdvancedWeeks(){
            this.$emit("activateAdvancedWeeks");
        },
    },
    components: {
        PopupClosedProgram: () => import(`@/components/popups/PopupClosedProgram.vue`)
    }
}
</script>

<style lang="scss">
.week-card{
    cursor: pointer;
    position: relative;
    width: 350px;
    height: 120px;
    padding: 10px 15px;
    border: 1px solid #EBEBEB;
    border-radius: 4px;
    &__name{
        margin-bottom: 10px;
        font-weight: 600;
        font-size: 20px;
        line-height: 20px;
    }
    &__description{
        width: 100%;
        font-weight: 500;
        font-size: 16px;
        line-height: 18px;
    }
    &__complete-times{
        font-size: 16px;
        line-height: 18px;
        color: $orange;
    }
    &__completed{
        font-size: 16px;
        line-height: 18px;
        color: $green;
    }
    &__additional-text{
        color: gray;
        font-size: 14px;
    }
    &.disabled{
        background: lightgrey;
    }
}

@media (max-width: 768px){
  .week-card{
    width: 100%;
  }
}
</style>