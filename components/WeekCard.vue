<template>
    <div>
        <div
            :class="{'disabled': disabled, 'completed': completeCount == 7 && !isTrainer}" 
            class="week-card"
            @click="weekClosedClick()"
            v-if="!isPeriod"
        >
            <div class="week-card__name">{{ name }}</div>
            
            <div class="week-card__complete-times" v-if="completeCount < 7 && !disabled">{{$t('weekCard.completeTimes1')}} {{ completeCount }} {{$t('weekCard.completeTimes2')}}</div>
            <div class="week-card__completed" v-if="completeCount >= 7">{{$t('weekCard.complete')}}</div>

        </div>

        <div
            :class="{'disabled': disabled, 'completed': completeCount == 31 && !isTrainer}" 
            class="week-card"
            @click="weekClosedClick()"
            v-else
        >
            <div class="week-card__name">{{ name }}</div>
            <div class="week-card__complete-times" v-if="completeCount < 31 && !disabled">{{$t('weekCard.completeTimes1')}} {{ completeCount }} {{$t('weekCard.completeTimes3')}}</div>
            <div class="week-card__completed" v-if="completeCount >= 31">{{$t('weekCard.complete')}}</div>

        </div>
        
        <PopupClosedWeek 
            v-if="popupClosedActive"
            :isDisabledText="disabled"
            :isTrainer="isTrainer"
            :isAdvanced="isAdvanced"
            @close="popupClosedActive = false"
        />
    </div>
</template>

<script>
export default {
    data: () => ({
       popupClosedActive: false, 
    }),
    props: {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String
        },
        id: {
            type: Number,
            required: true,
        },
        disabled: {
            type: Boolean
        },
        completeCount: {
            type: Number,
            default: null
        },
        isTrainer: {
            type: Boolean,
            default: false
        },
        isAdvanced: {
            type: Boolean,
            default: false
        },
        isPeriod: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        weekClosedClick(){
            if(this.disabled){
                this.popupClosedActive = true
            } else {
                this.$emit("weeksRedirect")
                // this.$router.push(this.link + this.id)
            }
        }
    },
    components: {
        PopupClosedWeek: () => import(`@/components/popups/PopupClosedWeek.vue`)
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