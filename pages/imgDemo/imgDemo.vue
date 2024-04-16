<template>
	<view class="content">
		<view class="gird">
			<view class="row">
				<view class="col">
					<image class="img" :src="imgList[0]?.base64"></image>
					<view class="progress" v-if="imgList[0]?.total">{{ ((imgList[0].loaded / imgList[0].total) * 100).toFixed(0) }}%</view>
				</view>
				<view class="col">
					<image class="img" :src="imgList[1]?.base64"></image>
					<view class="progress" v-if="imgList[1]?.total">{{ ((imgList[1].loaded / imgList[1].total) * 100).toFixed(0) }}%</view>
				</view>
			</view>
			<view class="row">
				<view class="col">
					<image class="img" :src="imgList[2]?.base64"></image>
					<view class="progress" v-if="imgList[2]?.total">{{ ((imgList[2].loaded / imgList[2].total) * 100).toFixed(0) }}%</view>
				</view>
				<view class="col">
					<image class="img" :src="imgList[3]?.base64"></image>
					<view class="progress" v-if="imgList[3]?.total">{{ ((imgList[3].loaded / imgList[3].total) * 100).toFixed(0) }}%</view>
				</view>
			</view>
		</view>
		<view class="options">
			<view class="options-item">
				<text>支持多选(multiple=true)</text>
				<switch :checked="multiple" @change="handleMultipleChange" />
			</view>
			<view class="options-item">
				<text>面向用户的摄像头(capture=user)</text>
				<switch :checked="capture === 'user'" @change="handleCaptureChange" />
			</view>
			<view class="options-item">
				<text>禁用(disabled=user)</text>
				<switch :checked="disabled" @change="handleDisabledChange" />
			</view>
		</view>
		<file-picker-x
			accept="image/*"
			:multiple="multiple"
			:capture="capture"
			:disabled="disabled"
			@success="handleSuccess"
			@loadstart="handleLoadstart"
			@loadend="handleLoadend"
			@progress="handleProgress"
		>
			<button type="primary" :disabled="disabled">选择图片</button>
		</file-picker-x>
	</view>
</template>

<script>
export default {
	data() {
		return {
			imgList: [],
			multiple: false,
			disabled: false,
			capture: 'environment'
		};
	},
	methods: {
		handleLoadstart() {
			uni.showLoading({
				title: '正在加载'
			});
		},
		handleProgress(res) {
			this.imgList = res;
		},
		handleLoadend() {
			uni.hideLoading();
		},
		async handleSuccess(res) {
			this.imgList = res;
		},
		handleMultipleChange(res) {
			this.multiple = res.detail.value;
		},
		handleCaptureChange(res) {
			this.capture = res.detail.value ? 'user' : 'environment';
		},
		handleDisabledChange(res) {
			this.disabled = res.detail.value;
		}
	}
};
</script>

<style lang="scss">
.content {
	padding-top: 20px;
}
.img {
	position: absolute;
	display: block;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
}
.gird {
	margin-bottom: 30px;
}
.row {
	display: flex;
}
.col {
	position: relative;
	box-sizing: content-box;
	width: 50%;
	padding-top: 50%;
	border: 1px solid #ccc;
}
.options {
	margin-bottom: 20px;
	&-item {
		display: flex;
		justify-content: space-between;
		padding: 10px 0;
		background-color: #fff;
	}
}
.process {
	position: absolute;
	display: block;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	font-size: 30px;
	text-align: center;
}
</style>
