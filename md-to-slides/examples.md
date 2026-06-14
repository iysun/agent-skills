# 示例：md 大纲 → 成品幻灯片

演示如何把一段大纲映射成幻灯片，并展示「扩写表达、不编造事实」「布局交替」「加演讲备注」三个要点。

## 输入（用户的 md 大纲）

```markdown
# 为什么要写单元测试

## 现状
- 很多团队没有测试
- 改一行代码就提心吊胆

## 三个收益
1. 重构有底气
2. 文档作用
3. 提前发现 bug

## 成本其实没那么高
对比：手动回归 vs 自动化测试

## 结论
现在就开始写第一个测试
```

## 映射决策

| 大纲 | 幻灯片 | 布局 |
|------|--------|------|
| 标题 | 封面 | cover |
| 现状 | 分隔页 + 痛点 | section + statement |
| 三个收益 | 一页 | grid g3（三栏卡片） |
| 成本对比 | 一页 | compare |
| 结论 | 结尾 | end |

主题：开发话题 → `data-theme="midnight" data-accent="cyan"`。

## 输出（只展示 `<main class="deck">` 内部，其余沿用模板）

```html
<main class="deck" id="deck">

  <!-- 封面 -->
  <section class="slide center" data-notes="开场：问一句『你敢随手重构线上代码吗？』引出主题。">
    <div class="inner">
      <span class="kicker">工程实践</span>
      <h1>为什么要<br/><span class="grad">写单元测试</span></h1>
      <p class="lead">不是为了覆盖率好看，而是为了改代码时睡得着觉。</p>
    </div>
  </section>

  <!-- 分隔页 -->
  <section class="slide section">
    <div class="inner">
      <div class="num">01</div>
      <h2>先说<span class="hl">现状</span></h2>
    </div>
  </section>

  <!-- 痛点金句 -->
  <section class="slide center" data-notes="共鸣点：很多人改一行就怕炸，停一下让观众代入。">
    <div class="inner">
      <p class="statement">很多团队没有测试，<br/>于是<span class="grad">改一行代码都提心吊胆</span>。</p>
    </div>
  </section>

  <!-- 三个收益（三栏） -->
  <section class="slide" data-notes="逐个点：重构、文档、防 bug，各举一句例子。">
    <div class="inner">
      <h2>测试带来的<span class="hl">三个收益</span></h2>
      <div class="grid g3">
        <div class="card"><div class="num">01</div><h3>重构有底气</h3><p>测试是安全网，红了就知道哪里坏了，敢动大手术。</p></div>
        <div class="card"><div class="num">02</div><h3>活的文档</h3><p>测试用例说明了「这段代码该怎么用」，比注释更新更勤。</p></div>
        <div class="card"><div class="num">03</div><h3>提前抓 bug</h3><p>问题在本地就暴露，而不是等用户在生产环境替你发现。</p></div>
      </div>
    </div>
  </section>

  <!-- 成本对比 -->
  <section class="slide">
    <div class="inner">
      <h2>成本其实<span class="hl2">没那么高</span></h2>
      <div class="compare">
        <div class="col bad"><h3 class="hl">手动回归</h3>
          <ul><li>每次发版都重来一遍</li><li>易漏、易累、不可复用</li><li>人越多越乱</li></ul></div>
        <div class="mid">VS</div>
        <div class="col good"><h3 class="hl2">自动化测试</h3>
          <ul><li>写一次，跑无数次</li><li>秒级反馈</li><li>新人也能放心改</li></ul></div>
      </div>
      <div class="callout"><b>一次性投入，长期复利。</b>越是长期维护的项目，越划算。</div>
    </div>
  </section>

  <!-- 结尾 -->
  <section class="slide center" data-notes="行动号召：今天就给最核心的函数补一个测试。">
    <div class="inner">
      <h1>别等「以后」，<br/><span class="grad">现在就写第一个测试</span></h1>
      <p class="lead" style="margin-left:auto;margin-right:auto">挑最怕改的那个函数，先补一条。</p>
    </div>
  </section>

</main>
```

## 关键点回顾

1. **扩写而非编造**：把「重构有底气」扩成完整解释，但没有捏造任何数字/出处。
2. **布局交替**：封面 → 分隔页 → 金句 → 三栏 → 对比 → 结尾，不全是 bullets。
3. **演讲备注**：关键页加 `data-notes`，放映按 `S` 看。
4. **一句话主张**：痛点与结论都用 `statement` 放大，制造记忆点。
