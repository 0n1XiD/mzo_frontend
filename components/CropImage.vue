<template>
    <div class="cropperImage" v-if="isActive">
        <div class="crop" v-if="step == 1">
            <cropper
                ref="cropper"
                
                :src="photo.photo"
                @change="crop"
            />
            <div class="cropper-footer">
                <Checkbox
                    v-model="cropLine"
                    @change="showCropLine()"
                    class="show-lines" 
                    group="showCropLine" 
                    default 
                    :name="$t('cropImage.placeholder')" 
                />
                <div class="row rotate-row">
                    <InputFields :key="ik" class="cropper-footer__rotate-input" v-model="rotateNumber" @input="changeRotateNum()" type="number" default placeholder="Градус поворота"/>
                    <div class="rotate" @click="rotate(rotateNumber)">
                        <img src="@/assets/img/svg/rotate.svg" alt="rotate">
                        {{$t('cropImage.turnDecription1')}} {{rotateNumber}} {{$t('cropImage.turnDecription2')}}
                    </div>
                </div>
                <Btn :src="photo.photo" @click="saveCrop()" blue :name="$t('cropImage.saveBtn')"/>
            </div>
        </div>
        <div class="line-step" v-if="step == 2">
            <div class="change-line">
                <div 
                    @mouseover="getPos($event)"
                    @mousemove="lineMove($event, activeLine)" 
                    @mouseleave="resetLines()"
                    @mouseup="resetLines()"
                    class="change-line__body" 
                >
                    <img :src="new_photo.photo" alt="new photo">
                    <div
                        @mousedown="lines.first_line_active = true; activeLine = 'first'"
                        @mouseup="resetLines()"
                        class="line" 
                        :style="{'top': lines.line_first_top + '%'}"
                    ></div>
                    <div
                        @mousedown="lines.second_line_active = true; activeLine = 'second'"
                        @mouseup="resetLines()"
                        class="line" 
                        :style="{'top': lines.line_second_top + '%'}"
                    ></div>
                </div>
            </div>
            <div class="button">
                <Btn :src="photo.photo" @click="saveCrop()" blue :name="$t('cropImage.saveBtn')"/>
            </div>
        </div>
    </div>
</template>

<script>
import 'vue-advanced-cropper/dist/style.css';
import { Cropper } from 'vue-advanced-cropper';

export default {
    data: () => ({
        cropLine: false,
        cropSettings: [],
        step: 1,
        new_photo: null,
        
        linesContentHeight: null,
        startLinePos: null,
        percent_step: null,
        activeLine: null,
        lines: {
            line_first_top: 30,
            first_line_active: false,
            line_second_top: 60,
            second_line_active: false,
        },
        rotateNumber: 90,
        ik: 0
    }),
    props: {
        photo: {
            type: Object,
            required: true
        },
        isActive: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        rotate(angle) {
			this.$refs.cropper.rotate(parseInt(angle));
		},
        changeRotateNum(){
            if (this.rotateNumber > 180){
                this.rotateNumber = 180
            }
            if (this.rotateNumber < -180){
                this.rotateNumber = -180
            }
        },
        crop({ coordinates }) {
            this.cropSettings = coordinates
		},
        showCropLine(){
            const prev_crop = document.querySelector('.vue-bounding-box');
            if(this.cropLine){
                let line_crop = document.createElement("div");
                line_crop.setAttribute("class", "posture-line");
                prev_crop.appendChild(line_crop);
            } else {
                const elements = document.getElementsByClassName('posture-line');
                while(elements.length > 0){
                    prev_crop.removeChild(elements[0]);
                }
            }
        },
        saveCrop(){
            if(this.step == 1){
                let result = this.$refs.cropper.getResult()
                this.new_photo = {
                    index: this.photo.index, 
                    photo: result.canvas.toDataURL("image/jpeg"),
                }
                this.cropLine = false
                this.step = 2
            } else {
                this.new_photo.first_line = this.lines.line_first_top
                this.new_photo.second_line = this.lines.line_second_top
                this.closeWindow()
                this.$emit("save", this.new_photo);
            }
        },
        closeWindow(){
            let active = this.isActive
            this.$emit("close", active);
        },
        getPos(e){
            if(!this.linesContentHeight || !this.startLinePos){
                this.linesContentHeight = e.toElement.clientHeight
                this.percent_step = this.linesContentHeight / 100
                try{
                    this.startLinePos = e.srcElement.children[0].y
                } catch {
                    this.startLinePos = 0
                }
            }
        },
        lineMove(e, line){
            if(line == 'first'){
                if(this.lines.first_line_active){
                    this.lines.line_first_top = (e.clientY - this.startLinePos) / this.percent_step
                }
    
                if(this.lines.line_first_top < 0){
                    this.lines.line_first_top = 0
                } else if (this.lines.line_first_top > 100){
                    this.lines.line_first_top = 100
                }
            } else if(line == 'second'){
                if(this.lines.second_line_active){
                    this.lines.line_second_top = (e.clientY - this.startLinePos) / this.percent_step
                }
    
                if(this.lines.line_second_top < 0){
                    this.lines.line_second_top = 0
                } else if (this.lines.line_second_top > 100){
                    this.lines.line_second_top = 100
                }
            }
        },
        resetLines(){
            this.lines.first_line_active = false
            this.lines.second_line_active = false
        }
    },
    components: {
        Btn: () => import('@/components/controls/Btn.vue'),
        InputFields: () => import('@/components/controls/Input-fields.vue'),
        Checkbox: () => import('@/components/controls/Checkbox.vue'),
    }
}
</script>

<style lang="scss">
.cropperImage{
    .vue-advanced-cropper {
        height: 75vh;
    }
    width: 80vw;
    height: 80vh;
    position: relative;
    .cancel-cover{
        cursor: pointer;
        padding: 5px 10px;
        background: $white;
        position: absolute;
        top: 15px;
        right: 90px;
        border-radius: 4px;
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

    .line-step{
        height: 80vh;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .change-line{
            margin-bottom: 20px;
            -moz-user-select: none; user-select: none;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 90%;
            &__body{
                height: 100%;
                width: fit-content;
                position: relative;
                img{
                    pointer-events: none;
                    width: 100%;
                    height: 100%;
                }
                .line{
                    position: absolute;
                    width: 100%;
                    height: 3px;
                    background: $light-orange-gradient;
                    &:hover{
                        cursor: grab;
                    }
                }
            }
        }
        .button{
            display: flex;
            justify-content: center;
            width: 100%;
        }
    }
}
.cropper-footer{
    padding-top: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__rotate-input{
        margin-right: 15px;
        padding: 0 6px !important;
        height: 35px !important;
        width: 70px !important;
    }
    .checkbox{
        label{
            color: $white;
        }
    }
    .save{
        .btn{
            &_orange{
                min-width: 78px;
                height: 40px;
                font-size: 14px;
                line-height: 17px;
            }
        }
    }
    .rotate{
        display: flex;
        align-items: center;
        cursor: pointer;
        color: $white;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
    }
}

@media (max-width: 992px){
    .cropperImage{
        width: 95vw;
    }
    .cropper-footer{
        .rotate{
            display: flex;
            align-items: center;
            cursor: pointer;
            color: $white;
            font-style: normal;
            font-weight: bold;
            font-size: 16px;
            line-height: 29px;
        }
    }
}

@media (max-width: 768px){
    .cropperImage{
        .vue-advanced-cropper {
            height: 65vh;
        }
        width: 80vw;
        height: 90vh;
    }
    .cropper-footer{
        flex-direction: column;
        .checkbox, .rotate-row{
            margin-bottom: 20px;
        }
        .custom-label{
            font-size: 16px !important;
            line-height: 18px !important;
        }
        .rotate{
            font-size: 16px;
            line-height: 18px;
            img{
                width: 20px;
                height: 20px;
            }
        }
    }
}
</style>