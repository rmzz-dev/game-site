import { Connector, Statement } from "db0";
import pg, { ClientConfig } from "pg";

export type ConnectorOptions = { url: string } | ClientConfig;

export default function postgresqlConnector(opts: ConnectorOptions) {
  let _client: undefined | pg.Client | Promise<pg.Client>;
  function getClient() {
    if (_client) {
      return _client;
    }
    const client = new pg.Client("url" in opts ? opts.url : opts);
    _client = client.connect().then(() => {
      _client = client;
      return _client;
    });
    return _client;
  }

  async function query(sql: string, params?: unknown[]) {
    const client = await getClient();
    return client.query(normalizeParams(sql), params);
  }

  return <Connector>{
    name: "postgresql",
    exec(sql: string) {
      return query(sql);
    },
    prepare(sql: string) {
      const stmt = <any>{
        _sql: sql,
        _params: [],
        bind(...params: any[]) {
          if (params.length > 0) {
            this._params = params;
          }
          return stmt;
        },
        all(...params: any[]) {
          return query(this._sql, params || this._params).then((r) => r.rows);
        },
        run(...params: any[]) {
          return query(this._sql, params || this._params).then((r) => ({
            result: r,
            rows: r.rows,
          }));
        },
        get(...params: any[]) {
          // TODO: Append limit?
          return query(this._sql, params || this._params).then(
            (r) => r.rows[0]
          );
        },
      };
      return stmt;
    },
  };
}

// https://www.postgresql.org/docs/9.3/sql-prepare.html
function normalizeParams(sql: string) {
  let i = 0;
  return sql.replace(/\?/g, () => `$${++i}`);
}
