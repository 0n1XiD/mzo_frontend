<template>
    <div class="posture-photos new-client">
        <div class="new-client__title">{{$t('posturePhotos.photosTitleShort')}}</div>
        <div class="new-client__content posture-photos__content">
            <Checkbox
                v-model="show_lines"
                @change="!show_lines"
                class="show-lines" 
                group="waysTried" 
                default 
                :name="$t('posturePhotos.showLinesName')"
            />
            <div class="photos">
                <div class="photos__item" v-for="(photo, index) in photos" :key="`photo-${index}`">
                    <img v-if="photo.src != '' && photo.src != null" :src="photo.src" :id="`min-photo-${index}`" alt="posture picture">
                    <div class="add-photo">
                        <img src="@/assets/img/svg/add.svg" alt="add photo">
                        <p>{{$t('posturePhotos.addPhoto')}}</p>
                    </div>
                    <div class="del-photo" 
                        v-if="photo.src != '' && photo.src != null" 
                        :src="photo.src"
                        @click="deletePicture(index)"
                    >
                        <img src="@/assets/img/svg/delete-basket.svg" alt="delete-basket">
                    </div>
                    <div class="posture-line" v-if="show_lines && (photo.src != '' && photo.src != null)"></div>
                    <div class="first-line y-line" v-if="show_lines && (photo.src != '' && photo.src != null)" :style="{'top': photo.top_line_first + '%'}"></div>
                    <div class="second-line y-line" v-if="show_lines && (photo.src != '' && photo.src != null)" :style="{'top': photo.top_line_second + '%'}"></div>
                    <input :id="`photoInput-${index}`" class="photos__input" type="file" accept="image/jpeg, image/png" @change="uploadImage($event, index)">
                </div>
            </div>
        </div>
        <div class="new-client__buttons">
            <Btn @click="callback($event)" blue :name="$t('posturePhotos.continueBtn')"/>
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
import '@/assets/css/new-client.scss'

export default {
    props: ['data_photos'],
    data () {
        return{
            error: false,
            photos: this.data_photos,
            show_lines: false,
            cropPhoto: {},
            isCrop: false
        }
    },
    // data: () => ({
    //     photos: [
    //         {id: 1, src: null},
    //         {id: 2, src: null},
    //         {id: 3, src: null},
    //         {id: 4, src: null}
    //     ],
    //     show_lines: false
    // }),
    watch: {
        data_photos(newValue) {
            this.photos = newValue // Update when the prop changes
        }
    },
    methods: {
        uploadImage(e, index){
            let saveSrc = ''
            if(this.photos[index].src != null && this.photos[index].src != ''){
                saveSrc = this.photos[index].src
            }
            try{
                const image = e.target.files[0];
                const reader = new FileReader();
                let size = image.size
                if(size <= 10000000){
                    reader.readAsDataURL(image);
                    reader.onload = e =>{
                        this.photos[index].src = e.target.result;
                        this.cropPhoto = {index: index, photo: e.target.result}
                        this.isCrop = true
                    };
                } else {
                    this.errorPhoto = true
                    this.photos[index].src = saveSrc
                }
            } catch {}
        },
        async saveUploadPhoto(e){
            this.photos[e.index].src = e.photo
            this.photos[e.index].top_line_first = e.first_line
            this.photos[e.index].top_line_second = e.second_line
        },
        callback: function(e) {
            this.$emit('click', this.photos);
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
    }
}
</script>

<style lang="scss">
.posture-photos{
    &__content{
        .show-lines{
            margin-bottom: 10px;
        }
        .photos{
            margin-bottom: 30px;
            display: flex;
            &__item{
                margin-bottom: 7px;
                width: 250px;
                height: 320px;
                overflow: hidden;
                position: relative;
                border: 1px dashed #AFB1B8;
                border-radius: 8px;
                .picture{
                    margin-bottom: 7px;
                    height: 114px;
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
                &:not(:last-child){
                    margin-right: 20px;
                }
            }
            img{
                object-fit: fill;
                width: 100%;
                height: 100%;
                z-index: 5;
            }
            .add-photo{
                cursor: pointer;
                width: 100%;
                height: 100%;
                display: flex;
                flex-flow: column;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 18px;
                line-height: 22px;
                img{
                    margin-bottom: 20px;
                    width: 18px;
                    height: 18px;
                }
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
    }
}

@media (max-width: 768px){
    .posture-photos{
        &__content{
            .photos{
                justify-content: space-evenly;
                flex-wrap: wrap;
                &__item{
                    &:not(:last-child){
                        margin-right: 0;
                    }
                }
            }
        }
    }
}

@media (max-width: 576px){
    .posture-photos{
        &__content{
            .photos{
                &__item{
                    width: 130px;
                    height: 170px;
                    .add-photo{
                        p{
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
}
</style>