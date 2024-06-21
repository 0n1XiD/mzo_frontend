<template>
    <div class="posture-introductions new-client">
        <div class="new-client__title">{{$t('postureIntroductions.postureTitle')}}</div>
        <div class="new-client__content">
            <video
                ref="video"
                src="https://mzosanki.space/media/video/posture_types.mp4"
                preload
                controls
                class="new-client__video"
            /> 
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('postureIntroductions.startBtn')"/>
        </div>
    </div>
</template>

<script>
import '@/assets/css/new-client.scss'

export default {
    methods: {
        callback(e) {
            this.$emit('click', e);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
    }
}
</script>

<style lang="scss">
.new-client{
    &__video{
        width: 100%;
        max-height: 520px;
    }
}
</style>