<template>
    <div>
        <!-- <header class="header-empty">
            <div class="_container">
                <div class="header-empty__inner">
                    <div class="row">
                        <HeaderLogo/>
                    </div>
                </div>
            </div>
        </header> -->
        <Nuxt class="default-wrapper"/>
    </div>
</template>

<script>

export default {
    components:{
        HeaderLogo: () =>import(`@/components/header/header-logo.vue`),
    }
}
</script>

<style lang="scss">
.header-empty{
    border-bottom: 1px solid #EBEBEB;
    z-index: 1100;
    width: 100%;
    background: $white;
    &__inner{
        padding: 12px 0;
        padding-bottom: 7px;
    }
}
</style>