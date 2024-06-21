<template>
    <div class="photos-page">
        <div class="_container">
            <div class="main__breadcrumbs">
                <img src="@/assets/img/svg/breadcrumbs-arrow.svg" alt="small-arrow">
                <nuxt-link :to="localePath(`/trainer/clients`)">
                    {{$t('photos.backLink')}}
                </nuxt-link> 
            </div>
            <ClientPageNav :id="client.id" :title="`${client.first_name} ${client.last_name}`"/>
            <div class="photos-page__content" v-if="!isComparison">
                <div class="photos-page__btns">
                    <Btn class="add-photo" blue v-if="photos.length > 0">
                        {{$t('photos.addPhotoBtn')}}
                        <input :id="`photosPageNoPhoto`" class="no-photos__input" type="file" accept="image/jpeg, image/png" @change="uploadImage($event)">
                    </Btn>
                    <div 
                        v-if="comparisonPhotos.length > 1" 
                        @click="showComparisonUnit = !showComparisonUnit" 
                        class="hide-show-compare"
                    >
                        {{$t('photos.compare')}}
                    </div>
                </div>
                <div class="no-photos" v-if="photos.length == 0">
                    <div class="no-photos__content">
                        <div class="no-photos__icon">
                            <img width="36" height="36" src="@/assets/img/svg/no_photo.svg" alt="no_photo">
                        </div>
                        <div class="no-photos__title">{{$t('photos.emptyTitle')}}</div>
                        <div class="no-photos__subtitle">
                            {{$t('photos.emptySubtitle')}}
                        </div>
                        <input :id="`photosPageNoPhoto`" class="no-photos__input" type="file" accept="image/jpeg, image/png" @change="uploadImage($event)">
                    </div>
                </div>
                <div class="photos">
                    <PhotosItem 
                        v-for="(photo, index) in photos" 
                        :key="photo.id"
                        :photo="photo"
                        :date="photo.created_at"
                        @delete="deletePhoto($event, index)"
                        @addRemoveToComparison="addRemoveToComparison($event, index)"
                    />
                </div>
            </div>
            <div class="photos-page__content photos-page__content_comparison" v-if="isComparison">
                <div class="row">
                    <Checkbox
                        v-model="show_lines"
                        @change="!show_lines"
                        class="show-lines" 
                        group="waysTried" 
                        default 
                        :name="$t('photos.showLines')"
                    />
                    <Btn @click="showAllPhotos()" class="show-all-photos" blueBorder :name="$t('photos.clearBtn')"/>
                </div>
                <div class="photos">
                    <div class="photos__item" v-for="photo in comparisonPhotos" :key="`comparison-${photo.id}`">
                        <img width="240" height="360" :src="photo.image" alt="comparison photo">
                        <div class="posture-line" v-if="show_lines"></div>
                        <div class="first-line y-line" v-if="show_lines" :style="{'top': photo.top_line_first + '%'}"></div>
                        <div class="second-line y-line" v-if="show_lines" :style="{'top': photo.top_line_second + '%'}"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="comparison-unit" v-if="showComparisonUnit && comparisonPhotos.length > 1 && !isComparison">
            <div class="comparison-unit__items">
                <div class="item" v-for="photo in comparisonPhotos" :key="`comparison-${photo.id}`">
                    <img width="120" height="120" :src="photo.image" alt="">
                </div>
            </div>
            <div class="comparison-unit__footer">
                <div class="in-compare-count">{{$t('photos.compareDescription1')}} {{ comparisonPhotos.length }} {{$t('photos.compareDescription2')}}</div>
                <Btn @click="isComparison = true" class="in-compare-btn" blue :name="$t('photos.compareBtn')"/>
            </div>
        </div>
        <div class="wrapper" v-if="isCrop">
            <div class="pop-up__close" @click="isCrop = false">
                <img src="@/assets/img/svg/close.svg" alt="close">
            </div>
            <CropImage 
                :isActive="isCrop" 
                :photo="cropPhoto" 
                @close="isCrop = false" 
                @save="saveUploadPhoto($event)"
            />
        </div>
    </div>
</template>

<script>
export default {
    data: () => ({
      isCrop: false,
      cropPhoto: {},
      comparisonPhotos: [],
      showComparisonUnit: true,
      isComparison: false,
      show_lines: false
    }),
    async asyncData({ params, $axios, store }) {
        let token = store.state.userInfo.token
        let client = null
        if(store.state.trainer.current_client){
            client = store.state.trainer.current_client
        } else {
            client = await $axios.$get(`/api/v1/user/get-client/?client_id=${params.client}`, {
                headers: { 'Authorization': `Token ${token}` },
            })
            store.commit('trainer/setClientInfo', client)
        }
        let photos = await $axios.$get(`/api/v1/user/get-client-photos/?client_id=${client.id}`, { 
            headers: { Authorization: `Token ${token}` }
        })
        return {client, token, photos}
    },
    methods: {
        uploadImage(e, index=null){
            let saveSrc = ''
            if(index){
                if(this.photos[index].image != null && this.photos[index].image != ''){
                    saveSrc = this.photos[index].image
                }
            }
            try{
                const image = e.target.files[0];
                const reader = new FileReader();
                let size = image.size
                if(size <= 10000000){
                    reader.readAsDataURL(image);
                    reader.onload = e =>{
                        if(index){
                            this.photos[index].image = e.target.result;
                        }
                        this.cropPhoto = {index: index, photo: e.target.result}
                        this.isCrop = true
                    };
                } else {
                    this.errorPhoto = true
                    if(index){
                        this.photos[index].image = saveSrc
                    }
                }
            } catch {}
        },
        async saveUploadPhoto(e){
            let params = {
                client_id: this.client.id,
                photo: e.photo,
                line_first: e.first_line,
                line_second: e.second_line
            }
            let new_photo = await this.$axios.$post('/api/v1/user/add-client-photo/', params, { 
                headers: { Authorization: `Token ${this.token}` } 
            })
            this.photos.push(new_photo)
        },
        async deletePhoto(e, index){
            await this.$axios.$delete('/api/v1/user/delete-client-photo/', { 
                headers: { Authorization: `Token ${this.token}` },
                data: { photo_id: e.id }
            })
            this.photos.splice(index, 1)
        },
        addRemoveToComparison(e, index){
            this.photos[index].inComprasion = e.compare
            if(this.photos[index].inComprasion == true){
                this.comparisonPhotos.push(this.photos[index])
            } else {
                let new_index = this.comparisonPhotos.indexOf(this.photos[index])
                if(new_index != -1){
                    this.comparisonPhotos.splice(new_index, 1)
                }
            }
            if(this.comparisonPhotos.length == 0){
                this.showComparisonUnit = true
            }
        },
        showAllPhotos(){
            this.comparisonPhotos = []
            this.showComparisonUnit = true
            this.show_lines = false
            this.isComparison = false
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
        ClientPageNav: () => import('@/components/client-page-nav.vue'),
        PhotosItem: () => import('@/components/PhotosItem.vue')
    }
}
</script>

<style lang="scss">
.photos-page{
    &__btns{
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        .btn{
            position: relative;
            margin-right: 30px;
        }
        .hide-show-compare{
            font-size: 16px;
            cursor: pointer;
            color: $blue
        }
    }
    &__content{
        .no-photos{
            height: 60vh;
            display: flex;
            justify-content: center;
            align-items: center;
            &__content{
                position: relative;
                cursor: pointer;
                padding: 0 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 250px;
                height: 250px;
                border: 1px solid #D9D9D9;
                border-radius: 4px;
            }
            &__icon{
                display: flex;
                justify-content: center;
                margin-bottom: 10px;
            }
            &__title{
                margin-bottom: 10px;
                text-align: center;
                font-weight: 700;
                font-size: 14px;
                line-height: 16px;
            }
            &__subtitle{
                font-weight: 500;
                font-size: 14px;
                line-height: 16px;
                text-align: center;
            }
            &__input{
                cursor: pointer;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                opacity: 0;
                z-index: 10;
            }
        }
        .photos{
            display: grid;
            grid-template-columns: repeat(auto-fill, 260px);
            grid-gap: 10px;
            grid-row-gap: 40px;
        }
        &_comparison{
            .row{
                margin-bottom: 30px;
                .checkbox{
                    margin-right: 30px;
                }
            }
            .photos{
                &__item{
                    position: relative;
                    width: fit-content;
                    img{
                        width: 240px;
                        height: 360px;
                        position: relative;
                        background: $white;
                        box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.25);
                        border-radius: 10px;
                        overflow: hidden;
                        object-fit: fill;
                    }
                    .posture-line{
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        height: 100%;
                        width: 2px;
                        background: $light-orange-gradient;
                        z-index: 100;
                    }
                    .y-line{
                        position: absolute;
                        width: 100%;
                        height: 3px;
                        background: $light-orange-gradient;
                    }
                }
            }
        }
    }
    .comparison-unit{
        display: flex;
        flex-direction: column;
        align-items: center;
        border-radius: 10px 0 0 0 10px;
        width: 200px;
        background: #fdfdfd;
        position: fixed;
        top: 0;
        right: 0;
        height: 100vh;
        box-shadow: -5px 0px 5px rgba(0, 0, 0, 0.25);
        &__items{
            margin-top: 60px;
            height: 80vh;
            overflow: auto;
            margin-bottom: 20px;
            .item{
                object-fit: cover;
                &:not(:last-child){
                    margin-bottom: 20px;
                }
            }
        }
        &__footer{
            margin: 0 10px;
            margin-bottom: 20px;
            .in-compare-count{
                text-align: center;
                margin-bottom: 10px;
                font-size: 14px;
                color: $blue;
            }
            .in-compare-btn{
                min-width: 170px;
            }
        }
    }
}

@media (max-width: 768px){
    .photos-page{
        &__btns{
            .hide-show-compare{
                display: none;
            }
        }
        .comparison-unit{
            background: transparent;
            box-shadow: none;
            &__items{
                display: none;
            }
            &__footer{
                .in-compare-btn{
                    display: block;
                    position: absolute;
                    bottom: 140px;
                    right: 30px;
                    color: transparent;
                    min-width: 80px;
                    min-height: 80px;
                    width: 80px;
                    height: 80px;
                    border-radius: 100%;
                    background-color: $light-blue-gradient;
                    background-image: url('~/assets/img/svg/compare.svg');
                    background-repeat: no-repeat;
                    background-size: 40px;
                    background-position: center center;
                }
            }
        }
    }
}

@media (max-width: 576px){
    .photos-page{
        &__content{
            .photos{
                grid-template-columns: repeat(auto-fill, 100%);
            }
            &_comparison{
                .photos{
                    &__item{
                        width: 100%;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }
    }
}
</style>