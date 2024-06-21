<template>
  <div class="statistical-results statistical-collection">
    <div class="statistical-collection__title">{{$t('statisticalResults.title')}}</div>
    <div class="error-text new-client__error" v-if="error">{{$t('statisticalResults.error')}}</div>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text long">{{$t('statisticalResults.question1')}}</p>
        <div class="statistical-collection__result">
            <RadioButton v-model="programHelping" default :name="$t('statisticalResults.yesBtn')" val="yes" radioName="programHelping"/>
            <RadioButton v-model="programHelping" default :name="$t('statisticalResults.noBtn')" val="no" radioName="programHelping"/>
        </div>
    </div>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text long">{{$t('statisticalResults.question2')}}</p>
        <div class="statistical-collection__result">
            <RadioButton v-model="mobility" default :name="$t('statisticalResults.yesBtn')" val="yes" radioName="mobility"/>
            <RadioButton v-model="mobility" default :name="$t('statisticalResults.noBtn')" val="no" radioName="mobility"/>
        </div>
    </div>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text long">{{$t('statisticalResults.question3')}}</p>
        <div class="statistical-collection__result">
            <RadioButton v-model="posture" default :name="$t('statisticalResults.yesBtn')" val="yes" radioName="posture"/>
            <RadioButton v-model="posture" default :name="$t('statisticalResults.noBtn')" val="no" radioName="posture"/>
        </div>
    </div>
    <div class="statistical-collection__select">
        <p class="statistical-collection__text long">{{$t('statisticalResults.question4')}}</p>
        <div class="statistical-collection__result">
            <RadioButton v-model="strengthBody" default :name="$t('statisticalResults.yesBtn')" val="yes" radioName="strengthBody"/>
            <RadioButton v-model="strengthBody" default :name="$t('statisticalResults.noBtn')" val="no" radioName="strengthBody"/>
        </div>
    </div>
    <Btn @click="callback($event)" blue :name="$t('statisticalResults.continueBtn')" class="statistical-collection__button"/>
  </div>
</template>

<script>
import '@/assets/css/statistical-collection.scss'

export default {
    props: ['staticInfoData'],
    data() {
        return{
            programHelping: null,
            mobility: null,
            posture: null,
            strengthBody: null,
            error: false,
            localStaticInfoData: this.staticInfoData
        }
    },
    watch: {
        staticInfoData(newValue){
            this.localStaticInfoData = newValue
        }
    },
    methods: {
        callback(e){
            if(this.programHelping && this.mobility && this.posture && this.strengthBody){
                this.error = false
                this.localStaticInfoData.results = {}
                this.localStaticInfoData.results.programHelping = this.programHelping
                this.localStaticInfoData.results.mobility = this.mobility
                this.localStaticInfoData.results.posture = this.posture
                this.localStaticInfoData.results.strengthBody = this.strengthBody
                this.$emit('click', this.localStaticInfoData);
            } else {
                this.error = true
            }
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
    }
}
</script>

<style lang="scss">

</style>