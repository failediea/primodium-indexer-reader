#!/usr/bin/env node
import"dotenv/config";import Ee from"@koa/cors";import Ne from"@koa/router";import Te from"koa";import Oe from"postgres";import{z as v}from"zod";import{isHex as se}from"viem";import{z as d,ZodError as ae}from"zod";var B=d.object({INDEXER_HOST:d.string().default("0.0.0.0"),INDEXER_PORT:d.coerce.number().positive().default(3001)}),Ce=d.intersection(d.object({START_BLOCK:d.coerce.bigint().nonnegative().default(0n),MAX_BLOCK_RANGE:d.coerce.bigint().positive().default(1000n),POLLING_INTERVAL:d.coerce.number().positive().default(1e3),STORE_ADDRESS:d.string().optional().transform(e=>e===""?void 0:e).refine(e=>e===void 0||se(e))}),d.union([d.object({RPC_HTTP_URL:d.string(),RPC_WS_URL:d.string().optional()}),d.object({RPC_HTTP_URL:d.string().optional(),RPC_WS_URL:d.string()})]));function H(e){try{return e.parse(process.env)}catch(o){if(o instanceof ae){let{_errors:r,...t}=o.format();console.error(`
Missing or invalid environment variables:

  ${Object.keys(t).join(`
  `)}
`),process.exit(1)}throw o}}import{Readable as Y}from"stream";import ke from"@koa/router";import{createBenchmark as q}from"@latticexyz/common";import Ae from"koa-compose";import{isNotNull as M}from"@latticexyz/common/utils";import{transformSchemaName as de}from"@latticexyz/store-sync/postgres";import{hexToBytes as S}from"viem";var j=de("mud");function z(e,o){return e`(${o.reduce((r,t)=>e`${r} AND ${t}`)})`}function ce(e,o){return e`(${o.reduce((r,t)=>e`${r} OR ${t}`)})`}function F(e,o){let r=o.filters.length?o.filters.map(n=>z(e,[o.address!=null?e`address = ${S(o.address)}`:null,e`table_id = ${S(n.tableId)}`,n.key0!=null?e`key0 = ${S(n.key0)}`:null,n.key1!=null?e`key1 = ${S(n.key1)}`:null].filter(M))):o.address!=null?[e`address = ${S(o.address)}`]:[],t=e`WHERE ${z(e,[e`is_deleted != true`,r.length?ce(e,r):null].filter(M))}`;return e`
    WITH
      config AS (
        SELECT
          version AS "indexerVersion",
          chain_id AS "chainId",
          block_number AS "chainBlockNumber"
        FROM ${e(`${j}.config`)}
        LIMIT 1
      ),
      records AS (
        SELECT
          '0x' || encode(address, 'hex') AS address,
          '0x' || encode(table_id, 'hex') AS "tableId",
          '0x' || encode(key_bytes, 'hex') AS "keyBytes",
          '0x' || encode(static_data, 'hex') AS "staticData",
          '0x' || encode(encoded_lengths, 'hex') AS "encodedLengths",
          '0x' || encode(dynamic_data, 'hex') AS "dynamicData",
          block_number AS "recordBlockNumber",
          log_index AS "logIndex"
        FROM ${e(`${j}.records`)}
        ${t}
        ORDER BY block_number, log_index ASC
      )
    SELECT
      (SELECT COUNT(*) FROM records) AS "totalRows",
      *
    FROM config, records
  `}import{isHex as p}from"viem";import{z as s}from"zod";var J=s.object({address:s.string().refine(p).optional(),filters:s.array(s.object({tableId:s.string().refine(p),key0:s.string().refine(p).optional(),key1:s.string().refine(p).optional()})).default([])}),ue=s.array(s.object({tableId:s.string().refine(p),on:s.string().default("__key_bytes")})),w=s.object({column:s.coerce.string(),operation:s.enum(["eq","neq","lt","lte","gt","gte"]),value:s.coerce.string()}),me=s.object({tableId:s.string().refine(p),where:w.optional(),and:w.array().optional(),or:w.array().optional(),include:ue.optional()}).refine(e=>["where","and","or"].filter(t=>e[t]!==void 0).length<=1,{message:"Only one of 'where', 'and', or 'or' can be defined at a time",path:["where","and","or"]}),W=s.object({address:s.string().refine(p),queries:s.array(me)});import{hexToResource as U}from"@latticexyz/common";import{isNotNull as X}from"@latticexyz/common/utils";import{snakeCase as E}from"change-case";function y(e){return/^0x[0-9A-Fa-f]+$/.test(e)?Buffer.from(e.slice(2),"hex"):e}function D(e,o,r,t){let n=e`${e(o)}.${e(r)}.${e(t.column)}`,i=y(t.value);switch(t.operation){case"eq":return e`${n} = ${i}`;case"neq":return e`${n} != ${i}`;case"lt":return e`${n} < ${i}`;case"lte":return e`${n} <= ${i}`;case"gt":return e`${n} > ${i}`;case"gte":return e`${n} >= ${i}`;default:throw new Error(`Unsupported operation: ${t.operation}`)}}function le(e,o){return e`(${o.reduce((r,t)=>e`${r} AND ${t}`)})`}function fe(e,o){return e`(${o.reduce((r,t)=>e`${r} OR ${t}`)})`}function L(e,o){return o.reduce((r,t)=>e`${r} UNION ALL ${t}`)}function pe(e,o,r){return e`
    WITH filter as (
     ${o}
    )
      SELECT 
        '0x' || encode(address, 'hex') AS address,
        '0x' || encode(mud.records.table_id, 'hex') AS "tableId",
        '0x' || encode(key_bytes, 'hex') AS "keyBytes",
        '0x' || encode(static_data, 'hex') AS "staticData",
        '0x' || encode(encoded_lengths, 'hex') AS "encodedLengths",
        '0x' || encode(dynamic_data, 'hex') AS "dynamicData",
        block_number AS "recordBlockNumber",
        log_index AS "logIndex"
      FROM mud.records
      JOIN filter on filter.__key_bytes = mud.records.key_bytes AND filter.table_id = mud.records.table_id
      WHERE mud.records.address = ${y(r)} AND mud.records.is_deleted = false
  `}function ye(e,o,r){return e`
      SELECT 
        '0x' || encode(address, 'hex') AS address,
        '0x' || encode(mud.records.table_id, 'hex') AS "tableId",
        '0x' || encode(key_bytes, 'hex') AS "keyBytes",
        '0x' || encode(static_data, 'hex') AS "staticData",
        '0x' || encode(encoded_lengths, 'hex') AS "encodedLengths",
        '0x' || encode(dynamic_data, 'hex') AS "dynamicData",
        block_number AS "recordBlockNumber",
        log_index AS "logIndex"
      FROM mud.records
      WHERE mud.records.address = ${y(o)} AND mud.records.is_deleted = false AND mud.records.table_id IN ${e(r.map(t=>y(t)))}
  `}function V(e,o,r){let t=[],n=r.map(({tableId:m,where:u,and:f,or:a,include:c})=>{let{name:re,namespace:oe}=U(m),$=`${E(oe)}__${E(re)}`,k=o;if(!u&&!f&&!a&&!c)return t.push(m),null;let h;u?h=D(e,k,$,u):f?h=le(e,f.map(b=>D(e,k,$,b))):a&&(h=fe(e,a.map(b=>D(e,k,$,b))));let A=e`
        SELECT __key_bytes, ${y(m)} as table_id 
        FROM ${e(k)}.${e($)}
        ${h?e`WHERE ${h}`:e``}`;if(c&&c.length){let b=c.map(({tableId:P,on:te})=>{let{name:ne,namespace:ie}=U(P),T=o,O=`${E(ie)}__${E(ne)}`;return e`
            SELECT ${e(T)}.${e(O)}.__key_bytes, ${y(P)} as table_id
            FROM (${A}) AS base
            JOIN ${e(T)}.${e(O)}
            ON ${e(T)}.${e(O)}.${e(te)} = base.__key_bytes`});A=L(e,[A,...b])}return A}).filter(X),i=n.length?pe(e,L(e,n),o):null,g=t.length?ye(e,o,t):null,l=[i,g].filter(X);return e`
    WITH
      config AS (
        SELECT
          version AS "indexerVersion",
          chain_id AS "chainId",
          block_number AS "chainBlockNumber"
        FROM mud.config
        LIMIT 1
      ),
      records as (
        ${L(e,l)}
      )
    SELECT * FROM records, config
    ORDER BY "records"."recordBlockNumber", "records"."logIndex" ASC
  `}import{Stream as ge}from"node:stream";import he from"accepts";import{createBrotliCompress as be,createDeflate as Se,createGzip as Re}from"node:zlib";import{includes as _e}from"@latticexyz/common/utils";var G={br:be,gzip:Re,deflate:Se},Z=Object.keys(G);function xe(e,o){let r=0;return e.on("data",t=>{r+=t.length,r>o&&(r=0,e.flush())}),e}function I({flushThreshold:e=1024*4}={}){return async function(r,t){r.vary("Accept-Encoding"),await t();let n=he(r.req).encoding(Z);if(!_e(Z,n))return;let i=xe(G[n](),e);r.set("Content-Encoding",n),r.body=r.body instanceof ge?r.body.pipe(i):i.end(r.body)}}import K from"debug";var N=K("primodiumxyz:indexer-reader"),C=K("primodiumxyz:indexer-reader");N.log=console.debug.bind(console);C.log=console.error.bind(console);import{decodeDynamicField as $e}from"@latticexyz/protocol-parser/internal";function Q(e){return{address:e.address,eventName:"Store_SetRecord",args:{tableId:e.tableId,keyTuple:$e("bytes32[]",e.keyBytes),staticData:e.staticData??"0x",encodedLengths:e.encodedLengths??"0x",dynamicData:e.dynamicData??"0x"}}}function ee(e){let o=new ke;return o.get("/api/logs",I(),async r=>{let t=q("postgres:logs"),n;try{n=J.parse(typeof r.query.input=="string"?JSON.parse(r.query.input):{})}catch(i){r.status=400,r.body=JSON.stringify(i),r.set("Content-Type","application/json"),N(i);return}try{n.filters=n.filters.length>0?[...n.filters]:[];let i=await F(e,n??{}).execute();if(t("query records"),i.length===0){r.status=200,r.body=JSON.stringify({blockNumber:0,chunk:1,totalChunks:1,logs:[]})+`
`;return}let g=i[0].chainBlockNumber,l=i.map(Q);t("map records to logs");let m=1e3,u=[];for(let a=0;a<l.length;a+=m){let c=l.slice(a,a+m);u.push(c)}let f=new Y({read(){u.forEach(async(a,c)=>{this.push(JSON.stringify({blockNumber:g,chunk:c+1,totalChunks:u.length,logs:a})+`
`)}),this.push(null)}});r.body=f,r.status=200}catch(i){r.status=500,r.set("Content-Type","application/json"),r.body=JSON.stringify(i),C(i)}}),o.get("/api/queryLogs",I(),async r=>{let t=q("postgres:logs");try{let n=W.parse(typeof r.query.input=="string"?JSON.parse(r.query.input):{}),i=await V(e,n.address,n.queries);if(t("query records"),i.length===0&&i.length===0){r.status=200,r.body=JSON.stringify({blockNumber:0,chunk:1,totalChunks:1,logs:[]})+`
`;return}let g=i[0].chainBlockNumber,l=i.map(Q);t("map records to logs");let m=1e3,u=[];for(let a=0;a<l.length;a+=m){let c=l.slice(a,a+m);u.push(c)}let f=new Y({read(){u.forEach(async(a,c)=>{this.push(JSON.stringify({blockNumber:g,chunk:c+1,totalChunks:u.length,logs:a})+`
`)}),this.push(null)}});r.body=f,r.status=200}catch(n){r.status=500,r.body=JSON.stringify(n),N(n);return}r.status=200}),Ae([o.routes(),o.allowedMethods()])}var R=H(v.intersection(B,v.object({DATABASE_URL:v.string()}))),we=Oe(R.DATABASE_URL,{prepare:!1}),_=new Te;_.use(Ee());_.use(ee(we));var x=new Ne;x.get("/",e=>{e.body="emit HelloWorld();"});x.get("/healthz",e=>{e.status=200});x.get("/readyz",e=>{e.status=200});_.use(x.routes());_.use(x.allowedMethods());_.listen({host:R.INDEXER_HOST,port:R.INDEXER_PORT});console.log(`postgres indexer frontend listening on http://${R.INDEXER_HOST}:${R.INDEXER_PORT}`);
//# sourceMappingURL=postgres-frontend.js.map