<template>
	<view class="content">
		<file-picker-x accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="handleChange">
			<button type="primary">上传Excel</button>
		</file-picker-x>
	</view>
</template>

<script>
import ExcelJS from 'exceljs';
export default {
	data() {
		return {};
	},
	methods: {
		async handleChange(res) {
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

<style lang="scss">
.content {
	padding: 0 14px;
	box-sizing: border-box;
}
</style>
