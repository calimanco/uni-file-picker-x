<template>
	<view class="filePickerX" :change:prop="filePickerXRenderjs.ready" :prop="{ accept, capture, multiple }">
		<slot><button>附件上传</button></slot>
	</view>
</template>

<script>
export default {
	name: 'filePickerX',
	props: {
		accept: { type: String, default: '*' },
		capture: { type: Boolean, defalut: false },
		multiple: { type: Boolean, defalut: false },
	},
	mounted() {
		// #ifdef H5
		this.filePickerXRenderjs.ready({
			accept: this.accept,
			capture: this.capture,
			multiple: this.multiple,
		})
		// #endif
	},
	methods: {
		handleStart(res) {
			this.$emit('start', res);
		},
		handleError(errMsg) {
			this.$emit('error', new Error(errMsg));
		},
		handleSuccess(res) {
			try {
				const result = res.map((i) => {
					return {
						...i,
						base64: `data:${i.type};base64,` + i.base64,
						result: uni.base64ToArrayBuffer(i.base64)
					};
				});
				this.$emit('change', result);
			} catch (err) {
				this.$emit('error', err.message);
			}
		}
	}
};
</script>

<script module="filePickerXRenderjs" lang="renderjs">
import { transformArrayBufferToBase64 } from '../../utils'

export default {
  methods: {
		ready(params) {
			setTimeout(() => {
				this.init(params)
			})
		},
    init(params) {
      const dom = this.$ownerInstance.$el
      const key = dom.getAttributeNames().find(i => i.match(/^data-v-.*/))
      if (!dom) {
				this.$ownerInstance.callMethod('handleError', 'can not find dom')
        return
      }
      const inputDom = document.createElement('input')
      inputDom.type = 'file'
      inputDom.className += 'filePickerX-input'
      inputDom.accept = params.accept
      inputDom.capture = params.capture
			inputDom.multiple = params.multiple
      inputDom.setAttribute(key, '')
      inputDom.onchange = e => {
        e.stopPropagation()
        e.preventDefault()
      }
      inputDom.oninput = async e => {
        e.stopPropagation()
        e.preventDefault()
        const fileList = e.target.files
        this.$ownerInstance.callMethod('handleStart', Array.from(fileList).map(i => {
					return {
						name: i.name,
						size: i.size,
						type: i.type,
						lastModified: i.lastModified,
					}
				}))
        try {
					const promiseList = []
					for(const file of fileList) {
						promiseList.push(this.processFile(file))
					}
          const result = await Promise.all(promiseList)
          this.$ownerInstance.callMethod('handleSuccess', result)
        } catch (err) {
          this.$ownerInstance.callMethod('handleError', err.message)
        }
        setTimeout(() => {
          e.target.value = ''
        }, 10)
      }
      dom.appendChild(inputDom)
    },
    async processFile(file) {
      const fileReader = new FileReader()
      await new Promise(resolve => {
        fileReader.onload = () => {
          resolve()
        }
        fileReader.readAsArrayBuffer(file)
      })
      return {
				name: file.name,
				size: file.size,
				type: file.type,
				lastModified: file.lastModified,
				base64: transformArrayBufferToBase64(fileReader.result)
			}
    }
  }
}
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
