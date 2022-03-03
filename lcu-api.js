const execSync = require('child_process').execSync
const axios = require('axios')
const https = require('https')

const os_name = process.platform
const leagueProcessName = "LeagueClientUx"

const cmdline = getCmdLine()
const data = getPortAndPass(cmdline)

const port = data.port
const passwd = data.passwd

const baseURL = `https://127.0.0.1:${port}`

const agent = new https.Agent({
    rejectUnauthorized: false
})

axios.defaults.headers.common['Authorization'] = `Basic ${btoa(`riot:${passwd}`)}`


function getPortAndPass(cmdline) {
    //const cmdline = rawCmdline.replace(/\s+\g/, "")
    const portRegex = /--app-port=([0-9]+)/ // Got from https://github.com/matsjla/league-connect/blob/master/src/authentication.ts
    const passwordRegex = /--remoting-auth-token=([\w-_]+)/

    var data = {}
    data.port = cmdline.match(portRegex)[0].replace("--app-port=", "")
    data.passwd = cmdline.match(passwordRegex)[0].replace("--remoting-auth-token=", "")
    

    return data
}

function runSystemCmd(cmd) {
    const output = execSync(cmd, { encoding: 'utf-8' })

    return output
}

function getCmdLine() {
    if (os_name === "win32") {
        return runSystemCmd(`wmic PROCESS WHERE name='${leagueProcessName}.exe' GET commandline`)
    } else if (os_name === "darwin") {
        return runSystemCmd(`ps -A | grep ${leagueProcessName}`)
    }
}

async function getCurrentRunePage() {
    var url = "/lol-perks/v1/currentpage"
    var rune

    var data = getRequest(url)

    if (data) {
        rune.name = data.name
        rune.primaryStyleId = data.primaryStyleId
        rune.subStyleId = data.subStyleId
        rune.selectedPerkIds = data.selectedPerkIds
        rune.id = data.id

        return rune
    } else {
        return 
    }
   
}

function getRequest(url) {
    axios
    .get(`${baseURL}${url}`, {httpsAgent: agent})
    .then((res) => {
        // console.log(`Status code: ${res.status}`)
        // console.log(`Response: ${JSON.stringify(res.data)}`)
        return res.data
    })
    .catch((error) => {
        console.log(error)
        return
    })
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

// var rune = {
//     name: "Runa dinâmica",
//     primaryStyleId: 8100,
//     subStyleId: 8300,
//     selectedPerkIds: [8128, 8126, 8138, 8105, 8306, 8410, 5007, 5002, 5001],
//     current: true
// }

//getRequest("/lol-summoner/v1/current-summoner") // get current summoner
//postRequest("/lol-perks/v1/pages", rune)
//deleteRequest("/lol-perks/v1/pages/1718822433")
//getRequest("/lol-perks/v1/currentpage")
