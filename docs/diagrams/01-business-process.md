# 01 — Business process (As-Is / To-Be)

devtools-roadmaps-web คือเว็บอ้างอิงแบบ static ที่แสดง career learning roadmap 3 เส้นทาง (Product Manager, Web Developer, Data Scientist) ให้ผู้เยี่ยมชม portfolio อ่านและค้นหา เนื้อหาเป็นไฟล์ MDX ใน repo เท่านั้น ไม่มีบัญชีผู้ใช้หรือที่เก็บข้อมูล และมี endpoint `/api/mcp` ให้ agent อ่านเนื้อหาชุดเดียวกัน

Last reviewed: 2026-11-28 · commit `d62a22b`

## As-Is (จากโค้ดวันนี้)

```mermaid
flowchart LR
  AUTHOR["owner commits content/roadmaps/*.mdx"] --> MAIN["push main"]
  MAIN --> CI["GitHub Actions CI (lint, typecheck, tests, build, security scan) ไม่ได้สั่ง deploy"]
  MAIN -.->|"push ไม่ deploy (Git link ชี้ repo เก่า)"| NODEPLOY["ไม่มี deploy อัตโนมัติ"]
  OWNERCLI["owner สั่ง Vercel CLI deploy เอง [ต้องยืนยัน]"] --> PROD["production roadmaps.bookchaowalit.com"]
  VISITOR["ผู้เยี่ยมชม"] --> HOME["/ : การ์ดทุก roadmap (prerender ตอน build)"]
  VISITOR --> LIST["/roadmaps?q=&level= : ค้นหา + chip ระดับ (อ่านไฟล์ทุก request)"]
  VISITOR --> DETAIL["/roadmaps/slug : prebuilt ตอน build, slug อื่น = 404"]
  HOME --> LOAD["lib/mdx.ts อ่าน front matter แล้วแปลงชนิด/เติมค่าเริ่มต้น (ไม่ reject ข้อมูลผิด schema)"]
  LIST --> LOAD
  DETAIL --> LOAD
  LOAD --> FILES[("content/roadmaps/*.mdx")]
  AGENT["MCP client"] --> MCP["POST /api/mcp : get_all, get_by_slug, search"]
  MCP -->|"slug ผิดรูปแบบหรือไม่มี, tool/method ไม่รู้จัก"| RPCERR["JSON-RPC error 400"]
  MCP -->|"JSON เสีย"| PARSE["Parse error 400"]
  MCP --> LOAD
  MCP -->|"อ่านไฟล์ล้มเหลว"| E500["JSON-RPC -32603, HTTP 500 (จับเอง ไม่ส่งไป Sentry)"]
  LOAD -->|"error ของหน้า (ไม่ใช่ MCP)"| SENTRY["Sentry ถ้ามี DSN: ตัด request/user/breadcrumbs/extra, ตัด query/hash ในข้อความ"]
  DETAIL -->|"slug ไม่มี"| NF["404 notFound"]
```

Sources: `content/roadmaps/*.mdx`, `lib/mdx.ts`, `app/page.tsx`, `app/roadmaps/page.tsx`, `app/roadmaps/[slug]/page.tsx`, `app/api/mcp/route.ts`, `lib/sentry.ts`, `next.config.ts`, `PRODUCT.md`, `README.md`

หมายเหตุจากโค้ด: ค่า progress ใน front matter เป็นข้อมูลตัวอย่างที่ใช้เรียงลำดับ ไม่แสดงในหน้า แต่ยังอยู่ในคำตอบ MCP; `/more-projects` redirect ถาวรไป bookchaowalit.com

## To-Be (`PRODUCT.md` §Live URL and deploy state)

```mermaid
flowchart LR
  AUTHOR["owner commits content/roadmaps/*.mdx"] --> MAIN["push main"]
  MAIN --> CI2["CI (แยกเส้นทาง)"]
  MAIN --> DEPLOY["Vercel Git deploy จาก repo นี้ (push = deploy)"]
  DEPLOY --> SITE["roadmaps.bookchaowalit.com + /api/mcp รุ่นล่าสุด"]
```

Sources: `PRODUCT.md` (owner action D9: reconnect Vercel Git to this repository)

## Gap

| ID | As-Is → To-Be | Status | Owner | Evidence |
|---|---|---|---|---|
| G1 | deploy ด้วย Vercel CLI, Git link ชี้ repo เก่า, commit L2 (MCP จริง, Sentry) อาจยังไม่ขึ้น production → เชื่อม Vercel Git กับ repo นี้ | decide | owner | `PRODUCT.md` §Live URL and deploy state (owner action D9) [ต้องยืนยัน: สถานะปัจจุบัน] |

## Open questions

- Vercel Git link ของโปรเจกต์ `bookchaowalit-roadmaps-frontend` ชี้ repo นี้แล้วหรือยัง (PRODUCT.md เขียนไว้ ณ 2026-10-23)
