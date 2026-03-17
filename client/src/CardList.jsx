import Cards from './Cards.jsx'

function CardList(props){

    return(
        <div>
        {props.cartes.map(carte => <Cards symbole={carte.symbole} affichage={carte.affichage}/>)}
        </div>
    )
}

export default CardList