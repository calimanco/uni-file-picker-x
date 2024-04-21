<template>
	<view class="filePickerX" :change:prop="filePickerXRenderjs.ready" :prop="{ accept, capture, multiple, disabled }">
		<slot><button :disabled="disabled">附件上传</button></slot>
	</view>
</template>

<script>
export default {
	name: 'filePickerX',
	data() {
		return {
			fileList: [],
			hasLoadstart: false,
			loadendCount: 0
		};
	},
	props: {
		accept: { type: String, default: '*' },
		capture: { type: String, defalut: 'environment' },
		multiple: { type: Boolean, defalut: false },
		disabled: { type: Boolean, defalut: false }
	},
	methods: {
		handleChange(res) {
			this.fileList = res.map((i) => {
				return {
					...i,
					loaded: 0,
					total: i.size
				};
			});
			this.hasLoadstart = false;
			this.loadendCount = 0;
			this.$emit('change', this.fileList);
		},
		handleEvent(res) {
			this.fileList = this.fileList.map((i) => {
				if (i.name === res.name) {
					return {
						...i,
						loaded: res.loaded,
						total: res.total
					};
				}
				return i;
			});
			if (res.eventType === 'loadstart') {
				if (this.hasLoadstart === true) {
					return;
				}
				this.hasLoadstart = true;
			}
			if (res.eventType === 'loadend') {
				this.loadendCount += 1;
				if (this.loadendCount !== this.fileList.length) {
					return;
				}
			}
			this.$emit(res.eventType, this.fileList);
		},
		handleError(errMsg) {
			this.$emit('fail', new Error(errMsg));
		},
		handleSuccess(res) {
			try {
				const result = res.map((i) => {
					return {
						...i,
						base64: `data:${i.type};base64,` + i.base64,
						arrayBuffer: uni.base64ToArrayBuffer(i.base64)
					};
				});
				this.$emit('success', result);
			} catch (err) {
				this.$emit('fail', err.message);
			} finally {
				this.$emit(
					'complete',
					res.map((i) => {
						return {
							...i,
							base64: ''
						};
					})
				);
			}
		}
	}
};
</script>

<script module="filePickerXRenderjs" lang="renderjs">
import { transformArrayBufferToBase64 } from '../../utils';

export default {
	methods: {
		data() {
			return {
				inputDom: null
			};
		},
		ready(params) {
			setTimeout(() => {
				this.init(params);
			}, 10);
		},
		init(params) {
			console.log('init', params)
			const dom = this.$ownerInstance.$el;
			const key = dom.getAttributeNames().find((i) => i.match(/^data-v-.*/));
			if (!dom) {
				this.$ownerInstance.callMethod('handleError', 'can not find dom');
				return;
			}
			if (this.inputDom) {
				dom.removeChild(this.inputDom);
			}
			this.fileList = [];
			const inputDom = document.createElement('input');
			inputDom.type = 'file';
			inputDom.className += 'filePickerX-input';
			inputDom.accept = params.accept;
			inputDom.capture = params.capture;
			inputDom.multiple = params.multiple;
			inputDom.disabled = params.disabled;
			inputDom.setAttribute(key, '');
			inputDom.onchange = async (e) => {
				e.stopPropagation();
				e.preventDefault();
				const fileList = e.target.files;
				this.$ownerInstance.callMethod(
					'handleChange',
					Array.from(fileList).map((file) => {
						return {
							name: file.name,
							size: file.size,
							type: file.type,
							lastModified: file.lastModified
						};
					})
				);
				try {
					const promiseList = [];
					for (const file of fileList) {
						promiseList.push(this.processFile(file));
					}
					const result = await Promise.all(promiseList);
					this.$ownerInstance.callMethod('handleSuccess', result);
				} catch (err) {
					this.$ownerInstance.callMethod('handleError', err.message);
				}
				setTimeout(() => {
					e.target.value = '';
				}, 10);
			};
			inputDom.oninput = async (e) => {
				e.stopPropagation();
				e.preventDefault();
			};
			this.inputDom = inputDom;
			dom.appendChild(inputDom);
		},
		async processFile(file) {
			const base = {
				name: file.name,
				size: file.size,
				fileType: file.type,
				lastModified: file.lastModified
			};
			const commonEvent = (e) => {
				return {
					...base,
					eventType: e.type,
					loaded: e.loaded,
					total: e.total
				};
			};
			const fileReader = new FileReader();
			fileReader.onloadstart = (e) => {
				this.$ownerInstance.callMethod('handleEvent', commonEvent(e));
			};
			fileReader.onloadend = (e) => {
				this.$ownerInstance.callMethod('handleEvent', commonEvent(e));
			};
			fileReader.onprogress = (e) => {
				this.$ownerInstance.callMethod('handleEvent', commonEvent(e));
			};
			fileReader.onerror = (e) => {
				this.$ownerInstance.callMethod('handleError', e.message);
			};
			await new Promise((resolve) => {
				fileReader.onload = () => {
					resolve();
				};
				fileReader.readAsArrayBuffer(file);
			});
			return {
				...base,
				base64: transformArrayBufferToBase64(fileReader.result)
			};
		}
	}
};
</script>

<style lang="scss">
.filePickerX {
	position: relative;

	&-input {
		position: absolute;
		display: block;
		appearance: none;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		z-index: 1;
	}
}
</style>
