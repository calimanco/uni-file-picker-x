# calimanco-file-picker-x

一个用于 uni-app 框架的跨平台文件选择组件，可用于 Web、Android 和 iOS（未实测）。

## 使用

使用 HBuilder X 导入，在根目录即可运行 Demo。  
提供两个示例：
- 图片选择示例（包括自定义UI和各种事件演示）
- 表格选择示例（可读 xlsx 文件，采用 ExcelJS 进行解析，默认UI）

## 特色

- 纯 Web 实现，使用 WebView 原本的文件选择能力，无需原生支持，无需复杂权限；
- 可获取到 base64 和 ArrayBuffer 两个类型数据，如果选择的是图片 base64 可直接回显；
- 纯容器（逻辑）组件，纯净简单，UI 可自定义；
- 支持多选；
- 支持提供详细的读取进度响应；
- 支持调用相机（需要手机支持）；
- 支持限定接受的文件类型（不同手机的响应可能不同）；

## 原理

由于 uni-app 是类似小程序的实现，Input 标签已经被改写过，不支持 file，但实际渲染层依旧是 WebView，因此就有了在渲染层反过来构建 Input 的思路。  
这是基于框架的 renderjs 实现，关于 renderjs 见 [官方文档](https://uniapp.dcloud.net.cn/tutorial/renderjs.html)。  
在渲染层动态生成透明的 Input 覆盖在组件上，这就是本插件的基本原理。  
其次由于 uni-app 的渲染层与逻辑层直接的通讯只能传递基本数据和简单 Object，无法传递有构造函数的数据，比如 ArrayBuffer，因此本插件还提供了通讯时数据的序列化和反序列化。


## 组件参数

| 参数 | 类型 | 说明 | 默认 |
| --- | --- | ---- | --- |
| accept | String | 与input标签属性相同，可接受的文件类型 | * |
| capture | String | 与input标签属性相同，相机来源（前置/后置） | environment |
| multiple | Boolean | 与input标签属性相同，是否支持多选 | false |
| disabled | Boolean | 禁用，自定义UI需要自行处理样式 | false |

## 组件事件

| 事件 | 负载参数 | 说明 |
| --- | --- | ---- |
| change | IFile[] | 选中文件时触发，此时未开始读取，只会提供基础信息 |
| loadstart | IFile[] | 开始读文件时触发，多选时只会首文件触发 |
| progress | IFile[] | 读文件时触发，可在 loaded 拿到进度 |
| loadend | IFile[] | 结束读文件时触发，多选时只会末文件触发 |
| success | IFile[] | 读取完成无错误，可拿到完整信息 |
| fail | Error | 读取发生错误，可拿到错误信息 |

```typescript
interface IFile {
	name: String  // 文件名
	size: Number  // 文件大小
	type: String  // 文件类型
	lastModified: Number  // 最后修改日期
	loaded: Number  // 已读取大小
	total: Number  // 总文件大小
	base64?: String  // base64编码字符串，仅在 success 事件有值
	arrayBuffer?: ArrayBuffer  // ArrayBuffer数据，仅在 success 事件有值
}
```