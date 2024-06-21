<template>
    <div class="client-page-nav">
        <div class="_container">
            <div class="main__title">{{ title }}</div>
            <div class="page__nav">
                <div class="nav">
                    <nuxt-link :to="localePath(`/trainer/clients/${id}`)" class="nav__item nav__notes">{{$t('clientPageNav.item1')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/trainer/clients/${id}/exercise-programs`)" class="nav__item nav__item_full-name">{{$t('clientPageNav.item2')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/trainer/clients/${id}/exercise-programs`)" class="nav__item nav__list nav__item_mobile">{{$t('clientPageNav.item3')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/trainer/clients/${id}/photos`)" class="nav__item nav__photos">{{$t('clientPageNav.item4')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/trainer/clients/${id}/statistics`)" class="nav__item nav__item_desktop nav__statistics">{{$t('clientPageNav.item5')}} </nuxt-link>
                    <nuxt-link :to="localePath(`/trainer/clients/${id}/settings`)" class="nav__item nav__item_desktop nav__settings">{{$t('clientPageNav.item6')}}</nuxt-link>
                    <nuxt-link :to="localePath(`/trainer/clients/${id}/questionnaire`)" class="nav__item nav__item_desktop nav__questionnaire">{{$t('clientPageNav.item7')}}</nuxt-link>

                    <div 
                        class="nav__item nav__additional"
                        :class="{'nav__additional_active': additional_client_nav_acticve, 'nav__additional_selected': isShowAdditional}"
                        @mouseenter="showAdditional()"
                        @mouseleave="hideAdditional()"
                    >
                        {{$t('clientPageNav.item9')}}
                        <div class="additional-pages" v-if="isShowAdditional">
                            <nuxt-link :to="localePath(`/trainer/clients/${id}/statistics`)" class="nav__item nav__statistics">{{$t('clientPageNav.item5')}} </nuxt-link>
                            <nuxt-link :to="localePath(`/trainer/clients/${id}/settings`)" class="nav__item nav__settings">{{$t('clientPageNav.item8')}}</nuxt-link>
                            <nuxt-link :to="localePath(`/trainer/clients/${id}/questionnaire`)" class="nav__item nav__questionnaire">{{$t('clientPageNav.item7')}}</nuxt-link>
                            <div class="additional-pages__close nav__item" @click="hideAdditional()"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/css/page.scss'

export default {
    data: () => ({
        additional_client_nav_acticve: false,
        isShowAdditional: false,
    }),
    props: [
        'title',
        'id',
    ],
    mounted() {
        this.checkRoute()
    },
    watch: {
        $route() {
            this.checkRoute()
        },
    },
    methods:{
        checkRoute(){
            if (this.$route.name == 'trainer-clients-client-questionnaire' || this.$route.name == 'trainer-clients-client-settings' || this.$route.name == 'trainer-clients-client-statistics'){
                this.additional_client_nav_acticve = true
            } else {
                this.additional_client_nav_acticve = false
            }
        },
        showAdditional(){
            this.isShowAdditional = true
            this.$emit('additional', this.isShowAdditional)
        },
        hideAdditional(){
            this.isShowAdditional = false
            this.$emit('additional', this.isShowAdditional)
        }
    }
}
</script>

<style lang="scss">
.client-page-nav{
    .page__nav{
        .nav{
            &__item{
                &:not(:last-child){
                    margin-right: 30px;
                }
            }
            &__additional{
                display: none;
                position: relative;
                &_active{
                    position: relative;
                    font-weight: bold;
                    margin-bottom: 1px;
                    &::after{
                        content: '';
                        position: absolute;
                        width: 100%;
                        bottom: -6px;
                        left: 0;
                        border-bottom: 2px solid $orange;
                    }
                }
                .additional-pages{
                    padding: 15px 0;
                    display: inline-block;
                    position: absolute;
                    right: 0;
                    left: 0;
                    top: 18px;
                    width: 100%;
                    min-width: max-content;
                    background: $white;
                    box-shadow: 0px 2px 8px rgba(30, 40, 67, 0.2);
                    border-radius: 8px 0 8px 8px;
                    z-index: 100;
                    .nav__item{
                        margin-right: 0;
                        text-align: center;
                        padding: 0 10px;
                        font-size: 10px !important;
                        display: block;
                        font-weight: 500;
                        &:not(:last-child){
                            margin-bottom: 20px;
                        }
                        &::after{
                            border-bottom: none;
                        }
                    }
                }
            }
        }
    }
}

@media (max-width: 1200px){
    .client-page-nav{
        ._container{
            padding: 0;
        }
    }
}

@media (max-width: 992px){
    .client-page-nav{
        .page__nav{
            .nav{
                &__item{
                    font-size: 14px;
                    &_desktop{
                        display: none;
                    }
                }
                &__additional{
                    display: block;
                }
            }
        }
    }
}

@media (max-width: 768px){
    .client-page-nav{
        .page__nav{
            z-index: 2100;
            .nav{
                position: relative;
                width: 100%;
                display: flex;
                justify-content: space-evenly;
                margin-bottom: 0;
                &__item{
                    &:not(:last-child){
                        margin-right: 0;
                    }
                    justify-content: space-evenly;
                    display: flex;
                    width: auto;
                    justify-content: center;
                    font-size: 14px;
                    height: 50px;
                    padding-top: 27px;
                    background-repeat: no-repeat;
                    background-size: 25px;
                    background-position: bottom 20px center;
                    &_full-name{
                        display: none;
                    }
                }
                &__home{
                    background-image: url('~/assets/img/svg/home.svg');
                }
                &__notes{
                    background-image: url('~/assets/img/svg/note.svg');
                }
                &__photos{
                    background-image: url('~/assets/img/svg/photo.svg');
                }
                &__statistics{
                    background-image: url('~/assets/img/svg/stats.svg');
                }
                &__settings{
                    background-image: url('~/assets/img/svg/settings.svg');
                }
                &__list{
                    background-image: url('~/assets/img/svg/list.svg');
                }
                &__additional{
                    background-image: url('~/assets/img/svg/additional.svg');
                    &_active{
                        position: relative;
                        font-weight: bold;
                        color: #55ACFE;
                        &::after{
                            content: '';
                            position: absolute;
                            width: 100%;
                            bottom: -6px;
                            left: 0;
                            border-bottom: none;
                        }
                    }
                    &.nav__additional_selected{
                        .additional-pages{
                            width: 100%;
                            height: 100%;
                            bottom: 0;
                        }
                    }
                    .additional-pages{
                        transition: all 0.7s ease;
                        width: 0;
                        height: 0;
                        left: 0;
                        bottom: -10000px;
                        box-shadow: none;
                        background: none;
                        .nav{
                            &__item{
                                position: fixed !important;
                                left: 0;
                                right: 0;
                                margin: auto;
                                background-color: $white;
                                z-index: 1100;
                                width: 80px;
                                height: 80px;
                                bottom: 70px;
                                border-radius: 35%;
                                box-shadow: 0px -2px 30px rgba(0, 0, 0, 0.25);
                                padding-top: 50px;
                                background-repeat: no-repeat;
                                background-size: 35px;
                                background-position: top 15px center;
                                font-size: 0;
                                &.nuxt-link-exact-active{
                                    background-color: #A7EAFF;
                                    color: $text-primary;
                                }
                            }
                            &__statistics{
                                position: absolute;
                                left: -170px;
                                background-image: url('~/assets/img/svg/stats.svg');
                            }
                            &__questionnaire{
                                bottom: 150px;
                                background-image: url('~/assets/img/svg/questionnaire.svg');
                            }
                            &__settings{
                                left: 170px;
                            }
                        }
                        &__close{
                            border-radius: 100%;
                            width: 50px !important;
                            height: 50px !important;
                            background: $light-gray-two !important;
                            bottom: 100px !important;
                            background-image: url('~/assets/img/svg/close-white.svg') !important;
                            background-repeat: no-repeat !important;
                            background-position: center center !important;
                        }
                    }
                }
            }
        }
    }
}
</style>