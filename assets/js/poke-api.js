//OBJETO PARA CONSUMO DA API E REQ HTTP
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail){ //convertendo o modelo da API para o nosso modelo
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types //Array destructuring 


    pokemon.types = types
    pokemon.type = type
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    pokemon.abilities = pokeDetail.abilities.map((abilitySlot) => abilitySlot.ability.name);
    pokemon.height = pokeDetail.height / 10; // Convertendo para metros
    pokemon.weight = pokeDetail.weight / 10; // Convertendo para kg

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 1) => {
   const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}` 
   return fetch(url) //Requisição da lista de pokemons da URL
        .then((response) => response.json()) //converte para json
        .then((jsonBody) => jsonBody.results)//Results onde contém os pokemons
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))//Mapeando em uma lista de requisições dos detalhes dos pokemons
        .then((detailRequests) => Promise.all(detailRequests)) //Esperando que todas as requisições terminem
        .then((pokemonsDetails) => pokemonsDetails)//Lista de detalhes dos pokemons
}









//FETCH é um processamento assíncrono, não tem resposta de imediato - nos retorna uma promise de um resultado - e por padrão fetch usa o GET

//Encadeamento de 'then', sempre o que vai para o primeiro then é o retorno da promisse(fetch url), o que vai para o segundo then é o retorno do primeiro, e assim segue o encadeamento.

//Para o código ficar mais limpo, usamos arrow function. É uma função especial que é usada frequentemente em callbacks, métodos de array e funções anônimas, são geralmente usadas para um contexto isolado.

/* SEM ARROW FUNCTION

        .then(function (response){
            return response.json()
        })
        .then(function (responsebody){ 
            console.log(responsebody)
        })
        .catch(function(error){
            console.error(error)
        })
        .finally(function (){
            console.log('Requisição concluída')
        })
*/

//Quando há apenas uma linha de código podemos deixar a arrow function igual a que temos na linha 6.
/*
         .then((response) => response.json())
*/