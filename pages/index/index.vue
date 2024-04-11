<template>
	<view class="content">
		<image class="logo" :src="img"></image>
		<view class="text-area">
			<text class="title">{{ title }}</text>
			<file-picker-x type="*" debug multiple @change="handleChange"></file-picker-x>
		</view>
	</view>
</template>

<script>
import ExcelJS from 'exceljs';
export default {
	data() {
		return {
			title: 'Hello',
			img: ''
		};
	},
	onLoad() {},
	methods: {
		async handleChange(res) {
			console.log(res[0]);
			this.img = res[0].base64;
			try {
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(res[0].result);
				const result = [];
				workbook.eachSheet((worksheet, sheetId) => {
					const sheet = {
						sheetName: worksheet.name,
						sheetId,
						rowData: []
					};
					worksheet.eachRow({ includeEmpty: false }, (row) => {
						sheet.rowData.push(row.values);
					});
					result.push(sheet);
				});
				console.log(result);
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>

<style>
.content {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}

.logo {
	height: 200rpx;
	width: 200rpx;
	margin-top: 200rpx;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 50rpx;
}

.text-area {
	display: flex;
	justify-content: center;
}

.title {
	font-size: 36rpx;
	color: #8f8f94;
}
</style>
