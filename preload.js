const { contextBridge, ipcRenderer } = require('electron')

var runes = require('./runes-info.js').runes

contextBridge.exposeInMainWorld('electronAPI', {
    rune: (callback) => ipcRenderer.on('runes', callback),
})

ipcRenderer.on('rune-loaded', (event, value) => {
    var txtInput = document.querySelector('#txtInput')
    var mainRunesDiv = document.querySelector('#main-runes')
    
    var displayPage = {
        primaryStyleId: value.primaryStyleId,
        subStyleId: value.subStyleId,
        selectedPerkIds: value.selectedPerkIds,
        name: value.name
    }

    txtInput.value = displayPage.name

    loadRuneIcons(displayPage)
})

function loadRuneIcons (displayPage) {
    var mainRunes1 = document.querySelector('#main-runes')
    var mainRunes2 = document.querySelector('#main-runes2')
    var essentialRunes = document.querySelector('#essential-runes')
    var subRunes1 = document.querySelector('#sub-runes')
    var subRunes2 = document.querySelector('#sub-runes2')

    var mainRunesCount = 5
    
    var selectedMainRune = displayPage.primaryStyleId
    var selectedEssentials = runes.find(x => x.id === selectedMainRune).slots[0].runes
    var selectedEssentialId = displayPage.selectedPerkIds[0]
    var essentialRunesCount = selectedEssentials.length

    var children = mainRunes1.children
    for (var c = 0; c < mainRunesCount; c++) {
        children[c].setAttribute('src', runes[c].icon)
        children[c].setAttribute('style', `order: ${runes[c].order};`)

        if (runes[c].id === selectedMainRune) {
            children[c].setAttribute('data-selected', 'true')
        }
    }

    for (var c = 0; c < essentialRunesCount; c++) {
        var img = document.createElement('img')

        img.src = selectedEssentials[c].icon
        img.className = "essential-rune-icon"
        img.alt = "rune-icon"

        if (selectedEssentials[c].id === selectedEssentialId) {
            img.setAttribute('data-selected', 'true')
        }

        essentialRunes.appendChild(img)
    }
    





}
