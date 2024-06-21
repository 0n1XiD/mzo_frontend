<template>
    <div class="posture-side new-client">
        <div class="new-client__title">На какое изображение больше всего похожа <br> ваша осанка при виде сбоку?</div>
        <div class="error-text new-client__error" v-if="error">Укажите тип осанки</div>
        <div class="new-client__content">
            <div class="new-client__choices">
                <div @click="activeValSide = 'type_1'" class="choices__item" :class="{'choices__item_active': activeValSide == 'type_1'}">
                    <div class="choices__image">
                        <img v-if="gender == 'female'" width="110" height="130" src="@/assets/img/questions/type1f.png" alt="type1">
                        <img v-else width="110" height="130" src="@/assets/img/questions/type1.png" alt="type1">
                    </div>
                    <div class="choices__type">Тип 1</div>
                </div>
                <div @click="activeValSide = 'type_2'" class="choices__item" :class="{'choices__item_active': activeValSide == 'type_2'}">
                    <div class="choices__image">
                        <img v-if="gender == 'female'" width="110" height="130" src="@/assets/img/questions/type2f.png" alt="type2">
                        <img v-else width="110" height="130" src="@/assets/img/questions/type2.png" alt="type2">
                    </div>
                    <div class="choices__type">Тип 2</div>
                </div>
                <div @click="activeValSide = 'type_3'" class="choices__item" :class="{'choices__item_active': activeValSide == 'type_3'}">
                    <div class="choices__image">
                        <img v-if="gender == 'female'" width="110" height="130" src="@/assets/img/questions/type3f.png" alt="type3">
                        <img v-else width="110" height="130" src="@/assets/img/questions/type3.png" alt="type3">
                    </div>
                    <div class="choices__type">Тип 3</div>
                </div>
            </div>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue name="Продолжить"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'

export default {
    props: ['active_side', 'gender'],
    data () {
        return{
            error: false,
            activeValSide: this.active_side,
            localGender: this.gender
        }
    },
    methods: {
        callback(e){
            if(this.activeValSide){
                this.error = false
                this.$emit('click', this.activeValSide);
            } else {
                this.error = true
            }
        }
    },
    watch: {
        active_side(newValue) {
            this.activeValSide = newValue
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