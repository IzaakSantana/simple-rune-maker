const { contextBridge, ipcRenderer } = require('electron')

var runes = require('./runes-info.js').runes

contextBridge.exposeInMainWorld('electronAPI', {
    rune: (callback) => ipcRenderer.on('runes', callback),
    runes: {
        runesJson : runes,
        reloadRunes : (value) => {
            console.log(`Mandando pro main: ${JSON.stringify(value)}`)
            ipcRenderer.send('reload-runes', value)
        },
        saveRunes : (value) => {
            ipcRenderer.send('save-runes', value)
        }
    }
})

ipcRenderer.on('reload-runes', (event, value) => {
    console.log(`Recebendo do main: ${JSON.stringify(value)}`)
    loadRuneIcons(value)
    
})

ipcRenderer.on('rune-loaded', (event, value) => {
    if (value === 'error') {
        window.alert('Error! Open league client and try again.')
    } else {
        var txtInput = document.querySelector('#txtInput')
        var mainSection = document.querySelector('#main')

        var displayPage = {
            primaryStyleId: value.primaryStyleId,
            subStyleId: value.subStyleId,
            selectedPerkIds: value.selectedPerkIds,
            name: value.name,
            id: value.id
        }

        txtInput.value = displayPage.name
        mainSection.dataset.pageid = displayPage.id

        loadRuneIcons(displayPage)
    }
})

function getRuneObjById(array, id) {
    return array.find(obj => obj.id === id)
}

function getSubRunes(mainRuneObj) {
    if (mainRuneObj) {
        return mainRuneObj.slots.slice(1, mainRuneObj.slots.length)
    } else {
        return null
    }
    
}

function loadRuneIcons (displayPage) {
    var mainRunes1 = document.querySelector('#main-runes')
    var mainRunes2 = document.querySelector('#main-runes2')
    var essentialRunes = document.querySelector('#essential-runes')
    var subRunes1 = document.querySelector('#sub-runes')
    var subRunes2 = document.querySelector('#sub-runes2')
    var stats = document.querySelector('#stats')

    var selectedMainRuneId = displayPage.primaryStyleId
    var selectedMainRune2Id = displayPage.subStyleId

    var mainRuneObj = getRuneObjById(runes, selectedMainRuneId)
    var secondaryRuneObj = getRuneObjById(runes, selectedMainRune2Id)

    var selectedEssentialId = displayPage.selectedPerkIds[0]
    var selectedEssentials = mainRuneObj.slots[0].runes

    var selectedSubRunes = getSubRunes(mainRuneObj)
    var selectedSubRunes2 = getSubRunes(secondaryRuneObj)

    loadMainRunes("mainrune-icon", mainRunes1, selectedMainRuneId, runes)
    loadMainRunes("mainrune-icon", mainRunes2, selectedMainRune2Id, runes)
    loadMainRunes("essentialrune-icon", essentialRunes, selectedEssentialId, selectedEssentials)
    loadSubRunes("subrune-icon", subRunes1, displayPage.selectedPerkIds, selectedSubRunes)
    loadSubRunes("subrune-icon", subRunes2, displayPage.selectedPerkIds, selectedSubRunes2)
    loadStats(stats, displayPage.selectedPerkIds.slice(-3))
}

var defaultAltText = "rune-icon"

function imgElement() {
    return document.createElement('img')
}

function loadMainRunes(className, divElement, selectedId, runesArray) {
    for (var c = 0; c < runesArray.length; c++) {
        var img = imgElement()

        img.src = runesArray[c].icon
        img.className = className
        img.alt = defaultAltText

        img.setAttribute('style', `order: ${runesArray[c].order};`)
        img.setAttribute('data-id', runesArray[c].id)
        

        if (runesArray[c].id === selectedId) {
            img.setAttribute('data-selected', 'true')
        } else {
            img.setAttribute('data-selected', 'false')
        }

        if (divElement.id === 'main-runes2') {
            var selectedPrimaryStyle = document.querySelector('#main-runes img[data-selected="true"]')

            if (selectedPrimaryStyle.dataset.id != `${runesArray[c].id}`) {
                divElement.appendChild(img)
            }
        } else {
            divElement.appendChild(img)
        }
    }
}


function loadSubRunes(className, divElement, selectedPerks, runesArray) {  
    var children = divElement.children

    var rows = {
        row0 : children[0],
        row1 : children[1],
        row2 : children[2]
    }
    
    if (runesArray) {
    
        for (var c = 0; c < runesArray.length; c++) {
            var row = runesArray[c].runes
    
            for (var c2 = 0; c2 < row.length; c2++) {
                var img = imgElement()
                
                img.src = row[c2].icon
                img.alt = defaultAltText
                img.className = className

                img.setAttribute('data-id', row[c2].id)

                if (selectedPerks.indexOf(row[c2].id) !== -1) {
                    img.setAttribute('data-selected', 'true')
                } else {
                    img.setAttribute('data-selected', 'false')     
                }

                rows[`row${c}`].appendChild(img)

            }
    
        }

        if (rows.row2.children.length >= 4) {
            rows.row2.dataset.extra_elem = 'true'
        } else {
            rows.row2.dataset.extra_elem = 'false'
        }

    } else {
        var rowsDiv = Array.from(divElement.children)
        var blankRuneSrc = "../images/runes/BlankRune.png"

        rowsDiv.forEach(element => {
            for (var count = 0; count < 3; count ++) {
                var img = imgElement()
            
                img.src = blankRuneSrc
                img.alt = defaultAltText
                img.className = className
                
                element.appendChild(img)
            }
        })

        rowsDiv[2].dataset.extra_elem = 'false'
    }
    
}

function loadStats(divElement, selectedStats) {
    var children = divElement.children

    var rows = {
        row0 : Array.from(children[0].children),
        row1 : Array.from(children[1].children),
        row2 : Array.from(children[2].children)
    }


    for (var c = 0; c < selectedStats.length; c++) {
        for (var c2 = 0; c2 < rows[`row${c}`].length; c2++) {
            if (Number(rows[`row${c}`][c2].dataset.id) === selectedStats[c]) {
                rows[`row${c}`][c2].dataset.selected = "true"
            }
        }
    }

}

function resetElement(element) {
    element.innerHTML = ""
}

function removeElement(array, value) {
    return array.filter((elem) => { 
        return elem != value; 
    });
}