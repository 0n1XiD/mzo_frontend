<template>
    <div class="reg-nav" :class="{'reg-nav_hidden': !reg_nav_active}">
        <div class="reg-nav__complete-percent">
            <div class="title">{{completePercent}}{{$t('regNav.percents')}}</div>
            <div class="line">
                <div class="line_active" v-bind:style="`width: ${completePercent}%;`"></div>
            </div>
        </div>
        <div class="reg-nav__public-info reg-nav__info-type">
            <div 
                class="title" 
                :class="{'title_active': open_step == 1}"
                @click="changeOpenStep(1)"
            >
                {{$t('regNav.historyTitle')}}
            </div>
            <div class="steps" v-if="open_step == 1">
                <div 
                    class="steps__item" 
                    :class="{'disabled': local_max_step < 0, 'active': step == 0 }"
                    @click="changeCurrentStep(0)"
                >
                    {{$t('regNav.historyItem1')}}
                </div>
                <div 
                    class="steps__item" 
                    :class="{ 'disabled': local_max_step < 1, 'active': step == 1 }"
                    @click="changeCurrentStep(1)"
                >
                    {{$t('regNav.historyItem2')}}
                </div>
                <div 
                    class="steps__item" 
                    :class="{ 'disabled': local_max_step < 2, 'active': step == 2 }"
                    @click="changeCurrentStep(2)"
                >
                    {{$t('regNav.historyItem3')}}
                </div>
                <div 
                    class="steps__item" 
                    :class="{ 'disabled': local_max_step < 3, 'active': step == 3 }"
                    @click="changeCurrentStep(3)"
                >
                    {{$t('regNav.historyItem4')}}
                </div>
            </div>
        </div>
        <div class="reg-nav__public-info reg-nav__info-type">
            <div 
                class="title" 
                :class="{'title_active': open_step == 2}"
                @click="changeOpenStep(2)"
            >
                {{$t('regNav.mobilityTitle')}}
            </div>
            <div class="steps" v-if="open_step == 2">
                <div 
                    class="steps__item" 
                    :class="{'disabled': local_max_step < 4, 'active': step == 4 }"
                    @click="changeCurrentStep(4)"
                >
                    {{$t('regNav.mobilityItem1')}}
                </div>
                <div 
                    class="steps__item" 
                    :class="{ 'disabled': local_max_step < 5, 'active': step == 5 }"
                    @click="changeCurrentStep(5)"
                >
                    {{$t('regNav.mobilityItem2')}}
                </div>
                <div 
                    class="steps__item" 
                    :class="{ 'disabled': local_max_step < 6, 'active': step == 6 }"
                    @click="changeCurrentStep(6)"
                >
                    {{$t('regNav.mobilityItem3')}}
                </div>
            </div>
        </div>
        <div class="reg-nav__public-info reg-nav__info-type">
            <div 
                class="title" 
                :class="{'title_active': open_step == 3}"
                @click="changeOpenStep(3)"
            >
                {{$t('regNav.postureTitle')}}
            </div>
            <div class="steps" v-if="open_step == 3">
                <div 
                    class="steps__item" 
                    :class="{'disabled': local_max_step < 7, 'active': step == 7 }"
                    @click="changeCurrentStep(7)"
                >
                    {{$t('regNav.postureItem1')}}
                </div>
                <div 
                    class="steps__item" 
                    :class="{ 'disabled': local_max_step < 8, 'active': step == 8 }"
                    @click="changeCurrentStep(8)"
                >
                    {{$t('regNav.postureItem2')}}
                </div>
                <div 
                    class="steps__item" 
                    :class="{ 'disabled': local_max_step < 9, 'active': step == 9 }"
                    @click="changeCurrentStep(9)"
                >
                    {{$t('regNav.postureItem3')}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    data () {
      return{
        open_step: -1, 
        completePercent: this.max_step * 10,
        step: this.current_step,
        local_max_step: this.max_step
      }
    },
    props: {
        current_step: {
            type: Number,
            required: true
        },
        max_step: {
            type: Number,
            required: true
        },
        reg_nav_active: {
            type: Boolean,
            default: true
        }
    },
    watch: {
      current_step(newValue){
        this.step = newValue
        if (this.step == 4){
            this.open_step = 2
        }
        if (this.step == 7){
            this.open_step = 3
        }
      },
      max_step(newValue){
        this.local_max_step = newValue
        this.completePercent = this.local_max_step * 10
      },
      regNavActive(newValue){
        this.regNavActive = newValue
      }
    },
    methods: {
        changeOpenStep(step){
            if (this.open_step != step){
                this.open_step = step
            } else {
                this.open_step = -1
            }
        },
        changeCurrentStep(step){
            this.step = step
            this.$emit('changePage', step)
        },
    },
    mounted() {
        if (this.current_step >= 0 && this.current_step <= 3){
            this.open_step = 1
        } else if (this.current_step >= 4 && this.current_step <= 6){
            this.open_step = 2
        } else {
            this.open_step = 3
        }
    }
}
</script>

<style lang="scss" scoped>
.reg-nav{
    z-index: 600;
    transition: all 0.5s ease-out;
    height: 100%;
    position: fixed;
    top: 45px;
    left: 0;
    background-color: hsl(0, 0%, 100%);
    width: 265px;
    border-right: 1px solid hsl(0, 0%, 85%);
    overflow-x: hidden;
    padding-bottom: 100px;
    &_hidden{
        left: -300px;
    }
    &__info-type{
        border-bottom: 1px solid hsl(0, 0%, 85%);
        .title{
            cursor: pointer;
            padding: 20px 20px 20px 20px;
            font-size: 18px;
            font-weight: 700;
            &.disabled{
                color: $gray-two;
                pointer-events: none;
            }
        }
        .steps{
            &__item{
                cursor: pointer;
                padding: 15px 30px 15px 30px;
                display: block;
                font-size: 16px;
                line-height: 16px;
                &:first-child{
                    padding: 10px 20px 20px 30px;
                }
                &:hover{
                    color: $blue;
                }
                &.active {
                    padding: 15px 30px 15px 30px;
                    background-color: hsl(0, 0%, 95%);
                    position: relative;
                    font-weight: bold;
                }
                &.disabled{
                    color: $gray-two;
                    pointer-events: none;
                }
            }
        }
    }
    &__complete-percent{
        border-bottom: 1px solid hsl(0, 0%, 85%);
        .title{
            padding: 20px 20px 0 20px;
            font-size: 18px;
            font-weight: 700;
        }
        .line{
            position: relative;
            width: 85%;
            height: 12px;
            border-radius: 10px;
            margin: 5px 20px 20px 20px;
            background: #e5e7ec;
            &_active {
              position: absolute;
              height: 12px;
              background: $orange;
              border-radius: 10px;
            }
        }
    }
    &::-webkit-scrollbar {
        display: none;
    }
}

@media (max-width: 992px){
    .reg-nav{
        width: 200px;
        &__info-type{
            .title{
                font-size: 16px;
                padding: 15px 10px 15px 10px;
            }
            .steps{
                &__item{
                    padding: 10px 20px 10px 20px;
                    font-size: 14px;
                    line-height: 14px;
                    &:first-child{
                        padding: 10px 15px 15px 20px;
                    }
                    &:hover{
                        color: $blue;
                    }
                    &.active {
                        padding: 10px 20px 10px 20px;
                    }
                }
            }
        }
        &__complete-percent{
            .title{
                padding: 15px 15px 0 15px;
                font-size: 16px;
            }
            .line{
                width: 85%;
                height: 10px;
                margin: 5px 15px 15px 15px;
                &_active {
                    height: 10px;
                }
            }
        }
    }
}
</style>