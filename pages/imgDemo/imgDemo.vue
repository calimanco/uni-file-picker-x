<template>
	<view class="content">
		<view class="gird">
			<view class="row">
				<div class="col">
					<image class="img" :src="imgList[0]"></image>
				</div>
				<div class="col">
					<image class="img" :src="imgList[1]"></image>
				</div>
			</view>
			<view class="row">
				<div class="col">
					<image class="img" :src="imgList[2]"></image>
				</div>
				<div class="col">
					<image class="img" :src="imgList[3]"></image>
				</div>
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
		<file-picker-x type="image/*" :multiple="multiple" :capture="capture" :disabled="disabled" @change="handleChange">
			<button type="primary" :disabled="disabled">上传图片</button>
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
		async handleChange(res) {
			this.imgList = res.map((i) => i.base64);
		},
		handleMultipleChange(res) {
			this.multiple = res.detail.value
		},
		handleCaptureChange(res) {
			this.capture = res.detail.value ? 'user' : 'environment'
		},
		handleDisabledChange(res) {
			this.disabled = res.detail.value
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
</style>
