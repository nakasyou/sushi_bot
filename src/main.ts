import * as sdk from "matrix-js-sdk";
import * as marked from 'marked'
import { load } from 'https://deno.land/std@0.203.0/dotenv/mod.ts'
import omikuji from './commands/omikuji.ts'
import time from './commands/time.ts'
import wp from './commands/wp.ts'
import echo from './commands/echo.ts'
import js from './commands/js/index.ts'
import makequote from './commands/makequote/index.ts'

interface ReplyData {
  userId: string
  replyContent: sdk.IContent
}
export interface CommandOptions {
  reply(text: string, opts?: sdk.MatrixEvent): Promise<void>
  rawMessage: string
  message: string
  client: sdk.MatrixClient
  replyData?: ReplyData
  conf: {
    MATRIX_USER_ID: string;
    MATRIX_ACCESS_TOKEN: string;
    MATRIX_HOME_SERVER: string;
    MATRIX_DEVICE_ID: string;
  }
}
export type Command = (opts: CommandOptions) => Promise<any> | any

async function main () {
  const conf = (globalThis.Bun ? Bun.env: await load({
    export: true,
  })) as {
    MATRIX_USER_ID: string;
    MATRIX_ACCESS_TOKEN: string;
    MATRIX_HOME_SERVER: string;
    MATRIX_DEVICE_ID: string;
  };

  const client = sdk.createClient({
    baseUrl: "https://" + conf.MATRIX_HOME_SERVER,
    accessToken: conf.MATRIX_ACCESS_TOKEN,
    userId: conf.MATRIX_USER_ID,
    timelineSupport: true,
    deviceId: conf.MATRIX_DEVICE_ID,
  });
  async function sendMessage(roomId: string, content: sdk.IContent) {
    const targetUrl =
      `https://${conf.MATRIX_HOME_SERVER}/_matrix/client/r0/rooms/${roomId}/send/m.room.message?access_token=${conf.MATRIX_ACCESS_TOKEN}`;

    const res = await fetch(targetUrl, {
      method: "POST",
      body: JSON.stringify(content),
    }).then((res) => res.text());
  }
  // @ts-expect-error
  client.on("RoomMember.membership", (event, member) => {
    if (member.membership === "invite" && member.userId === conf.MATRIX_USER_ID) {
      client.joinRoom(member.roomId).then(() =>
        console.log("Joined %s", member.roomId)
      );
    }
  });
  // @ts-expect-error
  client.on("Room.timeline", async (event: sdk.MatrixEvent, room, toStartOfTimeline) => {
    if (event.sender?.userId === "@nakasyou_bot:matrix.org") {
      return;
    }
    if (toStartOfTimeline) {
      return; // don't print paginated results
    }
    if (event.getType() !== "m.room.message") {
      return; // only print messages
    }
    const content = event.getContent()
    const rawMessage: string = content.body;
    const roomId: string = room.roomId;
    
    let replyData: ReplyData | undefined
    let message = rawMessage;
    
    console.log(0)
    
    if (content['m.relates_to'] && content['m.relates_to']['m.in_reply_to']) {
      const eventId = content['m.relates_to']['m.in_reply_to']['event_id']
      const replyEventData = await fetch(`https://matrix.org/_matrix/client/v3/rooms/${roomId}/event/${eventId}?access_token=${conf.MATRIX_ACCESS_TOKEN}`).then(res => res.json())
      
      replyData = {
        target: replyEventData.sender,
        content: replyEventData.content
      }
    }

    if ((/^> <@.+>.*$/).test(rawMessage.split('\n')[0])) {
      const target = rawMessage.split('\n')[0].match(/<@.+:.+>/)[0].slice(1,-1)
      const msgLines = []
      let quoteLines = 0
      for (const line of rawMessage.replace(' <' + target + '>', '').split('\n')) {
        if (line[0] !== '>') {
          break;
        }
        quoteLines ++
        msgLines.push(line.slice(2))
      }
      //reply.target = target
      //reply.msg = msgLines.join('\n')
      message = message.split('\n').slice(quoteLines + 1).join('\n')
    }
    console.log(1)
    if (message[0] !== "?") {
      return;
    }
    const command = message.slice(1).split(/[ \n]/g)[0]
    console.log(command, 2)
    const commands = {
      omikuji,
      time,
      wp,
      echo,
      js,
      makequote
    }
    if (!(command in commands)) {
      return // コマンドが存在しない
    }

    const commandFunc = commands[(command as keyof typeof commands)]
    commandFunc({
      reply: async (text, opts) => {
        const defaultContent = {
          msgtype: "m.text",
          body: text,
          formatted_body: marked.parse(text || ''),
          format: "org.matrix.custom.html",
        }
        sendMessage(roomId, {
          ...defaultContent,
          ...opts
        })
      },
      rawMessage,
      message,
      client,
      replyData,
      conf,
    })
    return
    switch (message.slice(1).split(/[ \n]/g)[0]) {
      case "omikuji": {
        
        break;
      }
      case "time": {
        sendText(roomId, new Date().toString());
        break;
      }
      case "magic": {
        sendText(roomId, "🪄✨");
        break;
      }
      case "echo": {
        sendText(roomId, message.replace("?echo", ""));
        break;
      }
      case "wp": {
        const targetWord = message.split("\n")[0].replace("?wp ", "");
        fetch(
          "https://ja.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=" +
            targetWord,
        )
          .then((res) => res.json())
          .then((json) => {
            const data = Object.values(json.query.pages)[0];
            if (data.missing === "") {
              sendText(
                roomId,
                "### SushiBot Wikipedia Search\n`" + targetWord +
                  "`というページはWikipediaに存在しませんでした...",
              );
            } else {
              const result = data.extract.replaceAll("\n", "\n\n");
              sendText(roomId, `### Wikipedia: ${targetWord}\n${result}`);
            }
          });
        break;
      }
      case "make-it-a-quote": {
        if (reply.target === "") {
          sendText(roomId, "リプライで使ってね");
          break;
        }
      
        break;
      }
      case "js": {
        const lines = message.split("\n");
        const initVmCode = `
        const _stringify = (data, objects) => {
          if (!objects) {
            objects = {};
          }
          for (const [key, value] of Object.entries(data)) {
            if (typeof value === "function" || value instanceof Function) {
              data[key] = value.toString();
            }
            for (const [objectKey, objectValue] of Object.entries(objects)){
              if (Object.is(objectValue, value)) {
                data[key] = \`[circular \${objectKey}]\`;
                delete objects[objectKey];
                break;
              }
            }
            try {
              JSON.stringify(value);
            } catch (_error) {
              objects[key] = value;
              _stringify(value, objects);
            }
          }
          return JSON.stringify(data, null, 2)
        };
  
        const end = (data) => postMessage(_stringify(data));
        `.replaceAll("\n", "");
        const code = initVmCode + "\n" + lines.slice(1).join("\n");
  
        const codeBlob = new Blob([code], {
          type: "text/javascript",
        });
        const codeUrl = URL.createObjectURL(codeBlob);
        const id = crypto.randomUUID();
        console.log(codeUrl)
        const worker = new Worker(codeUrl);
        const timeout = setTimeout(() => {
          worker.terminate();
          sendText(
            roomId,
            `5000ms経過したため、\`${id}\`の実行がタイムアウトしました`,
          );
        }, 3000);
        worker.onmessage = (evt) => {
          worker.terminate();
          clearTimeout(timeout);
          sendText(
            roomId,
            `実行が完了しました！\n\nID: \`${id}\`\n\nResult:\n~~~json\n${evt.data}\n~~~`,
          );
        };
        worker.onerror = (evt) => {
          worker.terminate();
          clearTimeout(timeout);
          console.log(evt.error);
          sendText(
            roomId,
            `
  ${id}でエラーが発生しました..
  
  \`${evt.message} ( line ${evt.lineno - 1}, col ${evt.colno})\`
  \`\`\`javascript
  ${evt.lineno > 2 ? code.split("\n")[evt.lineno - 2] : ""}
  ${code.split("\n")[evt.lineno - 1]}
  ${[...Array(evt.colno)].map(() => "").join(" ")}^ここ
  ${evt.lineno < code.split("\n").length ? code.split("\n")[evt.lineno] : ""}
  \`\`\`
  
  `
              .slice(1),
          );
        };
        sendText(roomId, `実行中...\n\nID: \`${id}\``);
      }
      default:
        break;
    }
  });
  async function sendText(roomId: string, text: string, opts?: sdk.MatrixEvent) {
    //roomId = '!ImNvrWGMJkOKjfLWFL:matrix.org
    const targetUrl =
      `https://matrix.org/_matrix/client/r0/rooms/${roomId}/send/m.room.message?access_token=${conf.MATRIX_ACCESS_TOKEN}`;
    const data = {
      msgtype: "m.text",
      body: text,
      formatted_body: marked.parse(text),
      format: "org.matrix.custom.html",
    };
    if (opts) {
      Object.assign(data, opts);
    }
    const res = await fetch(targetUrl, {
      method: "POST",
      body: JSON.stringify(data),
    }).then((res) => res.text());
  }
  client.startClient({
    initialSyncLimit: 0,
  });  
}
if (import.meta.main) {
  await main()
}
