/*MANIPULAÇÃO HTML*/
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');
const modalOverlay = document.getElementById('modal-overlay');
const modalInfo = document.getElementById('modalInfo');
const closeModal = document.getElementById('closeModal');


const maxRecords = 151
const limit = 16;
let offset = 0;
let loadedPokemons = []; // Lista global para armazenar os Pokémon carregados

function convertPokemonToLi(pokemon){ //Fazendo com que os pokemons da nossa API sejam adicionados em uma Li seguindo o padrão do nosso HTML
    return `
    <li class="pokemon ${pokemon.type}" data-number="${pokemon.number}" data-name="${pokemon.name}">
            <span class="number">#${String(pokemon.number).padStart(3, '0')}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join(' ')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

// Função para abrir o modal com as informações do Pokémon
function openModal(pokemon) {
    modalInfo.innerHTML = `
        <h2>${pokemon.name} (#${pokemon.number})</h2>
        <img src="${pokemon.photo}" alt="${pokemon.name}">
        <p><strong>Type:</strong> ${pokemon.types.join(', ')}</p>
        <p><strong>Abilities:</strong> ${pokemon.abilities.join(', ')}</p>
        <p><strong>Height:</strong> ${pokemon.height} m</p>
        <p><strong>Weight:</strong> ${pokemon.weight} kg</p>
    `;
    modalOverlay.classList.add('show');
}

// Fechar o modal
closeModal.addEventListener('click', () => {
    modalOverlay.classList.remove('show');
});

// Fechar o modal ao clicar fora dele
modalOverlay.addEventListener('click', (event) => {
    if (event.target === modalOverlay) {
        modalOverlay.classList.remove('show');
    }
});

// Função para carregar os Pokémon e atualizar a lista global
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        loadedPokemons = [...loadedPokemons, ...pokemons]; // Armazenar os Pokémon carregados
        const newList = pokemons.map(convertPokemonToLi);
        const newHtml = newList.join('');
        pokemonList.innerHTML += newHtml;
    });
}

// Adicionar evento de clique em cada card de Pokémon usando a lista carregada
pokemonList.addEventListener('click', (event) => {
    const clickedElement = event.target.closest('.pokemon');
    if (clickedElement) {
        const pokemonNumber = clickedElement.getAttribute('data-number');
        const selectedPokemon = loadedPokemons.find(p => p.number == pokemonNumber);
        if (selectedPokemon) openModal(selectedPokemon);
    }
});

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordNextPage = offset + limit //soma a quantidade de registros

    if(qtdRecordNextPage >= maxRecords){
        const newLimit = maxRecords - offset //calculando o novo limite
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton) //remove o botão
    }else{
        loadPokemonItens(offset, limit)
    }
})

// Carregar os primeiros Pokémon ao iniciar
loadPokemonItens(offset, limit)