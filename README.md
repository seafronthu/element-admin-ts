# vue-ts

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 路由
路由全部使用一级路由，根据后台id，parentid对route进行匹配整理（其中path：使用多级标记，meta进行数据整合，name是唯一且不能更改）
### 菜单栏
### 面包屑
### 多页面
暂时不开启同一页面组件打开多个标签页
### 页面缓存
所有页面缓存通过notCache进行判断是否缓存默认不存在是缓存的即代表false
### 标签页
具有显示
