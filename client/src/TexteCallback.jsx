import { useState , useEffect, useRef } from 'react'

function TexteCallback(){

    const champ1 = useRef("");
    const champ2 = useRef("");
    var compteur = 0
    /*
    const [champ1, setChamp1] = useState("");
    const [champ2, setChamp2] = useState("");
    

    useEffect(()=>{
        console.log("Premiere chaine : "+champ1+" Deuxieme Chaine : "+champ2);
    }, [champ1, champ2])
    */


    return(
        <>
        <p>-------------</p>
        <form>
        <label htmlFor="champ1">Champ 1 </label><input id="champ1" onChange={(e) => {champ1.current = e.target.value}}></input><br />
        <label htmlFor="champ2">Champ 2 </label><input id="champ2" onChange={(e) => {champ2.current = e.target.value}}/> <br />
        <button type="button" onClick={()=>{console.log((compteur++) +" "+champ1.current+" / "+champ2.current)}}>Log</button>


            
        </form>
        <p>-------------</p>
        </>
    )


}
export default TexteCallback