<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="delete-card-pop-up">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="delete-card-pop-up__title">{{$t('deleteExersice.title')}}</div>
            <div class="delete-card-pop-up__subtitle">
                {{$t('deleteExersice.subtitle')}}
            </div>
            <div class="delete-card-pop-up__buttons">
                <div class="button-no" @click="closeWindow()">
                    <btn blueBorder :name="$t('deleteExersice.noBtn')"/>
                </div>
                <div class="button-yes" @click="deleteConfirm()">
                    <btn blue :name="$t('deleteExersice.yesBtn')"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/css/popup-delete.scss'
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
        isPeriod: {
            type: Boolean,
            default: false
        },
    },
    methods: {
        async deleteConfirm(){
            try {
                if(!this.isAdvanced && !this.isPeriod){
                    await this.$axios.$delete('/api/v1/user/delete-client-day/', { 
                        headers: { Authorization: `Token ${this.token}` } ,
                        data: { day_id: this.exercise.id }
                    })
                } 
                if(this.isAdvanced) {
                   await this.$axios.$delete('/api/v1/user/delete-client-advanced-day/', { 
                        headers: { Authorization: `Token ${this.token}` } ,
                        data: { day_id: this.exercise.id }
                    }) 
                }
                if(this.isPeriod){
                   await this.$axios.$delete('/api/v1/user/delete-client-period-day/', { 
                        headers: { Authorization: `Token ${this.token}` } ,
                        data: { day_id: this.exercise.id }
                    })  
                }
                this.closeWindow()
                this.$emit("deleteConfirm");
            } catch { return "Sumthing went wrong" }
        },
        closeWindow(){
            let active = this.isActive
            this.$emit("close", active);
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`)
    }
}
</script>

<style>

</style>