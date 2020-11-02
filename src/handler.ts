export async function handleRequest(request: Request): Promise<Response> {
    const { headers, method } = request;
    const origin = headers.get('origin');
    const responseHeader = {
        'Access-Control-Allow-Origin': origin ?? '*'
    };
    const url = new URL(request.url);
    if (method === 'GET') {
        // 支持使用 淘口令 和 m.tb.cn 短链接 两种形式
        const shortUrl = url.searchParams.get('url');
        const taoCode = url.searchParams.get('text');
        if (shortUrl != null && /m\.tb\.cn/.test(shortUrl)) {
            // 使用短链接识别
            const detectedRet = await detectedWithShortUrl(shortUrl);
            return new Response(detectedRet, { headers: responseHeader });
        }
        if (taoCode != null) {
            // 淘口令的探测
            const detectedRet = await detectedWithCode(taoCode);
            return new Response(detectedRet, { headers: responseHeader });
        }
    }
    return new Response(null, { status: 405 });
}

const maybePromotionUrlRegExpList = [
    /uland.taobao\.com/,
    /s\.click\.taobao\.com/,
    /ai\.taobao\.com/,
    /temai\.taobao\.com/,
    /ut_sk=[^=&]*((?:lianmeng)|(?:yitao))/,
    /alimama/
];

async function detectedWithShortUrl(url: string) {
    const resText = await fetch(url).then((res) => res.text());
    const longUrlReg = /url\s=\s(['"])(.*)\1/;
    const longUrlRet = longUrlReg.exec(resText);
    if (longUrlRet != null) {
        // match success
        const longUrl = new URL(longUrlRet[2]);
        if (maybePromotionUrlRegExpList.some(reg => reg.test(longUrl.toString()))) {
            return `${url} 疑似推广链接：${longUrl}`;
        }
    }
    return 'ok';
}

/**
 * 借助 https://www.taokouling.com 的 API 实现识别淘口令
 */
async function detectedWithCode(text: string) {
    // 淘口令在一段文本中靠连续的11位中英文字符识别
    const codeReg = /[\w\d]{11}/;
    const codeRet = codeReg.exec(text);
    if (codeRet != null) {
        const code = codeRet[0];
        const ret = await fetch(`https://api.taokouling.com/tkl/tkljm?apikey=FvwGgYJdEt&tkl=${code}`).then((ret) =>
            ret.json()
        );
        if (ret.code === 1 && typeof ret.url === 'string' && ret.url.length > 0) {
            const longUrl = new URL(ret.url);
            if (maybePromotionUrlRegExpList.some(reg => reg.test(longUrl.toString()))) {
                return `${text} 疑似推广链接：${longUrl}`;
            }
        }
    }
    return 'ok';
}
