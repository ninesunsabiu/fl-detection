# 说明
在 cloudflare 上部署的识别淘口令或者淘宝短链接的计算能力  
返回具体是识别信息：
- 如果是返回 ok 字符串 则表明大概率不是推广链接
- 否则将淘口令或者短链接还原成长链接

在使用时，可以根据 response 是否为 ok 来判断是否疑似推广链接  
后续将会考虑支持 u.jd.com 的判断

# 使用
HTTP API
URL https://fl-detection.ninesuns-lin.workers.dev/
Method GET
searchParams 
| key | 必须 |  说明 |
| :-: | :-: | :-: |
| url | 否 | 淘宝短链接 |
| text | 否 | 淘口令 |

可以选择其中一种方式

示例
```
curl https://fl-detection.ninesuns-lin.workers.dev/?text=豆本豆🎵vd3ScQW61Gr📲

// or

curl https://fl-detection.ninesuns-lin.workers.dev/?url=https%3A%2F%2Fm.tb.cn%2FAhfdk3

```

# 背景
由于豆瓣车组的需要，如果你感兴趣的话，可以 👉 [点这里](https://www.douban.com/group/topic/199565199)

# 鸣谢
为淘口令提供转链API的 www.taokouling.com 服务