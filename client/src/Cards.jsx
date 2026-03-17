import { useState , useEffect } from 'react'




function Cards(props){
    var [etat, setEtat] = useState(props.affichage)


    const changeEtat = () =>{
        if(etat == 'hidden'){
            setEtat('visible');
        }
        else{
            setEtat('hidden');
        }
    }

    return (
        <div class="Cards">
            <button type="button" onClick={changeEtat}>{ (etat == 'visible') ? props.symbole : '-'}</button>
        </div>
    )
}

export default Cards