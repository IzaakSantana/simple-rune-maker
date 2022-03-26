var mainRunes1 = document.querySelector('#main-runes')
var mainRunes2 = document.querySelector('#main-runes2')
var essentialRunes = document.querySelector('#essential-runes')
var subRunes1 = document.querySelector('#sub-runes')
var subRunes2 = document.querySelector('#sub-runes2')
var stats = document.querySelector('#stats')
var txtInput = document.querySelector('#txtInput')
var txtOutput = document.querySelector('#txtOutput')
var saveButton = document.querySelector('#saveBtn')
var reloadButton = document.querySelector('#reloadBtn')

var runes = window.electronAPI.runes.runesJson

// secondary sub runes set up
var currentRow
var secondRow
var oldRow

const mutationConfig = { childList: true, subtree: true }
const observer = new MutationObserver(mutationCallback)

saveButton.addEventListener('click', saveBtnClicked)
reloadButton.addEventListener('click', reloadBtnClicked)
addIconListeners()

observer.observe(document.body, mutationConfig)


function mutationCallback(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            addIconListeners()
        }
    }
}

function addIconListeners() {
    var icons = document.getElementsByTagName('img')

    Array.from(icons).forEach((element) => {
        element.addEventListener('click', iconClicked)
    })
}

function saveBtnClicked() {
    if (txtInput.value.length <= 0) {
        alert('Pick a name for your rune!')
    } else if (null) {

    } else {
        txtOutput.innerText = "Saving..."
        window.electronAPI.runes.saveRunes(getRuneObj())
        txtOutput.innerText = "Runes saved!"
    }
    
}

function reloadBtnClicked() {
    txtOutput.innerText = 'Loading...'
    resetRuneTrees()
    window.electronAPI.runes.reloadRunes('new')
}

function iconClicked(event) {
    var target = event.currentTarget
    var parent = target.parentElement

    var parentChildren = Array.from(parent.children)
    var parentId = parent.id


    if (target.dataset.selected == 'false' && parent.parentElement.id != subRunes2.id) { 
    
        if (rowHasSelected(parent)) {
            getSelectedElement(parent).dataset.selected = 'false'
        }

        target.dataset.selected = 'true'
        
        if (parent.id == mainRunes1.id) {
            var secondaryTreeSelectedId = getMainSelectedId(Array.from(mainRunes2.children))

            if (secondaryTreeSelectedId == Number(target.dataset.id)) {
                var secondaryChildren = Array.from(mainRunes2.children)

                secondaryChildren.forEach(element => {
                    if (element.dataset.id == secondaryTreeSelectedId) {
                        element.dataset.selected = 'false'
                    }
                })

            }

        }

        if (parent.dataset.type === 'primary') {
            var runeObj = getRuneObj()

            resetRuneTrees()

            window.electronAPI.runes.reloadRunes(runeObj)
        }
    } else {
        var subChildren = Array.from(subRunes2.children)
        var selectedCount = getSelectedCount(subChildren)
        
        if (rowHasSelected(parent)) {
            getSelectedElement(parent).dataset.selected = 'false'

            target.dataset.selected = 'true'
        } else if (currentRow) {
            oldRow = secondRow
            secondRow = currentRow
            currentRow = parent

            if (oldRow) {
                getSelectedElement(oldRow).dataset.selected = 'false'
            }
 
            target.dataset.selected = 'true'
        } else if (selectedCount <= 1) {
            target.dataset.selected = 'true'
            currentRow = parent

        } else {
            subChildren.forEach((row) => {
                if (!secondRow && rowHasSelected(row)) {
                    secondRow = row
                } else if (rowHasSelected(row)) {
                    oldRow = row
                }                    
            })

            if (oldRow) {
                getSelectedElement(oldRow).dataset.selected = 'false'
            }

            target.dataset.selected = 'true'
            currentRow = parent
        }
    }
        
  
    }


function getSelectedElement(row) {
    var array = Array.from(row.children)
    var selectedElement

    array.forEach((element) => {
        if (element.dataset.selected == 'true') {
            selectedElement = element
        }
    })

    return selectedElement
}

function updateSubRunes(array) {
    var order = 1

    array.forEach(element => {
        Array.from(element.children).forEach(child => {
            if (child.dataset.selected == 'true') {
                element.dataset.lastclicked = `${order}`

                order++
            }
        })
    });
}

function unselectInRow(row) {
    var array = Array.from(row.children)

    array.forEach((element) => {
        if (element.dataset.selected == 'true') {
            element.dataset.selected = 'false'
        }
    })
}

function rowHasSelected(row) {
    var array = Array.from(row.children)
    var result = false

    array.forEach((element) => {
        if (element.dataset.selected == 'true') {
            result = true 
        }
    })

    return result
}

function getSelectedCount(div) {
    var array = Array.from(div)
    var count = 0

    array.forEach(element => {
        var children = Array.from(element.children)

        children.forEach(child => {
            if (child.dataset.selected == 'true') {
                count++
            }
        })
    })

    return count
}

function findSelectedRow(div) {
    var array = Array.from(div)
    var selected 

    array.forEach((row) => {
        Array.from(row).forEach((icon) => {
            if (icon.dataset.selected == 'true') {
                selected = row
            }
        })
    })

    return selected
}

function findLastClicked(array, value) {
    var found

    array.forEach(element => {
        if (element.dataset.lastclicked == value) {
            found = element
        }
    })

    return found
}

function findOtherClicked(array, self, value) {
    var found

    array.forEach(element => {
        if (element.dataset.lastclicked == value && element != self) {
            found = element
        }
    })

    return found
}

function resetRuneTrees() {
    mainRunes1.innerHTML = ""
    mainRunes2.innerHTML = ""
    essentialRunes.innerHTML = ""
    currentRow = ""
    secondRow = ""
    oldRow = ""

    Array.from(subRunes1.children).forEach((div) => {
        div.innerHTML = ""
    })

    Array.from(subRunes2.children).forEach((div) => {
        div.innerHTML = ""
    })

    Array.from(stats.children).forEach((row) => {
        Array.from(row.children).forEach((element) => {
            element.dataset.selected = 'false'
        })
    })
}

function getRuneObj() {
    var main1Children = Array.from(mainRunes1.children)
    var main2Children = Array.from(mainRunes2.children)
    var essentialChildren = Array.from(essentialRunes.children)
    var sub1Children = Array.from(subRunes1.children)
    var sub2Children = Array.from(subRunes2.children)
    var statsChildren = Array.from(stats.children)
    
    var mainSection = document.querySelector('#main')

    var primarySelected
    var subSelected
    var selectedPerks = []

    primarySelected = getMainSelectedId(main1Children)
    subSelected = getMainSelectedId(main2Children)
    selectedPerks.push(getMainSelectedId(essentialChildren))

    getSubSelectedId(sub1Children, selectedPerks)
    getSubSelectedId(sub2Children, selectedPerks)
    getSubSelectedId(statsChildren, selectedPerks)

    if (!subSelected) {
        subSelected = 0
    }

    return {
        name: txtInput.value,
        primaryStyleId: primarySelected,
        subStyleId: subSelected,
        selectedPerkIds: selectedPerks,
        current: true,
        id: mainSection.dataset.pageid
    }
}

function getMainSelectedId(array) {
    var id

    array.forEach(element => {
        if (element.dataset.selected === 'true') {
            id = Number(element.dataset.id)
        }
    })

    return id
}

function getSubSelectedId(array, target) {
    array.forEach(element => {
        var children = Array.from(element.children)

        children.forEach(elem2 => {
            if (elem2.dataset.selected === 'true') {
                target.push(Number(elem2.dataset.id))
            }
        })
    })
}