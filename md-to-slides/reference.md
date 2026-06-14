# 布局与主题速查

配合 [assets/template.html](assets/template.html) 使用。所有 class 名都已在模板 `<style>` 中定义——**保持名称不变**，否则主题与脚本失效。

## 一、幻灯片骨架

每张幻灯片是一个 `.slide`，内容包在 `.inner` 里。加 `center` 让内容居中；加 `data-notes` 写演讲备注。

```html
<section class="slide" data-notes="这页要讲的话…">
  <div class="inner"> …内容… </div>
</section>
```

## 二、布局片段

### 1. 封面 cover
```html
<section class="slide center">
  <div class="inner">
    <span class="kicker">分类 / 系列</span>
    <h1>主标题第一行<br/><span class="grad">高亮第二行</span></h1>
    <p class="lead">副标题 / 一句话简介</p>
  </div>
</section>
```

### 2. 分隔页 section
```html
<section class="slide section">
  <div class="inner">
    <div class="num">01</div>
    <h2>第一部分 · <span class="hl">小节标题</span></h2>
    <p class="lead">本节要讲什么。</p>
  </div>
</section>
```

### 3. 要点列表 bullets
```html
<section class="slide">
  <div class="inner">
    <h2>标题</h2>
    <ul class="points">
      <li><span class="ic">1</span><span>要点<small>补充小字（可省）</small></span></li>
      <li><span class="ic">2</span><span>要点</span></li>
    </ul>
  </div>
</section>
```
`ic` 里可放数字、`✓`、`→`、emoji。**超过 5 条就拆页或改卡片。**

### 4. 左右分栏 split
```html
<div class="split">            <!-- 或 split wide-left / split wide-right -->
  <div class="pane"> 左侧：观点 / 文字 </div>
  <div class="pane"> 右侧：卡片 / 代码 / 图 </div>
</div>
```

### 5. 2×2 网格（grid g4）
```html
<div class="grid g4">
  <div class="card"><div class="num">01</div><h3>标题</h3><p>说明</p></div>
  <div class="card"><div class="num">02</div><h3>标题</h3><p>说明</p></div>
  <div class="card"><div class="num">03</div><h3>标题</h3><p>说明</p></div>
  <div class="card"><div class="num">04</div><h3>标题</h3><p>说明</p></div>
</div>
```
两栏用 `grid g2`，三栏用 `grid g3`。卡片右上角标签：`<span class="tag">标签</span>`。

### 6. 对比 compare（A vs B）
```html
<div class="compare">
  <div class="col bad"><h3 class="hl">方案 A</h3><ul><li>特点</li></ul></div>
  <div class="mid">VS</div>
  <div class="col good"><h3 class="hl2">方案 B</h3><ul><li>特点</li></ul></div>
</div>
```

### 7. 引用 quote
```html
<div class="quote">放大的一句话。<span class="by">—— 出处</span></div>
```

### 8. 金句 statement（居中大字）
```html
<section class="slide center">
  <div class="inner"><p class="statement">一句<span class="grad">大字主张</span></p></div>
</section>
```

### 9. 步骤 / 时间线 steps（自动编号）
```html
<div class="steps">
  <div class="step"><div class="t">第一步<small>说明</small></div></div>
  <div class="step"><div class="t">第二步</div></div>
</div>
```

### 10. 代码 code（手动着色，可选）
```html
<pre class="code"><span class="c"># 注释</span>
<span class="k">const</span> x = <span class="s">"字符串"</span></pre>
```
`.c` 注释、`.k` 关键字、`.s` 字符串。代码里的 `<` `>` `&` 需转义为 `&lt; &gt; &amp;`。

### 11. 图片 figure
```html
<figure class="figure">
  <img src="图片路径" alt="说明" />
  <figcaption>图注</figcaption>
</figure>
```
本地图用相对路径，提示用户把图放到 HTML 同目录。

### 12. 结尾 end
```html
<section class="slide center">
  <div class="inner">
    <h1>结尾金句<br/><span class="grad">行动号召</span></h1>
    <p class="lead" style="margin-left:auto;margin-right:auto">感谢观看</p>
  </div>
</section>
```

## 三、文字强调与零件

| 写法 | 效果 |
|------|------|
| `<span class="hl">` | 主题色高亮 |
| `<span class="hl2">` | 第二强调色 |
| `<span class="grad">` | 渐变文字（标题用） |
| `<span class="strike">` | 删除线（表示过时/否定） |
| `<b>` / `<strong>` | 正文加重为主文本色 |
| `<div class="callout"><b>结论</b>…</div>` | 虚线框「关键结论」 |
| `<span class="pill">` / `<span class="pill on">` | 标签胶囊（on=点亮） |

## 四、主题与主题色

在根元素设默认：`<html data-theme="midnight" data-accent="blue">`。

**明暗主题 `data-theme`：**

| 值 | 风格 |
|----|------|
| `midnight` | 深蓝黑（默认，科技感） |
| `slate` | 中性深灰 |
| `forest` | 深绿 |
| `paper` | 浅色（正式 / 投影友好） |
| `dawn` | 暖浅色 |

**主题色 `data-accent`：** `blue`、`orange`、`green`、`purple`、`pink`、`cyan`、`red`。

放映时：右上角「🎨 主题」面板可视化切换；快捷键 `T` 循环主题、`C` 循环主题色；选择记忆到 `localStorage`。

**搭配建议：** 技术 → `midnight/slate` + `blue/cyan`；温暖分享 → `dawn` + `orange/pink`；正式浅色 → `paper` + `blue/green`。

## 五、放映快捷键

| 键 | 作用 | 键 | 作用 |
|----|------|----|------|
| `←` `→` `空格` / 双击左右半屏 | 翻页 | `O` | 总览缩略图 |
| `Home` / `End` | 首页 / 末页 | `S` | 演讲备注 |
| `F` | 全屏 | `T` / `C` | 主题 / 主题色 |
| URL `#3` | 跳到第 3 页 | `Ctrl/Cmd+P` | 打印 → 导出 PDF |

## 六、占位符（模板内 `{{…}}`）

生成时把这些替换成真实文本：`{{DECK_TITLE}}`（页面标题 + 状态栏）、`{{KICKER}}`、`{{TITLE_LINE_1}}`、`{{TITLE_LINE_2}}`、`{{SUBTITLE}}`。
