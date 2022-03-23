var mainRunes1 = document.querySelector('#main-runes')
var mainRunes2 = document.querySelector('#main-runes2')
var essentialRunes = document.querySelector('#essential-runes')
var subRunes1 = document.querySelector('#sub-runes')
var subRunes2 = document.querySelector('#sub-runes2')
var stats = document.querySelector('#stats')
var txtInput = document.querySelector('#txtInput')

var runes = window.electronAPI.runes.runesJson

const mutationConfig = { childList: true, subtree: true }
const observer = new MutationObserver(mutationCallback)


addListeners()

observer.observe(document.body, mutationConfig)


function mutationCallback(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            addListeners()
        }
    }
}

function addListeners() {
    var icons = document.getElementsByTagName('img')

    for (var c = 0; c < icons.length; c++) {
        icons[c].addEventListener('click', iconClicked)
    }
}

function iconClicked(event) {
    var target = event.currentTarget
    var parent = target.parentElement

    var parentChildren = Array.from(parent.children)
    var parentId = parent.id


    if (target.dataset.selected === 'false') {
        for (var c = 0; c < parentChildren.length; c++) {
            if (parentChildren[c].dataset.selected == 'true') {
                parentChildren[c].dataset.selected = 'false'
            }
        }
        
        target.dataset.selected = 'true'
        
        if (parent.id == mainRunes1.id) {
            var secondaryTreeSelectedId = getMainSelectedId(Array.from(mainRunes2.children))

            if (secondaryTreeSelectedId == Number(target.dataset.id)) {
                console.log('A secundária é a mesma que a primária.')

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
    }
    
}


function resetRuneTrees() {
    mainRunes1.innerHTML = ""
    mainRunes2.innerHTML = ""
    essentialRunes.innerHTML = ""

    Array.from(subRunes1.children).forEach((div) => {
        div.innerHTML = ""
    })

    Array.from(subRunes2.children).forEach((div) => {
        div.innerHTML = ""
    })
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
        current: true
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