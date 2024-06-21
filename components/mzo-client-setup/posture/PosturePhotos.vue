<template>
    <div class="mzo-client-step">
        <div class="title">{{$t('posturePhotos.title')}}</div>
        <div class="item">
            <div class="item__title">{{$t('posturePhotos.photosTitle')}}</div>
            <div class="item__subtitle">{{$t('posturePhotos.photosSubtitle')}}</div>
            <Checkbox
                v-model="show_lines"
                @change="!show_lines"
                class="show-lines" 
                group="waysTried" 
                default 
                :name="$t('posturePhotos.showLinesName')"
            />
            <div class="local_photos" :key="imagesKey">
                <div class="local_photos__item" v-for="(photo, index) in local_photos" :key="`photo-${index}`">
                    <img v-if="photo.image != '' && photo.image != null" :src="photo.image" :id="`min-photo-${index}`" alt="posture picture">
                    <div class="add-photo">
                        <img src="@/assets/img/svg/add.svg" alt="add photo">
                        <p>{{$t('posturePhotos.addPhoto')}}</p>
                    </div>
                    <div class="del-photo" 
                        v-if="photo.image != '' && photo.image != null" 
                        :src="photo.image"
                        @click="deletePicture(index)"
                    >
                        <img src="@/assets/img/svg/delete-basket.svg" alt="delete-basket">
                    </div>
                    <div class="posture-line" v-if="show_lines && (photo.image != '' && photo.image != null)"></div>
                    <div class="first-line y-line" v-if="show_lines && (photo.image != '' && photo.image != null)" :style="{'top': photo.top_line_first + '%'}"></div>
                    <div class="second-line y-line" v-if="show_lines && (photo.image != '' && photo.image != null)" :style="{'top': photo.top_line_second + '%'}"></div>
                    <input :id="`photoInput-${index}`" class="local_photos__input" type="file" accept="image/jpeg, image/png" @change="uploadImage($event, index)">
                    <btn v-if="photo.image != '' && photo.image != null" delete @click="deleteImage(photo)" class="delete"/>
                </div>
            </div>
        </div>
        <Btn blue :name="$t('posturePhotos.continueBtn')" @click="goToPage(9)"/>

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
import { mapState } from "vuex";

export default {
    data: () => ({
        isCrop: false,
        cropPhoto: {},
        imagesKey: 0,
        local_photos: [
            {id: -1, image: null, top_line_first: 30, top_line_second: 60, is_old_photo:false},
            {id: -1, image: null, top_line_first: 30, top_line_second: 60, is_old_photo:false},
            {id: -1, image: null, top_line_first: 30, top_line_second: 60, is_old_photo:false},
            {id: -1, image: null, top_line_first: 30, top_line_second: 60, is_old_photo:false}
        ],
        show_lines: false
    }),
    computed:{
        ...mapState(["userInfo"]),
        ...mapState({
            photos: state => state.client.photos
        })
    },
    beforeMount(){
        if (this.photos){
            for (let [index, photo] of this.photos.entries()){
                this.local_photos[index].id = photo.id
                this.local_photos[index].image = photo.image
                this.local_photos[index].top_line_first = photo.top_line_first
                this.local_photos[index].top_line_second = photo.top_line_second
                this.local_photos[index].is_old_photo = true
            }
        }
    },
    methods: {
        goToPage: async function(page){
            let have_changes = true
            if (have_changes){
                let send_photos = []
                for (let [_, photo] of this.local_photos.entries()){
                    if (!photo.is_old_photo){
                        send_photos.push(photo)
                    }
                }
                let form_data= {
                    step: page,
                    photos: send_photos,
                }
                await this.$axios.$post('/api/v1/user/mzo-client-setup/', form_data, { 
                    headers: { Authorization: `Token ${this.userInfo.token}`}
                }).then(res => {
                    this.$store.commit('client/setPhotos', this.local_photos)
                    this.$emit('changePage', page)
                }).catch(e => {
                    console.log(e.response)
                })
            }
        },
        uploadImage(e, index){
            let saveSrc = ''
            if(this.local_photos[index].image != null && this.local_photos[index].image != ''){
                saveSrc = this.local_photos[index].image
            }
            try{
                const image = e.target.files[0];
                const reader = new FileReader();
                let size = image.size
                if(size <= 10000000){
                reader.readAsDataURL(image);
                reader.onload = e =>{
                    this.local_photos[index].image = e.target.result;
                    this.local_photos[index].is_old_photo = false
                    this.cropPhoto = {index: index, photo: e.target.result}
                    this.isCrop = true
                };
                } else {
                    this.errorPhoto = true
                    this.local_photos[index].image = saveSrc
                }
            } catch {}
        },
        async saveUploadPhoto(e){
            this.local_photos[e.index].image = e.photo
            this.local_photos[e.index].top_line_first = e.first_line
            this.local_photos[e.index].top_line_second = e.second_line
        },
        async deleteImage(image_object){
            if (image_object.id != -1){
                await this.$axios.$delete('/api/v1/user/delete-client-photo/', { 
                    headers: { Authorization: `Token ${this.userInfo.token}` },
                    data: { photo_id: image_object.id }
                })
            }
            image_object.id = -1
            image_object.image = ''
            image_object.is_old_photo = true
            this.imagesKey += 1
        }
    },
    components:{
        RadioButton: () => import('@/components/controls/RadioButton.vue'),
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
        CropImage: () => import(`~/components/CropImage.vue`),
    }
}
</script>

<style lang="scss" scoped>
.mzo-client-step{
    .show-lines{
        margin-bottom: 15px;
    }
    .local_photos{
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
            .delete{
                z-index: 10;
                background-color: $dark-gray;
                position: absolute;
                bottom: 0;
                right: 0;
                &:hover{
                    opacity: 0.8;
                    background-color: #fc1943;
                }
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

@media (max-width: 1200px){
    .mzo-client-step{
        .local_photos{
            margin-bottom: 30px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 20px;
            &__item{
                &:not(:last-child){
                    margin-right: 0;
                }
            }
        }
    }
}

@media (max-width: 992px){
    .mzo-client-step{
        .local_photos{
            &__item{
                width: 215px;
                height: 290px;
            }
        }
    }
}

@media (max-width: 768px){
    .mzo-client-step{
        .local_photos{
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

@media (max-width: 576px){
    .mzo-client-step{
        .local_photos{
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
</style>