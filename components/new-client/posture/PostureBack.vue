<template>
    <div class="posture-back new-client">
        <div class="new-client__title">{{$t('postureBack.title1')}} <br> {{$t('postureBack.title2')}}</div>
        <div class="error-text new-client__error" v-if="error">{{$t('postureBack.error')}}</div>
        <div class="new-client__content">
            <div class="new-client__choices">
                <div @click="activeValBack = 'type_r'" class="choices__item" :class="{'choices__item_active': activeValBack == 'type_r'}">
                    <div class="choices__image">
                        <img v-if="gender == 'female'" width="110" height="130" src="@/assets/img/questions/typeRf.png" alt="typeR">
                        <img v-else width="110" height="130" src="@/assets/img/questions/typeR.png" alt="typeR">
                    </div>
                    <div class="choices__type">{{$t('postureBack.type1')}}</div>
                </div>
                <div @click="activeValBack = 'type_n'" class="choices__item" :class="{'choices__item_active': activeValBack == 'type_n'}">
                    <div class="choices__image">
                        <img v-if="gender == 'female'" width="110" height="130" src="@/assets/img/questions/typeNf.png" alt="typeN">
                        <img v-else width="110" height="130" src="@/assets/img/questions/typeN.png" alt="typeN">
                    </div>
                    <div class="choices__type">{{$t('postureBack.type2')}}</div>
                </div>
                <div @click="activeValBack = 'type_s'" class="choices__item" :class="{'choices__item_active': activeValBack == 'type_s'}">
                    <div class="choices__image">
                        <img v-if="gender == 'female'" width="110" height="130" src="@/assets/img/questions/typeSf.png" alt="typeS">
                        <img v-else height="130" src="@/assets/img/questions/typeS.png" alt="typeS">
                    </div>
                    <div class="choices__type">{{$t('postureBack.type3')}}</div>
                </div>
            </div>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('postureBack.endBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'

export default {
    props: ['active_back', 'gender'],
    data () {
        return{
            error: false,
            activeValBack: this.active_back,
            localGender: this.gender
        }
    },
    methods: {
        callback(e) {
            if(this.activeValBack){
                this.error = false
                this.$emit('click', this.activeValBack);
            } else {
                this.error = true
            }
        }
    },
    watch: {
        active_back(newValue) {
            this.activeValBack = newValue
        },
        gender(newValue) {
            this.localGender = newValue
        },
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue')
    }
}
</script>

<style lang="scss">

</style>