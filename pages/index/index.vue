<template>
	<view class="content">
		<view class="title">uni-file-picker-x</view>
		<view class="description">一个用于 uni 框架的跨平台文件选择组件，采用 Web 实现，纯容器（逻辑）组件。</view>
		<navigator url="/pages/imgDemo/imgDemo">
			<button class="btn" type="default">图片选择示例</button>
		</navigator>
		<navigator url="/pages/excelDemo/excelDemo">
			<button class="btn" type="default">Excel选择示例</button>
		</navigator>
	</view>
</template>

<script>
export default {
	data() {
		return {
			img: ''
		};
	},
	onLoad() {},
	methods: {}
};
</script>

<style lang="scss">
.content {
	padding-top: 30px;
}
.title {
	font-size: 40px;
	text-align: center;
	margin-bottom: 30px;
}

.description {
	margin-bottom: 30px;
}

.btn {
	margin-bottom: 20px;
}

.text-area {
	display: flex;
	justify-content: center;
}
</style>
