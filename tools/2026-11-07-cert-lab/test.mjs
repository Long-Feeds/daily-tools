// 证书工作台 · 集成测试（真实 Chromium）
// 真值：ORACLE 由 run 目录 truth/gen_truth.mjs 现场生成后用 inject-oracle.mjs 机械注入（不手抄）——
//   指纹 / DER / asn1parse 行数 = openssl 3.6；序列号 / RFC 4514 名称 / SAN / CSR / CRL = Python cryptography；
//   链验证与主机名 = openssl verify（-attime / -verify_hostname / -verify_ip / -purpose sslserver）；
//   密钥格式 = openssl pkcs8 / ec / pkey；JWK = Node crypto KeyObject.export；SSH 行与指纹 = ssh-keygen。
// 下载件一律用本文件里不经过页面引擎的手段复核：Node crypto.X509Certificate（验签 / checkHost / checkIP / 配对私钥）、
//   Node crypto.verify 验 CSR 自签名、本文件的独立 DER 拆包；设了 CL_OPENSSL=<openssl 路径> 时再交给 openssl verify / req -verify 复核。
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import crypto from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { renderGuards, guardBoxOverlap } from '/Users/lon/.agent-hub/cron/daily-website/tools/render-guards.mjs'

const ORACLE = {
 "meta": {
  "captured": "2026-11-07T07:20:50Z",
  "t0": 1794038400000
 },
 "inter": {
  "serial": "2002",
  "subject": "CN=Cert Lab Demo TLS CA 2025,O=示例信任服务有限公司,C=CN",
  "issuer": "CN=Cert Lab Demo Root CA,O=示例信任服务有限公司,C=CN",
  "nb": 1735689600000,
  "na": 2051222400000,
  "san": [],
  "nExt": 8,
  "sha256": "D4:58:70:6D:0C:72:0A:B1:DE:45:FB:97:F5:C9:1F:99:A9:09:66:0D:3E:C1:A8:73:72:CA:53:9F:A9:85:EA:C1",
  "sha1": "BD:82:55:26:D8:63:28:BC:BE:31:15:9C:06:7A:F5:97:B0:69:EC:44",
  "pin": "AmHcalkzetH8hhu5rTh6s2pAxTmhfZigHVeZQKctz6s=",
  "derB64": "MIICzDCCAlOgAwIBAgICIAIwCgYIKoZIzj0EAwMwVjELMAkGA1UEBhMCQ04xJzAlBgNVBAoMHuekuuS+i+S/oeS7u+acjeWKoeaciemZkOWFrOWPuDEeMBwGA1UEAwwVQ2VydCBMYWIgRGVtbyBSb290IENBMB4XDTI1MDEwMTAwMDAwMFoXDTM1MDEwMTAwMDAwMFowWjELMAkGA1UEBhMCQ04xJzAlBgNVBAoMHuekuuS+i+S/oeS7u+acjeWKoeaciemZkOWFrOWPuDEiMCAGA1UEAwwZQ2VydCBMYWIgRGVtbyBUTFMgQ0EgMjAyNTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJcmSu21JWWEIra+kpaHJZc+wwNbZfHKkccx9dOceXXVQYlSStDOYJrfnNvgVZR130fMLVrlEc1uW/7bv+GGDtKjggELMIIBBzASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwHQYDVR0OBBYEFIn3mdscdZyHb6lPY8SEgKqvsOUQMB8GA1UdIwQYMBaAFMChbdQs1US+ausicHgvRJaNxKSTMDsGCCsGAQUFBwEBBC8wLTArBggrBgEFBQcwAoYfaHR0cDovL3BraS5leGFtcGxlLmNvbS9yb290LmNydDAwBgNVHR8EKTAnMCWgI6Ahhh9odHRwOi8vcGtpLmV4YW1wbGUuY29tL3Jvb3QuY3JsMBMGA1UdIAQMMAowCAYGZ4EMAQIBMAoGCCqGSM49BAMDA2cAMGQCMEDEZiDnPA7aBRxgU1nvaY+Vv5kVBUCPtXJZHItl08zMOSmh2uzNzGmhmv92aEzBxAIwUZ7B20lSmjtwT2Pycsq30f4AiwueZrPXFeGnvXYJ8P1cVEZ+M6bbgozn4+0GeRoV",
  "derLen": 720,
  "asnLines": 72,
  "asnHl": 4,
  "asnLen": 716,
  "nodeCN": "Cert Lab Demo TLS CA 2025"
 },
 "leaf": {
  "serial": "3a7f0c",
  "subject": "CN=shop.example.com",
  "issuer": "CN=Cert Lab Demo TLS CA 2025,O=示例信任服务有限公司,C=CN",
  "nb": 1788220800000,
  "na": 1822521600000,
  "san": [
   "shop.example.com",
   "www.shop.example.com",
   "*.cdn.shop.example.com",
   "203.0.113.10",
   "2001:db8::10"
  ],
  "nExt": 8,
  "sha256": "DF:CB:A5:E3:95:9B:73:73:93:B0:E7:B5:66:FA:8A:9B:D2:F5:0E:EF:B8:CB:6D:DC:A8:B8:2F:86:FE:F5:8C:63",
  "sha1": "0D:FC:A6:84:F4:03:D6:D1:5C:47:F4:21:4A:09:E8:C0:F9:A0:58:4E",
  "pin": "rz/oC7ar/E6bAGBQGI+chgBMCmv5WHcSg5ckYyxOoXg=",
  "derB64": "MIICvzCCAmagAwIBAgIDOn8MMAoGCCqGSM49BAMCMFoxCzAJBgNVBAYTAkNOMScwJQYDVQQKDB7npLrkvovkv6Hku7vmnI3liqHmnInpmZDlhazlj7gxIjAgBgNVBAMMGUNlcnQgTGFiIERlbW8gVExTIENBIDIwMjUwHhcNMjYwOTAxMDAwMDAwWhcNMjcxMDAzMDAwMDAwWjAbMRkwFwYDVQQDDBBzaG9wLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErygIvmoS30YRCpCjVovMAETHoJowyecx1jhZJERL85YxhmouVe1z78ntmrak5m70pjFjsDAGbBhwDgQqZltLjKOCAVgwggFUMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMB0GA1UdDgQWBBQM6gTis/1EQF4oJdyCzMRfUijoFzAfBgNVHSMEGDAWgBSJ95nbHHWch2+pT2PEhICqr7DlEDBhBgNVHREEWjBYghBzaG9wLmV4YW1wbGUuY29tghR3d3cuc2hvcC5leGFtcGxlLmNvbYIWKi5jZG4uc2hvcC5leGFtcGxlLmNvbYcEywBxCocQIAENuAAAAAAAAAAAAAAAEDBnBggrBgEFBQcBAQRbMFkwIwYIKwYBBQUHMAGGF2h0dHA6Ly9vY3NwLmV4YW1wbGUuY29tMDIGCCsGAQUFBzAChiZodHRwOi8vcGtpLmV4YW1wbGUuY29tL3Rscy1jYS0yMDI1LmNydDATBgNVHSAEDDAKMAgGBmeBDAECATATBgNVHSUEDDAKBggrBgEFBQcDATAKBggqhkjOPQQDAgNHADBEAiA6qVET5XSGbY2jYUkBvvZeGxHGYDH39WQVszU0Bn9G/wIgLxLjQl7Iw4NMgE3eT6KbXpzZvDswdUdFQMfv2HBG40Q=",
  "derLen": 707,
  "asnLines": 64,
  "asnHl": 4,
  "asnLen": 703,
  "nodeCN": "shop.example.com"
 },
 "root": {
  "serial": "1001",
  "subject": "CN=Cert Lab Demo Root CA,O=示例信任服务有限公司,C=CN",
  "issuer": "CN=Cert Lab Demo Root CA,O=示例信任服务有限公司,C=CN",
  "nb": 1735689600000,
  "na": 2366841600000,
  "san": [],
  "nExt": 3,
  "sha256": "CE:B6:E1:3E:84:A4:8F:7E:96:5B:E4:59:2F:AA:D8:95:C8:FF:DF:E4:9F:07:C1:3F:98:7C:C8:7A:83:2E:A0:D1",
  "sha1": "E6:01:40:48:2E:AB:70:D1:9C:8E:C9:72:11:BE:DA:32:8D:00:18:79",
  "pin": "5oPCZ+W15342O/biYGBfaNWkHcULDYIyKOa0tbJaQjI=",
  "derB64": "MIICHDCCAaGgAwIBAgICEAEwCgYIKoZIzj0EAwMwVjELMAkGA1UEBhMCQ04xJzAlBgNVBAoMHuekuuS+i+S/oeS7u+acjeWKoeaciemZkOWFrOWPuDEeMBwGA1UEAwwVQ2VydCBMYWIgRGVtbyBSb290IENBMB4XDTI1MDEwMTAwMDAwMFoXDTQ1MDEwMTAwMDAwMFowVjELMAkGA1UEBhMCQ04xJzAlBgNVBAoMHuekuuS+i+S/oeS7u+acjeWKoeaciemZkOWFrOWPuDEeMBwGA1UEAwwVQ2VydCBMYWIgRGVtbyBSb290IENBMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEWskWSgwkzMjfWAmPTubVzs5AmWU8b6QSe0auPc3GyaTxVSCiTXqErbRbrn+DxX3a6Wg8W9wSdWUbCfo5GO2Ecjb9OTymshmWbYsu9sJF/dZ3S6lSxwgLwYZ3EcGJ8FfJo0IwQDAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBBjAdBgNVHQ4EFgQUwKFt1CzVRL5q6yJweC9Elo3EpJMwCgYIKoZIzj0EAwMDaQAwZgIxANJm+eJtsugRcClDmGHGL2TOcZRI+TuJB/oecQFgcQw9lsw0vuV7C/Jpfrmf+Fqx9wIxAJSgnxI3kpo8YtLp4+nvU4EncYcqP4F1FojxVtTb9CbRkylnItyaQ9gCMRjGi/uXQQ==",
  "derLen": 544,
  "asnLines": 57,
  "asnHl": 4,
  "asnLen": 540,
  "nodeCN": "Cert Lab Demo Root CA"
 },
 "expired": {
  "serial": "3a0001",
  "subject": "CN=old.example.com",
  "issuer": "CN=Cert Lab Demo TLS CA 2025,O=示例信任服务有限公司,C=CN",
  "nb": 1672531200000,
  "na": 1704067200000,
  "san": [
   "old.example.com"
  ],
  "nExt": 8,
  "sha256": "48:F6:CD:6B:1D:F3:E5:D7:B4:C1:11:13:A8:4C:55:3B:46:7B:8F:42:A8:41:11:EF:44:BE:DD:04:19:A3:C7:8C",
  "sha1": "C2:74:1D:35:F6:98:A5:69:E3:5F:74:7E:6D:3E:3B:22:8A:0A:C4:15",
  "pin": "rz/oC7ar/E6bAGBQGI+chgBMCmv5WHcSg5ckYyxOoXg=",
  "derB64": "MIICdzCCAh6gAwIBAgIDOgABMAoGCCqGSM49BAMCMFoxCzAJBgNVBAYTAkNOMScwJQYDVQQKDB7npLrkvovkv6Hku7vmnI3liqHmnInpmZDlhazlj7gxIjAgBgNVBAMMGUNlcnQgTGFiIERlbW8gVExTIENBIDIwMjUwHhcNMjMwMTAxMDAwMDAwWhcNMjQwMTAxMDAwMDAwWjAaMRgwFgYDVQQDDA9vbGQuZXhhbXBsZS5jb20wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAASvKAi+ahLfRhEKkKNWi8wARMegmjDJ5zHWOFkkREvzljGGai5V7XPvye2atqTmbvSmMWOwMAZsGHAOBCpmW0uMo4IBETCCAQ0wDAYDVR0TAQH/BAIwADAOBgNVHQ8BAf8EBAMCB4AwHQYDVR0OBBYEFAzqBOKz/URAXigl3ILMxF9SKOgXMB8GA1UdIwQYMBaAFIn3mdscdZyHb6lPY8SEgKqvsOUQMBoGA1UdEQQTMBGCD29sZC5leGFtcGxlLmNvbTBnBggrBgEFBQcBAQRbMFkwIwYIKwYBBQUHMAGGF2h0dHA6Ly9vY3NwLmV4YW1wbGUuY29tMDIGCCsGAQUFBzAChiZodHRwOi8vcGtpLmV4YW1wbGUuY29tL3Rscy1jYS0yMDI1LmNydDATBgNVHSAEDDAKMAgGBmeBDAECATATBgNVHSUEDDAKBggrBgEFBQcDATAKBggqhkjOPQQDAgNHADBEAiA0WOAkzsgm19QAByjdOE4/IBAP+OBlqfUtGkqS805JCgIgXPp7i+12fC0NLvm1QO6AkBxfwtiywtdIswyTIsELe5A=",
  "derLen": 635,
  "asnLines": 64,
  "asnHl": 4,
  "asnLen": 631,
  "nodeCN": "old.example.com"
 },
 "legacy": {
  "serial": "1",
  "subject": "CN=192.168.1.1,O=Legacy Router Co,C=CN",
  "issuer": "CN=192.168.1.1,O=Legacy Router Co,C=CN",
  "nb": 1456790400000,
  "na": 2087942400000,
  "san": [],
  "nExt": 1,
  "sha256": "06:FD:68:96:EF:6B:12:99:A0:37:CE:53:02:34:B7:53:F8:60:33:A3:11:C3:1D:31:1D:15:95:BD:C5:E8:97:53",
  "sha1": "DE:BB:3D:E8:C6:4B:4C:34:F2:DD:9B:AA:A6:A3:BC:90:24:3A:1D:CD",
  "pin": "FVSsqQy4EpR6ZD+ZwyXow9KK4OqMrFg+CZ9NFaZop2E=",
  "derB64": "MIICEzCCAXygAwIBAgIBATANBgkqhkiG9w0BAQUFADA+MQswCQYDVQQGEwJDTjEZMBcGA1UECgwQTGVnYWN5IFJvdXRlciBDbzEUMBIGA1UEAwwLMTkyLjE2OC4xLjEwHhcNMTYwMzAxMDAwMDAwWhcNMzYwMzAxMDAwMDAwWjA+MQswCQYDVQQGEwJDTjEZMBcGA1UECgwQTGVnYWN5IFJvdXRlciBDbzEUMBIGA1UEAwwLMTkyLjE2OC4xLjEwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBALLmpqJKU+GXicncJt7ppDJtLs9fOwtBGpc3tl71KpKAo5my6TvbSF30wdkQ2ZYmvtWM6gQABGRbg2y591EI3R4ARfsTteQ6hm/Ov42QGBUnDMSRiQHx911eegDshZKeRF/T/1xyqzqAkzBbWEfoY6mXIbFnx2VNeRdBYGOzpX61AgMBAAGjITAfMB0GA1UdDgQWBBRrjpTv4YaYakyt8TecxcU/CEUdGDANBgkqhkiG9w0BAQUFAAOBgQBZz3Q+8tZXsA7ZTDd5SFfnKTb+P3MZcUcQCBVJ2sRhnKQWwkkpMqtHgmo4hVqhnintq0nYkzQgeJLRDEqvJ7c3s4PqFrYV2Hfy6fUxq9/oI9kr4SqQaY6QfZs7E7HYcDPIbcJTD2eaATjEjm+t1wfhU+fszKC7BqHF6MUVf9jnTQ==",
  "derLen": 535,
  "asnLines": 51,
  "asnHl": 4,
  "asnLen": 531,
  "nodeCN": "192.168.1.1"
 },
 "self": {
  "serial": "5e1f",
  "subject": "CN=localhost",
  "issuer": "CN=localhost",
  "nb": 1790812800000,
  "na": 1822348800000,
  "san": [
   "localhost",
   "127.0.0.1"
  ],
  "nExt": 1,
  "sha256": "08:AA:20:4F:71:12:BF:7B:29:EA:DA:A4:4E:49:2B:C0:C0:AE:54:54:F6:92:14:11:21:90:3B:E3:F9:69:49:D6",
  "sha1": "F3:CA:76:D5:8F:3D:42:90:9F:BB:84:9D:B6:52:AC:71:94:16:4E:51",
  "pin": "z/zoOZ5qgsJ8kg9picMzfCJ31kKY0V/udOFNBpNwiOE=",
  "derB64": "MIICwjCCAaqgAwIBAgICXh8wDQYJKoZIhvcNAQELBQAwFDESMBAGA1UEAwwJbG9jYWxob3N0MB4XDTI2MTAwMTAwMDAwMFoXDTI3MTAwMTAwMDAwMFowFDESMBAGA1UEAwwJbG9jYWxob3N0MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt93yVYXB1QK9GC0jnIQL/XiveVRvuPfy/QStrWR+zHHfKd25krLl1FzcxVVbrPJ/eqEiOWZJ6Rws+aBD5zbA6eVmJyM30u0pvWwwGsLnD7byRBPcaXFdHhROXtYzXysh/kThLzMTZNgoOZNQCKZ/fpDLRw25EUlDzjibj5j63IIFLhQcaooxEVcp6D35FrK7+fThfAAoRvg+50ilmtdSizxipL4jHsD/UKXJI0APzRRT2rLS78ums7Ma+VhoFXshoy82j4wNIQE1SQ1MTtUXgjBO9uaZgJ8jTftRBfe3fb3onohLFpi2wLp7X3Cz11AqDStyai7/xEfA5LbRb0fE5QIDAQABox4wHDAaBgNVHREEEzARgglsb2NhbGhvc3SHBH8AAAEwDQYJKoZIhvcNAQELBQADggEBAH6u/rmom+MiCmu4uXtPy574s40p9gmFlMIdll+lcmGd3BVJN8DB9xGAx7tJrQMfojZqVY5Vteiwl08KC2jIqrMp3PgNUZkjSaKhtCBjOImrXD1hM1k2b7Cgc+Z1M9zubMQiglUruifNWxjeWL4esg3GvYZgJ2BucuvTCCi0fYcHewixRoWXyactMPCjJYscp579GBiniyG7WIqkzroBJFkX4z3jh3VAwsPE2IrNko+IUxZg5MCdS6nslX0/vgQaOzuVl4OlWp5SdYdeqPRv/lLkRNqtjXtsgCcOIBYUcThkpi544YNwDi5pu7dpEp98ahmXMQBEQa7zycd1d+IFQDI=",
  "derLen": 710,
  "asnLines": 35,
  "asnHl": 4,
  "asnLen": 706,
  "nodeCN": "localhost"
 },
 "ncLeaf": {
  "serial": "3b0001",
  "subject": "CN=wiki.corp.example",
  "issuer": "CN=Cert Lab Corp CA (Constrained),O=示例信任服务有限公司,C=CN",
  "nb": 1788220800000,
  "na": 1819756800000,
  "san": [
   "wiki.corp.example",
   "evil.example.net"
  ],
  "nExt": 8,
  "sha256": "89:DC:AA:B4:6B:04:68:01:5E:39:10:17:90:F6:23:B9:4D:B6:E7:7F:A6:A1:3A:97:7E:7B:79:67:1C:DD:13:A2",
  "sha1": "3B:8A:ED:BA:58:1F:E5:91:FD:61:33:CA:C6:7C:B2:E6:86:E3:60:AC",
  "pin": "rz/oC7ar/E6bAGBQGI+chgBMCmv5WHcSg5ckYyxOoXg=",
  "derB64": "MIICkzCCAjmgAwIBAgIDOwABMAoGCCqGSM49BAMCMF8xCzAJBgNVBAYTAkNOMScwJQYDVQQKDB7npLrkvovkv6Hku7vmnI3liqHmnInpmZDlhazlj7gxJzAlBgNVBAMMHkNlcnQgTGFiIENvcnAgQ0EgKENvbnN0cmFpbmVkKTAeFw0yNjA5MDEwMDAwMDBaFw0yNzA5MDEwMDAwMDBaMBwxGjAYBgNVBAMMEXdpa2kuY29ycC5leGFtcGxlMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErygIvmoS30YRCpCjVovMAETHoJowyecx1jhZJERL85YxhmouVe1z78ntmrak5m70pjFjsDAGbBhwDgQqZltLjKOCASUwggEhMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMB0GA1UdDgQWBBQM6gTis/1EQF4oJdyCzMRfUijoFzAfBgNVHSMEGDAWgBTj7gGLuvIlBf/HSDtqKOtxH6XvWjAuBgNVHREEJzAlghF3aWtpLmNvcnAuZXhhbXBsZYIQZXZpbC5leGFtcGxlLm5ldDBnBggrBgEFBQcBAQRbMFkwIwYIKwYBBQUHMAGGF2h0dHA6Ly9vY3NwLmV4YW1wbGUuY29tMDIGCCsGAQUFBzAChiZodHRwOi8vcGtpLmV4YW1wbGUuY29tL3Rscy1jYS0yMDI1LmNydDATBgNVHSAEDDAKMAgGBmeBDAECATATBgNVHSUEDDAKBggrBgEFBQcDATAKBggqhkjOPQQDAgNIADBFAiAGPCn5ERek92Q5ULci8KwJ5uBnUE8p3lRvtiiYbTgoawIhAL1GAE5OI4h+4RJHKagujkcHvWy2Nd1u4bVhkt6+K2Pj",
  "derLen": 663,
  "asnLines": 64,
  "asnHl": 4,
  "asnLen": 659,
  "nodeCN": "wiki.corp.example"
 },
 "github": [
  {
   "serial": "3e1d6026b4b0aea279dca2efbbced82b",
   "subject": "CN=github.com",
   "issuer": "CN=Sectigo Public Server Authentication CA DV E36,O=Sectigo Limited,C=GB",
   "nb": 1793318400000,
   "na": 1801094399000,
   "san": [
    "github.com",
    "www.github.com"
   ],
   "nExt": 9,
   "sha256": "7D:C4:D8:5C:F1:E3:10:97:12:25:BC:9A:92:57:67:90:43:A2:43:D7:0A:3C:C2:A9:1C:C5:D3:89:89:2C:27:76",
   "sha1": "E6:52:C8:BD:1C:AF:D0:4A:44:23:9F:A8:DA:B0:C5:9D:EA:CB:79:EE",
   "pin": "8gWWkWa8AfAz0khtRYRodss7ieQPpu8Sd7DppK94eVo=",
   "derB64": "MIID9DCCA5ugAwIBAgIQPh1gJrSwrqJ53KLvu87YKzAKBggqhkjOPQQDAjBgMQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQDEy5TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gQ0EgRFYgRTM2MB4XDTI2MTAzMDAwMDAwMFoXDTI3MDEyNzIzNTk1OVowFTETMBEGA1UEAxMKZ2l0aHViLmNvbTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABDfKd4nH+v687AH/LbUBuI5oXVsDbbLwRkLBCDbDmYWcrpxd8+9O0uPHpIgjAQ0gBToGy66v4d70x/jgDoosK3ejggKAMIICfDAfBgNVHSMEGDAWgBQXmagEwW/kLXCoChA9A9PpGrgmYzAdBgNVHQ4EFgQUjLAqHq7uhl0AATWx5YtpI6U+PHEwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQCMAAwEwYDVR0lBAwwCgYIKwYBBQUHAwEwSQYDVR0gBEIwQDA0BgsrBgEEAbIxAQICBzAlMCMGCCsGAQUFBwIBFhdodHRwczovL3NlY3RpZ28uY29tL0NQUzAIBgZngQwBAgEwgYQGCCsGAQUFBwEBBHgwdjBPBggrBgEFBQcwAoZDaHR0cDovL2NydC5zZWN0aWdvLmNvbS9TZWN0aWdvUHVibGljU2VydmVyQXV0aGVudGljYXRpb25DQURWRTM2LmNydDAjBggrBgEFBQcwAYYXaHR0cDovL29jc3Auc2VjdGlnby5jb20wJQYDVR0RBB4wHIIKZ2l0aHViLmNvbYIOd3d3LmdpdGh1Yi5jb20wggEMBgorBgEEAdZ5AgQCBIH9BIH6APgAdQBGojlnxg22RofGbz35mZR2k6amESCEV9VV5+PQodm2RgAAAaGKLocgAAAEAwBGMEQCICIQbbpOkqdkpMHlEO4IaqjUE51GdnAX8lTdfJqayeUyAiBW+rfEnQghzD2sljP8DmiE364OeNXjRLnoS4/+EDmBMQB/AKKBABhzThduHUfglUDzgbpUZpfNY6hDUHFuuAlO2vENAAABoYouiCYACAAABQAyHujyBAMASDBGAiEAqR77xK7WOstHFrsyltQlPHqO5UAlaD5EUGgfV+SyHngCIQCTdXIrVaNFlwq2jVoU6eq3LTDtgBbBB8AS6pKHuIF94DAKBggqhkjOPQQDAgNHADBEAiAiIVULRbVeXo166wK3Vp15eud/nlbNTa+j4FUnKD6GYAIgBcK3WmeV05N87KRIoaIV/h97FykBOCulKBsCT9qemhg=",
   "derLen": 1016,
   "asnLines": 67,
   "asnHl": 4,
   "asnLen": 1012,
   "nodeCN": "github.com"
  },
  {
   "serial": "36e059ed888dd57aedd570b6727f9bda",
   "subject": "CN=Sectigo Public Server Authentication CA DV E36,O=Sectigo Limited,C=GB",
   "issuer": "CN=Sectigo Public Server Authentication Root E46,O=Sectigo Limited,C=GB",
   "nb": 1616371200000,
   "na": 2089756799000,
   "san": [],
   "nExt": 8,
   "sha256": "87:3F:0B:A8:0E:3A:C2:22:65:6D:FD:04:15:8C:C1:5C:29:27:D4:2D:5D:05:F0:1D:EE:4A:47:EB:43:A9:16:DF",
   "sha1": "56:63:48:E6:56:E1:FA:6C:4E:2E:E6:72:59:16:E8:F4:E3:73:8A:07",
   "pin": "ZSagvDzjltLkewXEBuDxIzpW/dpVw1Juvvmd0hhkzdY=",
   "derB64": "MIIDXzCCAuagAwIBAgIQNuBZ7YiN1Xrt1XC2cn+b2jAKBggqhkjOPQQDAzBfMQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQDEy1TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBFNDYwHhcNMjEwMzIyMDAwMDAwWhcNMzYwMzIxMjM1OTU5WjBgMQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTcwNQYDVQQDEy5TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gQ0EgRFYgRTM2MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEaKGnbAUnBYljHDmn/yUhxe3TLxKYuyzc9VXoSaCEV5F73Fhfa/Si/RMsmwTFW3R9s7J6JpYZFmu4do3vk/Vgl6OCAYEwggF9MB8GA1UdIwQYMBaAFNEi2kxZ8UtfJjiqndbu6w3D+6lhMB0GA1UdDgQWBBQXmagEwW/kLXCoChA9A9PpGrgmYzAOBgNVHQ8BAf8EBAMCAYYwEgYDVR0TAQH/BAgwBgEB/wIBADAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGwYDVR0gBBQwEjAGBgRVHSAAMAgGBmeBDAECATBUBgNVHR8ETTBLMEmgR6BFhkNodHRwOi8vY3JsLnNlY3RpZ28uY29tL1NlY3RpZ29QdWJsaWNTZXJ2ZXJBdXRoZW50aWNhdGlvblJvb3RFNDYuY3JsMIGEBggrBgEFBQcBAQR4MHYwTwYIKwYBBQUHMAKGQ2h0dHA6Ly9jcnQuc2VjdGlnby5jb20vU2VjdGlnb1B1YmxpY1NlcnZlckF1dGhlbnRpY2F0aW9uUm9vdEU0Ni5wN2MwIwYIKwYBBQUHMAGGF2h0dHA6Ly9vY3NwLnNlY3RpZ28uY29tMAoGCCqGSM49BAMDA2cAMGQCMFsKnBQDh64l+v+aUYWjDCJKQMxHUUGmcwAYDIjJ9pbRYItMCIx5xu0oUb6sIfTXqQIwPddcsDE4KdeLu1hJdpHgdLvsHAK3vygyLGujMU9xBJCDackRT93VHEE0gppgNqdV",
   "derLen": 867,
   "asnLines": 72,
   "asnHl": 4,
   "asnLen": 863,
   "nodeCN": "Sectigo Public Server Authentication CA DV E36"
  },
  {
   "serial": "1a9eafec6de8e19b5c193141b68d90dd",
   "subject": "CN=Sectigo Public Server Authentication Root E46,O=Sectigo Limited,C=GB",
   "issuer": "CN=USERTrust ECC Certification Authority,O=The USERTRUST Network,L=Jersey City,ST=New Jersey,C=US",
   "nb": 1616371200000,
   "na": 2147471999000,
   "san": [],
   "nExt": 8,
   "sha256": "EA:6B:89:ED:69:07:A2:09:FF:91:88:67:6F:B1:64:E7:AC:ED:89:4B:89:96:DF:BE:5C:E5:BB:CC:22:DE:4D:DD",
   "sha1": "3F:96:99:89:F5:31:0E:9C:05:0D:FF:D7:AB:C1:55:30:E3:C1:3A:A0",
   "pin": "sLVjNUaFYfW7n6EtgBeEpjOlcnBdNPMrZDRF36iwBdE=",
   "derB64": "MIIDRjCCAsugAwIBAgIQGp6v7G3o4ZtcGTFBto2Q3TAKBggqhkjOPQQDAzCBiDELMAkGA1UEBhMCVVMxEzARBgNVBAgTCk5ldyBKZXJzZXkxFDASBgNVBAcTC0plcnNleSBDaXR5MR4wHAYDVQQKExVUaGUgVVNFUlRSVVNUIE5ldHdvcmsxLjAsBgNVBAMTJVVTRVJUcnVzdCBFQ0MgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMjEwMzIyMDAwMDAwWhcNMzgwMTE4MjM1OTU5WjBfMQswCQYDVQQGEwJHQjEYMBYGA1UEChMPU2VjdGlnbyBMaW1pdGVkMTYwNAYDVQQDEy1TZWN0aWdvIFB1YmxpYyBTZXJ2ZXIgQXV0aGVudGljYXRpb24gUm9vdCBFNDYwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAAR2+pmpbiDt+dd34wc7qNs9Xzjoq1WmVk/WSOrsfy2qw7LFeeyZYX8QeccCWvkEN/U0NSt3zn8gj1KjAIns1aeibVvjS5KToID1AZTc8GgHHs3u/iVStSBDHBv+6xnOQ6OjggEgMIIBHDAfBgNVHSMEGDAWgBQ64QmG1M8ZwpZ2dEl23OA1xmNjmjAdBgNVHQ4EFgQU0SLaTFnxS18mOKqd1u7rDcP7qWEwDgYDVR0PAQH/BAQDAgGGMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMBEGA1UdIAQKMAgwBgYEVR0gADBQBgNVHR8ESTBHMEWgQ6BBhj9odHRwOi8vY3JsLnVzZXJ0cnVzdC5jb20vVVNFUlRydXN0RUNDQ2VydGlmaWNhdGlvbkF1dGhvcml0eS5jcmwwNQYIKwYBBQUHAQEEKTAnMCUGCCsGAQUFBzABhhlodHRwOi8vb2NzcC51c2VydHJ1c3QuY29tMAoGCCqGSM49BAMDA2kAMGYCMQCMCyBit99vX2ba6xEkDe+YO7vC0twjbkv9PKpqGGuZ61JZryjFsp+DFpEclCVy4noCMQCwvZDXD/m2Ko1HA5Bkmz7YQOFAiNDD49IWa2wdT7R3DtODaSXH/BiXv8fwB9su4tU=",
   "derLen": 842,
   "asnLines": 80,
   "asnHl": 4,
   "asnLen": 838,
   "nodeCN": "Sectigo Public Server Authentication Root E46"
  }
 ],
 "letsencrypt": [
  {
   "serial": "5688c92ad512a3678db6355831a0bfbbd32",
   "subject": "CN=letsencrypt.org",
   "issuer": "CN=YE2,O=Let's Encrypt,C=US",
   "nb": 1793713474000,
   "na": 1801489473000,
   "san": [
    "cp.letsencrypt.org",
    "cp.root-x1.letsencrypt.org",
    "cps.letsencrypt.org",
    "cps.root-x1.letsencrypt.org",
    "lencr.org",
    "letsencrypt.com",
    "letsencrypt.org",
    "www.lencr.org",
    "www.letsencrypt.com",
    "www.letsencrypt.org"
   ],
   "nExt": 10,
   "sha256": "BF:23:01:9B:28:2D:3C:79:EA:F5:F0:68:84:79:EC:45:61:D3:90:A8:27:B6:1B:44:CE:6D:5D:CB:5B:7D:10:F3",
   "sha1": "1E:4A:84:1F:99:1B:D4:4C:66:B2:A7:A0:92:04:80:9C:94:34:6C:66",
   "pin": "flTwIAI56dThORiU1wbXUPovi3YFBsUIB40XypdFiq4=",
   "derB64": "MIIEPjCCA8SgAwIBAgISBWiMkq1RKjZ422NVgxoL+70yMAoGCCqGSM49BAMDMDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQwwCgYDVQQDEwNZRTIwHhcNMjYxMTAzMTM0NDM0WhcNMjcwMjAxMTM0NDMzWjAaMRgwFgYDVQQDEw9sZXRzZW5jcnlwdC5vcmcwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAATwMStYVLOg2Fb8v6HhbJSBjA2F5/t15QCPdaq9NvDNlX5Au/xBrmNdxUd08LQJRIcyhFFeiq9+DGCQNOC9IFISo4ICzzCCAsswDgYDVR0PAQH/BAQDAgeAMBMGA1UdJQQMMAoGCCsGAQUFBwMBMAwGA1UdEwEB/wQCMAAwHQYDVR0OBBYEFM3hJcx4hrtzy4N4tnj24rliSSBFMB8GA1UdIwQYMBaAFLlZ8o7PIvCG0zdI/3YUGLqC2FWHMDMGCCsGAQUFBwEBBCcwJTAjBggrBgEFBQcwAoYXaHR0cDovL3llMi5pLmxlbmNyLm9yZy8wgdMGA1UdEQSByzCByIISY3AubGV0c2VuY3J5cHQub3JnghpjcC5yb290LXgxLmxldHNlbmNyeXB0Lm9yZ4ITY3BzLmxldHNlbmNyeXB0Lm9yZ4IbY3BzLnJvb3QteDEubGV0c2VuY3J5cHQub3JngglsZW5jci5vcmeCD2xldHNlbmNyeXB0LmNvbYIPbGV0c2VuY3J5cHQub3Jngg13d3cubGVuY3Iub3JnghN3d3cubGV0c2VuY3J5cHQuY29tghN3d3cubGV0c2VuY3J5cHQub3JnMBMGA1UdIAQMMAowCAYGZ4EMAQIBMC4GA1UdHwQnMCUwI6AhoB+GHWh0dHA6Ly95ZTIuYy5sZW5jci5vcmcvNTEuY3JsMIIBBAYKKwYBBAHWeQIEAgSB9QSB8gDwAHcATGPcmOWcHauI9h6KPd6uj6tEozd7X5uUw/uhnPzBviYAAAGhod0ZwAAABAMASDBGAiEAofMALApTmDrNb1+VD6B1VVVNJzgm5FZ0GofExfXdvTQCIQCP7p3v3VnJAFwRnksr06jVmLUCaJTGiAf+iZtpAUotegB1AEaiOWfGDbZGh8ZvPfmZlHaTpqYRIIRX1VXn49Ch2bZGAAABoaHdIYwAAAQDAEYwRAIgBvADZT8P00lzDNwzoJgV61ndN0JL7NMo9MbdoW+3ZoACIDwxLBrSqEC6vZT585he2z2GfIXZ+rXfSyJUzRPGNQt8MAoGCCqGSM49BAMDA2gAMGUCMQDjHdwKFqoSgXa+bqAUSDYFrS5aeDAZ3yQ1x5PVzDnOx4VqCP8YSef9x0ur6ywRm5oCME4Jc3v7oT46JURlMDmFVG3S31kxPRCpAIaY4+Hktd/3+6JBqUEAeeHAy0iUUAjCqA==",
   "derLen": 1090,
   "asnLines": 70,
   "asnHl": 4,
   "asnLen": 1086,
   "nodeCN": "letsencrypt.org"
  },
  {
   "serial": "4df3b15dd6c0784c507cd37b58e6f115",
   "subject": "CN=YE2,O=Let's Encrypt,C=US",
   "issuer": "CN=Root YE,O=ISRG,C=US",
   "nb": 1756857600000,
   "na": 1851551999000,
   "san": [],
   "nExt": 8,
   "sha256": "97:65:8D:E8:C6:8D:FA:98:AC:E1:E5:02:8A:63:D5:4A:1A:AE:91:1B:3E:21:47:10:76:C6:85:0C:D0:8C:BA:B4",
   "sha1": "F8:15:8C:A8:A3:A7:C5:DB:D7:84:22:18:F5:D9:49:CE:C8:3A:CD:BA",
   "pin": "s/tdAOmUzd8syaTuqfgGvFcn6DzA5Cmb+Vby1ST+U3Y=",
   "derB64": "MIICjDCCAhGgAwIBAgIQTfOxXdbAeExQfNN7WObxFTAKBggqhkjOPQQDAzAuMQswCQYDVQQGEwJVUzENMAsGA1UEChMESVNSRzEQMA4GA1UEAxMHUm9vdCBZRTAeFw0yNTA5MDMwMDAwMDBaFw0yODA5MDIyMzU5NTlaMDMxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQwwCgYDVQQDEwNZRTIwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAARxmrQzkdbEEL3MqXt3dJQttYc47axkdDTHud5TPqM2z5uSD5cmk0WrHlWXvnlvqBLqiB34kluxIbmMyAiq3/YD6e80/vV259K8XQIdjFXloYOa0mIU71f7HQ09PvYDlw+jge4wgeswDgYDVR0PAQH/BAQDAgGGMBMGA1UdJQQMMAoGCCsGAQUFBwMBMBIGA1UdEwEB/wQIMAYBAf8CAQAwHQYDVR0OBBYEFLlZ8o7PIvCG0zdI/3YUGLqC2FWHMB8GA1UdIwQYMBaAFKPIJlqOoUzQNWP8myPIOq5W809WMDIGCCsGAQUFBwEBBCYwJDAiBggrBgEFBQcwAoYWaHR0cDovL3llLmkubGVuY3Iub3JnLzATBgNVHSAEDDAKMAgGBmeBDAECATAnBgNVHR8EIDAeMBygGqAYhhZodHRwOi8veWUuYy5sZW5jci5vcmcvMAoGCCqGSM49BAMDA2kAMGYCMQDIcnw5dcZLN9ffynXnnkLD/itSJEycJPb3sRkzeqBowup7vOsAwaqoCnNn/jh9wycCMQCJM6CPlaOC4pQYYbJtVPYbDKrIb2EKk5NpOpE6/XttQYZV/3gilB9l+Cc/DOVwmyg=",
   "derLen": 656,
   "asnLines": 72,
   "asnHl": 4,
   "asnLen": 652,
   "nodeCN": "YE2"
  },
  {
   "serial": "872165fc34b6e5fba8add5b3705fb53a",
   "subject": "CN=Root YE,O=ISRG,C=US",
   "issuer": "CN=ISRG Root X2,O=Internet Security Research Group,C=US",
   "nb": 1778630400000,
   "na": 1977782399000,
   "san": [],
   "nExt": 8,
   "sha256": "0F:C0:90:1C:CA:2B:AE:9E:9F:DB:B0:2D:50:D0:2F:10:94:F7:B3:66:72:08:69:91:B9:E8:97:62:6D:C4:85:F0",
   "sha1": "F3:76:20:FC:4B:1C:DD:D2:A3:D7:4B:1D:5E:8D:B4:2E:24:4C:A0:06",
   "pin": "sCkq5UWXjg+7mKu9lMhhYF5bGLsy7VI/UNW3tccdR7w=",
   "derB64": "MIICpjCCAiugAwIBAgIRAIchZfw0tuX7qK3Vs3BftTowCgYIKoZIzj0EAwMwTzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2VhcmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDIwHhcNMjYwNTEzMDAwMDAwWhcNMzIwOTAyMjM1OTU5WjAuMQswCQYDVQQGEwJVUzENMAsGA1UEChMESVNSRzEQMA4GA1UEAxMHUm9vdCBZRTB2MBAGByqGSM49AgEGBSuBBAAiA2IABDwS/6vhrcVqcbBo+wgdI3fwn9x7DNJJOY/lTOti0vkwuRN87RhEhTH17E7XyFjWsPYhIPt/wzOqxTd2b+4ZJNy9ID04YywF9U5zasDVyGSNErVNtz8uSGh5izW87j77GaOB6zCB6DAOBgNVHQ8BAf8EBAMCAQYwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUo8gmWo6hTNA1Y/ybI8g6rlbzT1YwHwYDVR0jBBgwFoAUfEKWrt5LSDv6kviejM9ti6lyN5UwMgYIKwYBBQUHAQEEJjAkMCIGCCsGAQUFBzAChhZodHRwOi8veDIuaS5sZW5jci5vcmcvMBMGA1UdIAQMMAowCAYGZ4EMAQIBMCcGA1UdHwQgMB4wHKAaoBiGFmh0dHA6Ly94Mi5jLmxlbmNyLm9yZy8wCgYIKoZIzj0EAwMDaQAwZgIxAMU19WCtmxVND8UHBZRoma49Z7jPs64Dma0eTu1OChVbB/2J7GV3nvYKAx54uk1G9QIxAO0miLVJu8PLNiXXXkiE/gsK3CTRTF/aeo4bMX42Zw40csRU6AC26hSW1/IWaas6dg==",
   "derLen": 682,
   "asnLines": 72,
   "asnHl": 4,
   "asnLen": 678,
   "nodeCN": "Root YE"
  },
  {
   "serial": "6c8f1dc727c7117f7baf853ac980f9cd",
   "subject": "CN=ISRG Root X2,O=Internet Security Research Group,C=US",
   "issuer": "CN=ISRG Root X1,O=Internet Security Research Group,C=US",
   "nb": 1778630400000,
   "na": 1977782399000,
   "san": [],
   "nExt": 8,
   "sha256": "EE:5F:7A:BD:69:81:BB:02:55:63:2C:D8:F4:92:83:45:1B:4B:18:84:4D:12:04:0B:44:EE:00:F0:7B:8F:E2:C6",
   "sha1": "3C:34:E3:56:C7:FC:17:F5:AC:F0:48:24:BC:58:7C:6C:62:39:51:A2",
   "pin": "diGVwiVYbubAI3RW4hB9xU8e/CH2GnkuvVFZE8zmgzI=",
   "derB64": "MIIEcDCCAligAwIBAgIQbI8dxyfHEX97r4U6yYD5zTANBgkqhkiG9w0BAQsFADBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJuZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBYMTAeFw0yNjA1MTMwMDAwMDBaFw0zMjA5MDIyMzU5NTlaME8xCzAJBgNVBAYTAlVTMSkwJwYDVQQKEyBJbnRlcm5ldCBTZWN1cml0eSBSZXNlYXJjaCBHcm91cDEVMBMGA1UEAxMMSVNSRyBSb290IFgyMHYwEAYHKoZIzj0CAQYFK4EEACIDYgAEzZvVn4CDCuwJSvMWSj5cz3es3mcFDR0HttwW+1qLFNvicWDEukWVEYmO6gbf9yoWHKS5xcUy4APgHoIYOIvXRdgKam7mAHf7AlF9ItgKbppbd9/w+kHsOdx1ymgHDB/qo4H1MIHyMA4GA1UdDwEB/wQEAwIBBjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQUfEKWrt5LSDv6kviejM9ti6lyN5UwHwYDVR0jBBgwFoAUebRZ5nu25eQBc4AIiMgaWPbpm24wMgYIKwYBBQUHAQEEJjAkMCIGCCsGAQUFBzAChhZodHRwOi8veDEuaS5sZW5jci5vcmcvMBMGA1UdIAQMMAowCAYGZ4EMAQIBMCcGA1UdHwQgMB4wHKAaoBiGFmh0dHA6Ly94MS5jLmxlbmNyLm9yZy8wDQYJKoZIhvcNAQELBQADggIBAD2/e9frmMxNpCV03qUHegg+MV2wz9644YoXdqtH8RyWYcBO7xfjjGEXdU1e/o0OkEFiynUCOSIk/vLLo7ttz6CPAeNlWfC0XNkoGeWgK6jjXvozBaGuGH5n0UfoshMeWTuURqNN5G00sSXDTBrpp2+mgvdZQjb8K11TYMA25QA+YHNfbIEL0BniAhKS2gsnJjSzrdZLI+EZ7SEyqdR2rkjd1KutLDU+n3TFyxjniZVGur4YlhMP3mY/dV95IruAkkjOZier6hGBdEgZXXvaCz9u9iVEadsIE75pAGL8oHV5vxdARDiotRpul1IN/UZwzAbrfUFcw1HkAcYD/mlZfnQ2ieCF2MS7j3Vhv7JPDKp45fmykmzYNSrumRW0upFFKDBOoF7hsOb7oLyHS+Uft6jOUfOrogj8YUx38hKb2K20r42OgsSdDdxdeYWcMS3Sb6mwJeSZEYxJ2gaXnDSPaKhhrNkYwljyVQyr4Nq+MEJytXNTnHqaAcrNwZlVpcJL1KBnMrMjP7eanvUwL3FYj3cF17jtboLt7gLoi4+2rWZFvn+w54jmd/FIuhhZcEaU/wvU6BUNMtcVquVGHp7itQeDth5j+XL3j4WJ2SABwzUl6OeYdgpIt/ITZa+pTT0mQ/r5XyA4MEAiabn7XJjvCERlF2dcn2wqJw+CreTkkQ2R",
   "derLen": 1140,
   "asnLines": 74,
   "asnHl": 4,
   "asnLen": 1136,
   "nodeCN": "ISRG Root X2"
  }
 ],
 "hosts": [
  {
   "host": "shop.example.com",
   "ok": true,
   "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: OK"
  },
  {
   "host": "www.shop.example.com",
   "ok": true,
   "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: OK"
  },
  {
   "host": "img.cdn.shop.example.com",
   "ok": true,
   "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: OK"
  },
  {
   "host": "a.b.cdn.shop.example.com",
   "ok": false,
   "out": "error 62 at 0 depth lookup: hostname mismatch | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: verification failed"
  },
  {
   "host": "cdn.shop.example.com",
   "ok": false,
   "out": "error 62 at 0 depth lookup: hostname mismatch | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: verification failed"
  },
  {
   "host": "example.com",
   "ok": false,
   "out": "error 62 at 0 depth lookup: hostname mismatch | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: verification failed"
  },
  {
   "host": "SHOP.Example.COM",
   "ok": true,
   "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: OK"
  },
  {
   "host": "203.0.113.10",
   "ok": true,
   "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: OK"
  },
  {
   "host": "2001:db8::10",
   "ok": true,
   "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: OK"
  },
  {
   "host": "2001:db8:0:0::10",
   "ok": true,
   "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: OK"
  },
  {
   "host": "203.0.113.11",
   "ok": false,
   "out": "error 64 at 0 depth lookup: IP address mismatch | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: verification failed"
  }
 ],
 "chainMozOnly": {
  "ok": false,
  "out": "error 19 at 2 depth lookup: self-signed certificate in certificate chain | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: verification failed"
 },
 "chainLate": {
  "ok": false,
  "out": "error 10 at 0 depth lookup: certificate has expired | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/leaf.pem: verification failed"
 },
 "expiredV": {
  "ok": false,
  "out": "error 10 at 0 depth lookup: certificate has expired | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/e.pem: verification failed"
 },
 "ncV": {
  "ok": false,
  "out": "error 47 at 0 depth lookup: permitted subtree violation | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/nc.pem: verification failed"
 },
 "githubV": {
  "ok": true,
  "out": "depth=1: C=GB, O=Sectigo Limited, CN=Sectigo Public Server Authentication CA DV E36 (untrusted) | depth=2: C=GB, O=Sectigo Limited, CN=Sectigo Public Server Authentication Root E46",
  "chainLen": 3
 },
 "githubBadHost": {
  "ok": false,
  "out": "error 62 at 0 depth lookup: hostname mismatch | error /Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/gh.pem: verification failed"
 },
 "letsencryptV": {
  "ok": true,
  "chainLen": 4,
  "out": "/Volumes/Extra2T/.agent-hub/cron/daily-website/runs/2026-11-07T07-00-00Z-8q6jy/truth/tmp/le.pem: OK | Chain: | depth=0: CN=letsencrypt.org (untrusted) | depth=1: C=US, O=Let's Encrypt, CN=YE2 (untrusted) | depth=2: C=US, O=ISRG, CN=Root YE (untrusted) | depth=3: C=US, O=Internet Security Research Group, CN=ISRG Root X2"
 },
 "key": {
  "pkcs8Pem": "-----BEGIN PRIVATE KEY-----\nMIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgs34q+OntUGVUcnob\nCXHbM5++TOltu9Vz/wPRA1Fhg8ahRANCAASvKAi+ahLfRhEKkKNWi8wARMegmjDJ\n5zHWOFkkREvzljGGai5V7XPvye2atqTmbvSmMWOwMAZsGHAOBCpmW0uM\n-----END PRIVATE KEY-----\n",
  "sec1Pem": "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEILN+Kvjp7VBlVHJ6Gwlx2zOfvkzpbbvVc/8D0QNRYYPGoAoGCCqGSM49\nAwEHoUQDQgAErygIvmoS30YRCpCjVovMAETHoJowyecx1jhZJERL85YxhmouVe1z\n78ntmrak5m70pjFjsDAGbBhwDgQqZltLjA==\n-----END EC PRIVATE KEY-----\n",
  "spkiPem": "-----BEGIN PUBLIC KEY-----\nMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErygIvmoS30YRCpCjVovMAETHoJow\nyecx1jhZJERL85YxhmouVe1z78ntmrak5m70pjFjsDAGbBhwDgQqZltLjA==\n-----END PUBLIC KEY-----\n",
  "jwk": {
   "kty": "EC",
   "x": "rygIvmoS30YRCpCjVovMAETHoJowyecx1jhZJERL85Y",
   "y": "MYZqLlXtc-_J7Zq2pOZu9KYxY7AwBmwYcA4EKmZbS4w",
   "crv": "P-256",
   "d": "s34q-OntUGVUcnobCXHbM5--TOltu9Vz_wPRA1Fhg8Y"
  },
  "pubJwk": {
   "kty": "EC",
   "x": "rygIvmoS30YRCpCjVovMAETHoJowyecx1jhZJERL85Y",
   "y": "MYZqLlXtc-_J7Zq2pOZu9KYxY7AwBmwYcA4EKmZbS4w",
   "crv": "P-256"
  },
  "thumb": "blR7ErL46t216_bwHMlUx3449lsEhyQ2_ZOKgZYW_pQ",
  "ssh": "ecdsa-sha2-nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBK8oCL5qEt9GEQqQo1aLzABEx6CaMMnnMdY4WSRES/OWMYZqLlXtc+/J7Zq2pOZu9KYxY7AwBmwYcA4EKmZbS4w=",
  "sshFp": "SHA256:Xj/fVQoxWxNN5DMBFGZb5j0vNC4Rwag+gGZhpAXjrMU",
  "pin": "rz/oC7ar/E6bAGBQGI+chgBMCmv5WHcSg5ckYyxOoXg=",
  "encDecryptsTo": "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgs34q+OntUGVUcnobCXHbM5++TOltu9Vz/wPRA1Fhg8ahRANCAASvKAi+ahLfRhEKkKNWi8wARMegmjDJ5zHWOFkkREvzljGGai5V7XPvye2atqTmbvSmMWOwMAZsGHAOBCpmW0uM",
  "p8b64": "MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgs34q+OntUGVUcnobCXHbM5++TOltu9Vz/wPRA1Fhg8ahRANCAASvKAi+ahLfRhEKkKNWi8wARMegmjDJ5zHWOFkkREvzljGGai5V7XPvye2atqTmbvSmMWOwMAZsGHAOBCpmW0uM",
  "encParams": [
   "5:d=2  hl=2 l=   9 prim: OBJECT            :PBES2",
   "20:d=4  hl=2 l=   9 prim: OBJECT            :PBKDF2",
   "51:d=5  hl=2 l=   2 prim: INTEGER           :0800",
   "57:d=6  hl=2 l=   8 prim: OBJECT            :hmacWithSHA256",
   "71:d=4  hl=2 l=   9 prim: OBJECT            :aes-256-cbc"
  ]
 },
 "csr": {
  "verify": "Certificate request self-signature verify OK",
  "subject": "CN=pay.example.com,O=示例电商,L=上海,ST=上海,C=CN",
  "san": [
   "pay.example.com",
   "api.pay.example.com"
  ]
 },
 "crl": {
  "revoked": [
   {
    "serial": "3a0001",
    "reason": "key_compromise"
   },
   {
    "serial": "3a0002",
    "reason": "superseded"
   }
  ],
  "issuer": "CN=Cert Lab Demo TLS CA 2025,O=示例信任服务有限公司,C=CN",
  "sigOk": "verify OK"
 },
 "p7bB64": "MIIH3gYJKoZIhvcNAQcCoIIHzzCCB8sCAQExADALBgkqhkiG9w0BBwGgggezMIICzDCCAlOgAwIBAgICIAIwCgYIKoZIzj0EAwMwVjELMAkGA1UEBhMCQ04xJzAlBgNVBAoMHuekuuS+i+S/oeS7u+acjeWKoeaciemZkOWFrOWPuDEeMBwGA1UEAwwVQ2VydCBMYWIgRGVtbyBSb290IENBMB4XDTI1MDEwMTAwMDAwMFoXDTM1MDEwMTAwMDAwMFowWjELMAkGA1UEBhMCQ04xJzAlBgNVBAoMHuekuuS+i+S/oeS7u+acjeWKoeaciemZkOWFrOWPuDEiMCAGA1UEAwwZQ2VydCBMYWIgRGVtbyBUTFMgQ0EgMjAyNTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJcmSu21JWWEIra+kpaHJZc+wwNbZfHKkccx9dOceXXVQYlSStDOYJrfnNvgVZR130fMLVrlEc1uW/7bv+GGDtKjggELMIIBBzASBgNVHRMBAf8ECDAGAQH/AgEAMA4GA1UdDwEB/wQEAwIBhjAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwHQYDVR0OBBYEFIn3mdscdZyHb6lPY8SEgKqvsOUQMB8GA1UdIwQYMBaAFMChbdQs1US+ausicHgvRJaNxKSTMDsGCCsGAQUFBwEBBC8wLTArBggrBgEFBQcwAoYfaHR0cDovL3BraS5leGFtcGxlLmNvbS9yb290LmNydDAwBgNVHR8EKTAnMCWgI6Ahhh9odHRwOi8vcGtpLmV4YW1wbGUuY29tL3Jvb3QuY3JsMBMGA1UdIAQMMAowCAYGZ4EMAQIBMAoGCCqGSM49BAMDA2cAMGQCMEDEZiDnPA7aBRxgU1nvaY+Vv5kVBUCPtXJZHItl08zMOSmh2uzNzGmhmv92aEzBxAIwUZ7B20lSmjtwT2Pycsq30f4AiwueZrPXFeGnvXYJ8P1cVEZ+M6bbgozn4+0GeRoVMIICvzCCAmagAwIBAgIDOn8MMAoGCCqGSM49BAMCMFoxCzAJBgNVBAYTAkNOMScwJQYDVQQKDB7npLrkvovkv6Hku7vmnI3liqHmnInpmZDlhazlj7gxIjAgBgNVBAMMGUNlcnQgTGFiIERlbW8gVExTIENBIDIwMjUwHhcNMjYwOTAxMDAwMDAwWhcNMjcxMDAzMDAwMDAwWjAbMRkwFwYDVQQDDBBzaG9wLmV4YW1wbGUuY29tMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAErygIvmoS30YRCpCjVovMAETHoJowyecx1jhZJERL85YxhmouVe1z78ntmrak5m70pjFjsDAGbBhwDgQqZltLjKOCAVgwggFUMAwGA1UdEwEB/wQCMAAwDgYDVR0PAQH/BAQDAgeAMB0GA1UdDgQWBBQM6gTis/1EQF4oJdyCzMRfUijoFzAfBgNVHSMEGDAWgBSJ95nbHHWch2+pT2PEhICqr7DlEDBhBgNVHREEWjBYghBzaG9wLmV4YW1wbGUuY29tghR3d3cuc2hvcC5leGFtcGxlLmNvbYIWKi5jZG4uc2hvcC5leGFtcGxlLmNvbYcEywBxCocQIAENuAAAAAAAAAAAAAAAEDBnBggrBgEFBQcBAQRbMFkwIwYIKwYBBQUHMAGGF2h0dHA6Ly9vY3NwLmV4YW1wbGUuY29tMDIGCCsGAQUFBzAChiZodHRwOi8vcGtpLmV4YW1wbGUuY29tL3Rscy1jYS0yMDI1LmNydDATBgNVHSAEDDAKMAgGBmeBDAECATATBgNVHSUEDDAKBggrBgEFBQcDATAKBggqhkjOPQQDAgNHADBEAiA6qVET5XSGbY2jYUkBvvZeGxHGYDH39WQVszU0Bn9G/wIgLxLjQl7Iw4NMgE3eT6KbXpzZvDswdUdFQMfv2HBG40QwggIcMIIBoaADAgECAgIQATAKBggqhkjOPQQDAzBWMQswCQYDVQQGEwJDTjEnMCUGA1UECgwe56S65L6L5L+h5Lu75pyN5Yqh5pyJ6ZmQ5YWs5Y+4MR4wHAYDVQQDDBVDZXJ0IExhYiBEZW1vIFJvb3QgQ0EwHhcNMjUwMTAxMDAwMDAwWhcNNDUwMTAxMDAwMDAwWjBWMQswCQYDVQQGEwJDTjEnMCUGA1UECgwe56S65L6L5L+h5Lu75pyN5Yqh5pyJ6ZmQ5YWs5Y+4MR4wHAYDVQQDDBVDZXJ0IExhYiBEZW1vIFJvb3QgQ0EwdjAQBgcqhkjOPQIBBgUrgQQAIgNiAARayRZKDCTMyN9YCY9O5tXOzkCZZTxvpBJ7Rq49zcbJpPFVIKJNeoSttFuuf4PFfdrpaDxb3BJ1ZRsJ+jkY7YRyNv05PKayGZZtiy72wkX91ndLqVLHCAvBhncRwYnwV8mjQjBAMA8GA1UdEwEB/wQFMAMBAf8wDgYDVR0PAQH/BAQDAgEGMB0GA1UdDgQWBBTAoW3ULNVEvmrrInB4L0SWjcSkkzAKBggqhkjOPQQDAwNpADBmAjEA0mb54m2y6BFwKUOYYcYvZM5xlEj5O4kH+h5xAWBxDD2WzDS+5XsL8ml+uZ/4WrH3AjEAlKCfEjeSmjxi0unj6e9TgSdxhyo/gXUWiPFW1Nv0JtGTKWci3JpD2AIxGMaL+5dBMQA=",
 "algs": [
  {
   "name": "RSA-PSS",
   "root": "-----BEGIN CERTIFICATE-----\nMIIDfzCCAjOgAwIBAgIUfXHl88CKcR2EnuADmBU4xYNEbz8wQQYJKoZIhvcNAQEK\nMDSgDzANBglghkgBZQMEAgEFAKEcMBoGCSqGSIb3DQEBCDANBglghkgBZQMEAgEF\nAKIDAgEgMBMxETAPBgNVBAMMCHBzcy1yb290MB4XDTI2MDEwMTAwMDAwMFoXDTM2\nMDEwMTAwMDAwMFowEzERMA8GA1UEAwwIcHNzLXJvb3QwggEiMA0GCSqGSIb3DQEB\nAQUAA4IBDwAwggEKAoIBAQCv5bkgI7F+xKfC0h52k2JH9dQss8a47YqJxIQblqEd\nTY/2gKXh8wFR/5M60Hdg2IS3BTH20NuAaFW/bff0QfehVDPgJr7G8i/vW1nVOaGQ\nqmONynIJZbGNj3/xRJ/IrIKJX7puGZH9gMTZz6xEx7Ob2mIuVJ2ep4uocV3XE1Q1\nhTbeh95XOiHUfpEe/7ecOfdjQeS+xYimGHrPVmcCoXc4xL9UTIP6vO5J6hAFILt+\nMceqPm2e136L9xpEHkIRhipRz05OQO0l9XLByWs064iS5BlHp3lyEfBaqLIu0Qsf\n/V4AB8ubM3JCZxWEyxLoPETQgWlhC1Hj39Uzbxd2ZuKhAgMBAAGjYzBhMB0GA1Ud\nDgQWBBSJwUVGWRLXnGPTUc7WOn5I8a4lpDAfBgNVHSMEGDAWgBSJwUVGWRLXnGPT\nUc7WOn5I8a4lpDAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBBjBBBgkq\nhkiG9w0BAQowNKAPMA0GCWCGSAFlAwQCAQUAoRwwGgYJKoZIhvcNAQEIMA0GCWCG\nSAFlAwQCAQUAogMCASADggEBAI97cKwb1JdQOl3zcwyWidX9qPzlinBBnWMHITe7\n1KJJRtgfwtewVKIu8uTMXYuGcWxRF121z9vEQ6AhjaFxuBWUda7UWso4UCPi4pWp\nEz41XgaPJxh++3XUvo8GDgVK13QeZ136qQl6w8qxFzw81ZQ4Pf4OZFsRI4xTes2L\ndHuTs+crl2mPDVY5DuZSC73GcGYG33gHa6oTNRSaM9/Y85YZq8M2lJdGnGsb2zUc\n06cptpNYfd3PjLuOhjqmf36SRLK3jKLoppdbmrUDg9z0k0ke/ygsF34wE10AhKfM\n0ZVcl/3zp1rGYZRZyU3a56MOZSU8iJo+GsVP9oDymIY2nmo=\n-----END CERTIFICATE-----\n",
   "leaf": "-----BEGIN CERTIFICATE-----\nMIIDrTCCAmGgAwIBAgIUe5iD9+KlFQHosgl2b0AkkazI1BkwQQYJKoZIhvcNAQEK\nMDSgDzANBglghkgBZQMEAgEFAKEcMBoGCSqGSIb3DQEBCDANBglghkgBZQMEAgEF\nAKIDAgEgMBMxETAPBgNVBAMMCHBzcy1yb290MB4XDTI2MDEwMTAwMDAwMFoXDTMw\nMDEwMTAwMDAwMFowEzERMA8GA1UEAwwIcHNzLWxlYWYwggEiMA0GCSqGSIb3DQEB\nAQUAA4IBDwAwggEKAoIBAQCkJh9wV+uiWfREgqDbWRslUxRinB/C2a1estL4e3yR\nNr1zeRkdyzmjlD7Qv1rrgciuvXEOsY488cuLp/5dLgf1RAmp+hgOgI2bxvoPRSXz\nK43qQWG//y5t7lCUiPb2qQe+ONVXFeWQts1/PxeINbONC822a/ILGP1lGkgKsM1y\nM0CCb5Jc4vEfmS+SqIav/KQWai6sz2nndiOZnXJMVsZcfUaw6zjG4zkdFFb/WWC1\nvOsOogbb1BV5bh3j2q/4f2GJaAmXrS8HqUPYTUaBte5OcHp07Ogcu5yyPzEbDGIC\nPTr375zAiod7Sv8OYGFViBpcQy3pIuAfPLdMWuEmAuttAgMBAAGjgZAwgY0wDAYD\nVR0TAQH/BAIwADAYBgNVHREEETAPgg1wc3MtbGVhZi50ZXN0MBMGA1UdJQQMMAoG\nCCsGAQUFBwMBMA4GA1UdDwEB/wQEAwIHgDAdBgNVHQ4EFgQULteyJfABRTT+CkpX\nuDPEQ0l19zUwHwYDVR0jBBgwFoAUicFFRlkS15xj01HO1jp+SPGuJaQwQQYJKoZI\nhvcNAQEKMDSgDzANBglghkgBZQMEAgEFAKEcMBoGCSqGSIb3DQEBCDANBglghkgB\nZQMEAgEFAKIDAgEgA4IBAQB47+yW4W2IjGRz+aPeN+96GPDOXSbHYz/XbPOFgSnN\nsuO2AwcqEuE0G0iwqOaL7cCZ5hOyAMm3N/knlPyCVRSFjbxLV+0epzpdV14IJ1cI\nzX1hkhG4vcHg2BNEwL3qox4x+Y3c4YLl30c7LnmVboE/cv9tKiFWRRmNY2Qq3YEE\nZlYGJQSC7sBCZKtbbr7hEwp9rtAMUW65pClt0t/WRMv2gmm5aS6wSEzS5FaHcVu4\nNr9yvVjy22IUsRIr5pjtjTbvOIzPfPBEtWrMuAM0AF/cEP/Oltnol3FkD23kRa1J\nAv+N2T0sAxBikmtXrZXd+HRavsvW1D1+GXOiM0VGXd+t\n-----END CERTIFICATE-----\n",
   "host": "pss-leaf.test",
   "ossl": true,
   "bad": {
    "pem": "-----BEGIN CERTIFICATE-----\nMIIDrTCCAmGgAwIBAgIUe5iD9+KlFQHosgl2b0AkkazI1BkwQQYJKoZIhvcNAQEK\nMDSgDzANBglghkgBZQMEAgEFAKEcMBoGCSqGSIb3DQEBCDANBglghkgBZQMEAgEF\nAKIDAgEgMBMxETAPBgNVBAMMCHBzcy1yb290MB4XDTI2MDEwMTAwMDAwMFoXDTMw\nMDEwMTAwMDAwMFowEzERMA8GA1UEAwwIcHNzLWxlYWYwggEiMA0GCSqGSIb3DQEB\nAQUAA4IBDwAwggEKAoIBAQCkJh9wV+uiWfREgqDbWRslUxRinB/C2a1estL4e3yR\nNr1zeRkdyzmjlD7Qv1rrgciuvXEOsY488cuLp/5dLgf1RAmp+hgOgI2bxvoPRSXz\nK43qQWG//y5t7lCUiPb2qQe+ONVXFeWQts1/PxeINbONC822a/ILGP1lGkgKsM1y\nM0CCb5Jc4vEfmS+SqIav/KQWai6sz2nndiOZnXJMVsZcfUaw6zjG4zkdFFb/WWC1\nvOsOogbb1BV5bh3j2q/4f2GJaAmXrS8HqUPYTUaBte5OcHp07Ogcu5yyPzEbDGIC\nPTr375zAiod7Sv8OYGFViBpcQy3pIuAfPLdMWuEmAuttAgMBAAGjgZAwgY0wDAYD\nVR0TAQH/BAIwADAYBgNVHREEETAPgg1wc3MtbGVhZi50ZXN0MBMGA1UdJQQMMAoG\nCCsGAQUFBwMBMA4GA1UdDwEB/wQEAwIHgDAdBgNVHQ4EFgQULteyJfABRTT+CkpX\nuDPEQ0l19zUwHwYDVR0jBBgwFoAUicFFRlkS15xj01HO1jp+SPGuJaQwQQYJKoZI\nhvcNAQEKMDSgDzANBglghkgBZQMEAgEFAKEcMBoGCSqGSIb3DQEBCDANBglghkgB\nZQMEAgEFAKIDAgEgA4IBAQB47+yW4W2IjGRz+aPeN+96GPDOXSbHYz/XbPOFgSnN\nsuO2AwcqEuE0G0iwqOaL7cCZ5hOyAMm3N/knlPyCVRSFjbxLV+0epzpdV14IJ1cI\nzX1hkhG4vcHg2BNEwL3qox4x+Y3c4YLl30c7LnmVboE/cv9tKiFWRRmNY2Qq3YEE\nZlYGJQSC7sBCZKtbbr7hEwp9rtAMUW65pClt0t/WRMv2gmm5aS6wSEzS5FaHcVu4\nNr9yvVjy22IUsRIr5pjtjTbvOIzPfPBEtWrMuAM0AF/cEP/Oltnol3FkD23kRa1J\nAv+N2T0sAxBikmtXrZXd+HRavsvW1D1+GXOiM0RGXd+t\n-----END CERTIFICATE-----\n",
    "ossl": false
   }
  },
  {
   "name": "ECDSA P-521",
   "root": "-----BEGIN CERTIFICATE-----\nMIICFTCCAXagAwIBAgIUeYd+ZPa5+anQAb8fRcltBYsWfHAwCgYIKoZIzj0EAwQw\nFDESMBAGA1UEAwwJcDUyMS1yb290MB4XDTI2MDEwMTAwMDAwMFoXDTM2MDEwMTAw\nMDAwMFowFDESMBAGA1UEAwwJcDUyMS1yb290MIGbMBAGByqGSM49AgEGBSuBBAAj\nA4GGAAQAFRWeG5H6RoqhQD/rg4nWsQEow2zXkZxcln5KGRUQDtt7EnofP4fbFHiA\nu/LGFZ1k9hLCawkhmCrKOlHlRfMYN2AAGReh6fvJeRFYWaZ700cd3ubSH2O67POs\nyFScRLMZgcn7/fwYcFwPsvOQBFch1aYTBkLj/MZC4ynTUq8+EFZjIc+jYzBhMB0G\nA1UdDgQWBBR21ABHOjpMLq8hGW209Zllvp1hzzAfBgNVHSMEGDAWgBR21ABHOjpM\nLq8hGW209Zllvp1hzzAPBgNVHRMBAf8EBTADAQH/MA4GA1UdDwEB/wQEAwIBBjAK\nBggqhkjOPQQDBAOBjAAwgYgCQgE9/9nxdiiuLkH1yd2LRnoimA98lo/tcYsnAMVK\n0d1UDq3GcJnD6p4QEYQ0/ooAmWdnaMNGeau6+rECWIv5JczUmwJCAUL0Djtxlrf5\nTmIy9TXawnv8AmqaHmjezn5yw4paVMw4ogJtUyyfbnpjhE5G+00qu1DC07wZAxHt\nP2WkMHyu41Pk\n-----END CERTIFICATE-----\n",
   "leaf": "-----BEGIN CERTIFICATE-----\nMIICRDCCAaWgAwIBAgIUEZC0UGvv//QmLtiT4MqZpPPQm7swCgYIKoZIzj0EAwQw\nFDESMBAGA1UEAwwJcDUyMS1yb290MB4XDTI2MDEwMTAwMDAwMFoXDTMwMDEwMTAw\nMDAwMFowFDESMBAGA1UEAwwJcDUyMS1sZWFmMIGbMBAGByqGSM49AgEGBSuBBAAj\nA4GGAAQBUg5jYF0zJW+GH52OBCy6tlga3Y5u9jiG6kU97WzbSGKlC9pe3+qcjApx\npOmnltJgwlW0O60rKLy/4RVtBca1sOwBx0HysHsOii0nSen/QEJAlJ8LLBxm8Sgh\nBV2lHryC88x298pAKgT4vsyJeoBBsSDcBb/e70yFViQ11/ywasTrNiWjgZEwgY4w\nDAYDVR0TAQH/BAIwADAZBgNVHREEEjAQgg5wNTIxLWxlYWYudGVzdDATBgNVHSUE\nDDAKBggrBgEFBQcDATAOBgNVHQ8BAf8EBAMCB4AwHQYDVR0OBBYEFG3vh/zdInla\niALYlFOquh1jKrZcMB8GA1UdIwQYMBaAFHbUAEc6OkwuryEZbbT1mWW+nWHPMAoG\nCCqGSM49BAMEA4GMADCBiAJCAeqiWDCu6KpJl5Q5nBbsdDZ+iIagCw5rGaOoCNEF\nI1RDZyQFCDrrsIoyxmFIzXXH4bhh+uh4uS3BHKiDFE9Mo4QZAkIBzGrxGCGO1goG\nPdOmTjYZFoNvVaLgroTO5DJ+0sF1WZWIeuUCVsT3JRe+aEUj2lcx2RP8nXFS+TPe\nSjxGBBgS5eE=\n-----END CERTIFICATE-----\n",
   "host": "p521-leaf.test",
   "ossl": true,
   "bad": {
    "pem": "-----BEGIN CERTIFICATE-----\nMIICRDCCAaWgAwIBAgIUEZC0UGvv//QmLtiT4MqZpPPQm7swCgYIKoZIzj0EAwQw\nFDESMBAGA1UEAwwJcDUyMS1yb290MB4XDTI2MDEwMTAwMDAwMFoXDTMwMDEwMTAw\nMDAwMFowFDESMBAGA1UEAwwJcDUyMS1sZWFmMIGbMBAGByqGSM49AgEGBSuBBAAj\nA4GGAAQBUg5jYF0zJW+GH52OBCy6tlga3Y5u9jiG6kU97WzbSGKlC9pe3+qcjApx\npOmnltJgwlW0O60rKLy/4RVtBca1sOwBx0HysHsOii0nSen/QEJAlJ8LLBxm8Sgh\nBV2lHryC88x298pAKgT4vsyJeoBBsSDcBb/e70yFViQ11/ywasTrNiWjgZEwgY4w\nDAYDVR0TAQH/BAIwADAZBgNVHREEEjAQgg5wNTIxLWxlYWYudGVzdDATBgNVHSUE\nDDAKBggrBgEFBQcDATAOBgNVHQ8BAf8EBAMCB4AwHQYDVR0OBBYEFG3vh/zdInla\niALYlFOquh1jKrZcMB8GA1UdIwQYMBaAFHbUAEc6OkwuryEZbbT1mWW+nWHPMAoG\nCCqGSM49BAMEA4GMADCBiAJCAeqiWDCu6KpJl5Q5nBbsdDZ+iIagCw5rGaOoCNEF\nI1RDZyQFCDrrsIoyxmFIzXXH4bhh+uh4uS3BHKiDFE9Mo4QZAkIBzGrxGCGO1goG\nPdOmTjYZFoNvVaLgroTO5DJ+0sF1WZWIeuUCVsT3JRe+aEUj2lcx2RP8nXFS+TPe\nSjxGBRgS5eE=\n-----END CERTIFICATE-----\n",
    "ossl": false
   }
  },
  {
   "name": "Ed25519",
   "root": "-----BEGIN CERTIFICATE-----\nMIIBSDCB+6ADAgECAhQtELXxbj6hn0Mj2o5TWYXHRBavxjAFBgMrZXAwEjEQMA4G\nA1UEAwwHZWQtcm9vdDAeFw0yNjAxMDEwMDAwMDBaFw0zNjAxMDEwMDAwMDBaMBIx\nEDAOBgNVBAMMB2VkLXJvb3QwKjAFBgMrZXADIQAMq51Pz2LntdOZ965o5LpF5Yds\nIUY/9F5f1N7EpehdjqNjMGEwHQYDVR0OBBYEFE5NYKGbzeiNw4j0NAt9Ay6B9JDa\nMB8GA1UdIwQYMBaAFE5NYKGbzeiNw4j0NAt9Ay6B9JDaMA8GA1UdEwEB/wQFMAMB\nAf8wDgYDVR0PAQH/BAQDAgEGMAUGAytlcANBALhJdBuZ8Um/GPeQUS07gQz6Yr4B\nuft9LrMUFFIUb9UL8aGaRMnduMO5cgDrqyihCIrz1Ps4quI6zrLe/0HGMwo=\n-----END CERTIFICATE-----\n",
   "leaf": "-----BEGIN CERTIFICATE-----\nMIIBdjCCASigAwIBAgIULta0DAprptDyaCcOAO1b9T+U/gowBQYDK2VwMBIxEDAO\nBgNVBAMMB2VkLXJvb3QwHhcNMjYwMTAxMDAwMDAwWhcNMzAwMTAxMDAwMDAwWjAS\nMRAwDgYDVQQDDAdlZC1sZWFmMCowBQYDK2VwAyEA3wSPpraHlIRXh1e++GfpJrZY\n3L5FVX+6K8mhasGiQSqjgY8wgYwwDAYDVR0TAQH/BAIwADAXBgNVHREEEDAOggxl\nZC1sZWFmLnRlc3QwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDgYDVR0PAQH/BAQDAgeA\nMB0GA1UdDgQWBBQZQ9jwpLWUpximGj4pQQ+yxLhpbTAfBgNVHSMEGDAWgBROTWCh\nm83ojcOI9DQLfQMugfSQ2jAFBgMrZXADQQAnTzeILH0+8meRIDsdoFJz4qoem+mO\ndD6gB2GaigajVAeVbi2GPEroZRdE7Qcwt4qbXB1OOrELOuwdYpjxsBAD\n-----END CERTIFICATE-----\n",
   "host": "ed-leaf.test",
   "ossl": true,
   "bad": {
    "pem": "-----BEGIN CERTIFICATE-----\nMIIBdjCCASigAwIBAgIULta0DAprptDyaCcOAO1b9T+U/gowBQYDK2VwMBIxEDAO\nBgNVBAMMB2VkLXJvb3QwHhcNMjYwMTAxMDAwMDAwWhcNMzAwMTAxMDAwMDAwWjAS\nMRAwDgYDVQQDDAdlZC1sZWFmMCowBQYDK2VwAyEA3wSPpraHlIRXh1e++GfpJrZY\n3L5FVX+6K8mhasGiQSqjgY8wgYwwDAYDVR0TAQH/BAIwADAXBgNVHREEEDAOggxl\nZC1sZWFmLnRlc3QwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDgYDVR0PAQH/BAQDAgeA\nMB0GA1UdDgQWBBQZQ9jwpLWUpximGj4pQQ+yxLhpbTAfBgNVHSMEGDAWgBROTWCh\nm83ojcOI9DQLfQMugfSQ2jAFBgMrZXADQQAnTzeILH0+8meRIDsdoFJz4qoem+mO\ndD6gB2GaigajVAeVbi2GPEroZRdE7Qcwt4qbXB1OOrELOuwdYpnxsBAD\n-----END CERTIFICATE-----\n",
    "ossl": false
   }
  }
 ],
 "issuedSubject": "CN=dev.local,O=\\<b id=\\\"cl-xss\\\"\\>注入\\</b\\>"
};

const OPENSSL = process.env.CL_OPENSSL || ''
const DAY = 86400000
const TABS = ['inspect', 'asn1', 'chain', 'issue', 'keys', 'watch', 'errors']

// ── 独立 DER 拆包（不调用页面引擎）──
function tlv(b, o = 0) {
  const tag = b[o]; let len = b[o + 1], hl = 2
  if (len & 0x80) { const n = len & 0x7f; len = 0; for (let i = 0; i < n; i++) len = len * 256 + b[o + 2 + i]; hl = 2 + n }
  return { tag, hl, len, start: o, cs: o + hl, end: o + hl + len }
}
function kids(b, t) { const out = []; let o = t.cs; while (o < t.end) { const c = tlv(b, o); out.push(c); o = c.end } return out }
function pemToDer(pem, label) {
  const re = new RegExp(`-----BEGIN ${label}-----([\\s\\S]*?)-----END ${label}-----`)
  const m = re.exec(pem); if (!m) return null
  return Buffer.from(m[1].replace(/\s+/g, ''), 'base64')
}
function pemBodies(text) { return [...String(text).matchAll(/-----BEGIN ([A-Z ]+)-----([\s\S]*?)-----END \1-----/g)].map((m) => ({ label: m[1], b64: m[2].replace(/\s+/g, '') })) }

export default async ({ page, toolURL, screenshot, assert }) => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cert-lab-'))
  const errs = []
  page.on('pageerror', (e) => errs.push(String(e)))
  await page.clock.setFixedTime(new Date(ORACLE.meta.t0))
  await page.goto(toolURL)
  await page.evaluate(() => localStorage.clear())
  await page.reload()
  await page.waitForFunction(() => window.CL_APP && window.CertLab)

  const onTab = async (t) => {
    await page.click(`#cl-tab-${t}`)
    await page.waitForFunction((t) => !document.getElementById('cl-pane-' + t).hidden, t)
  }
  const text = (sel) => page.$eval(sel, (n) => n.textContent)
  const done = (sel) => page.waitForFunction((s) => { const n = document.querySelector(s); return n && n.dataset.state === 'done' }, sel, { timeout: 30000 })
  const download = async (sel) => {
    const [d] = await Promise.all([page.waitForEvent('download'), page.click(sel)])
    const p = path.join(tmp, d.suggestedFilename())
    await d.saveAs(p)
    return { name: d.suggestedFilename(), path: p, buf: fs.readFileSync(p) }
  }
  const pick = async (v) => { await page.selectOption('#cl-sample', ''); await page.selectOption('#cl-sample', v); await page.waitForFunction(() => document.querySelectorAll('#cl-items .cl-item').length > 0) }
  const canon = (o) => JSON.stringify(Object.keys(o).sort().map((k) => [k, o[k]]))
  // 签发方式是「卡片式单选」：真的点卡片（label），再断言单选框确实选中了
  const setMode = async (v) => { await page.click(`.cl-mode:has(#cl-is-mode-${v})`); assert(await page.$eval(`#cl-is-mode-${v}`, (n) => n.checked), '点卡片应选中 ' + v) }
  const items = () => page.$$eval('#cl-items .cl-item', (ns) => ns.map((n) => ({ kind: n.querySelector('[data-kind]').dataset.kind, t: n.querySelector('b').textContent, pressed: n.getAttribute('aria-pressed') })))
  const setTime = (ms) => page.$eval('#cl-ch-time', (el, ms) => { const d = new Date(ms - new Date(ms).getTimezoneOffset() * 60000); el.value = d.toISOString().slice(0, 19) }, ms)
  const runChain = async () => { await page.click('#cl-ch-run'); await done('#cl-ch-out'); return page.$eval('#cl-ch-verdict', (n) => n.dataset.ok === 'true') }
  const codes = () => page.$$eval('#cl-ch-problems [data-code]', (ns) => ns.map((n) => n.dataset.code))
  const cap = {}

  // ═════ 1. 解析：打乱顺序的 fullchain ═════
  await pick('chain')
  let it = await items()
  assert(it.length === 3 && it.every((x) => x.kind === 'cert'), `fullchain 应识别出 3 张证书，实得 ${JSON.stringify(it)}`)
  assert(it[0].t === 'Cert Lab Demo TLS CA 2025' && it[1].t === 'shop.example.com' && it[2].t === 'Cert Lab Demo Root CA', '对象列表顺序应与粘贴顺序一致')
  assert(await text('#cl-tab-n-inspect') === '3', '解析页签计数应为 3')
  cap.PEM = true
  await page.click('#cl-item-1')
  await page.waitForFunction((v) => document.getElementById('cl-fp-sha256') && document.getElementById('cl-fp-sha256').textContent === v, ORACLE.leaf.sha256)
  assert(await text('#cl-d-cn') === ORACLE.leaf.nodeCN, 'CN 应与 Node X509Certificate 一致')
  assert(await text('#cl-fp-sha1') === ORACLE.leaf.sha1, `SHA-1 指纹应等于 openssl：${ORACLE.leaf.sha1}`)
  assert(await text('#cl-fp-spkiSha256') === 'sha256//' + ORACLE.leaf.pin, 'SPKI 钉扎哈希应等于 openssl pkey | dgst')
  assert((await text('#cl-d-serial')).includes(ORACLE.leaf.serial), '序列号应等于 cryptography 的十六进制')
  const sans = await page.$$eval('#cl-d-sans .cl-san', (ns) => ns.map((n) => n.textContent))
  assert(JSON.stringify(sans) === JSON.stringify(ORACLE.leaf.san), `SAN 应等于 cryptography：${sans} vs ${ORACLE.leaf.san}`)
  const rfc = await page.$$eval('[data-rfc4514]', (ns) => ns.map((n) => n.textContent))
  assert(rfc[0] === ORACLE.leaf.subject && rfc[1] === ORACLE.leaf.issuer, `RFC 4514 名称应与 cryptography 逐字节一致：${rfc}`)
  const leftDays = Math.floor((ORACLE.leaf.na - ORACLE.meta.t0) / DAY)
  assert(await text('#cl-d-status') === '有效 · 剩 ' + leftDays + ' 天', `剩余天数应为 ${leftDays}，实得 ${await text('#cl-d-status')}`)
  const extNames = await page.$$eval('#cl-d-exts .cl-ext', (ns) => ns.map((n) => n.dataset.ext))
  assert(extNames.length === ORACLE.leaf.nExt, `扩展数应为 ${ORACLE.leaf.nExt}，实得 ${extNames.length}`)
  assert(await page.$eval('#cl-d-lint .cl-msg', (n) => n.classList.contains('cl-msg-ok')), '合规叶子证书的体检应为「没发现问题」')
  // 有效期进度条的几何：「现在」标记的位置 = (t0 - nb) / (na - nb)
  const geo = await page.evaluate(() => { const bar = document.querySelector('.cl-life-bar').getBoundingClientRect(); const m = document.getElementById('cl-life-now').getBoundingClientRect(); return { x: (m.left + m.width / 2 - bar.left) / bar.width, h: m.height, vis: getComputedStyle(document.getElementById('cl-life-now')).display } })
  const want = (ORACLE.meta.t0 - ORACLE.leaf.nb) / (ORACLE.leaf.na - ORACLE.leaf.nb)
  assert(Math.abs(geo.x - want) < 0.01 && geo.h >= 10 && geo.vis !== 'none', `有效期「现在」标记应在 ${want.toFixed(3)} 处，实得 ${geo.x.toFixed(3)}`)
  // 键盘：对象列表 ↓ 选到根证书
  await page.focus('#cl-item-1'); await page.keyboard.press('ArrowDown')
  it = await items()
  assert(it[2].pressed === 'true' && await text('#cl-d-cn') === 'Cert Lab Demo Root CA', '对象列表 ↓ 应选中下一张')
  await page.click('#cl-item-1')
  // 下载 PEM / DER，与 openssl 的 DER 逐字节比
  const dPem = await download('[data-act="pem"]')
  assert(pemToDer(dPem.buf.toString(), 'CERTIFICATE').toString('base64') === ORACLE.leaf.derB64, '下载的 PEM 应与 openssl 导出的 DER 一致')
  const dDer = await download('[data-act="der"]')
  assert(dDer.buf.toString('base64') === ORACLE.leaf.derB64 && dDer.name.endsWith('.cer'), '下载的 DER 应与 openssl 一致')

  // ═════ 2. 解析：其他输入形态 ═════
  // DER 文件 + PKCS#7（.p7b）文件
  await page.click('#cl-clear')
  await page.setInputFiles('#cl-file', [{ name: 'leaf.cer', mimeType: 'application/pkix-cert', buffer: Buffer.from(ORACLE.leaf.derB64, 'base64') }, { name: 'chain.p7b', mimeType: 'application/x-pkcs7-certificates', buffer: Buffer.from(ORACLE.p7bB64, 'base64') }])
  await page.waitForFunction(() => document.querySelectorAll('#cl-items .cl-item').length === 4)
  it = await items()
  assert(it.every((x) => x.kind === 'cert') && it[0].t === 'shop.example.com', `DER + p7b 应得 4 张证书：${JSON.stringify(it)}`)
  cap.DER = true; cap['PKCS#7'] = true
  // base64 / 十六进制裸数据
  await page.fill('#cl-in', ORACLE.root.derB64); await page.click('#cl-parse')
  assert((await items())[0].t === 'Cert Lab Demo Root CA', '裸 base64 应识别为证书')
  await page.fill('#cl-in', Buffer.from(ORACLE.root.derB64, 'base64').toString('hex').replace(/(..)/g, '$1:')); await page.click('#cl-parse')
  assert((await items())[0].t === 'Cert Lab Demo Root CA', '冒号分隔十六进制应识别为证书')
  // 截断 / 垃圾输入：报错而不是崩
  await page.fill('#cl-in', '-----BEGIN CERTIFICATE-----\n' + ORACLE.leaf.derB64.slice(0, 200) + '\n-----END CERTIFICATE-----'); await page.click('#cl-parse')
  const det = await text('#cl-detail')
  assert((await items())[0].t === '解析失败' && (det.includes('截断') || det.includes('超出')), '截断的证书应报「截断 / 超出范围」：' + det.slice(0, 80))
  await page.fill('#cl-in', 'hello, this is not a certificate'); await page.click('#cl-parse')
  assert((await text('#cl-in-msgs')).includes('没找到 PEM 块'), '垃圾输入应提示没找到 PEM')
  // 老旧设备证书：体检报 SHA-1、RSA 1024、缺 SAN
  await pick('legacy')
  const lint = await page.$$eval('#cl-d-lint .cl-msg', (ns) => ns.map((n) => n.dataset.level + ':' + n.textContent))
  assert(lint.some((l) => /^error:.*SHA-1/.test(l)) && lint.some((l) => /^error:.*RSA 1024/.test(l)) && lint.some((l) => /^error:.*没有 SAN/.test(l)), `老旧证书体检应报 SHA-1 / RSA 1024 / 无 SAN：${lint}`)
  assert(rfc.length && (await page.$$eval('[data-rfc4514]', (ns) => ns[0].textContent)) === ORACLE.legacy.subject, '老旧证书使用者名称应与 cryptography 一致')
  // CSR：自签名有效 + SAN
  await pick('csr')
  await page.waitForFunction(() => document.getElementById('cl-csr-sig').dataset.ok === 'true')
  assert(JSON.stringify(await page.$$eval('#cl-d-sans .cl-san', (ns) => ns.map((n) => n.textContent))) === JSON.stringify(ORACLE.csr.san), 'CSR 的 SAN 应与 cryptography 一致')
  assert(ORACLE.csr.verify.includes('verify OK'), 'openssl 也应判 CSR 自签名有效')
  assert(await page.$eval('[data-rfc4514]', (n) => n.textContent) === ORACLE.csr.subject, 'CSR 使用者应与 cryptography 一致')
  // CRL：与过期证书 + 签发 CA 一起贴，核对签名与吊销
  await page.fill('#cl-in', await page.evaluate(() => CL_SAMPLES.crl + CL_SAMPLES.expired)); await page.click('#cl-parse')
  await page.click('#cl-item-0')
  await page.waitForFunction(() => /CRL 签名有效/.test(document.getElementById('cl-crl-msgs').textContent))
  const crlRows = await page.$$eval('#cl-crl-table tbody tr', (ns) => ns.map((r) => r.children[0].textContent + '|' + r.children[2].textContent))
  assert(JSON.stringify(crlRows) === JSON.stringify(ORACLE.crl.revoked.map((r) => r.serial + '|' + r.reason.replace(/_(.)/g, (m, c) => c.toUpperCase()))), `CRL 条目应与 cryptography 一致：${crlRows}`)
  assert((await text('#cl-crl-msgs')).includes('「old.example.com」（序列号 3a0001）已被吊销：keyCompromise'), '过期证书应被认出已吊销')
  assert(ORACLE.crl.sigOk.includes('verify OK'), 'openssl 也应判 CRL 签名有效')
  // 密钥样例：SEC1 + 加密 PKCS#8 + 证书 → 配对
  await pick('keys')
  it = await items()
  assert(JSON.stringify(it.map((x) => x.kind)) === JSON.stringify(['private-key', 'encrypted-key', 'cert']), `应识别出 私钥 / 加密私钥 / 证书：${it.map((x) => x.kind)}`)
  await page.waitForFunction(() => /是一对/.test(document.getElementById('cl-d-keymatch').textContent))

  // ═════ 3. ASN.1 结构 ═════
  await pick('chain'); await page.click('#cl-item-1'); await page.click('[data-act="asn1"]')
  await page.waitForFunction(() => document.querySelectorAll('#cl-asn-tree li').length > 10)
  const asn = await page.$$eval('#cl-asn-tree li', (ns) => ({ all: ns.length, plain: ns.filter((n) => !n.dataset.enc).length, root: [ns[0].dataset.hl, ns[0].dataset.len] }))
  assert(asn.plain === ORACLE.leaf.asnLines, `不含内嵌展开的结点数应等于 openssl asn1parse 行数 ${ORACLE.leaf.asnLines}，实得 ${asn.plain}`)
  assert(asn.all > asn.plain, '扩展里 OCTET STRING 包着的 DER 应被展开')
  assert(+asn.root[0] === ORACLE.leaf.asnHl && +asn.root[1] === ORACLE.leaf.asnLen, `根结点头长 / 内容长应等于 openssl（${ORACLE.leaf.asnHl}/${ORACLE.leaf.asnLen}）`)
  // 选中结点 ↔ 十六进制高亮：内容字节数 = 结点长度
  const hx = await page.evaluate(() => ({ h: document.querySelectorAll('#cl-asn-hex .cl-hx-h').length, c: document.querySelectorAll('#cl-asn-hex .cl-hx-c').length }))
  assert(hx.h === ORACLE.leaf.asnHl && hx.c === ORACLE.leaf.derLen - ORACLE.leaf.asnHl, `根结点高亮应为头 ${ORACLE.leaf.asnHl} + 内容 ${ORACLE.leaf.derLen - ORACLE.leaf.asnHl} 字节，实得 ${hx.h}+${hx.c}`)
  await page.focus('#cl-tn-0'); for (let k = 0; k < 3; k++) await page.keyboard.press('ArrowDown')
  const sel2 = await page.$eval('#cl-asn-tree [aria-selected="true"]', (n) => ({ i: n.dataset.i, len: +n.dataset.len, v: n.querySelector('.cl-tn-v').textContent }))
  const hx2 = await page.evaluate(() => document.querySelectorAll('#cl-asn-hex .cl-hx-c').length)
  assert(sel2.i === '3' && sel2.v === '2' && hx2 === 1 && sel2.len === 1, `↓↓↓ 应选到版本号 INTEGER 2 且高亮 1 字节，实得 ${JSON.stringify(sel2)}/${hx2}`)
  await page.keyboard.press('ArrowLeft')
  assert(await page.$eval('#cl-asn-tree [aria-selected="true"]', (n) => n.dataset.i) === '2', '← 在叶结点上应回到父结点 [0]')
  await page.keyboard.press('ArrowLeft')
  assert(await page.$eval('#cl-tn-2', (n) => n.getAttribute('aria-expanded')) === 'false' && await page.$eval('#cl-tn-2 > ul', (n) => getComputedStyle(n).display) === 'none', '← 在展开结点上应折叠（计算样式 none）')
  const sanNode = await page.$$eval('#cl-asn-tree li[data-enc] .cl-tn-v', (ns) => ns.map((n) => n.textContent).filter((t) => t === 'shop.example.com').length)
  assert(sanNode >= 1, 'SAN 扩展里的 dNSName 应在展开的结构里可见')

  // ═════ 4. 证书链 ═════
  await onTab('inspect'); await page.click('#cl-item-1'); await page.click('[data-act="chain"]'); await done('#cl-ch-out')
  assert(await page.$eval('#cl-ch-leaf', (n) => n.value) === '1', '叶子应自动识别为第 2 张')
  assert(await page.$eval('#cl-ch-host', (n) => n.value) === 'shop.example.com', '主机名应自动填入叶子的第一个 DNS SAN')
  assert(!(await page.$eval('#cl-ch-verdict', (n) => n.dataset.ok === 'true')) && (await codes()).includes('untrusted') && !ORACLE.chainMozOnly.ok, '只信任 Mozilla 根时，私有根应判不受信任（openssl 同判失败）')
  await page.check('#cl-ch-trustpasted')
  assert(await runChain(), '信任贴入的自签名根后应通过')
  const links = await page.$$eval('#cl-ch-links .cl-link', (ns) => ns.map((n) => n.querySelector('.cl-pill').textContent + ':' + n.querySelector('b').textContent))
  assert(JSON.stringify(links) === JSON.stringify(['叶子:shop.example.com', '中间 CA:Cert Lab Demo TLS CA 2025', '信任锚:Cert Lab Demo Root CA']), `链应理顺为 叶子 → 中间 → 根：${links}`)
  const hints = await text('#cl-ch-hints')
  assert(hints.includes('叶子证书不在第一个位置') && hints.includes('多发了根证书'), '应提示叶子不在首位、多发了根证书')
  const fc = pemBodies(await text('#cl-ch-fixed')).map((x) => x.b64)
  assert(JSON.stringify(fc) === JSON.stringify([ORACLE.leaf.derB64, ORACLE.inter.derB64]), '修好的链应为 叶子 + 中间证书（不含根），DER 与 openssl 一致')
  const dFull = await download('#cl-ch-dl')
  assert(dFull.name === 'fullchain.pem' && JSON.stringify(pemBodies(dFull.buf.toString()).map((x) => x.b64)) === JSON.stringify(fc), '下载的 fullchain.pem 应与页面一致')
  // 每条链路上的检查都是 ✓，且签名检查真的做了
  const chk = await page.$$eval('#cl-ch-links .cl-chk', (ns) => ns.map((n) => n.dataset.ok + ':' + n.textContent))
  assert(chk.every((c) => c.startsWith('true:')) && chk.filter((c) => c.includes('签名')).length === 2, `每级检查都应通过且做了 2 次验签：${chk}`)
  // 主机名：与 openssl -verify_hostname / -verify_ip 逐个对拍
  for (const h of ORACLE.hosts) {
    await page.fill('#cl-ch-host', h.host)
    const ok = await runChain()
    assert(ok === h.ok, `主机名 ${h.host}：页面 ${ok}，openssl ${h.ok}（${h.out}）`)
    if (!ok) assert((await codes()).includes('hostname'), `${h.host} 失败原因应是 hostname`)
  }
  // 时间旅行：2028 年叶子已过期（openssl -attime 同判 error 10）
  await page.fill('#cl-ch-host', 'shop.example.com'); await setTime(Date.parse('2028-01-01T00:00:00Z'))
  assert(!(await runChain()) && (await codes())[0] === 'expired' && !ORACLE.chainLate.ok && /error 10/.test(ORACLE.chainLate.out), '2028 年应判过期，与 openssl error 10 一致')
  await setTime(ORACLE.meta.t0)
  // 用途：服务器证书拿去做 mTLS 客户端 → EKU 不符
  await page.selectOption('#cl-ch-purpose', 'clientAuth')
  assert(!(await runChain()) && (await codes()).includes('eku'), '叶子只有 serverAuth，按 clientAuth 验应报 EKU')
  await page.selectOption('#cl-ch-purpose', 'serverAuth')
  // 只贴叶子：找不到签发者，并给出 AIA 地址
  await page.fill('#cl-ch-in', await page.evaluate(() => CL_SAMPLES.leaf_only)); await page.fill('#cl-ch-roots', await page.evaluate(() => CL_SAMPLES.root))
  await page.dispatchEvent('#cl-ch-in', 'input')
  assert(!(await runChain()) && (await codes())[0] === 'issuer-not-found' && (await text('#cl-ch-problems')).includes('http://pki.example.com/tls-ca-2025.crt'), '缺中间证书应报找不到签发者并给出 AIA 下载地址')
  // 过期样例 / 名称约束样例：与 openssl 的错误码一致
  await page.fill('#cl-ch-host', '')
  await page.fill('#cl-ch-in', await page.evaluate(() => CL_SAMPLES.expired)); await page.dispatchEvent('#cl-ch-in', 'input')
  assert(!(await runChain()) && (await codes()).includes('expired') && /error 10/.test(ORACLE.expiredV.out), '过期样例应报 expired（openssl error 10）')
  await page.fill('#cl-ch-in', await page.evaluate(() => CL_SAMPLES.nc)); await page.dispatchEvent('#cl-ch-in', 'input')
  assert(!(await runChain()) && (await codes()).includes('name-constraints') && (await text('#cl-ch-problems')).includes('evil.example.net') && /error 47/.test(ORACLE.ncV.out), '名称约束样例应报 name-constraints（openssl error 47 permitted subtree violation）')
  // 真实世界：github.com / letsencrypt.org 用内置 Mozilla 根验（抓取时刻）
  await page.fill('#cl-ch-roots', ''); await page.uncheck('#cl-ch-trustpasted')
  await setTime(Date.parse(ORACLE.meta.captured))
  for (const [k, host, truth] of [['github', 'github.com', ORACLE.githubV], ['letsencrypt', 'letsencrypt.org', ORACLE.letsencryptV]]) {
    await page.fill('#cl-ch-in', await page.evaluate((k) => CL_SAMPLES[k], k)); await page.dispatchEvent('#cl-ch-in', 'input')
    await page.fill('#cl-ch-host', host)
    assert(await runChain() === truth.ok && truth.ok, `${host} 应受 Mozilla 根信任（openssl：${truth.ok}）`)
    const n = await page.$$eval('#cl-ch-links .cl-link', (ns) => ns.length)
    assert(n === truth.chainLen, `${host} 的链长应等于 openssl -show_chain 的 ${truth.chainLen}，实得 ${n}`)
    if (k === 'github') {
      await page.fill('#cl-ch-host', 'example.com')
      assert(!(await runChain()) && (await codes()).includes('hostname') && !ORACLE.githubBadHost.ok, 'github.com 的证书不覆盖 example.com（openssl 同判失败）')
    }
  }
  // 页脚声明的验签算法：RSA-PSS / ECDSA P-521 / Ed25519（openssl 现签的私有链），并各翻一位确认会红
  await setTime(ORACLE.meta.t0)
  for (const a of ORACLE.algs) {
    await page.fill('#cl-ch-in', a.leaf); await page.dispatchEvent('#cl-ch-in', 'input'); await page.fill('#cl-ch-roots', a.root); await page.fill('#cl-ch-host', a.host)
    const ok = await runChain()
    assert(ok === a.ossl && ok, `${a.name} 链应验证通过（openssl：${a.ossl}）`)
    cap['验签 ' + a.name] = ok
    await page.fill('#cl-ch-in', a.bad.pem); await page.dispatchEvent('#cl-ch-in', 'input')
    assert(!(await runChain()) && (await codes()).includes('signature') && !a.bad.ossl, `${a.name} 签名翻一位后应报 signature（openssl：${a.bad.ossl}）`)
  }
  await page.fill('#cl-ch-roots', '')

  // ═════ 5. 签发：本地 CA + 服务器证书（结果交给 Node X509Certificate / openssl 复核）═════
  await onTab('issue')
  await page.fill('#cl-is-names', 'dev.local\n*.dev.local\n127.0.0.1\n::1')
  await page.fill('#cl-is-o', '<b id="cl-xss">注入</b>')
  await page.check('#cl-is-eku-client')
  await page.click('#cl-is-run'); await done('#cl-is-out')
  assert(await page.$eval('#cl-is-check', (n) => n.dataset.ok) === 'true', '签发后自检应通过')
  const files = await page.$$eval('#cl-is-files .cl-file', (ns) => ns.map((n) => n.dataset.file))
  assert(JSON.stringify(files) === JSON.stringify(['cert.pem', 'key.pem', 'ca.pem', 'ca-key.pem']), `应产出 4 个文件：${files}`)
  const fCert = await download('#cl-is-files [data-file="cert.pem"] [data-dl]')
  const fKey = await download('#cl-is-files [data-file="key.pem"] [data-dl]')
  const fCa = await download('#cl-is-files [data-file="ca.pem"] [data-dl]')
  const x = new crypto.X509Certificate(fCert.buf), xca = new crypto.X509Certificate(fCa.buf)
  assert(x.verify(xca.publicKey) && x.checkIssued(xca), 'Node：服务器证书应由 CA 签发且验签通过')
  assert(x.checkHost('dev.local') === 'dev.local' && x.checkHost('api.dev.local') === '*.dev.local' /* Node 返回命中的 SAN 模式本身 */ && !x.checkHost('a.b.dev.local') && x.checkIP('127.0.0.1') === '127.0.0.1' && x.checkIP('::1'), 'Node：SAN 应覆盖 dev.local / *.dev.local / 127.0.0.1 / ::1')
  assert(x.ca === false && xca.ca === true, 'Node：叶子 CA:FALSE、根 CA:TRUE')
  assert(JSON.stringify(x.keyUsage) === JSON.stringify(['1.3.6.1.5.5.7.3.1', '1.3.6.1.5.5.7.3.2']), `Node：EKU 应为 serverAuth + clientAuth：${x.keyUsage}`)
  assert(x.checkPrivateKey(crypto.createPrivateKey(fKey.buf)), 'Node：key.pem 应与 cert.pem 配对')
  assert(x.toLegacyObject().subject.O === '<b id="cl-xss">注入</b>', 'O 字段应原样写进证书')
  assert(Math.round((Date.parse(x.validTo) - Date.parse(x.validFrom)) / DAY) === 397, '默认有效期应为 397 天')
  if (OPENSSL) {
    const r = execFileSync(OPENSSL, ['verify', '-CAfile', fCa.path, '-purpose', 'sslserver', '-verify_hostname', 'api.dev.local', '-attime', String(Math.floor(ORACLE.meta.t0 / 1000)), fCert.path], { encoding: 'utf8' })
    assert(/OK/.test(r), 'openssl verify 应通过：' + r)
  }
  cap.ECDSA = true
  // 在「解析」页打开：HTML 注入必须被当成文本
  await page.click('#cl-is-files [data-file="cert.pem"] [data-insp]')
  await page.waitForFunction(() => !document.getElementById('cl-pane-inspect').hidden && document.querySelectorAll('#cl-items .cl-item').length === 4)
  assert(await page.$('#cl-xss') === null && (await text('#cl-detail')).includes('<b id="cl-xss">注入</b>'), '证书里的 HTML 必须原样显示、不能被渲染')
  assert(await page.$eval('[data-rfc4514]', (n) => n.textContent) === ORACLE.issuedSubject, `签发证书的 RFC 4514 主体应与 cryptography 一致：${ORACLE.issuedSubject}`)
  // CA 已保存 → 刷新后仍在 → 用它签 CSR 样例
  await page.reload(); await page.waitForFunction(() => window.CL_APP)
  await onTab('issue')
  const caOpts = await page.$$eval('#cl-is-ca option', (ns) => ns.map((n) => n.textContent))
  assert(caOpts.length === 2 && caOpts[1].startsWith('Cert Lab 本地开发 CA'), `刷新后已保存的 CA 应还在：${caOpts}`)
  await setMode('sign-csr')
  assert(await page.$eval('#cl-is-names-wrap', (n) => getComputedStyle(n).display) === 'none' && await page.$eval('#cl-is-csr-wrap', (n) => getComputedStyle(n).display) !== 'none', '签 CSR 模式应隐藏域名框、显示 CSR 框（计算样式）')
  await page.fill('#cl-is-csr', await page.evaluate(() => CL_SAMPLES.csr))
  await page.click('#cl-is-run'); await done('#cl-is-out')
  const sCert = await download('#cl-is-files [data-file="cert.pem"] [data-dl]')
  const sCa = await download('#cl-is-files [data-file="ca.pem"] [data-dl]')
  const xs = new crypto.X509Certificate(sCert.buf)
  const xsub = xs.toLegacyObject().subject
  assert(xs.verify(new crypto.X509Certificate(sCa.buf).publicKey) && xs.checkHost('api.pay.example.com') && xsub.CN === 'pay.example.com' && xsub.L === '上海', 'Node：用已保存的 CA 签 CSR，主体与 SAN 应取自 CSR')
  assert(sCa.buf.toString() === fCa.buf.toString(), '签 CSR 应复用同一个已保存的 CA')
  // 只生成 CSR（RSA 2048）：Node crypto 独立验 CSR 自签名
  await setMode('csr'); await page.fill('#cl-is-names', 'intranet.corp.example'); await page.selectOption('#cl-is-key', 'RSA:2048')
  await page.click('#cl-is-run'); await done('#cl-is-out')
  const fCsr = await download('#cl-is-files [data-file="request.csr"] [data-dl]')
  const csrDer = pemToDer(fCsr.buf.toString(), 'CERTIFICATE REQUEST')
  const cTop = tlv(csrDer), [cri, , sigBits] = kids(csrDer, cTop), criKids = kids(csrDer, cri)
  const spkiNode = criKids[2]
  const pub = crypto.createPublicKey({ key: csrDer.subarray(spkiNode.start, spkiNode.end), format: 'der', type: 'spki' })
  const okCsr = crypto.verify('sha256', csrDer.subarray(cri.start, cri.end), pub, csrDer.subarray(sigBits.cs + 1, sigBits.end))
  assert(okCsr && pub.asymmetricKeyDetails.modulusLength === 2048 && csrDer[criKids[0].cs] === 0, 'Node：CSR 的 RSA 2048 自签名应有效、版本为 0')
  assert(csrDer.includes(Buffer.from('intranet.corp.example')) && criKids[3].tag === 0xa0, 'CSR 应带 extensionRequest 与 SAN')
  if (OPENSSL) assert(/verify OK/.test(execFileSync(OPENSSL, ['req', '-in', fCsr.path, '-noout', '-verify'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })), 'openssl req -verify 应通过')
  cap.RSA = true
  // 自签名 Ed25519
  await setMode('self'); await page.fill('#cl-is-names', 'ed.local'); await page.selectOption('#cl-is-key', 'Ed25519')
  await page.click('#cl-is-run'); await done('#cl-is-out')
  const fEd = await download('#cl-is-files [data-file="cert.pem"] [data-dl]')
  const xe = new crypto.X509Certificate(fEd.buf)
  assert(xe.publicKey.asymmetricKeyType === 'ed25519' && xe.verify(xe.publicKey) && xe.checkHost('ed.local'), 'Node：Ed25519 自签名证书应自验通过')
  cap.Ed25519 = true
  // 表单校验
  await page.fill('#cl-is-names', 'bad..domain\nfoo.*.example'); await page.fill('#cl-is-c', '中国'); await page.click('#cl-is-run') /* 输入框 maxlength=2，「China」会被截成 Ch，故用两个汉字 */
  const ism = await text('#cl-is-msgs')
  assert(ism.includes('「bad..domain」不是合法的域名') && ism.includes('foo.*.example') && ism.includes('两位字母'), `非法输入应逐条报错：${ism}`)
  await page.fill('#cl-is-c', '')

  // ═════ 6. 密钥 ═════
  await onTab('keys')
  // 连同根证书一起贴：配对检查必须分得清「是一对」与「不是」（2026-11-07 改坏 M36 首轮 GREEN：只贴一张证书时「恒判配对」也是绿的）
  await page.fill('#cl-k-in', await page.evaluate(() => CL_SAMPLES.leaf_key_sec1 + CL_SAMPLES.leaf_only + CL_SAMPLES.root))
  await page.click('#cl-k-run'); await done('#cl-k-out')
  const blk = (id) => page.$eval(`#cl-k-fmt-${id} pre`, (n) => n.textContent)
  assert(await blk('pkcs8') === ORACLE.key.pkcs8Pem, 'PKCS#8 应与 openssl pkcs8 -topk8 逐字节一致')
  assert(await blk('sec1') === ORACLE.key.sec1Pem, 'SEC1 应与 openssl ec 逐字节一致')
  assert(await blk('spki') === ORACLE.key.spkiPem, '公钥应与 openssl pkey -pubout 一致')
  assert(JSON.stringify(JSON.parse(await blk('jwk'))) === JSON.stringify({ kty: 'EC', crv: 'P-256', x: ORACLE.key.jwk.x, y: ORACLE.key.jwk.y, d: ORACLE.key.jwk.d }) && ORACLE.key.jwk.kty === 'EC', '私钥 JWK 应与 Node KeyObject.export 一致')
  assert(JSON.stringify(JSON.parse(await blk('jwkpub'))) === JSON.stringify({ kty: 'EC', crv: 'P-256', x: ORACLE.key.pubJwk.x, y: ORACLE.key.pubJwk.y }), '公钥 JWK 应与 Node 一致')
  assert((await page.$eval('#cl-k-fmt-jwkpub .cl-note', (n) => n.textContent)).endsWith(ORACLE.key.thumb), 'JWK 指纹应等于 RFC 7638 独立计算')
  assert(await blk('ssh') === ORACLE.key.ssh + ' cert-lab', 'OpenSSH 公钥行应与 ssh-keygen -i 一致')
  assert((await page.$eval('#cl-k-fmt-ssh .cl-note', (n) => n.textContent)).endsWith(ORACLE.key.sshFp), 'SSH 指纹应与 ssh-keygen -lf 一致')
  assert(await text('#cl-k-pin') === 'sha256//' + ORACLE.key.pin && ORACLE.key.pin === ORACLE.leaf.pin, '公钥钉扎应与证书的一致')
  assert(await page.$eval('#cl-k-match [data-match="true"]', (n) => n.textContent.includes('shop.example.com')), '应认出与 shop.example.com 是一对')
  const mm = await page.$$eval('#cl-k-match [data-match]', (ns) => ns.map((n) => n.dataset.match + ':' + n.textContent))
  assert(mm.length === 2 && mm[0].startsWith('true:') && mm[0].includes('shop.example.com') && mm[1].startsWith('false:') && mm[1].includes('Cert Lab Demo Root CA'), `应判叶子是一对、根证书不是：${mm}`)
  cap['PKCS#8'] = true; cap.JWK = true; cap.OpenSSH = true
  // 加密私钥：没口令 → 提示；错口令 → 报错；对口令 → 解出与 openssl 一致
  await page.fill('#cl-k-in', await page.evaluate(() => CL_SAMPLES.leaf_key_enc)); await page.click('#cl-k-run'); await done('#cl-k-out')
  assert((await text('#cl-k-sum')).includes('aes-256-cbc') && (await text('#cl-k-sum')).includes('迭代 2048 次'), '应显示 PBES2 参数（与 openssl asn1parse：' + ORACLE.key.encParams.join(' ') + '）')
  await page.fill('#cl-k-pass', 'wrong-pass'); await page.click('#cl-k-decrypt'); await done('#cl-k-out')
  assert((await text('#cl-k-msgs')).includes('口令不对'), '错口令应报「口令不对」')
  await page.fill('#cl-k-pass', 'cert-lab-demo'); await page.click('#cl-k-decrypt'); await done('#cl-k-out')
  assert(pemToDer(await blk('pkcs8'), 'PRIVATE KEY').toString('base64') === ORACLE.key.encDecryptsTo, '解密结果应与 openssl pkcs8 -passin 一致')
  // 加密导出：Node（OpenSSL）用同一口令解得回原 PKCS#8
  await page.fill('#cl-k-iter', '2048'); await page.selectOption('#cl-k-cipher', 'aes-128-cbc'); await page.click('#cl-k-encrypt'); await done('#cl-k-out')
  const fEnc = await download('#cl-k-fmt-enc [data-kdl]')
  const back = crypto.createPrivateKey({ key: fEnc.buf, format: 'pem', passphrase: 'cert-lab-demo' }).export({ type: 'pkcs8', format: 'der' })
  assert(back.toString('base64') === ORACLE.key.p8b64, 'Node 应能用口令解开页面加密的私钥，且等于原 PKCS#8')
  assert(fEnc.buf.toString().includes('BEGIN ENCRYPTED PRIVATE KEY'), '导出应为 ENCRYPTED PRIVATE KEY')
  // RSA PKCS#1：现场生成，对 Node 的各种导出逐字节
  const rk = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 })
  await page.fill('#cl-k-pass', ''); await page.fill('#cl-k-in', rk.privateKey.export({ type: 'pkcs1', format: 'pem' })); await page.click('#cl-k-run'); await done('#cl-k-out')
  assert(await blk('pkcs8') === rk.privateKey.export({ type: 'pkcs8', format: 'pem' }), 'RSA：PKCS#1 → PKCS#8 应与 Node 一致')
  assert(await blk('pkcs1') === rk.privateKey.export({ type: 'pkcs1', format: 'pem' }), 'RSA：PKCS#1 往返应不变')
  assert(await blk('rsapub') === rk.publicKey.export({ type: 'pkcs1', format: 'pem' }), 'RSA：RSA PUBLIC KEY 应与 Node 一致')
  assert(canon(JSON.parse(await blk('jwk'))) === canon(rk.privateKey.export({ format: 'jwk' })), 'RSA：私钥 JWK 应与 Node 一致')
  const j = rk.publicKey.export({ format: 'jwk' })
  const sshStr = (b) => { const l = Buffer.alloc(4); l.writeUInt32BE(b.length); return Buffer.concat([l, b]) }
  const mpint = (b64u) => { let b = Buffer.from(b64u, 'base64url'); if (b[0] & 0x80) b = Buffer.concat([Buffer.from([0]), b]); return sshStr(b) }
  const sshBlob = Buffer.concat([sshStr(Buffer.from('ssh-rsa')), mpint(j.e), mpint(j.n)])
  assert(await blk('ssh') === 'ssh-rsa ' + sshBlob.toString('base64') + ' cert-lab', 'RSA：OpenSSH 公钥行应与独立拼装的 blob 一致')

  // ═════ 7. 到期看板（同步写 localStorage，操作后立刻刷新断言）═════
  await onTab('inspect'); await pick('chain'); await page.click('#cl-item-1'); await page.click('[data-act="watch"]')
  await page.fill('#cl-in', await page.evaluate(() => CL_SAMPLES.expired)); await page.click('#cl-parse'); await page.click('#cl-item-0'); await page.click('[data-act="watch"]')
  await page.click('[data-act="watch"]')
  await onTab('watch')
  let rows = await page.$$eval('#cl-w-body tr', (ns) => ns.map((r) => ({ cn: r.querySelector('b').textContent, days: +r.querySelector('.cl-days').dataset.days, lv: r.querySelector('.cl-days').dataset.lv })))
  assert(rows.length === 2 && rows[0].cn === 'old.example.com' && rows[1].cn === 'shop.example.com', `看板应有 2 张（重复添加去重）且按到期排序：${JSON.stringify(rows)}`)
  assert(rows[0].days === Math.floor((ORACLE.expired.na - ORACLE.meta.t0) / DAY) && rows[0].lv === 'err' && rows[1].days === leftDays && rows[1].lv === 'ok', '剩余天数与等级应正确')
  const stats = await page.$$eval('#cl-w-stats .cl-stat', (ns) => ns.map((n) => n.dataset.stat + '=' + n.querySelector('b').textContent).join(','))
  assert(stats === 'err=1,warn=0,soon=0,ok=1', `统计应为 1 过期 1 正常：${stats}`)
  await page.fill('#cl-w-body tr:nth-child(2) .cl-note-in', 'nginx@web-01')
  await page.reload(); await page.waitForFunction(() => window.CL_APP); await onTab('watch')
  assert(await page.$eval('#cl-w-body tr:nth-child(2) .cl-note-in', (n) => n.value) === 'nginx@web-01' && await text('#cl-tab-n-watch') === '2', '备注与看板应在刷新后保留')
  // 日历：每张 30 天、7 天各一条；DTSTART = 到期日 - N 天；行长 ≤ 75 字节；CRLF
  const ics = (await download('#cl-w-ics')).buf.toString()
  const ev = ics.split('BEGIN:VEVENT').slice(1)
  const starts = ev.map((e) => /DTSTART;VALUE=DATE:(\d{8})/.exec(e)[1]).sort()
  const wantStarts = [ORACLE.expired.na - 30 * DAY, ORACLE.expired.na - 7 * DAY, ORACLE.leaf.na - 30 * DAY, ORACLE.leaf.na - 7 * DAY].map((ms) => new Date(ms).toISOString().slice(0, 10).replace(/-/g, '')).sort()
  assert(ev.length === 4 && JSON.stringify(starts) === JSON.stringify(wantStarts), `ICS 应有 4 条提醒，日期 ${wantStarts}，实得 ${starts}`)
  assert(ics.split('\r\n').every((l) => Buffer.byteLength(l) <= 75) && !/[^\r]\n/.test(ics) && ics.replace(/\r\n /g, '').includes('nginx@web-01'), 'ICS 行应折到 75 字节内、用 CRLF、带备注')
  // 导出 → 清空 → 导入
  const js = await download('#cl-w-export')
  await page.evaluate(() => localStorage.removeItem('cl-watch-v1')); await page.reload(); await page.waitForFunction(() => window.CL_APP); await onTab('watch')
  assert(await page.$$eval('#cl-w-body tr', (ns) => ns.length) === 0, '清空后看板应为空')
  await page.setInputFiles('#cl-w-import', js.path)
  await page.waitForFunction(() => document.querySelectorAll('#cl-w-body tr').length === 2)
  assert(await page.$eval('#cl-w-body tr:nth-child(2) .cl-note-in', (n) => n.value) === 'nginx@web-01', '导入应恢复证书与备注')
  await page.click('#cl-w-body tr:nth-child(1) [data-del]')
  await page.reload(); await page.waitForFunction(() => window.CL_APP); await onTab('watch')
  rows = await page.$$eval('#cl-w-body tr b', (ns) => ns.map((n) => n.textContent))
  assert(JSON.stringify(rows) === '["shop.example.com"]', '删除应立即持久化')

  // ═════ 8. 报错翻译 ═════
  await onTab('errors')
  for (const [msg, code] of [['curl: (60) SSL certificate problem: unable to get local issuer certificate', 'issuer-not-found'], ['x509: certificate signed by unknown authority', 'issuer-not-found'], ['NET::ERR_CERT_COMMON_NAME_INVALID', 'hostname'], ['SSL routines::certificate verify failed: certificate has expired', 'expired'], ['self-signed certificate in certificate chain', 'untrusted'], ['tls: private key does not match public key', 'key-mismatch']]) {
    await page.fill('#cl-e-in', msg); await page.click('#cl-e-run')
    const got = await page.$$eval('#cl-e-out [data-code]', (ns) => ns.map((n) => n.dataset.code))
    assert(got[0] === code, `「${msg}」应翻译为 ${code}，实得 ${got}`)
  }
  await page.fill('#cl-e-in', 'everything is fine'); await page.click('#cl-e-run')
  assert(await page.$('#cl-e-none') !== null, '认不出的报错应给出提示')

  // ═════ 9. 能力清单：页面上列出的每一项都必须在上面真的测到过 ═════
  const claims = (await page.$$eval('#cl-hero-stats .cl-pill', (ns) => ns.slice(1).map((n) => n.textContent))).join(' · ').split(' · ').map((s) => s.trim())
  const footer = ['验签 RSA-PSS', '验签 ECDSA P-521', '验签 Ed25519']
  const dead = claims.concat(footer).filter((c) => !cap[c])
  assert(claims.length === 9 && dead.length === 0, `声明了但没测到的能力：${dead.join('、')}（声明 ${claims.join('、')}）`)

  // ═════ 10. 渲染守卫 ═════
  await onTab('inspect'); await pick('chain'); await page.click('#cl-item-1')
  await onTab('chain'); await page.fill('#cl-ch-in', await page.evaluate(() => CL_SAMPLES.chain)); await page.dispatchEvent('#cl-ch-in', 'input'); await page.check('#cl-ch-trustpasted'); await page.fill('#cl-ch-host', 'shop.example.com'); await runChain()
  await onTab('keys'); await page.fill('#cl-k-in', await page.evaluate(() => CL_SAMPLES.leaf_key_sec1)); await page.click('#cl-k-run'); await done('#cl-k-out')
  await onTab('errors'); await page.fill('#cl-e-in', 'x509: certificate has expired'); await page.click('#cl-e-run')
  const n = await renderGuards(page, {
    assert, tabs: TABS, onTab, paneSel: (t) => `#cl-pane-${t}`, panesRoot: '#cl-panes',
    figSel: (t) => `#cl-pane-${t} svg`, cardSel: '.cl-card, .cl-sum', minControls: 60,
  })
  assert(n >= 60, `守卫应扫到 ≥60 个控件，实得 ${n}`)
  await guardBoxOverlap(page, { assert, sel: '#cl-tabs .cl-tab, #cl-hero-stats .cl-pill, .cl-sum-meta span, .cl-chk' })
  // 详情卡里的长指纹 / 代码块不许把卡片撑破
  await onTab('inspect')
  const wide = await page.$$eval('.cl-pre, .cl-cmd, .cl-fp code', (ns) => ns.filter((n) => n.getBoundingClientRect().width > 0 && getComputedStyle(n).overflowX === 'visible' && n.scrollWidth - n.clientWidth > 2).length)
  assert(wide === 0, `有 ${wide} 个代码块横向撑破`)
  assert(errs.length === 0, '页面报错：' + errs.join(' | '))

  // 缩略图：github.com 真实证书
  await pick('github'); await page.click('#cl-item-0')
  await page.waitForFunction(() => document.getElementById('cl-fp-sha256') && !/计算中/.test(document.getElementById('cl-fp-sha256').textContent))
  assert(await text('#cl-fp-sha256') === ORACLE.github[0].sha256, 'github.com 叶子指纹应等于 openssl')
  await page.evaluate(() => window.scrollTo(0, 0))
  await screenshot('thumb.png')
  fs.rmSync(tmp, { recursive: true, force: true })
}
