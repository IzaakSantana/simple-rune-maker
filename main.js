const { app, ipcMain, BrowserWindow } = require('electron')
const path = require('path')



function createWindow(windowName) {
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

    window.loadFile(`./app/pages/${windowName}.html`)
}


app.whenReady().then(() => {

    createWindow('loading')

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length == 0) {
            createWindow('main')
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
