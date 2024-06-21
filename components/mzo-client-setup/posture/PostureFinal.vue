<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('postureFinal.title')}}</div>
        <div class="subtitle">
            {{$t('postureFinal.subtitle')}}
        </div>
        <Btn :disabled='isDisabled' blue :name="$t('postureFinal.endBtn')" @click="complete()"/>
    </div>  
</template>

<script>
import { mapState } from "vuex";

export default {
    data () {
        return{
            local_max_step: this.max_step,
            isDisabled: false
        }
    },
    computed:{
        ...mapState(["userInfo"]),
    },
    beforeMount(){
        if (this.userInfo.posture_side){
            this.activeValSide = this.userInfo.posture_side
        }
        if (this.userInfo.posture_back){
            this.activeValBack = this.userInfo.posture_back
        }
    },
    methods: {
        async complete(){
            this.isDisabled = true
            let form_data= {
                step: 10,
            }
            await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                headers: { Authorization: `Token ${this.userInfo.token}`}
            })
            this.$router.go(this.localePath())
        },
    },
    components:{
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss" scoped>
</style>