const logined = await fetch("https://matrix.org/_matrix/client/r0/login", {
  method: "POST",
  body: JSON.stringify({
    type: "m.login.password",
    user: prompt('User Name'),
    password: prompt('Password'),
  }),
}).then((res) => res.json())

if ('error' in logined) {
  throw new Error("ログインに失敗しました")
}
const write = globalThis.Bun ? globalThis.Bun.write : Deno.writeTextFile

write('./.env', `
MATRIX_USER_ID=${logined.user_id}
MATRIX_ACCESS_TOKEN=${logined.access_token}
MATRIX_HOME_SERVER=${logined.home_server}
MATRIX_DEVICE_ID=${logined.device_id}
`)
alert('ログインに成功しました!')