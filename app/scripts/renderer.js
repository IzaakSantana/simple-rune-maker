var mainRunes1 = document.querySelector('#main-runes')
var mainRunes2 = document.querySelector('#main-runes2')
var essentialRunes = document.querySelector('#essential-runes')
var subRunes1 = document.querySelector('#sub-runes')
var subRunes2 = document.querySelector('#sub-runes2')
var stats = document.querySelector('#stats')
var txtInput = document.querySelector('#txtInput')
var icons = document.getElementsByTagName('img')

var runes = window.electronAPI.runes.runesJson

for (var c = 0; c < icons.length; c++) {
    icons[c].addEventListener('click', iconClicked)
}

function iconClicked(event) {
    var target = event.currentTarget
    var parentChildren = Array.from(target.parentElement.children)

    if (target.dataset.selected === 'false') {
        for (var c = 0; c < parentChildren.length; c++) {
            if (parentChildren[c].dataset.selected == 'true') {
                parentChildren[c].dataset.selected = 'false'
            }
        }
    
        target.dataset.selected = 'true'
    
        if (target.parentElement.dataset.type === 'primary') {
            var runeObj = getRuneObj()

            resetRuneTrees()

            window.electronAPI.runes.reloadRunes(runeObj)
        }
    }
   
}

function resetRuneTrees() {
    mainRunes1.innerHTML = ""
    mainRunes2.innerHTML = ""
    essentialRunes.innerHTML = ""
    subRunes1.innerHTML = ""
    subRunes2.innerHTML = ""
}

function getRuneObj() {
    var main1Children = Array.from(mainRunes1.children)
    var main2Children = Array.from(mainRunes2.children)
    var essentialChildren = Array.from(essentialRunes.children)
    var sub1Children = Array.from(subRunes1.children)
    var sub2Children = Array.from(subRunes2.children)
    var statsChildren = Array.from(stats.children)
    
    var primarySelected
    var subSelected
    var selectedPerks = []

    primarySelected = getMainId(main1Children)
    subSelected = getMainId(main2Children)
    selectedPerks.push(getMainId(essentialChildren))

    getSubId(sub1Children, selectedPerks)
    getSubId(sub2Children, selectedPerks)
    getSubId(statsChildren, selectedPerks)


    return {
        name: txtInput.value,
        primaryStyleId: primarySelected,
        subStyleId: subSelected,
        selectedPerkIds: selectedPerks,
        current: true
    }
}

function getMainId(array) {
    var id

    array.forEach(element => {
        if (element.dataset.selected === 'true') {
            id = Number(element.dataset.id)
        }
    })

    return id
}

function getSubId(array, target) {
    array.forEach(element => {
        var children = Array.from(element.children)

        children.forEach(elem2 => {
            if (elem2.dataset.selected === 'true') {
                target.push(Number(elem2.dataset.id))
            }
        })
    })
}