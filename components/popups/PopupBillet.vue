<template>
    <div class="wrapper">
        <div class="pop-up__close-bg" @click="closeWindow()"></div>
        <div class="popuo-billet">
            <div class="pop-up__close" @click="closeWindow()">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <div class="popuo-billet__content" v-html="htmlContent.content"></div>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        htmlContent: {
            type: Object,
            default: ''
        },
    },
    methods: {
        closeWindow(){
            this.$store.commit('client/htmlPopupContentClose', this.htmlContent)
            this.$emit("close");
        },
    },
    components:{
        Btn: () => import(`@/components/controls/Btn.vue`)
    }
}
</script>

<style lang="scss">
.popuo-billet{
    position: relative;
    width: 100%;
    max-width: 700px;
    padding: 20px 40px;
    background: $white;
    text-align: -webkit-center;
    border-radius: 15px;
    &__title{
        font-weight: bold;
        margin-bottom: 15px;
        font-size: 24px;
    }
    &__subtitle{
        margin-bottom: 15px;
        font-size: 18px;
    }
    &__content{
        iframe, video{
            margin-top: 35px;
            height: fit-content;
            width: 100%;
        }
    }
}

@media (max-width: 576px){
    .popuo-billet{
        padding: 20px 5px;
    }
}
</style>