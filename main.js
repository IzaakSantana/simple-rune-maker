const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')

const axios = require('axios')
const https = require('https')
const execSync = require('child_process').execSync

const os_name = process.platform
const leagueProcessName = "LeagueClientUx"

const cmdline = getCmdLine()
const data = getPortAndPass(cmdline)

const port = data.port
const passwd = data.passwd
const baseURL = `https://127.0.0.1:${port}`

console.log(`port: ${port}\npass: ${passwd}`)

const agent = new https.Agent({
    rejectUnauthorized: false
})

axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`riot:${passwd}`)}`


app.whenReady().then(async () => {

    var window = createWindow()

    getCurrentRunePage(window)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length == 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('reload-runes', (event, value) => {
    event.sender.send('reload-runes', value)
})

function createWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        maximizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    })

    window.loadFile(`./app/pages/main.html`)

    return window
}


// -- lcu 

function getPortAndPass(cmdline) {
    const portRegex = /--app-port=([0-9]+)/
    const passwordRegex = /--remoting-auth-token=([\w-_]+)/

    var data = {}

    try {
        data.port = cmdline.match(portRegex)[0].replace("--app-port=", "")
        data.passwd = cmdline.match(passwordRegex)[0].replace("--remoting-auth-token=", "")
    } catch (err) {
        console.log(err.name)
        
    }
    

    return data
}

function runSystemCmd(cmd) {
    try {
        const output = execSync(cmd, { encoding: 'utf-8' })

        return output
    } catch (error) {
        console.log(`From runSystemCmd: ${error.name}`)
    }
}


function getCmdLine() {
    if (os_name === "win32") {
        return runSystemCmd(`wmic PROCESS WHERE name='${leagueProcessName}.exe' GET commandline`)
    } else if (os_name === "darwin") {
        return runSystemCmd(`ps -A | grep ${leagueProcessName}`)
    }
}

async function getCurrentRunePage(window) {
    try {
        var res = await axios.get(`${baseURL}/lol-perks/v1/currentpage`, { httpsAgent: agent })

        window.webContents.send('rune-loaded', res.data)
    } catch (error) {
        window.webContents.send('rune-loaded', 'error')
    }
}

function getRequest(url) {
    var data

    axios
    .get(`${baseURL}${url}`, {httpsAgent: agent})
    .then((res) => {
        console.log(`Status code: ${res.status}`)
        console.log(`Response: ${JSON.stringify(res.data)}`)
        data =  res.data
    })
    .catch((error) => {
        console.log(error)
        data = null
    })

    console.log(`depois do GET: ${data}`)
    return data
}

function postRequest(url, data) {
    axios.post(`${baseURL}${url}`, data, {httpsAgent: agent})
  .then(function (response) {
    console.log(JSON.parse(JSON.stringify(response.data)));
  })
  .catch(function (error) {
    console.log(error);
  });
}

function deleteRequest(url) {
    axios.delete(`${baseURL}${url}`, {httpsAgent: agent})
    .then((res) => {
        console.log(JSON.stringify(res.data))
    })
    .catch((error) => {
        console.log(error)
    })
}