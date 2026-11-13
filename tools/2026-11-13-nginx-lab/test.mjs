// Nginx 配置工作台 · Nginx Lab —— 集成测试
// 真值来源（一个手打的魔数都不留）：
//  · ORACLE.scenarios：run 目录 toracle/gen.mjs 用本机源码编译的 nginx 1.30.6（--with-debug，Linux 语义）
//    把 5 组场景、66 条原始请求（socket 原样发请求行，不让客户端归一化路径）真跑一遍：
//    状态码、debug 日志里的 "using configuration" 序列（= location 选择序列）、Location 头、
//    返回正文（静态文件的内容就是它自己的绝对路径）、echo 上游收到的请求 URI 与 Host、自定义响应头。
//  · ORACLE.broken：同一个 nginx 的 `nginx -t` 对 7 份坏配置给出的 [emerg] 消息与行号。
//  · ORACLE.mac：未改动的 macOS 构建（大小写不敏感文件系统语义）跑 edge 场景的 5 条请求。
//  以上由 toracle/inject.mjs 机械注入下面的 ORACLE 块。
//  测试全程通过页面 UI 操作（往编辑器、文件系统、请求栏里填值并点发送），读结果卡上的 data-* 与真值逐条比。
import { renderGuards, guardBoxOverlap, guardControlSize } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "nginx": "1.30.6（本机源码编译，--with-debug，Linux 语义 -DNGX_HAVE_CASELESS_FILESYSTEM=0；mac 场景用未改的 macOS 构建）",
  "generated": "2026-11-13T08:24:46.566Z",
  "requests": 75
 },
 "scenarios": [
  {
   "id": "spa",
   "host": "app.example.com",
   "conf": "server {\n    listen 127.0.0.1:17301;\n    server_name app.example.com;\n    return 301 https://$host$request_uri;\n}\n\nserver {\n    listen 127.0.0.1:17300;\n    server_name app.example.com;\n    root /tmp/nlx/spa/dist;\n    index index.html;\n    add_header Strict-Transport-Security \"max-age=31536000\" always;\n    add_header X-Frame-Options DENY;\n\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n    location /api/ {\n        proxy_pass http://127.0.0.1:17399/;\n        proxy_set_header Host $host;\n    }\n    location ~* \\.(js|css|png|svg|woff2)$ {\n        expires 30d;\n        add_header Cache-Control \"public, immutable\";\n    }\n    location = /healthz {\n        return 200 \"ok\\n\";\n    }\n}\n",
   "fs": [
    "/tmp/nlx/spa/dist/index.html",
    "/tmp/nlx/spa/dist/favicon.svg",
    "/tmp/nlx/spa/dist/assets/app.3f9a.js",
    "/tmp/nlx/spa/dist/docs/"
   ],
   "reqs": [
    {
     "method": "GET",
     "port": 17300,
     "target": "/",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/",
      "/"
     ],
     "location": "",
     "body": "/tmp/nlx/spa/dist/index.html",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/settings/profile",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/",
      "/"
     ],
     "location": "",
     "body": "/tmp/nlx/spa/dist/index.html",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/api/users?page=2",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/api/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/users?page=2",
     "upHost": "app.example.com"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/api",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [
      "/api/"
     ],
     "location": "http://app.example.com:17300/api/",
     "body": "",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/assets/app.3f9a.js",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "\\.(js|css|png|svg|woff2)$"
     ],
     "location": "",
     "body": "/tmp/nlx/spa/dist/assets/app.3f9a.js",
     "custom": [
      "cache-control: max-age=2592000\npublic, immutable"
     ],
     "expires": 1,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/healthz",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "=/healthz"
     ],
     "location": "",
     "body": "ok\n",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/docs",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [
      "/"
     ],
     "location": "http://app.example.com:17300/docs/",
     "body": "",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/docs?tab=1",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [
      "/"
     ],
     "location": "http://app.example.com:17300/docs/?tab=1",
     "body": "",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17301,
     "target": "/login?next=/me",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [],
     "location": "https://app.example.com/login?next=/me",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/missing.css",
     "hdr": "",
     "mode": "",
     "status": 404,
     "locs": [
      "\\.(js|css|png|svg|woff2)$"
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "POST",
     "port": 17300,
     "target": "/favicon.svg",
     "hdr": "",
     "mode": "",
     "status": 405,
     "locs": [
      "\\.(js|css|png|svg|woff2)$"
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/api/a%20b/../c?x=%2F",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/api/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/c?x=%2F",
     "upHost": "app.example.com"
    },
    {
     "method": "GET",
     "port": 17300,
     "target": "/api/caf%C3%A9%20x?y=1",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/api/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "strict-transport-security: max-age=31536000",
      "x-frame-options: DENY"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/caf%C3%A9%20x?y=1",
     "upHost": "app.example.com"
    }
   ]
  },
  {
   "id": "traps",
   "host": "traps.test",
   "conf": "server {\n    listen 127.0.0.1:17310;\n    server_name traps.test;\n    root /tmp/nlx/traps/site;\n    add_header X-Content-Type-Options nosniff;\n\n    location /static {\n        alias /tmp/nlx/traps/static/;\n    }\n    location /api/ {\n        proxy_pass http://127.0.0.1:17399/v1;\n    }\n    location /downloads/ {\n        root /tmp/nlx/traps/files;\n    }\n    location ~ \\.php$ {\n        return 200 \"php uri=$uri args=$args\";\n    }\n    location /app/ {\n        try_files $uri /app/index.php;\n    }\n    location /admin/ {\n        if ($http_x_debug) {\n            add_header X-Debug on;\n        }\n        try_files $uri $uri/ =404;\n    }\n    location /internal/ {\n        deny all;\n        allow 10.0.0.0/8;\n    }\n    location /secure/ {\n        add_header Strict-Transport-Security \"max-age=31536000\";\n        add_header X-Frame-Options SAMEORIGIN;\n    }\n    location /legacy/ {\n        proxy_set_header Host $http_host;\n        proxy_pass http://127.0.0.1:17399;\n    }\n}\n",
   "fs": [
    "/tmp/nlx/traps/static/logo.png",
    "/tmp/nlx/traps/secret.txt",
    "/tmp/nlx/traps/files/downloads/report.pdf",
    "/tmp/nlx/traps/files/downloads/tool.php",
    "/tmp/nlx/traps/site/app/index.php",
    "/tmp/nlx/traps/site/admin/index.html",
    "/tmp/nlx/traps/site/index.html"
   ],
   "reqs": [
    {
     "method": "GET",
     "port": 17310,
     "target": "/static../secret.txt",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/static"
     ],
     "location": "",
     "body": "/tmp/nlx/traps/secret.txt",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/static/logo.png",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/static"
     ],
     "location": "",
     "body": "/tmp/nlx/traps/static/logo.png",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/api/users",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/api/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/v1users",
     "upHost": "127.0.0.1:17399"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/downloads/report.pdf",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/downloads/"
     ],
     "location": "",
     "body": "/tmp/nlx/traps/files/downloads/report.pdf",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/downloads/tool.php",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "\\.php$"
     ],
     "location": "",
     "body": "php uri=/downloads/tool.php args=",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/app/search?q=nginx",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/app/",
      "\\.php$"
     ],
     "location": "",
     "body": "php uri=/app/index.php args=",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/admin/",
     "hdr": "X-Debug: 1",
     "mode": "",
     "status": 200,
     "locs": [
      "/admin/",
      "/admin/"
     ],
     "location": "",
     "body": "/tmp/nlx/traps/site/admin/index.html",
     "custom": [
      "x-debug: on"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/admin/",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/admin/",
      "/admin/"
     ],
     "location": "",
     "body": "/tmp/nlx/traps/site/admin/index.html",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/internal/metrics",
     "hdr": "",
     "mode": "",
     "status": 403,
     "locs": [
      "/internal/"
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/secure/missing",
     "hdr": "",
     "mode": "",
     "status": 404,
     "locs": [
      "/secure/"
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17310,
     "target": "/legacy/x?y=1",
     "hdr": "Host: evil.example",
     "mode": "",
     "status": 200,
     "locs": [
      "/legacy/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "x-content-type-options: nosniff"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/legacy/x?y=1",
     "upHost": "evil.example"
    }
   ]
  },
  {
   "id": "rewrite",
   "host": "www.example.org",
   "conf": "map $uri $new_uri {\n    /old-about     /about/;\n    \"~^/blog/(?<y>\\d{4})/(?<slug>[^/]+)\\.html$\"  /posts/$y-$slug/;\n}\n\nserver {\n    listen 127.0.0.1:17320;\n    server_name www.example.org example.org;\n    root /tmp/nlx/rw/site;\n\n    if ($host = example.org) {\n        return 301 http://www.example.org$request_uri;\n    }\n    if ($new_uri) {\n        return 301 $new_uri;\n    }\n\n    rewrite ^/product/(\\d+)$ /item.php?id=$1 last;\n    rewrite ^/search/(.+)$ /search.php?q=$1;\n\n    location / {\n        try_files $uri $uri/ =404;\n    }\n    location ~ ^/download/(?<file>.+)$ {\n        rewrite ^ /files/$file break;\n        root /tmp/nlx/rw/storage;\n    }\n    location = /item.php {\n        return 200 \"item id=$arg_id args=$args\";\n    }\n    location = /search.php {\n        return 200 \"q=$arg_q args=$args\";\n    }\n    location /loop/ {\n        rewrite ^/loop/(.*)$ /loop/$1 last;\n    }\n    location /old/ {\n        rewrite ^/old/(.*)$ /new/$1 permanent;\n    }\n    location /keep/ {\n        rewrite ^/keep/(.*)$ /item.php?from=$1? last;\n    }\n    location ~ ^/cap/(\\w+)$ {\n        set $before $1;\n        rewrite ^/never-matches$ /x;\n        return 200 \"before=$before after=$1\";\n    }\n}\n",
   "fs": [
    "/tmp/nlx/rw/site/index.html",
    "/tmp/nlx/rw/site/about/index.html",
    "/tmp/nlx/rw/storage/files/manual/v2.pdf"
   ],
   "reqs": [
    {
     "method": "GET",
     "port": 17320,
     "target": "/pricing?ref=ad",
     "hdr": "Host: example.org",
     "mode": "",
     "status": 301,
     "locs": [],
     "location": "http://www.example.org/pricing?ref=ad",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/old-about",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [],
     "location": "http://www.example.org:17320/about/",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/blog/2024/hello-nginx.html",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [],
     "location": "http://www.example.org:17320/posts/2024-hello-nginx/",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/product/42?utm=x",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "=/item.php"
     ],
     "location": "",
     "body": "item id=42 args=id=42&utm=x",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/search/nginx%20lab",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "=/search.php"
     ],
     "location": "",
     "body": "q=nginx%20lab args=q=nginx%20lab",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/search/a+b?z=1",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "=/search.php"
     ],
     "location": "",
     "body": "q=a%2Bb args=q=a%2Bb&z=1",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/download/manual/v2.pdf",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "^/download/(?<file>.+)$"
     ],
     "location": "",
     "body": "/tmp/nlx/rw/storage/files/manual/v2.pdf",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/loop/a",
     "hdr": "",
     "mode": "",
     "status": 500,
     "locs": [
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/",
      "/loop/"
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/old/x/y?k=v",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [
      "/old/"
     ],
     "location": "http://www.example.org:17320/new/x/y?k=v",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/keep/abc?drop=me",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/keep/",
      "=/item.php"
     ],
     "location": "",
     "body": "item id= args=from=abc",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/about",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [
      "/"
     ],
     "location": "http://www.example.org:17320/about/",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17320,
     "target": "/cap/abc",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "^/cap/(\\w+)$"
     ],
     "location": "",
     "body": "before=abc after=",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    }
   ]
  },
  {
   "id": "multi",
   "host": "example.com",
   "conf": "server {\n    listen 127.0.0.1:17330 default_server;\n    server_name _;\n    return 444;\n}\nserver {\n    listen 127.0.0.1:17330;\n    server_name example.com www.example.com;\n    root /tmp/nlx/multi/www;\n    location / { try_files $uri $uri/ =404; }\n}\nserver {\n    listen 127.0.0.1:17330;\n    server_name ~^(?<tenant>[a-z0-9-]+)\\.example\\.app$;\n    root /tmp/nlx/multi/tenants/$tenant;\n    location / { try_files $uri /index.html; }\n}\nserver {\n    listen 127.0.0.1:17330;\n    server_name *.example.com;\n    return 301 http://example.com$request_uri;\n}\nserver {\n    listen 127.0.0.1:17330;\n    server_name api.*;\n    location / { return 200 \"tail-wildcard host=$host\"; }\n}\nserver {\n    listen 127.0.0.1:17330;\n    location / { return 200 \"nameless host=$host\"; }\n}\n",
   "fs": [
    "/tmp/nlx/multi/www/index.html",
    "/tmp/nlx/multi/www/about/index.html",
    "/tmp/nlx/multi/tenants/acme/index.html",
    "/tmp/nlx/multi/tenants/acme/logo.png"
   ],
   "reqs": [
    {
     "method": "GET",
     "port": 17330,
     "target": "/",
     "hdr": "Host: example.com",
     "mode": "",
     "status": 200,
     "locs": [
      "/",
      "/"
     ],
     "location": "",
     "body": "/tmp/nlx/multi/www/index.html",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/about",
     "hdr": "Host: WWW.Example.COM.",
     "mode": "",
     "status": 301,
     "locs": [
      "/"
     ],
     "location": "http://www.example.com:17330/about/",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/dashboard",
     "hdr": "Host: acme.example.app",
     "mode": "",
     "status": 200,
     "locs": [
      "/",
      "/"
     ],
     "location": "",
     "body": "/tmp/nlx/multi/tenants/acme/index.html",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/logo.png",
     "hdr": "Host: acme.example.app",
     "mode": "",
     "status": 200,
     "locs": [
      "/"
     ],
     "location": "",
     "body": "/tmp/nlx/multi/tenants/acme/logo.png",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/2026/hello",
     "hdr": "Host: blog.example.com",
     "mode": "",
     "status": 301,
     "locs": [],
     "location": "http://example.com/2026/hello",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/",
     "hdr": "Host: 203.0.113.9",
     "mode": "",
     "status": 0,
     "locs": [],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": ""
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/v1",
     "hdr": "Host: api.example.net",
     "mode": "",
     "status": 200,
     "locs": [
      "/"
     ],
     "location": "",
     "body": "tail-wildcard host=api.example.net",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/",
     "hdr": "Host: bad/host",
     "mode": "",
     "status": 400,
     "locs": [],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17339,
     "target": "/",
     "hdr": "Host: bad/host",
     "mode": "",
     "status": 0,
     "locs": [],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": ""
    },
    {
     "method": "GET",
     "port": 17330,
     "target": "/",
     "hdr": "",
     "mode": "http10",
     "status": 200,
     "locs": [
      "/"
     ],
     "location": "",
     "body": "nameless host=",
     "custom": [],
     "expires": 0,
     "ctype": "text/plain"
    }
   ]
  },
  {
   "id": "edge",
   "host": "edge.test",
   "conf": "server {\n    listen 127.0.0.1:17340;\n    server_name edge.test;\n    root /tmp/nlx/edge/www;\n    add_header X-Srv srv;\n    error_page 404 /404.html;\n\n    location = /x { return 200 \"exact\"; }\n    location /x { return 200 \"prefix-x\"; }\n    location ^~ /img/ { add_header X-Img 1; }\n    location ~ \\.(png|gif)$ { return 200 \"regex-img\"; }\n    location ~ ^/b { return 200 \"regex-b\"; }\n    location /docs/ {\n        location ~ \\.md$ { return 200 \"nested-md $uri\"; }\n        location /docs/v2/ { return 200 \"nested-v2\"; }\n    }\n    location /proxy/ { proxy_pass http://127.0.0.1:17399; }\n    location /p2/ { proxy_pass http://127.0.0.1:17399/base/; }\n    location /fb/ { try_files $uri @fallback; }\n    location @fallback { return 200 \"named uri=$uri\"; }\n    location /priv/ { internal; }\n    location /ep/ {\n        error_page 404 =200 /ok.txt;\n        error_page 403 = @fallback;\n    }\n    location = /deny-me { deny all; }\n    location /ix/ { index /abs.html; }\n    location /auto/ { autoindex on; }\n    location /merge/ {\n        add_header_inherit merge;\n        add_header X-Merge 1;\n    }\n    location /Case/ { return 200 \"case\"; }\n}\n",
   "fs": [
    "/tmp/nlx/edge/www/404.html",
    "/tmp/nlx/edge/www/ok.txt",
    "/tmp/nlx/edge/www/abs.html",
    "/tmp/nlx/edge/www/img/a.png",
    "/tmp/nlx/edge/www/auto/one.txt",
    "/tmp/nlx/edge/www/auto/sub/",
    "/tmp/nlx/edge/www/docs/readme.md",
    "/tmp/nlx/edge/www/merge/m.txt",
    "/tmp/nlx/edge/www/index.html",
    "/tmp/nlx/edge/www/ep/sub/"
   ],
   "reqs": [
    {
     "method": "GET",
     "port": 17340,
     "target": "/x",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "=/x"
     ],
     "location": "",
     "body": "exact",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/xy",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/x"
     ],
     "location": "",
     "body": "prefix-x",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/img/a.png",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/img/"
     ],
     "location": "",
     "body": "/tmp/nlx/edge/www/img/a.png",
     "custom": [
      "x-img: 1"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/b.png",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "\\.(png|gif)$"
     ],
     "location": "",
     "body": "regex-img",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/docs/readme.md",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "\\.md$"
     ],
     "location": "",
     "body": "nested-md /docs/readme.md",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/docs/v2/readme.md",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "\\.md$"
     ],
     "location": "",
     "body": "nested-md /docs/v2/readme.md",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/docs/v2/x",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/docs/v2/"
     ],
     "location": "",
     "body": "nested-v2",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/proxy/a%2Fb?q=1",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/proxy/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/proxy/a%2Fb?q=1",
     "upHost": "127.0.0.1:17399"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/proxy//a/./b/../c",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/proxy/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/proxy//a/./b/../c",
     "upHost": "127.0.0.1:17399"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/p2/x/y?z=1",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/p2/"
     ],
     "location": "",
     "body": "",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain",
     "upUri": "/base/x/y?z=1",
     "upHost": "127.0.0.1:17399"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/fb/nothing?keep=1",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/fb/"
     ],
     "location": "",
     "body": "named uri=/fb/nothing",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/priv/a",
     "hdr": "",
     "mode": "",
     "status": 404,
     "locs": [
      ""
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/ep/missing",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/ep/",
      ""
     ],
     "location": "",
     "body": "/tmp/nlx/edge/www/ok.txt",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/nothing-here",
     "hdr": "",
     "mode": "",
     "status": 404,
     "locs": [
      "",
      ""
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/ix/",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/ix/",
      ""
     ],
     "location": "",
     "body": "/tmp/nlx/edge/www/abs.html",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/auto/",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/auto/"
     ],
     "location": "",
     "body": "16e\r\n<html>\r\n<head><title>Index of /auto/</title></head>\r\n<body>\r\n<h1>Index of /auto/</h1><hr><pre><a href=\"../\">../</a>\r\n<a href=\"sub/\">sub/</a>                                               13-Nov-2026 08:16                   -\r\n<a href=\"one.txt\">one.txt</a>                                            13-Nov-2026 08:16                  30\r\n</pre><hr></body>\r\n</html>\r\n\r\n0\r\n\r\n",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/merge/m.txt",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/merge/"
     ],
     "location": "",
     "body": "/tmp/nlx/edge/www/merge/m.txt",
     "custom": [
      "x-merge: 1",
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/case/",
     "hdr": "",
     "mode": "",
     "status": 404,
     "locs": [
      "",
      ""
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/a/../../etc/passwd",
     "hdr": "",
     "mode": "",
     "status": 400,
     "locs": [],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/%7Ex/%E4%B8%AD",
     "hdr": "",
     "mode": "",
     "status": 404,
     "locs": [
      "",
      ""
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "POST",
     "port": 17340,
     "target": "/ok.txt",
     "hdr": "",
     "mode": "",
     "status": 405,
     "locs": [
      ""
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "DELETE",
     "port": 17340,
     "target": "/ok.txt",
     "hdr": "",
     "mode": "",
     "status": 405,
     "locs": [
      ""
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/img",
     "hdr": "",
     "mode": "",
     "status": 301,
     "locs": [
      ""
     ],
     "location": "http://edge.test:17340/img/",
     "body": "",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/",
     "hdr": "",
     "mode": "http10",
     "status": 200,
     "locs": [
      "",
      ""
     ],
     "location": "",
     "body": "/tmp/nlx/edge/www/index.html",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/bz",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "^/b"
     ],
     "location": "",
     "body": "regex-b",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "//x",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "=/x"
     ],
     "location": "",
     "body": "exact",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/ep/sub/",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "/ep/"
     ],
     "location": "",
     "body": "named uri=/ep/sub/",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    },
    {
     "method": "POST",
     "port": 17340,
     "target": "/auto/",
     "hdr": "",
     "mode": "",
     "status": 403,
     "locs": [
      "/auto/"
     ],
     "location": "",
     "body": "",
     "custom": [],
     "expires": 0,
     "ctype": "text/html"
    },
    {
     "method": "GET",
     "port": 17340,
     "target": "/img/%2e%2e/docs/readme.md",
     "hdr": "",
     "mode": "",
     "status": 200,
     "locs": [
      "\\.md$"
     ],
     "location": "",
     "body": "nested-md /docs/readme.md",
     "custom": [
      "x-srv: srv"
     ],
     "expires": 0,
     "ctype": "text/plain"
    }
   ]
  }
 ],
 "broken": {
  "semicolon": {
   "text": "server {\n    listen 127.0.0.1:17350;\n    server_name a.test\n    location / { return 200 \"x\"; }\n}\n",
   "msg": "directive \"server_name\" is not terminated by \";\"",
   "line": 4
  },
  "brace": {
   "text": "server {\n    listen 127.0.0.1:17350;\n    location / {\n        return 200 \"x\";\n    }\n}\n}\n",
   "msg": "unexpected \"}\"",
   "line": 7
  },
  "context": {
   "text": "server {\n    listen 127.0.0.1:17350;\n    location / {\n        server_name inner.test;\n    }\n}\n",
   "msg": "\"server_name\" directive is not allowed here",
   "line": 4
  },
  "unknownvar": {
   "text": "server {\n    listen 127.0.0.1:17350;\n    location / {\n        return 200 \"$no_such_var\";\n    }\n}\n",
   "msg": "unknown \"no_such_var\" variable",
   "line": 0
  },
  "proxyuri": {
   "text": "server {\n    listen 127.0.0.1:17350;\n    location ~ ^/api/ {\n        proxy_pass http://127.0.0.1:9/v1/;\n    }\n}\n",
   "msg": "\"proxy_pass\" cannot have URI part in location given by regular expression, or inside named location, or inside \"if\" statement, or inside \"limit_except\" block",
   "line": 4
  },
  "dupdefault": {
   "text": "server {\n    listen 127.0.0.1:17350 default_server;\n}\nserver {\n    listen 127.0.0.1:17350 default_server;\n}\n",
   "msg": "a duplicate default server for 127.0.0.1:17350",
   "line": 5
  },
  "order": {
   "text": "server {\n    listen 127.0.0.1:17350;\n    location /a { return 200 \"1\"; }\n    location /a { return 200 \"2\"; }\n    bogus_directive on;\n}\n",
   "msg": "unknown directive \"bogus_directive\"",
   "line": 5
  },
  "regexbrace": {
   "text": "server {\n    listen 127.0.0.1:17350;\n    location ~ ^/a{2}$ { return 200 \"x\"; }\n}\n",
   "msg": "unknown directive \"2}$\"",
   "line": 3
  }
 },
 "mac": {
  "conf": "server {\n    listen 127.0.0.1:17340;\n    server_name edge.test;\n    root /tmp/nlx/edge/www;\n    add_header X-Srv srv;\n    error_page 404 /404.html;\n\n    location = /x { return 200 \"exact\"; }\n    location /x { return 200 \"prefix-x\"; }\n    location ^~ /img/ { add_header X-Img 1; }\n    location ~ \\.(png|gif)$ { return 200 \"regex-img\"; }\n    location ~ ^/b { return 200 \"regex-b\"; }\n    location /docs/ {\n        location ~ \\.md$ { return 200 \"nested-md $uri\"; }\n        location /docs/v2/ { return 200 \"nested-v2\"; }\n    }\n    location /proxy/ { proxy_pass http://127.0.0.1:17399; }\n    location /p2/ { proxy_pass http://127.0.0.1:17399/base/; }\n    location /fb/ { try_files $uri @fallback; }\n    location @fallback { return 200 \"named uri=$uri\"; }\n    location /priv/ { internal; }\n    location /ep/ {\n        error_page 404 =200 /ok.txt;\n        error_page 403 = @fallback;\n    }\n    location = /deny-me { deny all; }\n    location /ix/ { index /abs.html; }\n    location /auto/ { autoindex on; }\n    location /merge/ {\n        add_header_inherit merge;\n        add_header X-Merge 1;\n    }\n    location /Case/ { return 200 \"case\"; }\n}\n",
  "fs": [
   "/tmp/nlx/edge/www/404.html",
   "/tmp/nlx/edge/www/ok.txt",
   "/tmp/nlx/edge/www/abs.html",
   "/tmp/nlx/edge/www/img/a.png",
   "/tmp/nlx/edge/www/auto/one.txt",
   "/tmp/nlx/edge/www/auto/sub/",
   "/tmp/nlx/edge/www/docs/readme.md",
   "/tmp/nlx/edge/www/merge/m.txt",
   "/tmp/nlx/edge/www/index.html",
   "/tmp/nlx/edge/www/ep/sub/"
  ],
  "host": "edge.test",
  "reqs": [
   {
    "method": "GET",
    "port": 17340,
    "target": "/case/",
    "status": 200,
    "locs": [
     "/Case/"
    ],
    "body": "case"
   },
   {
    "method": "GET",
    "port": 17340,
    "target": "/CASE/x",
    "status": 200,
    "locs": [
     "/Case/"
    ],
    "body": "case"
   },
   {
    "method": "GET",
    "port": 17340,
    "target": "/IMG/a.png",
    "status": 200,
    "locs": [
     "/img/"
    ],
    "body": "/tmp/nlx/edge/www/img/a.png"
   },
   {
    "method": "GET",
    "port": 17340,
    "target": "/X",
    "status": 200,
    "locs": [
     "=/x"
    ],
    "body": "exact"
   },
   {
    "method": "GET",
    "port": 17340,
    "target": "/Docs/Readme.MD",
    "status": 200,
    "locs": [
     "\\.md$"
    ],
    "body": "nested-md /Docs/Readme.MD"
   }
  ]
 }
};

export default async ({ page, toolURL, screenshot, assert }) => {
  const ok = (c, m) => assert(c, m)
  page.on('pageerror', (e) => ok(false, '页面抛错：' + e.message))
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 15000 })

  const TABS = ['sim', 'tests', 'lint', 'tree', 'fs', 'help']
  const onTab = async (t) => {
    await page.click(`#nl-tab-${t}`)
    await page.waitForFunction((t) => !document.querySelector(`#nl-pane-${t}`).hidden, t)
  }
  const anaKey = () => page.evaluate(() => window.NLApp.anaKey())
  const renderKey = () => page.evaluate(() => window.NLApp.renderKey())
  // 往编辑器里填整份配置（真实输入事件），等分析跑完
  async function setConfig(text) {
    const k0 = await anaKey()
    await page.fill('#nl-src', text)
    await page.waitForFunction((k0) => window.NLApp.anaKey() > k0, k0, { timeout: 10000 })
  }
  async function setFs(list) {
    await onTab('fs')
    await page.fill('#nl-fs-text', list.join('\n'))
    await page.waitForFunction((n) => window.NLApp.state().fs.filter((x) => x.trim()).length === n, list.length)
    await onTab('sim')
  }
  // 发一个请求：填方法 / URL / 请求头 / IP，按发送，等结果卡用这次的请求重绘
  async function send({ method = 'GET', url, headers = '', client = '127.0.0.1', local = '127.0.0.1', http10 = false }) {
    await onTab('sim')
    await openAdv()
    await page.selectOption('#nl-method', method)
    await page.fill('#nl-headers', headers)
    await page.fill('#nl-client', client)
    await page.fill('#nl-local', local)
    const cur = await page.$eval('#nl-http10', (c) => c.checked)
    if (cur !== http10) await page.click('#nl-http10')
    await page.fill('#nl-url', url)
    const k0 = await renderKey()
    await page.click('#nl-send')
    await page.waitForFunction(([k0, url, method]) => window.NLApp.renderKey() > k0 && window.NLApp.state().req.url === url && window.NLApp.state().req.method === method, [k0, url, method], { timeout: 10000 })
    return page.$eval('#nl-result', (el) => ({ ...el.dataset }))
  }
  async function openAdv() {
    if (!(await page.$eval('#nl-adv', (d) => d.open))) await page.click('#nl-adv summary')
    await page.waitForFunction(() => document.querySelector('#nl-adv').open)
  }
  function customOf(d) {
    const H = {}
    JSON.parse(d.headers || '[]').forEach((h) => { const i = h.indexOf(': '); const k = h.slice(0, i).toLowerCase(); if (/^x-|^cache-control$|^strict-transport-security$/.test(k)) H[k] = (H[k] ? H[k] + '\n' : '') + h.slice(i + 2) })
    return Object.keys(H).sort().map((k) => k + ': ' + H[k])
  }

  // ── 1. 首屏：默认示例载入、语法正确、给出建议请求 ──
  ok(await page.$eval('a[href="../../"]', (a) => a.textContent.includes('返回工具集')), '顶部有返回工具集链接')
  ok(await page.$eval('#nl-ed-status', (e) => e.textContent.includes('语法正确')), '默认示例语法正确')
  ok((await page.$$('#nl-presets .nl-preset')).length === 5, '5 个示例')
  ok((await page.$$('#nl-suggest .nl-chip')).length >= 6, '给出建议请求')
  ok(await page.$eval('#nl-result', (e) => e.dataset.status === '200'), '默认请求已模拟出 200')

  // ── 2. 真 nginx 对拍：66 条请求逐条比 ──
  let n = 0, nOk = 0
  for (const sc of ORACLE.scenarios) {
    await setConfig(sc.conf)
    ok(await page.$eval('#nl-ed-status', (e) => e.textContent.includes('语法正确')), `场景 ${sc.id} 语法正确`)
    await setFs(sc.fs)
    for (const o of sc.reqs) {
      const hdrs = o.hdr ? o.hdr.split(/\s*;\s*(?=[A-Za-z-]+:)/).join('\n') : ''
      const d = await send({ method: o.method, url: `http://${sc.host}:${o.port}${o.target}`, headers: hdrs, http10: o.mode === 'http10' })
      const tag = `${sc.id} ${o.method} ${o.target}${o.hdr ? ' [' + o.hdr + ']' : ''}`
      const status = d.kind === 'close' ? 0 : +d.status
      const bad = []
      if (status !== o.status) bad.push(`状态 ${status} ≠ nginx ${o.status}`)
      if (d.locs !== JSON.stringify(o.locs)) bad.push(`location 序列 ${d.locs} ≠ ${JSON.stringify(o.locs)}`)
      if ((d.locationHeader || '') !== o.location) bad.push(`Location ${d.locationHeader} ≠ ${o.location}`)
      if (o.upUri !== undefined) { if (d.upstream !== o.upUri || d.upHost !== o.upHost) bad.push(`上游 ${d.upstream}|${d.upHost} ≠ ${o.upUri}|${o.upHost}`) }
      else if (o.status === 200 && d.kind !== 'autoindex') {
        const body = d.kind === 'file' ? d.fileResolved : d.body
        if (body !== o.body) bad.push(`正文 ${JSON.stringify(body)} ≠ ${JSON.stringify(o.body)}`)
      }
      const cu = customOf(d)
      if (JSON.stringify(cu) !== JSON.stringify(o.custom)) bad.push(`响应头 ${JSON.stringify(cu)} ≠ ${JSON.stringify(o.custom)}`)
      ok(bad.length === 0, `对拍 ${tag}：${bad.join('；')}`)
      n++; if (!bad.length) nOk++
    }
  }
  ok(n === ORACLE.meta.requests && n === 75, `对拍了全部 ${ORACLE.meta.requests} 条请求（实跑 ${n}）`)
  ok(nOk === n, `对拍一致 ${nOk}/${n}`)

  // ── 3. macOS 版语义（大小写不敏感）：勾选后与 mac 构建一致；不勾选时与 Linux 不同 ──
  await setConfig(ORACLE.mac.conf)
  await setFs(ORACLE.mac.fs)
  await openAdv()
  if (!(await page.$eval('#nl-caseless', (c) => c.checked))) {
    const k0 = await anaKey()
    await page.click('#nl-caseless')
    await page.waitForFunction((k0) => window.NLApp.anaKey() > k0, k0)
  }
  for (const o of ORACLE.mac.reqs) {
    const d = await send({ method: o.method, url: `http://${ORACLE.mac.host}:${o.port}${o.target}` })
    const body = d.kind === 'file' ? d.fileResolved : d.body
    ok(+d.status === o.status && d.locs === JSON.stringify(o.locs) && (o.status !== 200 || body.toLowerCase() === o.body.toLowerCase()), `mac 语义 ${o.target}：${d.status} ${d.locs} ${body} ≠ ${o.status} ${JSON.stringify(o.locs)} ${o.body}`)
  }
  {
    await openAdv()
    const k0 = await anaKey()
    await page.click('#nl-caseless')
    await page.waitForFunction((k0) => window.NLApp.anaKey() > k0, k0)
    const lin = ORACLE.scenarios.find((s) => s.id === 'edge').reqs.find((r) => r.target === '/case/')
    const d = await send({ url: `http://${ORACLE.mac.host}:17340/case/` })
    ok(+d.status === lin.status && d.locs === JSON.stringify(lin.locs), `取消勾选后回到 Linux 语义：/case/ → ${d.status} ${d.locs}（nginx ${lin.status} ${JSON.stringify(lin.locs)}）`)
  }

  // ── 4. nginx -t 报错对拍：消息与行号（nginx 没给行号的那条只比消息） ──
  for (const [id, b] of Object.entries(ORACLE.broken)) {
    await setConfig(b.text)
    const msg = await page.$eval('#nl-ed-msg', (e) => e.hidden ? '' : e.textContent)
    ok(msg.includes(b.msg), `坏配置 ${id}：编辑器提示「${msg}」应含 nginx 的「${b.msg}」`)
    if (b.line) {
      ok(msg.includes(':' + b.line + ' ') || msg.includes(':' + b.line + '（'), `坏配置 ${id}：行号应为 ${b.line}，提示为「${msg}」`)
      const gl = await page.$$eval('#nl-gutter b.nl-g-err', (bs) => bs.map((x) => +x.textContent))
      ok(gl.length === 1 && gl[0] === b.line, `坏配置 ${id}：行号栏标红第 ${b.line} 行，实际 ${gl}`)
    }
    await onTab('lint')
    const t = await page.$eval('#nl-nginxt', (e) => e.textContent)
    ok(t.includes('test failed') && t.includes(b.msg), `坏配置 ${id}：体检页的 nginx -t 输出失败并含报错`)
    await onTab('sim')
    await page.click('#nl-send')
    await page.waitForFunction(() => document.querySelector('#nl-result').dataset.status === 'config-error')
  }

  // ── 5. 示例「陷阱合集」：体检逐条命中设计好的坑；「演示」真的复现路径穿越 ──
  await page.click('#nl-presets [data-preset="traps"]')
  await page.waitForFunction(() => window.NLApp.state().preset === 'traps' && window.NLApp.analysis().lint.length > 0)
  await onTab('lint')
  const ids = await page.$$eval('#nl-findings .nl-finding', (fs) => fs.map((f) => f.dataset.lint))
  for (const want of ['alias-traversal', 'proxy-pass-slash', 'regex-steals-prefix', 'try-files-args', 'if-is-evil', 'access-order', 'header-no-always', 'host-spoofing', 'add-header-redefinition', 'fastcgi-no-script'])
    ok(ids.includes(want), `陷阱合集应体检出 ${want}，实得 ${ids.join(',')}`)
  ok(await page.$eval('#nl-nginxt', (e) => e.textContent.includes('syntax is ok')), '陷阱合集本身语法正确（坑都是语义层面的）')
  ok(await page.$eval('#nl-cnt-lint', (e) => e.classList.contains('nl-c-bad')), '有高危发现时侧栏计数标红')
  {
    // traps 场景第 0 条请求 /static../secret.txt 被真 nginx 证实能读到 alias 目录上一级的文件（见 ORACLE.scenarios[traps]）
    const tr = ORACLE.scenarios.find((s) => s.id === 'traps').reqs[0]
    ok(tr.target === '/static../secret.txt' && tr.status === 200 && tr.body.endsWith('/secret.txt') && !tr.body.includes('/static/'), '真值里 alias 穿越确实读到了上一级的 secret.txt')
    const k0 = await renderKey()
    await page.click('#nl-findings [data-lint="alias-traversal"] [data-demo]')
    await page.waitForFunction((k0) => window.NLApp.renderKey() > k0 && !document.querySelector('#nl-pane-sim').hidden, k0)
    const d = await page.$eval('#nl-result', (e) => ({ ...e.dataset }))
    ok(d.status === '200' && d.fileResolved === '/var/www/secret.txt', `演示 alias 穿越：应读到 /var/www/secret.txt，实得 ${d.status} ${d.fileResolved}`)
    ok(await page.$eval('#nl-out-target', (e) => e.textContent.includes('实际读到 /var/www/secret.txt')), '结果卡写明实际读到的文件')
  }
  await onTab('sim')

  // ── 6. 步骤与行号跳转：结果卡上的每一步都指回配置里的行 ──
  {
    await page.click('#nl-presets [data-preset="spa"]')
    await page.waitForFunction(() => window.NLApp.state().preset === 'spa' && document.querySelector('#nl-result').dataset.status === '200')
    const steps = await page.$$eval('#nl-steps .nl-step', (ls) => ls.map((l) => l.querySelector('.nl-phase').textContent))
    ok(steps.includes('server') && steps.includes('location') && steps.includes('try_files'), `SPA 首页的步骤含 server / location / try_files：${steps.join(',')}`)
    const btn = await page.$('#nl-steps [data-goto]')
    const target = await btn.getAttribute('data-goto')
    await btn.click()
    const line = +target.split(':').pop()
    const sel = await page.$eval('#nl-src', (t) => t.value.slice(0, t.selectionStart).split('\n').length)
    ok(sel === line, `点 L${line} 跳到编辑器第 ${line} 行（光标在第 ${sel} 行）`)
    ok(await page.$$eval('#nl-gutter b.nl-g-hit', (b) => b.length) >= 2, '行号栏高亮命中的 server 与 location')
    // 结构页：节点数 = 引擎大纲里的 location 数；命中的节点高亮
    await onTab('tree')
    const nodes = await page.$$eval('#nl-tree .nl-node', (n) => n.length)
    const want = await page.evaluate(() => { let c = 0; const walk = (l) => { c++; l.children.forEach(walk) }; window.NLApp.analysis().outline.forEach((s) => { s.locations.forEach(walk); s.named.forEach(walk) }); return c })
    ok(nodes === want && nodes >= 4, `结构页画出全部 ${want} 个 location（实得 ${nodes}）`)
    ok(await page.$$eval('#nl-tree .nl-node-hit', (n) => n.length) >= 1, '刚模拟过的请求走过的 location 在结构页高亮')
  }

  // ── 7. 测试用例：添加 → 记期望 → 改配置后变「不符」→ 基线对比 ──
  {
    await onTab('tests')
    const n0 = await page.evaluate(() => window.NLApp.state().tests.length)
    await page.fill('#nl-add-url', 'https://app.example.com/api/orders/7?x=1')
    await page.click('#nl-add-btn')
    await page.waitForFunction((n0) => window.NLApp.state().tests.length === n0 + 1, n0)
    const last = await page.evaluate(() => { const s = window.NLApp.state(); return s.tests[s.tests.length - 1] })
    ok(last.expect && last.expect.includes('/orders/7?x=1'), `新用例记下了期望去向：${last.expect}`)
    await page.click('#nl-tests-accept')
    await page.waitForFunction(() => window.NLApp.state().tests.every((t) => t.expect != null))
    const passAll = await page.$eval('#nl-tests-sum', (e) => [+e.dataset.pass, +e.dataset.fail])
    ok(passAll[0] === n0 + 1 && passAll[1] === 0, `记为期望后全部通过：${passAll}`)
    await page.click('#nl-baseline')
    await page.waitForFunction(() => !!window.NLApp.state().baseline)
    // 把 proxy_pass 的结尾斜杠去掉：/api/ 下的用例都应变成「不符」，并相对基线「变化」
    const cfg = await page.$eval('#nl-src', (t) => t.value)
    ok(cfg.includes('proxy_pass http://127.0.0.1:3000/;'), 'SPA 示例含 proxy_pass http://127.0.0.1:3000/;')
    await setConfig(cfg.replace('proxy_pass http://127.0.0.1:3000/;', 'proxy_pass http://127.0.0.1:3000;'))
    await onTab('tests')
    await page.waitForFunction(() => +document.querySelector('#nl-tests-sum').dataset.fail > 0)
    const st = await page.evaluate(() => { const s = window.NLApp.state(); return s.tests.map((t) => t.url) })
    const apiCases = st.filter((u) => /\/api\/./.test(u)).length
    const [, fail] = await page.$eval('#nl-tests-sum', (e) => [+e.dataset.pass, +e.dataset.fail])
    const changed = await page.$eval('#nl-tests-sum', (e) => +e.dataset.changed)
    ok(fail === apiCases && changed === apiCases && apiCases === 2, `去掉斜杠后 ${apiCases} 条 /api/ 用例不符（实得 ${fail}）且相对基线变化（${changed}）`)
    ok(await page.$$eval('#nl-tests-table tr.nl-tr-fail', (r) => r.length) === apiCases, '不符的行标红')
    // 操作后立刻刷新：用例、基线、配置改动都还在（pagehide 补写）
    await page.reload()
    await page.waitForFunction(() => document.documentElement.dataset.ready === '1')
    const kept = await page.evaluate(() => { const s = window.NLApp.state(); return { n: s.tests.length, base: !!s.baseline, cfg: s.files[0].text.includes('proxy_pass http://127.0.0.1:3000;') } })
    ok(kept.n === n0 + 1 && kept.base && kept.cfg, `刷新后状态还在：${JSON.stringify(kept)}`)
  }

  // ── 8. 格式化：按钮产出与引擎 format 一致；随机配置 round-trip（canon(format(x)) === canon(x)）──
  {
    await onTab('sim')
    const messy = 'server{listen 8080;server_name  fmt.test;\n# 注释\nlocation /a{return 200 "a b";}   location ~ \\.php$ { if ($x = "1") { return 403; } }}\n'
    await setConfig(messy)
    await page.click('#nl-fmt')
    await page.waitForFunction(() => document.querySelector('#nl-src').value.includes('\n    location /a {\n'))
    const v = await page.$eval('#nl-src', (t) => t.value)
    const same = await page.evaluate((m) => NGX.canon(NGX.format(m).text) === NGX.canon(m), messy)
    ok(same && v.split('\n')[0] === 'server {', `格式化后语义不变、缩进规范：${v.split('\n').slice(0, 3).join(' / ')}`)
    const fuzz = await page.evaluate(() => {
      let seed = 20261113; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648
      const pick = (a) => a[Math.floor(rnd() * a.length)]
      const words = ['a', '/x/', '"q w"', "'s;t'", '$uri', '${host}x', '~*', '\\.php$', 'a#b', '"{"', '80', 'on', '# mid\n']
      function block(d) {
        let s = ''
        const k = 1 + Math.floor(rnd() * 4)
        for (let i = 0; i < k; i++) {
          const ws = pick([' ', '  ', '\t', '\n'])
          if (d < 3 && rnd() < 0.35) s += pick(['location', 'server', 'if', 'map']) + ' ' + pick(words) + ws + '{' + block(d + 1) + '}' + pick(['', '\n', ' '])
          else s += pick(['return', 'set', 'root', 'add_header', 'rewrite']) + ' ' + Array.from({ length: 1 + Math.floor(rnd() * 3) }, () => pick(words)).join(pick([' ', '  '])) + ';' + pick(['', ' # c\n', '\n', '\n\n\n'])
        }
        return s
      }
      let bad = 0, total = 0
      for (let i = 0; i < 300; i++) {
        const x = block(0)
        if (NGX.tokenize(x, '').error) continue
        total++
        const f = NGX.format(x)
        const nc = (t) => NGX.tokenize(t, '').tokens.filter((k) => k.t === 'comment').map((k) => k.v).join('\n')
        if (f.error || NGX.canon(f.text) !== NGX.canon(x) || NGX.format(f.text).text !== f.text || nc(f.text) !== nc(x)) bad++
      }
      return { bad, total }
    })
    ok(fuzz.total >= 200 && fuzz.bad === 0, `格式化 round-trip fuzz：${fuzz.total} 组 ${fuzz.bad} 失配（指令序列、注释逐条、幂等三项都比）`)
    // fork 报的 BUG-9：夹在指令中间的两条注释不能被并成一条
    const two = await page.evaluate(() => { const x = 'location /a # c1\n { # c2\n return 200; }\n'; return NGX.tokenize(NGX.format(x).text, '').tokens.filter((k) => k.t === 'comment').length })
    ok(two === 2, `相邻注释格式化后仍是 2 条（实得 ${two}）`)
  }

  // ── 9. 文件系统页：删掉文件，请求结果随之变化（与 edge 场景 /nothing-here 的真值同一路径：error_page 404 → /404.html，状态保持 404） ──
  {
    const sc = ORACLE.scenarios.find((s) => s.id === 'edge')
    await setConfig(sc.conf)
    await setFs(sc.fs)
    const okTxt = sc.reqs.find((r) => r.target === '/ep/missing')
    let d = await send({ url: 'http://edge.test:17340/ok.txt' })
    ok(d.status === '200' && d.fileResolved === okTxt.body, `ok.txt 在时 200（${d.status} ${d.fileResolved}）`)
    await setFs(sc.fs.filter((p) => !p.endsWith('/ok.txt')))
    d = await send({ url: 'http://edge.test:17340/ok.txt' })
    const miss = sc.reqs.find((r) => r.target === '/nothing-here')
    ok(+d.status === miss.status && d.locs === JSON.stringify(miss.locs) && miss.locs.length === 2, `删掉 ok.txt 后与真值同构：${d.status} ${d.locs}（nginx 对 /nothing-here：${miss.status} ${JSON.stringify(miss.locs)}）`)
    ok(await page.$eval('#nl-fs-tree', (e) => !e.textContent.includes('ok.txt') && e.textContent.includes('404.html')), '目录树随列表更新')
  }

  // ── 10. 键盘：页签方向键切换；编辑器里 Tab 插入 4 个空格 ──
  {
    await page.click('#nl-tab-sim')
    await page.keyboard.press('ArrowDown')
    await page.waitForFunction(() => !document.querySelector('#nl-pane-tests').hidden)
    ok(await page.evaluate(() => document.activeElement.id === 'nl-tab-tests'), '方向键移动焦点到下一个页签')
    await page.keyboard.press('End')
    await page.waitForFunction(() => !document.querySelector('#nl-pane-help').hidden)
    await page.click('#nl-src')
    await page.$eval('#nl-src', (t) => { t.focus(); t.setSelectionRange(t.value.length, t.value.length) })
    const before = await page.$eval('#nl-src', (t) => t.value.length)
    await page.keyboard.press('Tab')
    const after = await page.$eval('#nl-src', (t) => ({ v: t.value, active: document.activeElement.id }))
    ok(after.v.length === before + 4 && after.v.endsWith('    ') && after.active === 'nl-src', `编辑器里按 Tab 插入 4 个空格（长度 ${before}→${after.v.length}，焦点 ${after.active}）`)
  }

  // ── 11. 渲染守卫：[hidden] 计算样式、逐页签控件尺寸、uppercase、逐视口溢出、卡片逃逸 ──
  await page.click('#nl-presets [data-preset="php"]')
  await page.waitForFunction(() => window.NLApp.state().preset === 'php')
  const nCtl = await renderGuards(page, {
    assert: ok, tabs: TABS, onTab, paneSel: (t) => `#nl-pane-${t}`, panesRoot: '#nl-panes',
    figSel: () => '#nl-none-svg', cardSel: '.nl-card, .nl-outcome, .nl-finding, .nl-srv', labelSel: 'th, dt, label, label > span, .nl-phase, .nl-side-h, .nl-toc-h, .nl-sev, .nl-kind',
    minControls: 30,
  })
  ok(nCtl >= 30, `各页签累计扫到 ${nCtl} 个控件`)
  for (const host of ['.nl-nav', '.nl-side', '.nl-ed-head', '#nl-presets', '.nl-hero-cta', '.nl-toc'])
    await guardControlSize(page, { assert: ok, tabs: [host], onTab: async () => {}, paneSel: (h) => h, minControls: 1 })
  await onTab('sim')
  await guardBoxOverlap(page, { assert: ok, sel: '.nl-preset, .nl-tab, .nl-chip, .nl-path-i, .nl-pill' })
  // 隐藏的面板计算样式为 none（renderGuards 已扫），可见的结果卡没有越出主栏
  const esc = await page.evaluate(() => { const m = document.querySelector('.nl-main').getBoundingClientRect(); const r = document.querySelector('#nl-outcome').getBoundingClientRect(); return r.right - m.right })
  ok(esc <= 1, `结果卡不越出主栏（${esc}px）`)

  // ── 12. 缩略图 ──
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.click('#nl-presets [data-preset="spa"]')
  await page.waitForFunction(() => window.NLApp.state().preset === 'spa' && document.querySelector('#nl-result').dataset.status === '200')
  ok(await page.$$eval('#nl-files .nl-file', (fs) => fs.length) === 1, '切到 SPA 示例后侧栏只剩它自己的文件（不残留上一个示例 include 的内置文件）')
  // 缩略图拍「请求模拟」这一屏：请求栏 + 结果卡 + 逐步过程；先收起刚弹出的「已载入示例」提示，免得盖住内容
  await page.evaluate(() => { document.querySelector('#nl-toast').hidden = true; const y = document.querySelector('#nl-pane-sim').getBoundingClientRect().top + window.scrollY - 72; window.scrollTo(0, y) })
  await screenshot('thumb.png')
}
