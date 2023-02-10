
import { individualKarts } from "./data.js";

const containerCards = document.querySelector('#containerCards')

const generalFilter = document.querySelector('#generalFilter')

const characters = document.querySelector('#characters')
const karts = document.querySelector('#karts')

const generalFilterOptions = [ 'Personaje', 'Kart', 'En mi colección', 'Faltantes en mi colección' ]

const characterFilterOptions = [ 'Mario', 'Luigi', 'Peach', 'Rosalina', 'Daisy', 'Toad', 'Yoshi', 'Donkey Kong', 'Diddy Kong', 'Wario', 'Waluigi', 'Bowser', 'Dry Bones', 'Koopa Troopa', 'Shy Guy', 'Lakitu' ]

const kartFilterOptions = [ 'Standard Kart', 'Mach 8', 'B-Dasher', 'Badwagon', 'Circuit Special', 'Sneeker', 'Sports Coupe', 'P-Wing', 'Wild Wing', 'Pipe Frame', 'Flame Flyer', 'Birthday Girl', 'Bumble V' ]



//Función que trae todos los karts de la colección individual
function getKarts(list) {

    containerCards.innerHTML = ''

    list.forEach( kart => {

        const container = document.createElement('div')

        const containerImg = document.createElement('figure')
        const img = document.createElement('img')
        img.setAttribute('src', kart.img)
        containerImg.append(img)

        const characterName = document.createElement('p')
        characterName.textContent = kart.characterName

        const kartName = document.createElement('p')
        kartName.textContent = kart.kart

        const buttonAdd = document.createElement('button')
        buttonAdd.setAttribute('type', 'button')
        buttonAdd.textContent = 'Agregar'
        

        container.classList.add('card')
        containerImg.classList.add('containerImg')
        buttonAdd.classList.add('cardButton')
        buttonAdd.classList.add('noInCollectionButton')

        // Revisa si ya está el kart en la coleccion, si si mantiene los estilos en verde
        if (alredyInIndividualKartCollectionList()[kart.id]) {
            buttonAdd.classList.add('inCollectionButton')
            buttonAdd.textContent = 'En mi colección'
        }

        buttonAdd.addEventListener('click', () => {

            if(!buttonAdd.classList.contains('inCollectionButton')) {

                buttonAdd.classList.remove('noInCollectionButton')
                buttonAdd.classList.add('inCollectionButton')

                buttonAdd.textContent = 'En mi colección';

                kartInCollection( kart )
                

            } else {
                buttonAdd.classList.remove('inCollectionButton')
                buttonAdd.classList.add('noInCollectionButton')

                buttonAdd.textContent = 'Agregar';

                kartInCollection( kart )
            }

        } )

        container.append(containerImg, characterName, kartName, buttonAdd)

        containerCards.append(container)

    });

}
getKarts(individualKarts)


// Funcion que revisa si hay algo en el LOCALSTORAGE 
function alredyInIndividualKartCollectionList() {

    const individualKartProperty = JSON.parse(localStorage.getItem('individualKart'));
    let individualKartsList;

    if( individualKartProperty ) {
        individualKartsList = individualKartProperty;
    } else {
        individualKartsList = {};
    }

    return individualKartsList;
}

//Funcion que agrega o quita contenido al LocalStorage
function kartInCollection( kartComplete ) {
    
    let individualKartsList = alredyInIndividualKartCollectionList();
    
    if( individualKartsList[kartComplete.id] ) {

        individualKarts.filter( item => {
            if( item.id === kartComplete.id )
            kartComplete.isInCollection = false
            return individualKarts
        })

        individualKartsList[kartComplete.id] = undefined;

    }else {

        individualKarts.filter( item => {
            if( item.id === kartComplete.id )
            kartComplete.isInCollection = true
            return individualKarts
        })

        individualKartsList[kartComplete.id] = kartComplete;
    }
    console.log(kartComplete)
    localStorage.setItem('individualKart', JSON.stringify(individualKartsList))
    
}


//Función que coloca las opciones que debe de llevar un select
function setFilterOptions(combobox, valores) {

    valores.forEach( valor => {
        const filterItem = document.createElement('option');
        filterItem.setAttribute('value', valor)
        filterItem.textContent = valor
        combobox.append(filterItem)
    })

}
setFilterOptions(generalFilter, generalFilterOptions)

//Función que coloca las opciones a un segundo select(si es necesario) o filtra segun la condicion dada
function setSecondFilter(e) {
    
    if(e.target.value === 'Personaje') {
        characters.classList.remove('hide')
        karts.classList.add('hide')
        getKarts(individualKarts)
        setFilterOptions(characters, characterFilterOptions)
    }

    if(e.target.value === 'Kart') {
        characters.classList.add('hide')
        karts.classList.remove('hide')
        getKarts(individualKarts)
        setFilterOptions(karts, kartFilterOptions)
    }

    if(e.target.value === 'En mi colección') {

        characters.classList.add('hide')
        karts.classList.add('hide')
        

        // traer al local storage con los que etsan en mi colección
        const getListFromLocalStorage = JSON.parse( localStorage.getItem('individualKart') )
        const myCollection = Object.values(getListFromLocalStorage)

        getKarts(myCollection)
    }

    if(e.target.value === 'Faltantes en mi colección') {
        characters.classList.add('hide')
        karts.classList.add('hide')
        
        // traer los que no estan en mi colección
        const noInMyCollection = individualKarts.filter( item => {
            return item.isInCollection === false;
        })

        getKarts(noInMyCollection)
    }

}



//evento del filtro general
generalFilter.addEventListener('change', (e) => {

    if( generalFilter.value === 'generalFilter') {
        characters.classList.add('hide')
        karts.classList.add('hide')
        getKarts(individualKarts)
    }
    setSecondFilter(e)
} )


//evento del segundo filtro personaje
characters.addEventListener('change', () => {
    const valorOption = characters.value
    const groupFilter = individualKarts.filter( item => {
        return item.characterName.includes(valorOption)
    })

    getKarts(groupFilter)
})

//evento del segundo filtro kart
karts.addEventListener('change', () => {
    const valorOption = karts.value
    const groupFilter = individualKarts.filter( item => {
        return item.kart === valorOption
    })

    getKarts(groupFilter)
})























