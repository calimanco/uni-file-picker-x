<template>
	<view class="content">
		<view class="json">
			<text space="nbsp">{{ excelJSON }}</text>
		</view>
		<file-picker-x
			accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			@success="handleChange"
			@loadstart="handleLoadstart"
			@loadend="handleLoadend"
		></file-picker-x>
	</view>
</template>

<script>
import ExcelJS from 'exceljs';
export default {
	data() {
		return {
			excelJSON: ''
		};
	},
	methods: {
		handleLoadstart() {
			uni.showLoading({
				title: '正在加载'
			});
		},
		handleLoadend() {
			uni.hideLoading();
		},
		async handleChange(res) {
			try {
				const workbook = new ExcelJS.Workbook();
				await workbook.xlsx.load(res[0].arrayBuffer);
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
				this.excelJSON = JSON.stringify(result, null, 2);
			} catch (err) {
				console.log(err);
			}
		}
	}
};
</script>

<style lang="scss">
.content {
	padding-top: 20px;
}
.json {
	height: 500px;
	background-color: rgb(246, 248, 250);
	overflow: auto;
	padding: 10px;
	margin-bottom: 20px;
}
</style>
