---
title: 密码框里敲的每一个字，输入法都看得见——我写的这个开源库想把它挡住
date: 2026-08-29
description: LazyKeyboard：Android 安全键盘开源库。从绑定层面断掉输入法、自绘键盘、数字乱序，把敏感输入留在应用内。问题、用法、原理与取舍。
---

先说一个不太舒服的事实：

你在 Android 密码框里敲的**每一个字符，都会先经过当前输入法**，再进入应用。系统就是这么设计的——输入法是文字的中转站。而用户手机里装的输入法，可能是任何一个拥有完整网络权限的第三方 App。

它读没读、传没传，你不知道，也管不着。

## 这个问题的真实分量

对大多数人来说这听起来像杞人忧天，但对特定场景它是硬性要求：

- **金融、政务、医疗类 App** 的合规检测(等保、行标测评)普遍要求：密码类输入不得经由系统输入法；
- 银行的做法要么是自研键盘，要么采购**闭源、收费、体积大**的商业 SDK;
- 中小团队和工具类 App 两条路都贵。

剩下的第三条路，就是用一个轻量的开源库。这也是我在 2018 年写 [LazyKeyboard](https://github.com/onlyloveyd/LazyKeyboard) 的原因——最近我把它翻新到了 v1.8,趁这个机会认真介绍一下。

## LazyKeyboard 是什么

一句话：**把敏感输入框的键盘，换成一个不经过任何输入法的应用内自绘键盘。**

![演示：输入、长按连删、数字乱序、符号键盘](https://blog-1256167984.cos.ap-guangzhou.myqcloud.com/lazykeyboard_demo.gif "真机录制：字母输入、长按连删、数字乱序、符号键盘")

它管三件事：

1. **输入法断路**——输入框从绑定层面拒绝一切输入法，系统键盘没有任何路径弹得出来；
2. **防肩窥**——数字键盘每次展示都重新乱序，对着录屏和肩膀后面的人，键盘布局没有参考价值；
3. **防遮挡**——键盘弹出如果盖住输入框，页面自动抬升，关闭后复原，使用方零配置。

纯 Java 实现，不引入 Kotlin 运行时，只依赖 AndroidX 的 appcompat 和 constraintlayout,接入成本一个 XML 标签。

## 五分钟接入

**第一步**，`settings.gradle` 里加上 JitPack 仓库：

```kotlin
dependencyResolutionManagement {
    repositories {
        maven(url = "https://jitpack.io")
    }
}
```

**第二步**，引入依赖：

```kotlin
dependencies {
    implementation("com.github.onlyloveyd:LazyKeyboard:v1.8")
}
```

**第三步**，把布局里的 `EditText` 换成 `SecurityEditText`:

```xml
<com.gs.keyboard.SecurityEditText
    android:id="@+id/login_input_password"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="密码"
    android:inputType="textPassword" />
```

完了。不需要写任何 Java 代码：点击弹出、失焦收起、返回键关闭，全部自动处理。聚焦它，弹出来的是这个：

![数字乱序键盘](https://blog-1256167984.cos.ap-guangzhou.myqcloud.com/lazykeyboard-number.png "数字每次展示都重新乱序")

## 进阶用法

**自定义外观。** 切换栏选中/未选中颜色、切换栏背景、键盘背景、按键预览开关，都有对应属性：

```xml
app:chooserSelectedColor="#000000"
app:chooserUnselectedColor="#999999"
app:keyboardBackground="@drawable/keyboard_bg"
app:keyPreview="true"
```

**拿到按键序列做加密。** 这是 v1.7 新增的 API。`setOnSecurityKeyListener` 在每次按键**作用到文本之前**触发，你可以据此维护自己的加密序列，或做输入审计：

```java
SecurityEditText editText = findViewById(R.id.login_input_password);
editText.setOnSecurityKeyListener((primaryCode, label) -> {
    if (primaryCode == OnSecurityKeyListener.KEYCODE_DELETE) {
        // 从自己的加密序列里删掉一位
    } else if (primaryCode >= 0) {
        // 往自己的加密序列里追加该字符
    }
});
```

功能键(大小写/完成/删除)以负数编码下发，常量定义在监听器接口上。

**Compose 项目。** v1.8 提供了独立的可选模块，核心库依然是纯 Java——不用 Compose 就不要加这个依赖：

```kotlin
dependencies {
    implementation("com.github.onlyloveyd:LazyKeyboard:v1.8")
    implementation("com.github.onlyloveyd.LazyKeyboard:lazykeyboard-compose:v1.8")
}
```

输入内容以 Compose 状态暴露，旋转屏幕后内容和焦点都会自动恢复：

```kotlin
val passwordState = rememberSecurityInputState()

SecurityTextField(state = passwordState, hint = "支付密码")
Text("已输入 ${passwordState.text.length} 位")
```

**英文设备。** v1.8 内置了英文文案：切换栏自动变成 ABC / Sym / 123,完成键变成 Done。其他语言在应用内重写四个字符串资源即可。

## 两个值得知道的原理

**输入法为什么真的弹不出来？** 只调 `setShowSoftInputOnFocus(false)` 是不够的——它只挡得住「聚焦触发」这一条路，长按选择、业务代码主动 `showSoftInput`、部分 ROM 在窗口焦点变化时，系统键盘照样能钻出来。LazyKeyboard 的做法更彻底：重写 `onCreateInputConnection()` 返回 `null`,输入法连绑定的机会都没有。这条路有单元测试回归保护着。

**键盘为什么敢自己画？** 早期版本基于框架的 `android.inputmethodservice.KeyboardView`,但 Google 从 API 29 起废弃并冻结了它。v1.7 我把它整个替换成了库内自绘视图：按键布局模型、绘制、触摸、长按连删、预览气泡全部自己实现，还顺手修掉了框架实现里所有按键共用一个 drawable 实例导致的一类渲染 bug。百分比布局按容器宽度解析、行内居中，横竖屏和分屏都正确。

## 有意为之的取舍

安全是有代价的，这些「不支持」是设计决定，不是缺陷：

- **输入法组合输入不可用**——输入根本不经过输入法，这是前提；
- **长按没有全选/复制**——`textPassword` 类型的输入框本来就没有，而把密码放进系统剪贴板等于主动泄密，金融类 App 的安全键盘一律禁用；
- **只防 UI 层**——它挡的是输入法抓取和肩窥，不加密内容、不防已 root 的设备。有合规要求的场景，请配合你们自己的提交值加密(这正是输入回调 API 存在的意义)。

## 写在最后

LazyKeyboard 从 2018 年维护到现在，MIT 协议，几百个 star,最近完成了：v1.7 自绘渲染层 + 输入回调 API,v1.8 Compose 适配 + 英文文案。

如果你在做金融、政务类应用，或者只是想给自己的密码框加一道闸：[GitHub 传送门](https://github.com/onlyloveyd/LazyKeyboard),中文文档在 [README_zh-CN.md](https://github.com/onlyloveyd/LazyKeyboard/blob/master/README_zh-CN.md)。

发现问题欢迎提 issue,觉得有用欢迎 star——这是维护开源库最直接的正反馈。
